import { User, Course, Enrollment } from "../../models/index.js";

/**
 * @desc    Get all dashboard stats at once (RECOMMENDED)
 * @route   GET /api/dashboard/stats
 * @access  Admin
 */
export const getDashboardCardStats = async (req, res) => {
    try {
        const { college, course } = req.query;

        // Base filter for paid enrollments
        const baseFilter = {
            paymentStatus: "paid",
        };

        if (college) baseFilter["checkoutDetails.collegeName"] = college;

        let courseId;
        if (course) {
            const courseDoc = await Course.findOne({ title: course });
            if (courseDoc) {
                courseId = courseDoc._id;
                baseFilter.course = courseId;
            }
        }

        // Date ranges
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Parallel queries for better performance
        const [
            enrolledToday,
            enrolledThisWeek,
            uniqueStudents,
            totalCoursesCount,
        ] = await Promise.all([
            // Students enrolled today
            Enrollment.countDocuments({
                ...baseFilter,
                enrollmentDate: { $gte: startOfDay },
            }),

            // Students enrolled this week
            Enrollment.countDocuments({
                ...baseFilter,
                enrollmentDate: { $gte: sevenDaysAgo },
            }),

            // Total active students (unique)
            Enrollment.distinct("student", baseFilter),

            // Total courses
            college
                ? Enrollment.distinct("course", {
                      "checkoutDetails.collegeName": college,
                      paymentStatus: "paid",
                  })
                : Course.countDocuments({ isPublished: true }),
        ]);

        const totalActive = uniqueStudents.length;
        const totalCourses = Array.isArray(totalCoursesCount)
            ? totalCoursesCount.length
            : totalCoursesCount;

        res.status(200).json({
            success: true,
            data: {
                enrolledToday,
                enrolledThisWeek,
                totalActive,
                totalCourses,
            },
            filters: { college, course },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
};

export const getTotalEnrolledStudentInEveryActiveCourse = async (req, res) => {
    try {
        const { college, fromDate, toDate } = req.query;

        // Date range filter
        const dateFilter = {};
        if (fromDate) {
            dateFilter.$gte = new Date(fromDate);
        }
        if (toDate) {
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            dateFilter.$lte = endDate;
        }

        // Build match filter
        const matchFilter = {
            paymentStatus: "paid",
        };

        if (Object.keys(dateFilter).length > 0) {
            matchFilter.enrollmentDate = dateFilter;
        }

        if (college) {
            matchFilter["checkoutDetails.collegeName"] = college;
        }

        // Aggregate enrollments by course stream
        const streamStats = await Enrollment.aggregate([
            { $match: matchFilter },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            { $unwind: "$courseInfo" },
            {
                $group: {
                    _id: "$courseInfo.stream",
                    count: { $sum: 1 },
                    uniqueStudents: { $addToSet: "$student" },
                },
            },
            {
                $project: {
                    _id: 0,
                    stream: "$_id",
                    enrollmentCount: "$count",
                    uniqueStudentCount: { $size: "$uniqueStudents" },
                },
            },
            { $sort: { enrollmentCount: -1 } },
        ]);

        res.status(200).json({
            success: true,
            data: streamStats,
            filters: {
                college,
                fromDate,
                toDate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch performance overview",
            error: error.message,
        });
    }
};

export const getAllEnrolledStudents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            studentName = "",
            courseName = "",
            collegeName = "",
            email = "",
            minDate,
            maxDate,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build match conditions
        const matchConditions = {
            role: "student", // Only get students
        };

        // Search by student name (first name, middle name, or last name)
        if (studentName) {
            matchConditions.$or = [
                { name: { $regex: studentName, $options: "i" } },
                { middleName: { $regex: studentName, $options: "i" } },
                { lastName: { $regex: studentName, $options: "i" } },
            ];
        }

        // Filter by course name
        if (courseName && courseName !== "All") {
            matchConditions.courseName = { $regex: courseName, $options: "i" };
        }

        // Filter by college name
        if (collegeName && collegeName !== "All") {
            matchConditions.collegeName = {
                $regex: collegeName,
                $options: "i",
            };
        }

        // Filter by email
        if (email) {
            matchConditions.email = { $regex: email, $options: "i" };
        }

        // Date range filter
        if (minDate || maxDate) {
            matchConditions.createdAt = {};
            if (minDate) {
                matchConditions.createdAt.$gte = new Date(minDate);
            }
            if (maxDate) {
                matchConditions.createdAt.$lte = new Date(maxDate);
            }
        }

        // Build aggregation pipeline
        const aggregate = User.aggregate([
            // Match stage - filter documents
            { $match: matchConditions },

            // Add computed fields
            {
                $addFields: {
                    fullName: {
                        $concat: [
                            "$name",
                            " ",
                            { $ifNull: ["$middleName", ""] },
                            " ",
                            { $ifNull: ["$lastName", ""] },
                        ],
                    },
                },
            },

            // Project stage - select fields to return
            {
                $project: {
                    _id: 1,
                    name: 1,
                    middleName: 1,
                    lastName: 1,
                    fullName: 1,
                    email: 1,
                    courseName: 1,
                    collegeName: 1,
                    yearOfStudy: 1,
                    accountStatus: 1,
                    avatar: 1,
                    phoneNumber: 1,
                    lmsId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },

            // Sort stage
            {
                $sort: {
                    [sortBy]: sortOrder === "asc" ? 1 : -1,
                    _id: 1, // Always include _id for consistent sorting
                },
            },
        ]);

        // Pagination options
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                docs: "students",
                totalDocs: "totalStudents",
                limit: "pageSize",
                page: "currentPage",
                totalPages: "totalPages",
                hasNextPage: "hasNext",
                hasPrevPage: "hasPrev",
                nextPage: "next",
                prevPage: "prev",
                pagingCounter: "serialNo",
            },
        };

        // Execute pagination
        const result = await User.aggregatePaginate(aggregate, options);

        res.json({
            success: true,
            message: "Student enrollments retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Get enrollments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get student enrollments",
            error: error.message,
        });
    }
};

/**
 * Get unique colleges list (for filter dropdown)
 */
export const getCollegesList = async (req, res) => {
    try {
        const colleges = await User.aggregate([
            {
                $match: {
                    role: "student",
                    collegeName: { $exists: true, $ne: null },
                },
            },
            { $group: { _id: "$collegeName" } },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            success: true,
            data: colleges.map((c) => c._id),
        });
    } catch (error) {
        console.error("Get colleges error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get colleges list",
            error: error.message,
        });
    }
};

/**
 * Get unique courses list (for filter dropdown)
 */
export const getCoursesList = async (req, res) => {
    try {
        const courses = await User.aggregate([
            {
                $match: {
                    role: "student",
                    courseName: { $exists: true, $ne: null },
                },
            },
            { $group: { _id: "$courseName" } },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            success: true,
            data: courses.map((c) => c._id),
        });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get courses list",
            error: error.message,
        });
    }
};

/**
 * Get single student enrollment details
 */
export const getStudentInfoById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            role: "student",
        }).select(
            "-password -lmsPassword -resetPasswordToken -googleId -githubId"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.json({
            success: true,
            data: student,
        });
    } catch (error) {
        console.error("Get enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get student details",
            error: error.message,
        });
    }
};

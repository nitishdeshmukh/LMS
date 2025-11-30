import {
    User,
    Course,
    Enrollment,
    Certificate,
    Submission,
} from "../../models/index.js";
import { Parser } from "json2csv";

/**
 * Get Dashboard Statistics (VERIFIED STUDENTS ONLY)
 * Returns: Total Active Students (today/week/month), Active Students per Domain, Completion Statistics
 * Supports: Date range filtering for domain chart
 */
export const getActiveStudentStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Parse date range if provided
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) {
                dateFilter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.createdAt.$lte = new Date(endDate);
            }
        }

        const stats = await Promise.all([
            // 1. Total Active Students with today/week/month breakdown
            getTotalActiveStudentsBreakdown(dateFilter),

            // 2. Active Students per Domain (with date filter)
            getActiveStudentsPerDomain(dateFilter),

            // 3. Completion Statistics
            getCompletionStatistics(dateFilter),
        ]);

        res.json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            data: {
                totalActiveStudents: stats[0],
                activeStudentsPerDomain: stats[1],
                completionStatistics: stats[2],
                appliedFilters: {
                    startDate: startDate || null,
                    endDate: endDate || null,
                },
                generatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get dashboard statistics",
            error: error.message,
        });
    }
};

/**
 * Helper: Get Total Active Students Breakdown (Today, This Week, This Month)
 * ONLY VERIFIED STUDENTS
 */
async function getTotalActiveStudentsBreakdown(dateFilter) {
    const now = new Date();

    // Calculate date boundaries
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(
        weekStart.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Base query - ONLY VERIFIED STUDENTS
    const baseQuery = {
        role: "student",
        accountStatus: "verified", // ✅ Only verified students
    };

    const stats = await User.aggregate([
        { $match: baseQuery },
        {
            $facet: {
                // Today's count
                today: [
                    { $match: { createdAt: { $gte: todayStart } } },
                    { $count: "count" },
                ],
                // Yesterday's count (for comparison)
                yesterday: [
                    {
                        $match: {
                            createdAt: {
                                $gte: yesterdayStart,
                                $lt: todayStart,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                // This week's count
                thisWeek: [
                    { $match: { createdAt: { $gte: weekStart } } },
                    { $count: "count" },
                ],
                // Last week's count (for comparison)
                lastWeek: [
                    {
                        $match: {
                            createdAt: {
                                $gte: lastWeekStart,
                                $lt: weekStart,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                // This month's count
                thisMonth: [
                    { $match: { createdAt: { $gte: monthStart } } },
                    { $count: "count" },
                ],
                // Last month's count (for comparison)
                lastMonth: [
                    {
                        $match: {
                            createdAt: {
                                $gte: lastMonthStart,
                                $lt: monthStart,
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        },
    ]);

    const result = stats[0];

    // Extract counts
    const todayCount = result.today[0]?.count || 0;
    const yesterdayCount = result.yesterday[0]?.count || 0;
    const weekCount = result.thisWeek[0]?.count || 0;
    const lastWeekCount = result.lastWeek[0]?.count || 0;
    const monthCount = result.thisMonth[0]?.count || 0;
    const lastMonthCount = result.lastMonth[0]?.count || 0;

    // Calculate growth percentages
    const todayGrowth = calculateGrowth(todayCount, yesterdayCount);
    const weekGrowth = calculateGrowth(weekCount, lastWeekCount);
    const monthGrowth = calculateGrowth(monthCount, lastMonthCount);

    return {
        today: {
            count: todayCount,
            growth: todayGrowth,
            label: `${todayGrowth >= 0 ? "+" : ""}${todayGrowth}% today`,
        },
        thisWeek: {
            count: weekCount,
            growth: weekGrowth,
            label: `${weekGrowth >= 0 ? "+" : ""}${weekGrowth}% this week`,
        },
        thisMonth: {
            count: monthCount,
            growth: monthGrowth,
            label: `${monthGrowth >= 0 ? "+" : ""}${monthGrowth}% this month`,
        },
    };
}

/**
 * Helper: Get Active Students per Domain
 * ONLY VERIFIED STUDENTS + Date Range Filter
 */
async function getActiveStudentsPerDomain(dateFilter) {
    const matchConditions = {
        paymentStatus: "paid",
        ...dateFilter, // Apply date filter if provided
    };

    const domainStats = await Enrollment.aggregate([
        // Match enrollments within date range
        { $match: matchConditions },

        // Lookup student details to verify status
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDetails",
            },
        },

        { $unwind: "$studentDetails" },

        // ✅ Filter only VERIFIED students
        {
            $match: {
                "studentDetails.role": "student",
                "studentDetails.accountStatus": "verified",
            },
        },

        // Lookup course details
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails",
            },
        },

        { $unwind: "$courseDetails" },

        // Group by domain/stream
        {
            $group: {
                _id: "$courseDetails.stream",
                students: { $addToSet: "$student" }, // Unique students
            },
        },

        // Count unique students
        {
            $project: {
                _id: 0,
                domain: "$_id",
                count: { $size: "$students" },
            },
        },

        // Sort by count descending
        { $sort: { count: -1 } },
    ]);

    return domainStats.map((item) => ({
        domain: item.domain || "Other",
        count: item.count,
    }));
}

/**
 * Helper: Get Completion Statistics
 * ONLY VERIFIED STUDENTS
 */
async function getCompletionStatistics(dateFilter) {
    const completionStats = await Enrollment.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                ...dateFilter,
            },
        },

        // Lookup student details
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                as: "studentDetails",
            },
        },

        { $unwind: "$studentDetails" },

        // ✅ Filter only VERIFIED students
        {
            $match: {
                "studentDetails.role": "student",
                "studentDetails.accountStatus": "verified",
            },
        },

        {
            $facet: {
                // Total certificates issued
                certificatesIssued: [
                    {
                        $match: {
                            isCompleted: true,
                            certificateId: { $exists: true, $ne: null },
                        },
                    },
                    { $count: "total" },
                ],

                // Completion rate
                completionRate: [
                    {
                        $group: {
                            _id: null,
                            totalEnrollments: { $sum: 1 },
                            completedEnrollments: {
                                $sum: { $cond: ["$isCompleted", 1, 0] },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            rate: {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$completedEnrollments",
                                            "$totalEnrollments",
                                        ],
                                    },
                                    100,
                                ],
                            },
                        },
                    },
                ],

                // Average progress
                averageProgress: [
                    {
                        $group: {
                            _id: null,
                            avgProgress: { $avg: "$progressPercentage" },
                        },
                    },
                ],
            },
        },
    ]);

    const stats = completionStats[0];

    return {
        certificatesIssued: stats.certificatesIssued[0]?.total || 0,
        avgCompletionRate: Math.round(stats.completionRate[0]?.rate || 0),
        averageProgress: Math.round(stats.averageProgress[0]?.avgProgress || 0),
    };
}

/**
 * Helper: Calculate growth percentage
 */
function calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}

// /**
//  * Get detailed breakdown of students by domain with date filter
//  */
// export const getStudentsByDomainDetailed = async (req, res) => {
//     try {
//         const { domain, startDate, endDate, page = 1, limit = 20 } = req.query;

//         if (!domain) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Domain parameter is required",
//             });
//         }

//         // Build date filter
//         let enrollmentDateFilter = {};
//         if (startDate || endDate) {
//             enrollmentDateFilter.enrollmentDate = {};
//             if (startDate) {
//                 enrollmentDateFilter.enrollmentDate.$gte = new Date(startDate);
//             }
//             if (endDate) {
//                 enrollmentDateFilter.enrollmentDate.$lte = new Date(endDate);
//             }
//         }

//         // Find courses in this domain
//         const courses = await Course.find({ stream: domain }, { _id: 1 });
//         const courseIds = courses.map((c) => c._id);

//         const aggregate = Enrollment.aggregate([
//             {
//                 $match: {
//                     course: { $in: courseIds },
//                     paymentStatus: "paid",
//                     ...enrollmentDateFilter,
//                 },
//             },

//             // Lookup student details
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "student",
//                     foreignField: "_id",
//                     as: "studentDetails",
//                 },
//             },

//             { $unwind: "$studentDetails" },

//             // ✅ Filter only VERIFIED students
//             {
//                 $match: {
//                     "studentDetails.role": "student",
//                     "studentDetails.accountStatus": "verified",
//                 },
//             },

//             // Lookup course details
//             {
//                 $lookup: {
//                     from: "courses",
//                     localField: "course",
//                     foreignField: "_id",
//                     as: "courseDetails",
//                 },
//             },

//             { $unwind: "$courseDetails" },

//             // Project required fields
//             {
//                 $project: {
//                     _id: 1,
//                     studentId: "$studentDetails._id",
//                     studentName: {
//                         $trim: {
//                             input: {
//                                 $concat: [
//                                     "$studentDetails.name",
//                                     " ",
//                                     {
//                                         $ifNull: [
//                                             "$studentDetails.lastName",
//                                             "",
//                                         ],
//                                     },
//                                 ],
//                             },
//                         },
//                     },
//                     studentEmail: "$studentDetails.email",
//                     collegeName: "$studentDetails.collegeName",
//                     courseName: "$courseDetails.title",
//                     progress: "$progressPercentage",
//                     enrollmentDate: "$enrollmentDate",
//                     isCompleted: 1,
//                     accountStatus: "$studentDetails.accountStatus",
//                 },
//             },

//             { $sort: { enrollmentDate: -1 } },
//         ]);

//         // Pagination
//         const options = {
//             page: parseInt(page),
//             limit: parseInt(limit),
//             customLabels: {
//                 docs: "students",
//                 totalDocs: "totalStudents",
//             },
//         };

//         const result = await Enrollment.aggregatePaginate(aggregate, options);

//         res.json({
//             success: true,
//             data: result,
//         });
//     } catch (error) {
//         console.error("Get students by domain error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to get students by domain",
//             error: error.message,
//         });
//     }
// };

/**
 * Get All Students with Enrollment Details
 * Includes: Payment Status, Capstone Status, College, Year filters
 */
export const getAllStudentsWithEnrollments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            collegeName = "",
            yearOfStudy = "",
            paymentStatus = "",
            capstoneStatus = "",
            search = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build match conditions
        const matchConditions = {
            role: "student",
            accountStatus: "verified", // Only verified students
        };

        // Search by name or email
        if (search) {
            matchConditions.$or = [
                { name: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by college
        if (collegeName && collegeName !== "All") {
            matchConditions.collegeName = {
                $regex: collegeName,
                $options: "i",
            };
        }

        // Filter by year
        if (yearOfStudy && yearOfStudy !== "All") {
            matchConditions.yearOfStudy = yearOfStudy;
        }

        const aggregate = User.aggregate([
            // Stage 1: Match students
            { $match: matchConditions },

            // Stage 2: Lookup enrollments
            {
                $lookup: {
                    from: "enrollments",
                    localField: "_id",
                    foreignField: "student",
                    as: "enrollments",
                },
            },

            // Stage 3: Unwind enrollments (one row per enrollment)
            {
                $unwind: {
                    path: "$enrollments",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Stage 4: Lookup course details
            {
                $lookup: {
                    from: "courses",
                    localField: "enrollments.course",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },

            {
                $unwind: {
                    path: "$courseDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Stage 5: Lookup capstone submissions
            {
                $lookup: {
                    from: "submissions",
                    let: {
                        enrollmentId: "$enrollments._id",
                        courseId: "$enrollments.course",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$enrollment",
                                                "$$enrollmentId",
                                            ],
                                        },
                                        { $eq: ["$type", "assignment"] },
                                    ],
                                },
                            },
                        },
                        // Get latest capstone submission
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: "capstoneSubmissions",
                },
            },

            // Stage 6: Add computed fields
            {
                $addFields: {
                    fullName: {
                        $trim: {
                            input: {
                                $concat: [
                                    "$name",
                                    " ",
                                    { $ifNull: ["$lastName", ""] },
                                ],
                            },
                        },
                    },
                    paymentStatus: {
                        $ifNull: ["$enrollments.paymentStatus", "N/A"],
                    },
                    capstoneStatus: {
                        $cond: {
                            if: { $gt: [{ $size: "$capstoneSubmissions" }, 0] },
                            then: {
                                $arrayElemAt: [
                                    "$capstoneSubmissions.status",
                                    0,
                                ],
                            },
                            else: "Not Submitted",
                        },
                    },
                    capstoneSubmissionId: {
                        $cond: {
                            if: { $gt: [{ $size: "$capstoneSubmissions" }, 0] },
                            then: {
                                $arrayElemAt: ["$capstoneSubmissions._id", 0],
                            },
                            else: null,
                        },
                    },
                },
            },

            // Stage 7: Filter by payment status if provided
            ...(paymentStatus && paymentStatus !== "All"
                ? [{ $match: { paymentStatus: paymentStatus } }]
                : []),

            // Stage 8: Filter by capstone status if provided
            ...(capstoneStatus && capstoneStatus !== "All"
                ? [
                      {
                          $match: {
                              capstoneStatus:
                                  capstoneStatus === "submitted"
                                      ? "submitted"
                                      : capstoneStatus === "graded"
                                      ? "graded"
                                      : capstoneStatus === "in-progress"
                                      ? "In Progress"
                                      : "Not Submitted",
                          },
                      },
                  ]
                : []),

            // Stage 9: Project final fields
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    name: 1,
                    lastName: 1,
                    email: 1,
                    collegeName: 1,
                    yearOfStudy: 1,
                    phoneNumber: 1,
                    avatar: 1,
                    enrollmentId: "$enrollments._id",
                    courseId: "$courseDetails._id",
                    courseName: "$courseDetails.title",
                    courseStream: "$courseDetails.stream",
                    paymentStatus: 1,
                    amountPaid: "$enrollments.amountPaid",
                    transactionId: "$enrollments.transactionId",
                    capstoneStatus: 1,
                    capstoneSubmissionId: 1,
                    progressPercentage: "$enrollments.progressPercentage",
                    isCompleted: "$enrollments.isCompleted",
                    certificateId: "$enrollments.certificateId",
                    enrollmentDate: "$enrollments.enrollmentDate",
                    createdAt: 1,
                },
            },

            // Stage 10: Sort
            {
                $sort: {
                    [sortBy]: sortOrder === "asc" ? 1 : -1,
                    _id: 1,
                },
            },
        ]);

        // Pagination
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
            },
        };

        const result = await User.aggregatePaginate(aggregate, options);

        res.json({
            success: true,
            message: "Students with enrollments retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Get students error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get students",
            error: error.message,
        });
    }
};

/**
 * Get Filter Options (Colleges, Payment Status, Capstone Status)
 */
export const getFilterOptions = async (req, res) => {
    try {
        const options = await User.aggregate([
            { $match: { role: "student", accountStatus: "verified" } },
            {
                $facet: {
                    colleges: [
                        {
                            $match: {
                                collegeName: {
                                    $exists: true,
                                    $ne: null,
                                    $ne: "",
                                },
                            },
                        },
                        { $group: { _id: "$collegeName" } },
                        { $sort: { _id: 1 } },
                    ],
                    years: [
                        {
                            $match: {
                                yearOfStudy: {
                                    $exists: true,
                                    $ne: null,
                                    $ne: "",
                                },
                            },
                        },
                        { $group: { _id: "$yearOfStudy" } },
                        { $sort: { _id: 1 } },
                    ],
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                colleges: options[0].colleges.map((c) => c._id),
                years: options[0].years.map((y) => y._id),
                paymentStatuses: ["pending", "paid", "failed", "refunded"],
                capstoneStatuses: [
                    "Not Submitted",
                    "submitted",
                    "graded",
                    "In Progress",
                ],
            },
        });
    } catch (error) {
        console.error("Get filter options error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get filter options",
            error: error.message,
        });
    }
};

/**
 * Update Payment Status
 */
export const updatePaymentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { paymentStatus } = req.body;

        const validStatuses = ["pending", "paid", "failed", "refunded"];
        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status",
            });
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { paymentStatus },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.json({
            success: true,
            message: "Payment status updated successfully",
            data: enrollment,
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: error.message,
        });
    }
};

/**
 * Update Capstone Status
 */
export const updateCapstoneStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status, grade, feedback } = req.body;

        const validStatuses = ["submitted", "graded", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid capstone status",
            });
        }

        const updateData = { status };
        if (grade) updateData.grade = grade;
        if (feedback) updateData.feedback = feedback;

        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            updateData,
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found",
            });
        }

        res.json({
            success: true,
            message: "Capstone status updated successfully",
            data: submission,
        });
    } catch (error) {
        console.error("Update capstone status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update capstone status",
            error: error.message,
        });
    }
};

/**
 * Issue Certificate for Student
 */
export const issueCertificate = async (req, res) => {
    try {
        const { enrollmentId } = req.body;

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "name lastName email")
            .populate("course", "title");

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        // Check if already completed
        if (enrollment.isCompleted && enrollment.certificateId) {
            return res.status(400).json({
                success: false,
                message: "Certificate already issued",
                data: { certificateId: enrollment.certificateId },
            });
        }

        // Check if capstone is graded
        const capstoneSubmission = await Submission.findOne({
            enrollment: enrollmentId,
            type: "assignment",
            status: "graded",
        });

        if (!capstoneSubmission) {
            return res.status(400).json({
                success: false,
                message:
                    "Student must complete and pass capstone project first",
            });
        }

        // Generate certificate ID
        const certificateId = `C2D-${Math.random()
            .toString(36)
            .substr(2, 8)
            .toUpperCase()}`;

        // Update enrollment
        enrollment.isCompleted = true;
        enrollment.completionDate = new Date();
        enrollment.certificateId = certificateId;
        enrollment.progressPercentage = 100;
        await enrollment.save();

        // TODO: Generate PDF certificate and store URL
        // const pdfUrl = await generateCertificatePDF(enrollment);

        res.json({
            success: true,
            message: "Certificate issued successfully",
            data: {
                certificateId,
                studentName: `${enrollment.student.name} ${
                    enrollment.student.lastName || ""
                }`,
                courseName: enrollment.course.title,
                completionDate: enrollment.completionDate,
            },
        });
    } catch (error) {
        console.error("Issue certificate error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to issue certificate",
            error: error.message,
        });
    }
};

/**
 * Export Students Data to CSV
 */
export const exportStudentsCSV = async (req, res) => {
    try {
        const {
            collegeName = "",
            paymentStatus = "",
            capstoneStatus = "",
        } = req.query;

        // Build match conditions
        const matchConditions = {
            role: "student",
            accountStatus: "verified",
        };

        if (collegeName && collegeName !== "All") {
            matchConditions.collegeName = {
                $regex: collegeName,
                $options: "i",
            };
        }

        const students = await User.aggregate([
            { $match: matchConditions },
            {
                $lookup: {
                    from: "enrollments",
                    localField: "_id",
                    foreignField: "student",
                    as: "enrollments",
                },
            },
            {
                $unwind: {
                    path: "$enrollments",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "enrollments.course",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: {
                    path: "$courseDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "submissions",
                    let: { enrollmentId: "$enrollments._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$enrollment",
                                                "$$enrollmentId",
                                            ],
                                        },
                                        { $eq: ["$type", "assignment"] },
                                    ],
                                },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: "capstoneSubmissions",
                },
            },
            {
                $project: {
                    Name: {
                        $concat: ["$name", " ", { $ifNull: ["$lastName", ""] }],
                    },
                    Email: "$email",
                    College: "$collegeName",
                    Year: "$yearOfStudy",
                    Course: "$courseDetails.title",
                    "Payment Status": {
                        $ifNull: ["$enrollments.paymentStatus", "N/A"],
                    },
                    "Amount Paid": {
                        $ifNull: ["$enrollments.amountPaid", 0],
                    },
                    "Capstone Status": {
                        $cond: {
                            if: { $gt: [{ $size: "$capstoneSubmissions" }, 0] },
                            then: {
                                $arrayElemAt: [
                                    "$capstoneSubmissions.status",
                                    0,
                                ],
                            },
                            else: "Not Submitted",
                        },
                    },
                    Progress: {
                        $concat: [
                            {
                                $toString: {
                                    $ifNull: [
                                        "$enrollments.progressPercentage",
                                        0,
                                    ],
                                },
                            },
                            "%",
                        ],
                    },
                    "Certificate ID": {
                        $ifNull: ["$enrollments.certificateId", "Not Issued"],
                    },
                    "Enrollment Date": {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$enrollments.enrollmentDate",
                        },
                    },
                },
            },
        ]);

        // Apply additional filters
        let filteredStudents = students;

        if (paymentStatus && paymentStatus !== "All") {
            filteredStudents = filteredStudents.filter(
                (s) => s["Payment Status"] === paymentStatus
            );
        }

        if (capstoneStatus && capstoneStatus !== "All") {
            filteredStudents = filteredStudents.filter(
                (s) => s["Capstone Status"] === capstoneStatus
            );
        }

        // Convert to CSV
        const fields = [
            "Name",
            "Email",
            "College",
            "Year",
            "Course",
            "Payment Status",
            "Amount Paid",
            "Capstone Status",
            "Progress",
            "Certificate ID",
            "Enrollment Date",
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(filteredStudents);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=students_${Date.now()}.csv`
        );
        res.send(csv);
    } catch (error) {
        console.error("Export CSV error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export CSV",
            error: error.message,
        });
    }
};

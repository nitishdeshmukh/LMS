import { Student } from "../../models/index.js";

/**
 * Get all pending users (students awaiting verification)
 * Filters: College, Year of Study, Course/Domain
 * Search: Student name, email
 */
export const getOngoingUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            studentName = "",
            email = "",
            collegeName = "",
            yearOfStudy = "",
            courseName = "", // Domain/Course filter
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build match conditions - ONLY pending students
        const matchConditions = {
            accountStatus: "pending", // ✅ Only pending students
        };

        // Search by student name (first/middle/last name)
        if (studentName) {
            matchConditions.$or = [
                { name: { $regex: studentName, $options: "i" } },
                { middleName: { $regex: studentName, $options: "i" } },
                { lastName: { $regex: studentName, $options: "i" } },
            ];
        }

        // Filter by email
        if (email) {
            matchConditions.email = { $regex: email, $options: "i" };
        }

        // ✅ Filter by College
        if (collegeName && collegeName !== "All") {
            matchConditions.collegeName = {
                $regex: collegeName,
                $options: "i",
            };
        }

        // ✅ Filter by Year of Study
        if (yearOfStudy && yearOfStudy !== "All") {
            matchConditions.yearOfStudy = yearOfStudy;
        }

        // ✅ Filter by Domain/Course
        if (courseName && courseName !== "All") {
            matchConditions.courseName = { $regex: courseName, $options: "i" };
        }

        // Build aggregation pipeline
        const aggregate = Student.aggregate([
            // Stage 1: Match pending students with filters
            { $match: matchConditions },

            // Stage 2: Add computed fields
            {
                $addFields: {
                    fullName: {
                        $trim: {
                            input: {
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
                    // Days since registration
                    daysSinceRegistration: {
                        $dateDiff: {
                            startDate: "$createdAt",
                            endDate: "$$NOW",
                            unit: "day",
                        },
                    },
                },
            },

            // Stage 3: Project only necessary fields
            {
                $project: {
                    _id: 1,
                    name: 1,
                    middleName: 1,
                    lastName: 1,
                    fullName: 1,
                    email: 1,
                    phoneNumber: 1,
                    alternatePhone: 1,
                    collegeName: 1,
                    courseName: 1,
                    yearOfStudy: 1,
                    accountStatus: 1,
                    avatar: 1,
                    lmsId: 1,
                    myReferralCode: 1,
                    referredBy: 1,
                    linkedin: 1,
                    github: 1,
                    portfolio: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lastLogin: 1,
                    daysSinceRegistration: 1,
                },
            },

            // Stage 4: Sort
            {
                $sort: {
                    [sortBy]: sortOrder === "asc" ? 1 : -1,
                    _id: 1, // Secondary sort for consistency
                },
            },
        ]);

        // Pagination options
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                docs: "pendingUsers",
                totalDocs: "totalPending",
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
        const result = await Student.aggregatePaginate(aggregate, options);

        res.json({
            success: true,
            message: "Pending users retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Get pending users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get pending users",
            error: error.message,
        });
    }
};

/**
 * Approve pending user (change status to verified)
 */
export const approveOngoingUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const student = await Student.findOneAndUpdate(
            { _id: userId, accountStatus: "pending" },
            { accountStatus: "verified" },
            { new: true }
        ).select("-lmsPassword -resetPasswordToken");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Pending student not found",
            });
        }

        // TODO: Send approval email to student
        // await sendApprovalEmail(student.email, student.name);

        res.json({
            success: true,
            message: "Student approved successfully",
            data: student,
        });
    } catch (error) {
        console.error("Approve student error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to approve student",
            error: error.message,
        });
    }
};

/**
 * Reject pending student (change status to blocked or delete)
 */
export const rejectOngoingUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const student = await Student.findOneAndUpdate(
            { _id: userId, accountStatus: "pending" },
            { accountStatus: "blocked" },
            { new: true }
        ).select("-lmsPassword -resetPasswordToken");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Pending student not found",
            });
        }

        // TODO: Send rejection email with reason
        // await sendRejectionEmail(student.email, student.name, reason);

        res.json({
            success: true,
            message: "Student rejected successfully",
            data: student,
        });
    } catch (error) {
        console.error("Reject student error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reject student",
            error: error.message,
        });
    }
};

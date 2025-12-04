import {
    Student,
    Enrollment,
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

        res.status(200).json({
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
 * Based on paid enrollments
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

    // Base query - paid enrollments only
    const baseQuery = {
        paymentStatus: {
            $nin: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING"],
        },
    };

    const stats = await Enrollment.aggregate([
        { $match: baseQuery },
        {
            $group: {
                _id: "$student",
                enrollmentDate: { $min: "$createdAt" },
            },
        },
        {
            $facet: {
                // Today's count
                today: [
                    { $match: { enrollmentDate: { $gte: todayStart } } },
                    { $count: "count" },
                ],
                // Yesterday's count (for comparison)
                yesterday: [
                    {
                        $match: {
                            enrollmentDate: {
                                $gte: yesterdayStart,
                                $lt: todayStart,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                // This week's count
                thisWeek: [
                    { $match: { enrollmentDate: { $gte: weekStart } } },
                    { $count: "count" },
                ],
                // Last week's count (for comparison)
                lastWeek: [
                    {
                        $match: {
                            enrollmentDate: {
                                $gte: lastWeekStart,
                                $lt: weekStart,
                            },
                        },
                    },
                    { $count: "count" },
                ],
                // This month's count
                thisMonth: [
                    { $match: { enrollmentDate: { $gte: monthStart } } },
                    { $count: "count" },
                ],
                // Last month's count (for comparison)
                lastMonth: [
                    {
                        $match: {
                            enrollmentDate: {
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
 * Based on paid enrollments + Date Range Filter
 */
async function getActiveStudentsPerDomain(dateFilter) {
    const matchConditions = {
        paymentStatus: {
            $nin: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING"],
        },
        ...dateFilter, // Apply date filter if provided
    };

    const domainStats = await Enrollment.aggregate([
        // Match enrollments within date range
        { $match: matchConditions },

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
 * Based on paid enrollments
 */
async function getCompletionStatistics(dateFilter) {
    const completionStats = await Enrollment.aggregate([
        {
            $match: {
                paymentStatus: {
                    $nin: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING"],
                },
                ...dateFilter,
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

/**
 * Get All Students with Enrollment Details
 * Includes: Payment Status, Capstone Status, College, Year filters
 */
export const getAllStudentsWithEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            paymentStatus: {
                $nin: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING"],
            },
        })
            .populate("student")
            .populate("course", "title slug price thumbnail stream")
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Students with enrollments retrieved successfully",
            data: enrollments,
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
 * Update Payment Status
 */
export const updatePaymentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { paymentStatus } = req.body;

        const validStatuses = [
            "UNPAID",
            "PARTIAL_PAYMENT_VERIFICATION_PENDING",
            "PARTIAL_PAID",
            "FULLY_PAYMENT_VERIFICATION_PENDING",
            "FULLY_PAID",
        ];
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

        res.status(200).json({
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
        const { 
            enrollmentId, 
            certificateId,
            amountRemaining, 
            paymentStatus 
        } = req.body;

        console.log("Request body:", { enrollmentId, certificateId, amountRemaining, paymentStatus });

        // Validate required fields
        if (!certificateId) {
            return res.status(400).json({
                success: false,
                message: "Certificate ID is required",
            });
        }

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

        // Check capstone submission
        const capstoneSubmission = await Submission.findOne({
            enrollment: enrollmentId,
            type: "capstone",
            status: "graded",
        });

        if (!capstoneSubmission) {
            return res.status(400).json({
                success: false,
                message: "Student must complete and pass capstone project first",
            });
        }

        // Generate certificate ID if not provided
        
        enrollment.isCompleted = true;
        enrollment.completionDate = new Date();
        enrollment.certificateId = certificateId;
        enrollment.progressPercentage = 100;
        
        // Conditionally update payment fields only if provided
        if (paymentStatus !== undefined) {
            enrollment.paymentStatus = paymentStatus;
        }
        if (amountRemaining !== undefined) {
            enrollment.amountRemaining = amountRemaining;
        }
        
        await enrollment.save();

        res.status(200).json({
            success: true,
            message: "Certificate issued successfully",
            data: {
                certificateId: certificateId,
                studentName: `${enrollment.student.name} ${enrollment.student.lastName || ""}`,
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
        const students = await Enrollment.aggregate([
            // Match paid enrollments only
            {
                $match: {
                    paymentStatus: {
                        $nin: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING"],
                    },
                },
            },

            // Lookup student details
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "studentDetails",
                },
            },
            { $unwind: "$studentDetails" },

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

            // Lookup capstone submissions
            {
                $lookup: {
                    from: "submissions",
                    let: { enrollmentId: "$_id" },
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

            // Project final fields for CSV
            {
                $project: {
                    Name: {
                        $concat: [
                            "$studentDetails.name",
                            " ",
                            { $ifNull: ["$studentDetails.lastName", ""] },
                        ],
                    },
                    Email: "$studentDetails.email",
                    College: "$studentDetails.collegeName",
                    Year: "$studentDetails.yearOfStudy",
                    Course: "$courseDetails.title",
                    "Payment Status": "$paymentStatus",
                    "Amount Paid": { $ifNull: ["$amountPaid", 0] },
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
                                    $ifNull: ["$progressPercentage", 0],
                                },
                            },
                            "%",
                        ],
                    },
                    "Certificate ID": {
                        $ifNull: ["$certificateId", "Not Issued"],
                    },
                    "Enrollment Date": {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$enrollmentDate",
                        },
                    },
                },
            },
        ]);
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
        const csv = json2csvParser.parse(students);

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

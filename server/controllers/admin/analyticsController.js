import {
    User,
    Course,
    Enrollment,
    Certificate,
    Payment,
    Submission,
} from "../../models/index.js";

// ============================================
// DASHBOARD OVERVIEW STATS
// ============================================

/**
 * Retrieves key performance metrics for the dashboard overview cards.
 * Calculates total users, active courses, completion rates, certificates, engagement, and revenue.
 *
 * @async
 * @function getDashboardStats
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date for filtering (ISO format)
 * @param {string} [req.query.endDate] - End date for filtering (ISO format)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with dashboard statistics
 * @throws {Error} 500 - Server error during data aggregation
 */
export const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Default: from beginning of time to now
        const start = startDate ? new Date(startDate) : new Date(0); // Unix epoch start
        const end = endDate ? new Date(endDate) : new Date(); // Current time

        const dateFilter = {
            createdAt: {
                $gte: start,
                $lte: end,
            },
        };

        // Total users count
        const totalUsers = await User.countDocuments(dateFilter);

        // Active courses (published/active status)
        const activeCourses = await Course.countDocuments({
            status: "published",
            ...dateFilter,
        });

        // Average completion rate
        const completionStats = await Enrollment.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    avgCompletion: { $avg: "$progressPercentage" },
                },
            },
        ]);

        const avgCompletionRate =
            completionStats.length > 0
                ? Math.round(completionStats[0].avgCompletion)
                : 0;

        // Certificates issued
        const certificatesIssued = await Certificate.countDocuments(dateFilter);

        // Average time spent (calculated from enrollment data)
        // Estimate: avg days enrolled * 0.5 hours per day
        const timeStats = await Enrollment.aggregate([
            { $match: dateFilter },
            {
                $project: {
                    daysEnrolled: {
                        $divide: [
                            {
                                $subtract: [
                                    {
                                        $ifNull: [
                                            "$completionDate",
                                            new Date(),
                                        ],
                                    },
                                    "$createdAt",
                                ],
                            },
                            1000 * 60 * 60 * 24,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDays: { $avg: "$daysEnrolled" },
                },
            },
        ]);

        const avgTimeSpent =
            timeStats.length > 0
                ? (timeStats[0].avgDays * 0.5).toFixed(1)
                : "0.0";

        // Total revenue
        const revenueStats = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: "completed",
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const totalRevenue =
            revenueStats.length > 0
                ? `$${(revenueStats[0].total / 1000).toFixed(1)}K`
                : "$0.0K";

        // Calculate percentage changes (compare with previous period)
        const periodDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const previousStart = new Date(
            start.getTime() - periodDays * 24 * 60 * 60 * 1000
        );
        const previousEnd = new Date(start.getTime() - 1); // Day before current period starts

        const previousDateFilter = {
            createdAt: {
                $gte: previousStart,
                $lte: previousEnd,
            },
        };

        // Previous period metrics
        const prevUsers = await User.countDocuments(previousDateFilter);
        const prevCourses = await Course.countDocuments({
            status: "published",
            ...previousDateFilter,
        });
        const prevCertificates = await Certificate.countDocuments(
            previousDateFilter
        );

        const prevRevenue = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousStart, $lte: previousEnd },
                    status: "completed",
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Calculate percentage changes
        const userChange =
            prevUsers > 0
                ? (((totalUsers - prevUsers) / prevUsers) * 100).toFixed(1)
                : totalUsers > 0
                ? 100
                : 0;

        const courseChange =
            prevCourses > 0
                ? (((activeCourses - prevCourses) / prevCourses) * 100).toFixed(
                      1
                  )
                : activeCourses > 0
                ? 100
                : 0;

        const certChange =
            prevCertificates > 0
                ? (
                      ((certificatesIssued - prevCertificates) /
                          prevCertificates) *
                      100
                  ).toFixed(1)
                : certificatesIssued > 0
                ? 100
                : 0;

        const currentRevenue =
            revenueStats.length > 0 ? revenueStats[0].total : 0;
        const previousRevenue =
            prevRevenue.length > 0 ? prevRevenue[0].total : 0;
        const revenueChange =
            previousRevenue > 0
                ? (
                      ((currentRevenue - previousRevenue) / previousRevenue) *
                      100
                  ).toFixed(1)
                : currentRevenue > 0
                ? 100
                : 0;

        // Calculate dynamic time spent change
        const prevTimeStats = await Enrollment.aggregate([
            { $match: previousDateFilter },
            {
                $project: {
                    daysEnrolled: {
                        $divide: [
                            {
                                $subtract: [
                                    {
                                        $ifNull: [
                                            "$completionDate",
                                            previousEnd,
                                        ],
                                    },
                                    "$createdAt",
                                ],
                            },
                            1000 * 60 * 60 * 24,
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgDays: { $avg: "$daysEnrolled" },
                },
            },
        ]);

        const prevAvgTimeSpent =
            prevTimeStats.length > 0 ? prevTimeStats[0].avgDays * 0.5 : 0;
        const currentAvgTimeSpent = parseFloat(avgTimeSpent);

        const timeSpentChange =
            prevAvgTimeSpent > 0
                ? (
                      ((currentAvgTimeSpent - prevAvgTimeSpent) /
                          prevAvgTimeSpent) *
                      100
                  ).toFixed(1)
                : currentAvgTimeSpent > 0
                ? 100
                : 0;

        // Calculate dynamic completion rate change
        const prevCompletionStats = await Enrollment.aggregate([
            { $match: previousDateFilter },
            {
                $group: {
                    _id: null,
                    avgCompletion: { $avg: "$progressPercentage" },
                },
            },
        ]);

        const prevAvgCompletionRate =
            prevCompletionStats.length > 0
                ? prevCompletionStats[0].avgCompletion
                : 0;

        const completionRateChange =
            prevAvgCompletionRate > 0
                ? (
                      ((avgCompletionRate - prevAvgCompletionRate) /
                          prevAvgCompletionRate) *
                      100
                  ).toFixed(1)
                : avgCompletionRate > 0
                ? 100
                : 0;

        res.json({
            success: true,
            data: {
                totalUsers: {
                    value: totalUsers.toLocaleString(),
                    change: `${userChange >= 0 ? "+" : ""}${userChange}%`,
                },
                activeCourses: {
                    value: activeCourses,
                    change: `${courseChange >= 0 ? "+" : ""}${courseChange}%`,
                },
                avgCompletionRate: {
                    value: `${avgCompletionRate}%`,
                    change: `${
                        completionRateChange >= 0 ? "+" : ""
                    }${completionRateChange}%`,
                },
                certificatesIssued: {
                    value: certificatesIssued.toLocaleString(),
                    change: `${certChange >= 0 ? "+" : ""}${certChange}%`,
                },
                avgTimeSpent: {
                    value: `${avgTimeSpent}h`,
                    change: `${
                        timeSpentChange >= 0 ? "+" : ""
                    }${timeSpentChange}%`,
                },
                totalRevenue: {
                    value: totalRevenue,
                    change: `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`,
                },
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
};

// ============================================
// PERFORMANCE RADAR CHART DATA
// ============================================

/**
 * Retrieves overall performance metrics for radar chart visualization.
 * Metrics: Average Revenue Earned, Average Quiz Score, Assignment Submission Rate,
 * Course Completion Rate, and Average Course Progress.
 *
 * @async
 * @function getPerformanceRadar
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date for filtering
 * @param {string} [req.query.endDate] - End date for filtering
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with performance metrics array for radar chart
 * @throws {Error} 500 - Server error during metrics calculation
 */
export const getPerformanceRadar = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // 1. Average Revenue Earned (normalized to 100)
        const revenueStats = await Payment.aggregate([
            { $match: { ...dateFilter, status: "completed" } },
            {
                $group: {
                    _id: null,
                    avgRevenue: { $avg: "$amount" },
                    totalRevenue: { $sum: "$amount" },
                },
            },
        ]);

        const revenueTarget = 100000; // $100K target
        const avgRevenueValue =
            revenueStats.length > 0
                ? Math.min(
                      Math.round(
                          (revenueStats[0].totalRevenue / revenueTarget) * 100
                      ),
                      100
                  )
                : 0;

        // 2. Average Quiz Score
        const quizScores = await Submission.aggregate([
            { $match: { ...dateFilter, type: "quiz" } },
            {
                $group: {
                    _id: null,
                    avgScore: {
                        $avg: {
                            $multiply: [
                                { $divide: ["$quizScore", "$totalQuestions"] },
                                100,
                            ],
                        },
                    },
                },
            },
        ]);

        const avgQuizScore =
            quizScores.length > 0 ? Math.round(quizScores[0].avgScore) : 0;

        // 3. Assignment Submission Rate
        const totalAssignments = await Submission.countDocuments({
            ...dateFilter,
            type: "assignment",
        });

        const submittedAssignments = await Submission.countDocuments({
            ...dateFilter,
            type: "assignment",
            submittedAt: { $ne: null },
        });

        const assignmentRate =
            totalAssignments > 0
                ? Math.round((submittedAssignments / totalAssignments) * 100)
                : 0;

        // 4. Course Completion Rate
        const completedEnrollments = await Enrollment.countDocuments({
            completionDate: {
                $gte: new Date(startDate || 0),
                $lte: new Date(endDate || Date.now()),
            },
        });

        const totalEnrollments = await Enrollment.countDocuments(dateFilter);

        const courseCompletionRate =
            totalEnrollments > 0
                ? Math.round((completedEnrollments / totalEnrollments) * 100)
                : 0;

        // 5. Average Course Progress
        const progressStats = await Enrollment.aggregate([
            {
                $match: {
                    updatedAt: {
                        $gte: new Date(startDate || 0),
                        $lte: new Date(endDate || Date.now()),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    avgProgress: { $avg: "$progressPercentage" },
                },
            },
        ]);

        const avgProgress =
            progressStats.length > 0
                ? Math.round(progressStats[0].avgProgress)
                : 0;

        res.json({
            success: true,
            data: [
                {
                    category: "Avg Revenue Earned",
                    value: avgRevenueValue,
                    full: 100,
                },
                { category: "Avg Quiz Score", value: avgQuizScore, full: 100 },
                {
                    category: "Assignment Rate",
                    value: assignmentRate,
                    full: 100,
                },
                {
                    category: "Course Completion",
                    value: courseCompletionRate,
                    full: 100,
                },
                { category: "Progress Avg", value: avgProgress, full: 100 },
            ],
        });
    } catch (error) {
        console.error("Performance radar error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch performance radar data",
            error: error.message,
        });
    }
};

// ============================================
// STUDENT GROWTH LINE CHART
// ============================================

/**
 * Retrieves cumulative student registration growth over time for simple line chart.
 * Returns time-series data showing total registered users at each monthly data point.
 *
 * @async
 * @function getStudentGrowth
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date for data range
 * @param {string} [req.query.endDate] - End date for data range
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with time-series growth data
 * @throws {Error} 500 - Server error during aggregation
 */
export const getStudentGrowth = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();

        const growthData = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Get initial count before start date
        const initialCount = await User.countDocuments({
            createdAt: { $lt: start },
        });

        let cumulativeCount = initialCount;
        const formattedData = growthData.map((item) => {
            cumulativeCount += item.count;
            return {
                date: new Date(item._id.year, item._id.month - 1, 1).getTime(),
                value: cumulativeCount,
            };
        });

        res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Student growth error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch student growth data",
            error: error.message,
        });
    }
};

// ============================================
// ENROLLMENT, COMPLETION & REVENUE TREND (Multi-line Chart)
// ============================================

/**
 * Retrieves multi-series trend data for enrollments, completions, and revenue over time.
 * Used for smooth multi-line chart visualization showing correlations between key metrics.
 *
 * @async
 * @function getEnrollmentCompletionRevenueTrend
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date for trend analysis
 * @param {string} [req.query.endDate] - End date for trend analysis
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with multi-series time-series data
 * @throws {Error} 500 - Server error during data aggregation
 */
export const getEnrollmentCompletionRevenueTrend = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();

        // Enrollments by month
        const enrollments = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Completions by month
        const completions = await Enrollment.aggregate([
            {
                $match: {
                    completionDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$completionDate" },
                        month: { $month: "$completionDate" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Revenue by month (in thousands)
        const revenue = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    status: "completed",
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Merge all data by month
        const dataMap = new Map();

        enrollments.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            dataMap.set(key, {
                date: new Date(item._id.year, item._id.month - 1, 1).getTime(),
                enrollments: item.count,
                completions: 0,
                revenue: 0,
            });
        });

        completions.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (dataMap.has(key)) {
                dataMap.get(key).completions = item.count;
            } else {
                dataMap.set(key, {
                    date: new Date(
                        item._id.year,
                        item._id.month - 1,
                        1
                    ).getTime(),
                    enrollments: 0,
                    completions: item.count,
                    revenue: 0,
                });
            }
        });

        revenue.forEach((item) => {
            const key = `${item._id.year}-${item._id.month}`;
            if (dataMap.has(key)) {
                dataMap.get(key).revenue = Math.round(item.total / 1000);
            } else {
                dataMap.set(key, {
                    date: new Date(
                        item._id.year,
                        item._id.month - 1,
                        1
                    ).getTime(),
                    enrollments: 0,
                    completions: 0,
                    revenue: Math.round(item.total / 1000),
                });
            }
        });

        const trendData = Array.from(dataMap.values()).sort(
            (a, b) => a.date - b.date
        );

        res.json({
            success: true,
            data: trendData,
        });
    } catch (error) {
        console.error("Enrollment/Completion/Revenue trend error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch trend data",
            error: error.message,
        });
    }
};

// ============================================
// COURSE COMPLETION STATUS (Doughnut Chart)
// ============================================

/**
 * Retrieves distribution of course completion statuses for doughnut chart.
 * Categories: Completed, In Progress, Not Started based on enrollment progress.
 *
 * @async
 * @function getCourseCompletionStatus
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date filter
 * @param {string} [req.query.endDate] - End date filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with categorized completion data
 * @throws {Error} 500 - Server error during status aggregation
 */
export const getCourseCompletionStatus = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const statusData = await Enrollment.aggregate([
            { $match: dateFilter },
            {
                $project: {
                    status: {
                        $cond: {
                            if: { $eq: ["$progressPercentage", 100] },
                            then: "completed",
                            else: {
                                $cond: {
                                    if: { $gt: ["$progressPercentage", 0] },
                                    then: "in-progress",
                                    else: "not-started",
                                },
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const statusMap = {
            completed: { category: "Completed", value: 0, color: "#10b981" },
            "in-progress": {
                category: "In Progress",
                value: 0,
                color: "#3b82f6",
            },
            "not-started": {
                category: "Not Started",
                value: 0,
                color: "#ef4444",
            },
        };

        statusData.forEach((item) => {
            if (statusMap[item._id]) {
                statusMap[item._id].value = item.count;
            }
        });

        res.json({
            success: true,
            data: Object.values(statusMap),
        });
    } catch (error) {
        console.error("Course completion status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch completion status",
            error: error.message,
        });
    }
};

// ============================================
// ENROLLMENT BY CATEGORY (Doughnut Chart)
// ============================================

/**
 * Retrieves distribution of student enrollments across course categories for doughnut chart.
 * Groups by course category from Course model.
 *
 * @async
 * @function getEnrollmentByCategory
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date filter
 * @param {string} [req.query.endDate] - End date filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with enrollment distribution by category
 * @throws {Error} 500 - Server error during category aggregation
 */
export const getEnrollmentByCategory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const categoryData = await Enrollment.aggregate([
            { $match: dateFilter },
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
                    _id: "$courseInfo.category",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const colorPalette = [
            "#3b82f6", // blue
            "#8b5cf6", // violet
            "#ec4899", // pink
            "#f59e0b", // amber
            "#10b981", // emerald
        ];

        const formattedData = categoryData.map((item, index) => ({
            category: item._id || "Uncategorized",
            value: item.count,
            color: colorPalette[index % colorPalette.length],
        }));

        res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Enrollment by category error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enrollment by category",
            error: error.message,
        });
    }
};

// ============================================
// MONTHLY ENROLLMENTS TREND (Column Chart)
// ============================================

/**
 * Retrieves new student enrollments by month for column chart visualization.
 * Shows enrollment count for each month in the specified date range.
 *
 * @async
 * @function getMonthlyEnrollments
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date for trend
 * @param {string} [req.query.endDate] - End date for trend
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with monthly enrollment counts
 * @throws {Error} 500 - Server error during monthly aggregation
 */
export const getMonthlyEnrollments = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setMonth(new Date().getMonth() - 5));
        const end = endDate ? new Date(endDate) : new Date();

        const monthlyData = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const formattedData = monthlyData.map((item) => ({
            category: monthNames[item._id.month - 1],
            value: item.count,
        }));

        res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Monthly enrollments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly enrollments",
            error: error.message,
        });
    }
};

// ============================================
// COURSE COMPLETIONS BY MONTH (Column Chart)
// ============================================

/**
 * Retrieves number of course completions by month for column chart.
 * Counts courses completed (100% progress or completion date set) per month.
 *
 * @async
 * @function getCourseCompletionsByMonth
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date filter
 * @param {string} [req.query.endDate] - End date filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with monthly completion counts
 * @throws {Error} 500 - Server error during completion aggregation
 */
export const getCourseCompletionsByMonth = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setMonth(new Date().getMonth() - 5));
        const end = endDate ? new Date(endDate) : new Date();

        const completionData = await Enrollment.aggregate([
            {
                $match: {
                    completionDate: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$completionDate" },
                        month: { $month: "$completionDate" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const formattedData = completionData.map((item) => ({
            category: monthNames[item._id.month - 1],
            value: item.count,
        }));

        res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Course completions by month error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch course completions by month",
            error: error.message,
        });
    }
};

// ============================================
// ASSESSMENT PERFORMANCE (Doughnut Chart)
// ============================================

/**
 * Retrieves student assessment performance distribution for doughnut chart.
 * Categories: Excellent (90-100%), Good (75-89%), Average (60-74%), Below Average (<60%).
 *
 * @async
 * @function getAssessmentPerformance
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date filter
 * @param {string} [req.query.endDate] - End date filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with performance distribution
 * @throws {Error} 500 - Server error during performance calculation
 */
export const getAssessmentPerformance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const performanceData = await Submission.aggregate([
            { $match: dateFilter },
            {
                $project: {
                    scorePercentage: {
                        $multiply: [
                            { $divide: ["$quizScore", "$totalQuestions"] },
                            100,
                        ],
                    },
                },
            },
            {
                $bucket: {
                    groupBy: "$scorePercentage",
                    boundaries: [0, 60, 75, 90, 101],
                    default: "Other",
                    output: {
                        count: { $sum: 1 },
                    },
                },
            },
        ]);

        const performanceMap = {
            0: { category: "Below Average (<60%)", value: 0, color: "#ef4444" },
            60: { category: "Average (60-74%)", value: 0, color: "#f59e0b" },
            75: { category: "Good (75-89%)", value: 0, color: "#3b82f6" },
            90: { category: "Excellent (90-100%)", value: 0, color: "#10b981" },
        };

        performanceData.forEach((item) => {
            if (performanceMap[item._id]) {
                performanceMap[item._id].value = item.count;
            }
        });

        res.json({
            success: true,
            data: Object.values(performanceMap),
        });
    } catch (error) {
        console.error("Assessment performance error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assessment performance",
            error: error.message,
        });
    }
};

// ============================================
// USER ENGAGEMENT LEVELS (Doughnut Chart)
// ============================================

/**
 * Retrieves user engagement level distribution based on submission activity for doughnut chart.
 * Categories: Highly Active, Active, Moderate, Inactive based on submission frequency.
 *
 * @async
 * @function getUserEngagement
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.startDate] - Start date filter
 * @param {string} [req.query.endDate] - End date filter
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with engagement distribution
 * @throws {Error} 500 - Server error during engagement calculation
 */
export const getUserEngagement = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // Use Submission count as engagement metric
        const engagementData = await Submission.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$user",
                    submissionCount: { $sum: 1 },
                },
            },
            {
                $bucket: {
                    groupBy: "$submissionCount",
                    boundaries: [0, 3, 10, 20, 1000],
                    default: "Other",
                    output: {
                        count: { $sum: 1 },
                    },
                },
            },
        ]);

        const engagementMap = {
            0: { category: "Inactive", value: 0, color: "#ef4444" },
            3: { category: "Moderate", value: 0, color: "#f59e0b" },
            10: { category: "Active", value: 0, color: "#3b82f6" },
            20: { category: "Highly Active", value: 0, color: "#10b981" },
        };

        engagementData.forEach((item) => {
            if (engagementMap[item._id]) {
                engagementMap[item._id].value = item.count;
            }
        });

        res.json({
            success: true,
            data: Object.values(engagementMap),
        });
    } catch (error) {
        console.error("User engagement error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user engagement levels",
            error: error.message,
        });
    }
};

// ============================================
// TOP PERFORMING COURSES - RADIAL HISTOGRAM
// ============================================

/**
 * Retrieves enrollment trends for top-performing courses over recent months for radial histogram visualization.
 * Returns 6-month enrollment data for top 6 courses, formatted for radial chart display.
 *
 * @async
 * @function getTopPerformingCourses
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.topCount=6] - Number of top courses to include
 * @param {number} [req.query.monthsBack=6] - Number of months to look back
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with course enrollment trends
 * @throws {Error} 500 - Server error during trend calculation
 */
export const getTopPerformingCourses = async (req, res) => {
    try {
        const topCount = parseInt(req.query.topCount) || 6;
        const monthsBack = parseInt(req.query.monthsBack) || 6;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - monthsBack);

        // Get top courses by enrollment count
        const topCourses = await Enrollment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: "$course",
                    totalEnrollments: { $sum: 1 },
                },
            },
            { $sort: { totalEnrollments: -1 } },
            { $limit: topCount },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            { $unwind: "$courseInfo" },
        ]);

        const courseIds = topCourses.map((c) => c._id);
        const courseNames = topCourses.reduce((acc, c) => {
            acc[c._id.toString()] = c.courseInfo.title;
            return acc;
        }, {});

        // Get monthly enrollment data for these courses
        const monthlyEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    course: { $in: courseIds },
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        course: "$course",
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        // Format data for radial histogram
        const formattedData = [];

        monthlyEnrollments.forEach((item) => {
            const courseName = courseNames[item._id.course.toString()];
            const monthName = monthNames[item._id.month - 1];
            const category = `${courseName.substring(0, 15)} - ${monthName}`;

            formattedData.push({
                category: category,
                value: item.count,
                course: courseName,
                month: monthName,
            });
        });

        res.json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Top performing courses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top performing courses",
            error: error.message,
        });
    }
};

// ============================================
// TOP LEADERBOARD PERFORMERS
// ============================================

/**
 * Retrieves top-performing students based on overall scores and achievements.
 * Returns ranked list with student details, course, and performance score.
 *
 * @async
 * @function getTopLeaderboard
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.limit=5] - Number of top performers to return
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with ranked top performers
 * @throws {Error} 500 - Server error during leaderboard calculation
 */
export const getTopLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const topPerformers = await Submission.aggregate([
            {
                $group: {
                    _id: "$user",
                    avgScore: {
                        $avg: {
                            $multiply: [
                                { $divide: ["$quizScore", "$totalQuestions"] },
                                100,
                            ],
                        },
                    },
                    totalSubmissions: { $sum: 1 },
                },
            },
            { $sort: { avgScore: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            { $unwind: "$userInfo" },
            {
                $lookup: {
                    from: "enrollments",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
                        { $sort: { updatedAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "course",
                                foreignField: "_id",
                                as: "courseInfo",
                            },
                        },
                        { $unwind: "$courseInfo" },
                    ],
                    as: "latestEnrollment",
                },
            },
            {
                $project: {
                    name: {
                        $concat: ["$userInfo.name", " ", "$userInfo.lastName"],
                    },
                    course: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    "$latestEnrollment.courseInfo.title",
                                    0,
                                ],
                            },
                            "N/A",
                        ],
                    },
                    score: { $round: ["$avgScore", 0] },
                },
            },
        ]);

        res.json({
            success: true,
            data: topPerformers,
        });
    } catch (error) {
        console.error("Top leaderboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top leaderboard",
            error: error.message,
        });
    }
};

// ============================================
// RECENT CERTIFICATIONS
// ============================================

/**
 * Retrieves recently issued certificates with student and course details.
 * Returns list ordered by issue date descending.
 *
 * @async
 * @function getRecentCertifications
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.limit=4] - Number of recent certificates to return
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with recent certifications
 * @throws {Error} 500 - Server error during certificate retrieval
 */
export const getRecentCertifications = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;

        const recentCerts = await Certificate.aggregate([
            { $sort: { issuedAt: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            { $unwind: "$userInfo" },
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
                $project: {
                    name: {
                        $concat: ["$userInfo.name", " ", "$userInfo.lastName"],
                    },
                    course: "$courseInfo.title",
                    time: {
                        $let: {
                            vars: {
                                diff: {
                                    $divide: [
                                        {
                                            $subtract: [
                                                new Date(),
                                                "$issuedAt",
                                            ],
                                        },
                                        1000 * 60 * 60,
                                    ],
                                },
                            },
                            in: {
                                $cond: {
                                    if: { $lt: ["$$diff", 1] },
                                    then: "Just now",
                                    else: {
                                        $cond: {
                                            if: { $lt: ["$$diff", 24] },
                                            then: {
                                                $concat: [
                                                    {
                                                        $toString: {
                                                            $round: [
                                                                "$$diff",
                                                                0,
                                                            ],
                                                        },
                                                    },
                                                    " hours ago",
                                                ],
                                            },
                                            else: {
                                                $concat: [
                                                    {
                                                        $toString: {
                                                            $round: [
                                                                {
                                                                    $divide: [
                                                                        "$$diff",
                                                                        24,
                                                                    ],
                                                                },
                                                                0,
                                                            ],
                                                        },
                                                    },
                                                    " day",
                                                    {
                                                        $cond: {
                                                            if: {
                                                                $gt: [
                                                                    {
                                                                        $divide:
                                                                            [
                                                                                "$$diff",
                                                                                24,
                                                                            ],
                                                                    },
                                                                    1,
                                                                ],
                                                            },
                                                            then: "s",
                                                            else: "",
                                                        },
                                                    },
                                                    " ago",
                                                ],
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        res.json({
            success: true,
            data: recentCerts,
        });
    } catch (error) {
        console.error("Recent certifications error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent certifications",
            error: error.message,
        });
    }
};

// ============================================
// SYSTEM HEALTH METRICS
// ============================================

/**
 * Retrieves system health and infrastructure metrics.
 * Includes server uptime, load time, active sessions (based on recent submissions), and storage usage statistics.
 *
 * @async
 * @function getSystemHealth
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with system health metrics
 * @throws {Error} 500 - Server error during health check
 */
export const getSystemHealth = async (req, res) => {
    try {
        // Server uptime (process uptime in days)
        const uptimeSeconds = process.uptime();
        const uptimeDays = (uptimeSeconds / (60 * 60 * 24)).toFixed(1);
        const serverUptime = `${((uptimeDays / 365) * 100).toFixed(1)}%`;

        // Active sessions (count of unique users with recent submissions in last 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const activeSessions = await Submission.distinct("user", {
            createdAt: { $gte: fifteenMinutesAgo },
        }).then((users) => users.length);

        // Average load time (simulated - in production, use real metrics from monitoring tools)
        const avgLoadTime = "1.2s";

        // Storage used (simulated - calculate from actual file/media storage in production)
        const storageUsed = "67%";

        res.json({
            success: true,
            data: {
                serverUptime: {
                    label: "Server Uptime",
                    value: serverUptime,
                    status: "excellent",
                },
                avgLoadTime: {
                    label: "Average Load Time",
                    value: avgLoadTime,
                    status: "good",
                },
                activeSessions: {
                    label: "Active Sessions",
                    value: activeSessions.toString(),
                    status: "excellent",
                },
                storageUsed: {
                    label: "Storage Used",
                    value: storageUsed,
                    status: "warning",
                },
            },
        });
    } catch (error) {
        console.error("System health error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch system health metrics",
            error: error.message,
        });
    }
};

import { faker } from "@faker-js/faker";
import {
    Analytics,
    User,
    Enrollment,
    Payment,
    Course,
} from "../../models/index.js";

export const seedAnalytics = async () => {
    const analyticsData = [];

    // Get all data for calculations
    const allUsers = await User.find({ role: "student" });
    const allEnrollments = await Enrollment.find();
    const allPayments = await Payment.find({ status: "verified" });
    const allCourses = await Course.find().select("_id title");

    if (allUsers.length === 0) {
        console.log("⚠️  Skipping analytics: No data found to analyze");
        return;
    }

    // Generate analytics for the past 180 days
    const daysToGenerate = 180;
    const today = new Date();

    // Calculate cumulative growth over time
    let cumulativeStudents = 0;
    let cumulativeEnrollments = 0;
    let cumulativeRevenue = 0;

    for (let i = daysToGenerate; i >= 0; i--) {
        const currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() - i);
        currentDate.setHours(0, 0, 0, 0);

        // Simulate growth: more recent data has higher values
        const growthFactor = (daysToGenerate - i) / daysToGenerate;

        // New students joining that day (0-10 per day, increasing over time)
        const newStudents = Math.floor(
            faker.number.int({ min: 0, max: 10 }) * growthFactor
        );
        cumulativeStudents = Math.min(
            cumulativeStudents + newStudents,
            allUsers.length
        );

        // New enrollments that day (0-15 per day, increasing over time)
        const newEnrollments = Math.floor(
            faker.number.int({ min: 0, max: 15 }) * growthFactor
        );
        cumulativeEnrollments = Math.min(
            cumulativeEnrollments + newEnrollments,
            allEnrollments.length
        );

        // Revenue for that day (based on enrollments)
        const dailyRevenue =
            newEnrollments *
            faker.helpers.arrayElement([500, 1999, 2499, 2999]);
        cumulativeRevenue += dailyRevenue;

        // Active users (10-40% of total students)
        const activeUsersToday = Math.floor(
            cumulativeStudents * faker.number.float({ min: 0.1, max: 0.4 })
        );

        // Course popularity (top 5-10 courses by enrollments)
        const coursePopularity = [];
        const popularCourseCount = Math.min(
            faker.number.int({ min: 5, max: 10 }),
            allCourses.length
        );

        for (let j = 0; j < popularCourseCount; j++) {
            const course = allCourses[j];
            const enrollmentCount = Math.floor(
                (cumulativeEnrollments / allCourses.length) *
                    faker.number.float({ min: 0.5, max: 2.5 }) // Some courses are more popular
            );

            coursePopularity.push({
                courseId: course._id,
                title: course.title,
                enrollments: enrollmentCount,
            });
        }

        // Sort by enrollments descending
        coursePopularity.sort((a, b) => b.enrollments - a.enrollments);

        analyticsData.push({
            date: currentDate,
            totalStudents: cumulativeStudents,
            totalEnrollments: cumulativeEnrollments,
            revenue: Math.floor(cumulativeRevenue),
            coursePopularity: coursePopularity,
            activeUsersToday: activeUsersToday,
            createdAt: currentDate,
            updatedAt: currentDate,
        });
    }

    // Update the last entry with actual current data
    const latestAnalytics = analyticsData[analyticsData.length - 1];
    latestAnalytics.totalStudents = allUsers.length;
    latestAnalytics.totalEnrollments = allEnrollments.length;
    latestAnalytics.revenue = allPayments.reduce(
        (sum, p) => sum + (p.amountPaid || 0),
        0
    );

    // Calculate actual course popularity from enrollments
    const actualCoursePopularity = await Enrollment.aggregate([
        {
            $group: {
                _id: "$course",
                enrollments: { $sum: 1 },
            },
        },
        { $sort: { enrollments: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "courseInfo",
            },
        },
        {
            $project: {
                courseId: "$_id",
                title: { $arrayElemAt: ["$courseInfo.title", 0] },
                enrollments: 1,
            },
        },
    ]);

    latestAnalytics.coursePopularity = actualCoursePopularity.map((cp) => ({
        courseId: cp.courseId,
        title: cp.title,
        enrollments: cp.enrollments,
    }));

    // Recent active users (students who logged in last 7 days)
    const recentActiveUsers = await User.countDocuments({
        role: "student",
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    latestAnalytics.activeUsersToday = recentActiveUsers;

    await Analytics.insertMany(analyticsData);

    // Calculate statistics
    const totalRevenue = analyticsData[analyticsData.length - 1].revenue;
    const avgDailyStudents = Math.floor(
        analyticsData.reduce((sum, a) => sum + a.totalStudents, 0) /
            analyticsData.length
    );
    const avgDailyEnrollments = Math.floor(
        analyticsData.reduce((sum, a) => sum + a.totalEnrollments, 0) /
            analyticsData.length
    );

    console.log(
        `✅ ${analyticsData.length} analytics entries seeded (${daysToGenerate} days)`
    );
    console.log(`   📊 Current Stats:`);
    console.log(`      - Total Students: ${latestAnalytics.totalStudents}`);
    console.log(
        `      - Total Enrollments: ${latestAnalytics.totalEnrollments}`
    );
    console.log(
        `      - Total Revenue: ₹${totalRevenue.toLocaleString("en-IN")}`
    );
    console.log(
        `      - Active Users (last 7 days): ${latestAnalytics.activeUsersToday}`
    );
    console.log(`   📈 Averages:`);
    console.log(`      - Avg Daily Students: ${avgDailyStudents}`);
    console.log(`      - Avg Daily Enrollments: ${avgDailyEnrollments}`);

    if (latestAnalytics.coursePopularity.length > 0) {
        console.log(`   🏆 Top 3 Popular Courses:`);
        latestAnalytics.coursePopularity.slice(0, 3).forEach((cp, idx) => {
            console.log(
                `      ${idx + 1}. ${cp.title} - ${cp.enrollments} enrollments`
            );
        });
    }
};

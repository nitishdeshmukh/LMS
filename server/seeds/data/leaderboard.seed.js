import { faker } from "@faker-js/faker";
import { Leaderboard, User, Course, Enrollment } from "../../models/index.js";

export const seedLeaderboard = async () => {
    const students = await User.find({
        role: "student",
        accountStatus: "verified",
    });
    const courses = await Course.find();

    if (students.length === 0) {
        console.log("⚠️  Skipping leaderboard: No verified students found");
        return;
    }

    const leaderboardEntries = [];

    // ==================== GLOBAL LEADERBOARD ====================
    // Use student's XP from User model as the global score
    const globalEntries = students.map((student) => ({
        student: student._id,
        score: student.xp || faker.number.int({ min: 0, max: 5000 }),
        type: "global",
        createdAt: faker.date.past({ years: 1 }),
    }));

    // Sort by score descending and assign ranks
    globalEntries.sort((a, b) => b.score - a.score);
    globalEntries.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    leaderboardEntries.push(...globalEntries);

    // ==================== COURSE-SPECIFIC LEADERBOARDS ====================
    if (courses.length > 0) {
        for (const course of courses) {
            // Get all enrollments for this course
            const enrollments = await Enrollment.find({
                course: course._id,
                status: { $in: ["active", "completed"] },
            }).populate("student");

            if (enrollments.length === 0) continue;

            const courseEntries = enrollments.map((enrollment) => {
                const student = enrollment.student;

                // Calculate course score based on student's activity
                // Combine various metrics for a realistic score
                const baseScore = faker.number.int({ min: 0, max: 1000 });
                const quizBonus = (student.quizzesCompleted || 0) * 10;
                const assignmentBonus =
                    (student.assignmentsCompleted || 0) * 15;
                const hoursBonus = Math.floor((student.hoursLearned || 0) * 2);
                const streakBonus = (student.streak || 0) * 5;

                const totalScore =
                    baseScore +
                    quizBonus +
                    assignmentBonus +
                    hoursBonus +
                    streakBonus;

                return {
                    student: student._id,
                    course: course._id,
                    score: totalScore,
                    type: "course",
                    createdAt: faker.date.between({
                        from:
                            enrollment.createdAt ||
                            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                        to: new Date(),
                    }),
                };
            });

            // Sort by score descending and assign ranks for this course
            courseEntries.sort((a, b) => b.score - a.score);
            courseEntries.forEach((entry, index) => {
                entry.rank = index + 1;
            });

            leaderboardEntries.push(...courseEntries);
        }
    }

    // ==================== ADD SOME VARIATION ====================
    // Some students might not be on course leaderboards (inactive or dropped)
    // Remove random 10-20% of course entries to simulate this
    const courseEntries = leaderboardEntries.filter((e) => e.type === "course");
    const toRemove = Math.floor(
        courseEntries.length * faker.number.float({ min: 0.1, max: 0.2 })
    );

    for (let i = 0; i < toRemove; i++) {
        const randomIndex = faker.number.int({
            min: 0,
            max: leaderboardEntries.length - 1,
        });
        if (leaderboardEntries[randomIndex]?.type === "course") {
            leaderboardEntries.splice(randomIndex, 1);
        }
    }

    // Recalculate ranks after removal for affected courses
    const courseIds = [
        ...new Set(
            leaderboardEntries
                .filter((e) => e.type === "course")
                .map((e) => e.course.toString())
        ),
    ];

    for (const courseId of courseIds) {
        const entries = leaderboardEntries.filter(
            (e) => e.course?.toString() === courseId
        );
        entries.sort((a, b) => b.score - a.score);
        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });
    }

    await Leaderboard.insertMany(leaderboardEntries);

    const globalCount = leaderboardEntries.filter(
        (e) => e.type === "global"
    ).length;
    const courseCount = leaderboardEntries.filter(
        (e) => e.type === "course"
    ).length;

    console.log(`✅ ${leaderboardEntries.length} leaderboard entries seeded`);
    console.log(`   🌍 Global: ${globalCount} students`);
    console.log(
        `   📚 Course-specific: ${courseCount} entries across ${courseIds.length} courses`
    );

    // Show top 3 global leaders
    const top3 = await Leaderboard.find({ type: "global" })
        .sort({ rank: 1 })
        .limit(3)
        .populate("student", "name email");

    console.log("   🏆 Top 3 Global Leaders:");
    top3.forEach((entry, idx) => {
        console.log(
            `      ${idx + 1}. ${entry.student.name} - ${entry.score} XP`
        );
    });
};

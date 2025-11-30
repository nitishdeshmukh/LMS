import { leaderboardQuerySchema } from "../../validation/student.zod.js";
import { Leaderboard } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * GET /api/student/leaderboard
 * Get leaderboard
 */
export const getLeaderboard = async (req, res) => {
    try {
        const validation = leaderboardQuerySchema.safeParse(req.query);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const { type, courseId, limit, page } = validation.data;
        const skip = (page - 1) * limit;

        const query = { type };
        if (type === "course" && courseId) {
            query.course = courseId;
        }

        // Get leaderboard entries
        const leaderboard = await Leaderboard.find(query)
            .populate({
                path: "student",
                select: "name collegeName courseName yearOfStudy avatar isProfileLocked linkedin github",
            })
            .sort({ xp: -1 })
            .skip(skip)
            .limit(limit);

        // Get current user's position
        const userEntry = await Leaderboard.findOne({
            student: req.userId,
            type,
            ...(type === "course" && courseId ? { course: courseId } : {}),
        }).populate("student", "name avatar");

        let userRank = null;
        if (userEntry) {
            const higherCount = await Leaderboard.countDocuments({
                type,
                ...(type === "course" && courseId ? { course: courseId } : {}),
                xp: { $gt: userEntry.xp },
            });
            userRank = higherCount + 1;
        }

        // Format response with privacy consideration
        const formattedLeaderboard = leaderboard.map((entry, index) => {
            const student = entry.student;
            const isLocked = student.isProfileLocked;

            return {
                rank: skip + index + 1,
                name: student.name,
                avatar: student.avatar,
                xp: entry.xp,
                quizzesCompleted: entry.quizzesCompleted,
                // Only show social links if profile is not locked
                ...(isLocked
                    ? {}
                    : {
                          college: student.collegeName,
                          linkedin: student.linkedin,
                          github: student.github,
                      }),
                isCurrentUser:
                    entry.student._id.toString() === req.userId.toString(),
            };
        });

        const total = await Leaderboard.countDocuments(query);

        res.json({
            success: true,
            data: {
                leaderboard: formattedLeaderboard,
                userRank,
                userEntry: userEntry
                    ? {
                          xp: userEntry.xp,
                          streak: userEntry.streak,
                          rank: userRank,
                      }
                    : null,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("Get leaderboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * Helper function to update leaderboard
 * Exported for use in other controllers
 * @param {string} userId - The student's ID
 * @param {string} courseId - The course ID (optional for course-specific leaderboard)
 * @param {number} xpGained - XP points gained
 * @param {object} stats - Additional stats to increment { quizzesCompleted, assignmentsCompleted }
 */
export const updateLeaderboard = async (
    userId,
    courseId,
    xpGained,
    stats = {}
) => {
    try {
        const incrementFields = { xp: xpGained };

        // Add optional stat increments
        if (stats.quizzesCompleted) {
            incrementFields.quizzesCompleted = stats.quizzesCompleted;
        }
        if (stats.assignmentsCompleted) {
            incrementFields.assignmentsCompleted = stats.assignmentsCompleted;
        }

        // Update global leaderboard
        await Leaderboard.findOneAndUpdate(
            { student: userId, type: "global" },
            {
                $inc: incrementFields,
                $set: { student: userId, type: "global" },
            },
            { upsert: true }
        );

        // Update course leaderboard
        if (courseId) {
            await Leaderboard.findOneAndUpdate(
                { student: userId, type: "course", course: courseId },
                {
                    $inc: incrementFields,
                    $set: {
                        student: userId,
                        type: "course",
                        course: courseId,
                    },
                },
                { upsert: true }
            );
        }
    } catch (error) {
        console.error("Leaderboard update error:", error);
    }
};

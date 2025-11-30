import User from "../../models/User.js";

/**
 * POST /api/student/streak/update
 * Update daily streak (called on login or activity)
 */
export const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    if (lastStreak) {
      lastStreak.setHours(0, 0, 0, 0);
    }

    const oneDayMs = 24 * 60 * 60 * 1000;
    const daysDiff = lastStreak ? Math.floor((today - lastStreak) / oneDayMs) : null;

    if (daysDiff === null || daysDiff > 1) {
      // Reset streak
      user.streak = 1;
    } else if (daysDiff === 1) {
      // Continue streak
      user.streak += 1;
      // Bonus XP for streak milestones
      if (user.streak % 7 === 0) {
        user.xp += 100; // Weekly streak bonus
      }
    }
    // If daysDiff === 0, streak already counted today

    user.lastStreakDate = today;
    await user.save();

    res.json({
      success: true,
      data: { streak: user.streak },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

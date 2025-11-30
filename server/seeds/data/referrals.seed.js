import { faker } from "@faker-js/faker";
import { Referral, User } from "../../models/index.js";

export const seedReferrals = async () => {
    // Get users who can be referrers (verified accounts with referral codes)
    const potentialReferrers = await User.find({
        accountStatus: "verified",
        myReferralCode: { $exists: true },
    }).select("_id myReferralCode");

    // Get users who were referred (have referredBy field)
    const referredUsers = await User.find({
        referredBy: { $exists: true, $ne: null },
    }).select("_id referredBy");

    if (potentialReferrers.length === 0) {
        console.log(
            "⚠️  Skipping referrals: No users with referral codes found"
        );
        return;
    }

    const referrals = [];

    // Create referrals for users who have referredBy field
    for (const referee of referredUsers) {
        // Find the referrer by matching referral code
        const referrer = potentialReferrers.find(
            (user) => user.myReferralCode === referee.referredBy
        );

        if (referrer && referrer._id.toString() !== referee._id.toString()) {
            referrals.push({
                referrer: referrer._id,
                referee: referee._id,
                referralCode: referrer.myReferralCode,
                credited: faker.datatype.boolean(0.7), // 70% credited
                createdAt: faker.date.past({ years: 1 }),
            });
        }
    }

    // Create additional random referrals (users who joined via referral link)
    const additionalReferrals = faker.number.int({ min: 15, max: 30 });
    const allUsers = await User.find({
        accountStatus: { $in: ["verified", "pending"] },
    }).select("_id");

    for (let i = 0; i < additionalReferrals && allUsers.length > 1; i++) {
        const referrer = faker.helpers.arrayElement(potentialReferrers);
        const referee = faker.helpers.arrayElement(allUsers);

        // Ensure referrer and referee are different
        if (referrer._id.toString() !== referee._id.toString()) {
            // Check if this referral already exists
            const exists = referrals.some(
                (r) =>
                    r.referrer.toString() === referrer._id.toString() &&
                    r.referee.toString() === referee._id.toString()
            );

            if (!exists) {
                const createdDate = faker.date.past({ years: 1 });
                const daysSinceCreation = Math.floor(
                    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Recent referrals are less likely to be credited
                const creditProbability = daysSinceCreation > 30 ? 0.8 : 0.4;

                referrals.push({
                    referrer: referrer._id,
                    referee: referee._id,
                    referralCode: referrer.myReferralCode,
                    credited: faker.datatype.boolean(creditProbability),
                    createdAt: createdDate,
                });
            }
        }
    }

    // Update referrer's referralCount in User model
    const referrerCounts = {};
    referrals.forEach((ref) => {
        const referrerId = ref.referrer.toString();
        referrerCounts[referrerId] = (referrerCounts[referrerId] || 0) + 1;
    });

    // Bulk update referral counts
    const bulkOps = Object.entries(referrerCounts).map(([userId, count]) => ({
        updateOne: {
            filter: { _id: userId },
            update: { $set: { referralCount: count } },
        },
    }));

    if (bulkOps.length > 0) {
        await User.bulkWrite(bulkOps);
    }

    // Check for premium unlock (if referralCount >= threshold, e.g., 5)
    const PREMIUM_THRESHOLD = 5;
    await User.updateMany(
        { referralCount: { $gte: PREMIUM_THRESHOLD } },
        { $set: { isPremiumUnlocked: true } }
    );

    await Referral.insertMany(referrals);
    console.log(`✅ ${referrals.length} referrals seeded`);
    console.log(
        `📊 ${
            Object.keys(referrerCounts).length
        } users have successful referrals`
    );

    const premiumUnlocked = await User.countDocuments({
        referralCount: { $gte: PREMIUM_THRESHOLD },
        isPremiumUnlocked: true,
    });
    console.log(`🎉 ${premiumUnlocked} users unlocked premium via referrals`);
};

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";

// Import all seed functions
import { seedUsers, cleanUsers } from "./data/users.seed.js";
import { seedCourses } from "./data/courses.seed.js";
import { seedEnrollments } from "./data/enrollments.seed.js";
import { seedReferrals } from "./data/referrals.seed.js";
import { seedPayments } from "./data/payments.seed.js";
import { seedSubmissions } from "./data/submissions.seed.js";
import { seedLeaderboard } from "./data/leaderboard.seed.js";
import { seedCertificates } from "./data/certificates.seed.js";
import { seedAnalytics } from "./data/analytics.seed.js";

// Load .env from root directory (parent of server folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// Clean entire database
const cleanDatabase = async () => {
    console.log("🗑️  Clearing entire database...");
    await mongoose.connection.dropDatabase();
    console.log("✅ Database cleared\n");
};

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log("🔗 Connected to MongoDB\n");

        // Always clear database before seeding
        await cleanDatabase();

        console.log("🌱 Starting database seeding...\n");

        // Seed in correct order (respecting dependencies)

        // 1. Independent collections
        console.log("📝 Step 1: Seeding Users...");
        await seedUsers();
        console.log("");

        console.log("📚 Step 2: Seeding Courses...");
        await seedCourses();
        console.log("");

        // 2. Depends on Users
        console.log("🔗 Step 3: Seeding Referrals...");
        await seedReferrals();
        console.log("");

        // 3. Depends on Users and Courses
        console.log("📝 Step 4: Seeding Enrollments...");
        await seedEnrollments();
        console.log("");

        // 4. Depends on Enrollments
        console.log("💳 Step 5: Seeding Payments...");
        await seedPayments();
        console.log("");

        console.log("📤 Step 6: Seeding Submissions...");
        await seedSubmissions();
        console.log("");

        console.log("🏆 Step 7: Seeding Leaderboard...");
        await seedLeaderboard();
        console.log("");

        console.log("🎓 Step 8: Seeding Certificates...");
        await seedCertificates();
        console.log("");

        console.log("📊 Step 9: Seeding Analytics...");
        await seedAnalytics();
        console.log("");

        console.log("✅ Database seeded successfully! 🎉\n");
        console.log("═══════════════════════════════════════════════════════");
        console.log("📊 SEEDING SUMMARY");
        console.log("═══════════════════════════════════════════════════════");

        // Get final counts
        const User = mongoose.model("User");
        const Course = mongoose.model("Course");
        const Enrollment = mongoose.model("Enrollment");
        const Payment = mongoose.model("Payment");
        const Submission = mongoose.model("Submission");
        const Referral = mongoose.model("Referral");
        const Leaderboard = mongoose.model("Leaderboard");
        const Certificate = mongoose.model("Certificate");
        const Analytics = mongoose.model("Analytics");

        const counts = {
            users: await User.countDocuments(),
            courses: await Course.countDocuments(),
            enrollments: await Enrollment.countDocuments(),
            payments: await Payment.countDocuments(),
            submissions: await Submission.countDocuments(),
            referrals: await Referral.countDocuments(),
            leaderboard: await Leaderboard.countDocuments(),
            certificates: await Certificate.countDocuments(),
            analytics: await Analytics.countDocuments(),
        };

        console.log(
            `✓ Users:        ${counts.users.toString().padStart(4)} records`
        );
        console.log(
            `✓ Courses:      ${counts.courses.toString().padStart(4)} records`
        );
        console.log(
            `✓ Enrollments:  ${counts.enrollments
                .toString()
                .padStart(4)} records`
        );
        console.log(
            `✓ Payments:     ${counts.payments.toString().padStart(4)} records`
        );
        console.log(
            `✓ Submissions:  ${counts.submissions
                .toString()
                .padStart(4)} records`
        );
        console.log(
            `✓ Referrals:    ${counts.referrals.toString().padStart(4)} records`
        );
        console.log(
            `✓ Leaderboard:  ${counts.leaderboard
                .toString()
                .padStart(4)} records`
        );
        console.log(
            `✓ Certificates: ${counts.certificates
                .toString()
                .padStart(4)} records`
        );
        console.log(
            `✓ Analytics:    ${counts.analytics
                .toString()
                .padStart(4)} records (180 days)`
        );
        console.log(
            "═══════════════════════════════════════════════════════\n"
        );

        console.log("🎯 You can now start your application with real data!");
        console.log("💡 Test credentials:");
        console.log("   Admin Email: admin@example.com");
        console.log("   Admin Password: Admin@123");
        console.log("");
        console.log("🔐 LMS Login Test Credentials:");
        console.log("   LMS ID: LMS001 | Password: Lms@123");
        console.log("   LMS ID: LMS002 | Password: Lms@123");
        console.log("   LMS ID: LMS003 | Password: Lms@123");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        console.error(
            "\n💡 Tip: Try running with --clear flag to drop existing data first"
        );
        process.exit(1);
    }
};

seedDatabase();

import { faker } from "@faker-js/faker";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

// Helper to generate college names
const colleges = [
    "IIT Delhi",
    "IIT Bombay",
    "NIT Trichy",
    "BITS Pilani",
    "VIT Vellore",
    "Delhi University",
    "Mumbai University",
    "Anna University",
    "Pune University",
    "Manipal Institute of Technology",
    "SRM University",
    "Amity University",
];

const courses = [
    "B.Tech CSE",
    "B.Tech IT",
    "BCA",
    "MCA",
    "B.Sc Computer Science",
    "M.Tech",
    "B.Tech ECE",
];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];

// Helper to hash password (since insertMany doesn't trigger pre-save hooks)
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Clean all users from database
export const cleanUsers = async () => {
    const result = await User.deleteMany({});
    console.log(`🗑️  Cleaned ${result.deletedCount} users from database`);
    return result.deletedCount;
};

export const seedUsers = async () => {
    const users = [];

    const hashedLmsPassword = await hashPassword("Lms@123");

    // Create 1 admin
    users.push({
        email: "admin@example.com",
        lmsId: "ADMIN001",
        lmsPassword: hashedLmsPassword,
        name: "Admin",
        middleName: "",
        lastName: "User",
        phoneNumber: faker.phone.number("+91##########"),
        alternatePhone: faker.helpers.maybe(
            () => faker.phone.number("+91##########"),
            { probability: 0.3 }
        ),
        avatar: faker.image.avatar(),
        role: "admin",
        lastLogin: faker.date.recent({ days: 1 }),
    });

    // Create 3 test students with predictable LMS credentials for testing
    const testStudents = [
        {
            email: "student1@example.com",
            name: "Test",
            lastName: "Student1",
            lmsId: "LMS001",
        },
        {
            email: "student2@example.com",
            name: "Test",
            lastName: "Student2",
            lmsId: "LMS002",
        },
        {
            email: "student3@example.com",
            name: "Test",
            lastName: "Student3",
            lmsId: "LMS003",
        },
    ];

    for (const testStudent of testStudents) {
        users.push({
            email: testStudent.email,
            name: testStudent.name,
            lastName: testStudent.lastName,
            phoneNumber: faker.phone.number("+91##########"),
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            avatar: faker.image.avatar(),
            xp: faker.number.int({ min: 500, max: 5000 }),
            hoursLearned: faker.number.int({ min: 20, max: 100 }),
            role: "student",
            accountStatus: "verified",
            lmsId: testStudent.lmsId,
            lmsPassword: hashedLmsPassword,
            referralCount: faker.number.int({ min: 0, max: 5 }),
            isPremiumUnlocked: true,
            lastLogin: faker.date.recent({ days: 3 }),
        });
    }

    // Create 20-30 regular students with password auth
    const studentCount = faker.number.int({ min: 20, max: 30 });

    for (let i = 0; i < studentCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const accountStatus = faker.helpers.arrayElement([
            "pending",
            "verified",
            "verified",
            "verified",
            "blocked",
        ]); // More verified

        const hasLmsAccess = faker.datatype.boolean(0.7); // 70% have LMS access

        const user = {
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            name: firstName,
            middleName: faker.helpers.maybe(() => faker.person.middleName(), {
                probability: 0.4,
            }),
            lastName: lastName,
            phoneNumber: faker.phone.number("+91##########"),
            alternatePhone: faker.helpers.maybe(
                () => faker.phone.number("+91##########"),
                { probability: 0.2 }
            ),
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            avatar: faker.helpers.maybe(() => faker.image.avatar(), {
                probability: 0.6,
            }),
            linkedin: faker.helpers.maybe(
                () => `https://linkedin.com/in/${faker.internet.username()}`,
                { probability: 0.7 }
            ),
            github: faker.helpers.maybe(
                () => `https://github.com/${faker.internet.username()}`,
                { probability: 0.5 }
            ),
            portfolio: faker.helpers.maybe(() => faker.internet.url(), {
                probability: 0.3,
            }),
            isProfileLocked: faker.datatype.boolean(0.1), // 10% locked
            xp: faker.number.int({ min: 0, max: 3000 }),
            hoursLearned: faker.number.int({ min: 0, max: 200 }),
            role: "student",
            accountStatus: accountStatus,
            lmsId: hasLmsAccess
                ? `LMS${faker.string.alphanumeric(8).toUpperCase()}`
                : undefined,
            lmsPassword: hasLmsAccess ? hashedLmsPassword : undefined,
            referredBy: faker.helpers.maybe(
                () => `REFER-${faker.string.alphanumeric(4).toUpperCase()}`,
                { probability: 0.3 }
            ),
            referralCount: faker.number.int({ min: 0, max: 10 }),
            isPremiumUnlocked: faker.datatype.boolean(0.2), // 20% premium
            lastLogin:
                accountStatus === "verified"
                    ? faker.date.recent({ days: 30 })
                    : undefined,
        };

        users.push(user);
    }

    // Create 5-10 Google OAuth users (no password)
    const googleUserCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < googleUserCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        users.push({
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            googleId: faker.string.numeric(21), // Google IDs are typically numeric
            name: firstName,
            lastName: lastName,
            avatar: faker.image.avatar(),
            phoneNumber: faker.helpers.maybe(
                () => faker.phone.number("+91##########"),
                { probability: 0.5 }
            ),
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            linkedin: faker.helpers.maybe(
                () => `https://linkedin.com/in/${faker.internet.username()}`,
                { probability: 0.6 }
            ),
            github: faker.helpers.maybe(
                () => `https://github.com/${faker.internet.username()}`,
                { probability: 0.4 }
            ),
            xp: faker.number.int({ min: 0, max: 2000 }),
            hoursLearned: faker.number.int({ min: 0, max: 150 }),
            role: "student",
            accountStatus: "verified",
            isPremiumUnlocked: faker.datatype.boolean(0.15),
            lastLogin: faker.date.recent({ days: 15 }),
        });
    }

    // Create 3-5 GitHub OAuth users
    const githubUserCount = faker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < githubUserCount; i++) {
        const firstName = faker.person.firstName();
        const username = faker.internet.username({ firstName });

        users.push({
            email: faker.internet.email({ firstName }).toLowerCase(),
            githubId: faker.string.numeric(8),
            name: firstName,
            avatar: `https://github.com/${username}.png`,
            github: `https://github.com/${username}`,
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            xp: faker.number.int({ min: 0, max: 1500 }),
            hoursLearned: faker.number.int({ min: 0, max: 100 }),
            role: "student",
            accountStatus: "verified",
            lastLogin: faker.date.recent({ days: 10 }),
        });
    }

    await User.insertMany(users);
    console.log(
        `✅ ${users.length} users seeded (1 admin, ${testStudents.length} test students, ${studentCount} random students, ${googleUserCount} Google users, ${githubUserCount} GitHub users)`
    );

    return users;
};

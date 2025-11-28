import { faker } from "@faker-js/faker";
import { User } from "../../models/index.js";

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

export const seedUsers = async () => {
    const users = [];

    // ⭐ ADMIN USER
    users.push({
        email: "admin@example.com",
        password: "Admin@123",
        name: "Admin",
        middleName: faker.person.middleName(),
        lastName: "User",
        phoneNumber: faker.phone.number("+91##########"),
        alternatePhone: faker.helpers.maybe(
            () => faker.phone.number("+91##########"),
            { probability: 0.3 }
        ),
        collegeName: faker.helpers.arrayElement(colleges),
        courseName: faker.helpers.arrayElement(courses),
        yearOfStudy: faker.helpers.arrayElement(years),
        avatar: faker.image.avatar(),
        linkedin: `https://linkedin.com/in/${faker.internet.username()}`,
        github: `https://github.com/${faker.internet.username()}`,
        portfolio: faker.helpers.maybe(() => faker.internet.url(), {
            probability: 0.5,
        }),
        isProfileLocked: false,
        xp: faker.number.int({ min: 1000, max: 5000 }),
        streak: faker.number.int({ min: 0, max: 100 }),
        lastStreakDate: faker.date.recent({ days: 7 }),
        hoursLearned: faker.number.int({ min: 50, max: 500 }),
        quizzesCompleted: faker.number.int({ min: 10, max: 100 }),
        assignmentsCompleted: faker.number.int({ min: 5, max: 50 }),
        role: "admin",
        accountStatus: "verified",
        lmsId: `LMS${faker.string.alphanumeric(8).toUpperCase()}`,
        lmsPassword: "Lms@123",
        referralCount: faker.number.int({ min: 5, max: 30 }),
        isPremiumUnlocked: true,
        lastLogin: faker.date.recent({ days: 1 }),
    });

    // ⭐ REGULAR STUDENTS
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
        ]);

        users.push({
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            password: "Password@123",
            name: firstName,
            middleName: faker.helpers.maybe(() => faker.person.middleName(), {
                probability: 0.4,
            }),
            lastName,
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
            isProfileLocked: faker.datatype.boolean(0.1),
            xp: faker.number.int({ min: 0, max: 3000 }),
            streak: faker.number.int({ min: 0, max: 50 }),
            lastStreakDate: faker.helpers.maybe(
                () => faker.date.recent({ days: 30 }),
                { probability: 0.8 }
            ),
            hoursLearned: faker.number.int({ min: 0, max: 200 }),
            quizzesCompleted: faker.number.int({ min: 0, max: 50 }),
            assignmentsCompleted: faker.number.int({ min: 0, max: 30 }),
            role: "student",
            accountStatus,
            lmsId: faker.helpers.maybe(
                () => `LMS${faker.string.alphanumeric(8).toUpperCase()}`,
                { probability: 0.7 }
            ),
            lmsPassword: faker.helpers.maybe(() => "Lms@123", {
                probability: 0.7,
            }),
            referredBy: faker.helpers.maybe(
                () => `REFER-${faker.string.alphanumeric(4).toUpperCase()}`,
                { probability: 0.3 }
            ),
            referralCount: faker.number.int({ min: 0, max: 10 }),
            isPremiumUnlocked: faker.datatype.boolean(0.2),
            lastLogin:
                accountStatus === "verified"
                    ? faker.date.recent({ days: 30 })
                    : undefined,
        });
    }

    // ⭐ GOOGLE USERS
    const googleUserCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < googleUserCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        users.push({
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            googleId: faker.string.numeric(21),
            name: firstName,
            lastName,
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
            streak: faker.number.int({ min: 0, max: 30 }),
            hoursLearned: faker.number.int({ min: 0, max: 150 }),
            quizzesCompleted: faker.number.int({ min: 0, max: 40 }),
            assignmentsCompleted: faker.number.int({ min: 0, max: 25 }),
            role: "student",
            accountStatus: "verified",
            isPremiumUnlocked: faker.datatype.boolean(0.15),
            lastLogin: faker.date.recent({ days: 15 }),
        });
    }

    // ⭐ GITHUB USERS
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
            streak: faker.number.int({ min: 0, max: 25 }),
            hoursLearned: faker.number.int({ min: 0, max: 100 }),
            role: "student",
            accountStatus: "verified",
            lastLogin: faker.date.recent({ days: 10 }),
        });
    }

    // ⭐ SAVE WITH MIDDLEWARE (IMPORTANT)
    let savedCount = 0;

    for (const data of users) {
        const doc = new User(data);
        await doc.save(); // runs hashing + referral code + validation
        savedCount++;
    }

    console.log(
        `✅ ${savedCount} users seeded (1 admin, ${studentCount} students, ${googleUserCount} Google users, ${githubUserCount} GitHub users)`
    );
};

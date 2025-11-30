import { faker } from "@faker-js/faker";
import { Student } from "../../models/index.js";

const colleges = [
    "IIT Delhi",
    "IIT Bombay",
    "IIT Madras",
    "IIT Kanpur",
    "NIT Trichy",
    "NIT Warangal",
    "BITS Pilani",
    "VIT Vellore",
    "Delhi University",
    "Mumbai University",
    "Anna University",
    "Pune University",
    "Manipal Institute of Technology",
    "SRM University",
    "Amity University",
    "IIIT Hyderabad",
    "NSUT Delhi",
    "DTU Delhi",
    "Jadavpur University",
    "BHU Varanasi",
];

const courses = [
    "B.Tech CSE",
    "B.Tech IT",
    "B.Tech ECE",
    "B.Tech EEE",
    "BCA",
    "MCA",
    "B.Sc Computer Science",
    "M.Tech CSE",
    "B.E. Computer Engineering",
    "M.Sc Data Science",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];

export const seedStudents = async () => {
    const students = [];

    // ==================== TEST STUDENTS ====================
    // These have known credentials for testing
    const testStudents = [
        {
            lmsId: "LMS001",
            name: "Rahul",
            lastName: "Sharma",
            email: "rahul.sharma@example.com",
            collegeName: "IIT Delhi",
            courseName: "B.Tech CSE",
        },
        {
            lmsId: "LMS002",
            name: "Priya",
            lastName: "Verma",
            email: "priya.verma@example.com",
            collegeName: "NIT Trichy",
            courseName: "B.Tech IT",
        },
        {
            lmsId: "LMS003",
            name: "Amit",
            lastName: "Kumar",
            email: "amit.kumar@example.com",
            collegeName: "BITS Pilani",
            courseName: "MCA",
        },
    ];

    for (const testStudent of testStudents) {
        students.push({
            ...testStudent,
            lmsPassword: "Lms@123",
            phoneNumber: faker.phone.number("+91##########"),
            yearOfStudy: faker.helpers.arrayElement(years),
            avatar: faker.image.avatar(),
            accountStatus: "verified",
            xp: faker.number.int({ min: 500, max: 2000 }),
            streak: faker.number.int({ min: 5, max: 30 }),
            hoursLearned: faker.number.int({ min: 20, max: 100 }),
            quizzesCompleted: faker.number.int({ min: 5, max: 30 }),
            assignmentsCompleted: faker.number.int({ min: 3, max: 20 }),
            lastLogin: faker.date.recent({ days: 3 }),
        });
    }

    // ==================== RANDOM STUDENTS ====================
    const randomStudentCount = faker.number.int({ min: 25, max: 40 });

    for (let i = 0; i < randomStudentCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const accountStatus = faker.helpers.weightedArrayElement([
            { weight: 6, value: "verified" },
            { weight: 2, value: "pending" },
            { weight: 1, value: "unenrolled" },
            { weight: 1, value: "blocked" },
        ]);

        const isActive = accountStatus === "verified";

        students.push({
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            name: firstName,
            middleName: faker.helpers.maybe(() => faker.person.middleName(), {
                probability: 0.3,
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
                probability: 0.7,
            }),
            linkedin: faker.helpers.maybe(
                () => `https://linkedin.com/in/${faker.internet.username().toLowerCase()}`,
                { probability: 0.6 }
            ),
            github: faker.helpers.maybe(
                () => `https://github.com/${faker.internet.username().toLowerCase()}`,
                { probability: 0.5 }
            ),
            portfolio: faker.helpers.maybe(() => faker.internet.url(), {
                probability: 0.2,
            }),
            isProfileLocked: faker.datatype.boolean(0.1),
            xp: isActive ? faker.number.int({ min: 100, max: 5000 }) : 0,
            streak: isActive ? faker.number.int({ min: 0, max: 50 }) : 0,
            lastStreakDate: isActive
                ? faker.helpers.maybe(() => faker.date.recent({ days: 7 }), {
                      probability: 0.8,
                  })
                : undefined,
            hoursLearned: isActive ? faker.number.int({ min: 0, max: 200 }) : 0,
            quizzesCompleted: isActive ? faker.number.int({ min: 0, max: 50 }) : 0,
            assignmentsCompleted: isActive ? faker.number.int({ min: 0, max: 30 }) : 0,
            accountStatus,
            lmsId: `LMS${faker.string.alphanumeric(8).toUpperCase()}`,
            lmsPassword: "Lms@123",
            referredBy: faker.helpers.maybe(
                () => `${faker.person.firstName().substring(0, 4).toUpperCase()}-${faker.string.alphanumeric(4).toUpperCase()}`,
                { probability: 0.3 }
            ),
            referralCount: faker.number.int({ min: 0, max: 10 }),
            isPremiumUnlocked: faker.datatype.boolean(0.15),
            lastLogin: isActive ? faker.date.recent({ days: 30 }) : undefined,
        });
    }

    // ==================== GOOGLE OAUTH STUDENTS ====================
    const googleStudentCount = faker.number.int({ min: 8, max: 15 });

    for (let i = 0; i < googleStudentCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        students.push({
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            googleId: faker.string.numeric(21),
            name: firstName,
            lastName,
            avatar: faker.image.avatar(),
            phoneNumber: faker.helpers.maybe(
                () => faker.phone.number("+91##########"),
                { probability: 0.6 }
            ),
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            linkedin: faker.helpers.maybe(
                () => `https://linkedin.com/in/${faker.internet.username().toLowerCase()}`,
                { probability: 0.5 }
            ),
            github: faker.helpers.maybe(
                () => `https://github.com/${faker.internet.username().toLowerCase()}`,
                { probability: 0.4 }
            ),
            xp: faker.number.int({ min: 100, max: 3000 }),
            streak: faker.number.int({ min: 0, max: 30 }),
            hoursLearned: faker.number.int({ min: 5, max: 150 }),
            quizzesCompleted: faker.number.int({ min: 0, max: 40 }),
            assignmentsCompleted: faker.number.int({ min: 0, max: 25 }),
            accountStatus: "verified",
            isPremiumUnlocked: faker.datatype.boolean(0.1),
            lastLogin: faker.date.recent({ days: 15 }),
        });
    }

    // ==================== GITHUB OAUTH STUDENTS ====================
    const githubStudentCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < githubStudentCount; i++) {
        const firstName = faker.person.firstName();
        const username = faker.internet.username({ firstName }).toLowerCase();

        students.push({
            email: faker.internet.email({ firstName }).toLowerCase(),
            githubId: faker.string.numeric(8),
            name: firstName,
            lastName: faker.person.lastName(),
            avatar: `https://avatars.githubusercontent.com/u/${faker.number.int({ min: 1000000, max: 99999999 })}`,
            github: `https://github.com/${username}`,
            collegeName: faker.helpers.arrayElement(colleges),
            courseName: faker.helpers.arrayElement(courses),
            yearOfStudy: faker.helpers.arrayElement(years),
            xp: faker.number.int({ min: 200, max: 2500 }),
            streak: faker.number.int({ min: 0, max: 25 }),
            hoursLearned: faker.number.int({ min: 10, max: 120 }),
            quizzesCompleted: faker.number.int({ min: 0, max: 35 }),
            assignmentsCompleted: faker.number.int({ min: 0, max: 20 }),
            accountStatus: "verified",
            lastLogin: faker.date.recent({ days: 10 }),
        });
    }

    // ==================== SAVE ALL STUDENTS ====================
    let savedCount = 0;
    for (const data of students) {
        const doc = new Student(data);
        await doc.save();
        savedCount++;
    }

    const verifiedCount = students.filter(s => s.accountStatus === "verified").length;
    const oauthCount = students.filter(s => s.googleId || s.githubId).length;

    console.log(`✅ ${savedCount} students seeded`);
    console.log(`   👤 Test accounts: 3 (LMS001, LMS002, LMS003)`);
    console.log(`   👥 Random students: ${randomStudentCount}`);
    console.log(`   🔐 OAuth students: ${oauthCount} (Google: ${googleStudentCount}, GitHub: ${githubStudentCount})`);
    console.log(`   ✓ Verified: ${verifiedCount}`);
    console.log("\n   📋 Test Credentials:");
    console.log("      LMS ID: LMS001, LMS002, LMS003");
    console.log("      Password: Lms@123");
};

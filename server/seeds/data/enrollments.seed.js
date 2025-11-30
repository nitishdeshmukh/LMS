import { faker } from "@faker-js/faker";
import { Enrollment, User, Course } from "../../models/index.js";

// Sample colleges and courses (reuse from users seed)
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

const degreeCourses = [
    "B.Tech CSE",
    "B.Tech IT",
    "BCA",
    "MCA",
    "B.Sc Computer Science",
    "M.Tech",
    "B.Tech ECE",
];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];

// Generate LMS credentials
const generateLmsId = () => `LMS${faker.string.alphanumeric(8).toUpperCase()}`;
const generateLmsPassword = () =>
    `${faker.word.noun()}${faker.number.int({ min: 100, max: 999 })}`;

// Generate certificate ID
const generateCertificateId = () =>
    `CERT-${faker.string.alphanumeric(12).toUpperCase()}`;

// Generate fake lesson ObjectIds
const generateLessonIds = (count) => {
    return Array.from({ length: count }, () =>
        faker.database.mongodbObjectId()
    );
};

export const seedEnrollments = async () => {
    const students = await User.find({ role: "student" }).limit(40);
    const courses = await Course.find();

    if (students.length === 0 || courses.length === 0) {
        console.log("⚠️  Skipping enrollments: Need users and courses first");
        return;
    }

    const enrollments = [];
    const enrollmentMap = new Set(); // Track unique student-course pairs

    // Each student enrolls in 1-4 courses
    for (const student of students) {
        const enrollmentCount = faker.number.int({ min: 1, max: 4 });
        const selectedCourses = faker.helpers.arrayElements(
            courses,
            enrollmentCount
        );

        for (const course of selectedCourses) {
            const uniqueKey = `${student._id}-${course._id}`;

            // Skip if already enrolled (prevent duplicates)
            if (enrollmentMap.has(uniqueKey)) continue;
            enrollmentMap.add(uniqueKey);

            const enrollmentDate = faker.date.past({ years: 1 });
            const daysSinceEnrollment = Math.floor(
                (Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Payment status distribution
            const paymentStatus = faker.helpers.weightedArrayElement([
                { weight: 7, value: "paid" },
                { weight: 2, value: "pending" },
                { weight: 0.5, value: "failed" },
                { weight: 0.5, value: "refunded" },
            ]);

            // Checkout details - might differ from user profile
            const useStudentInfo = faker.datatype.boolean(0.8); // 80% use their own info

            // FIXED: Ensure phoneNumber is always provided
            const phoneNumber =
                useStudentInfo && student.phoneNumber
                    ? student.phoneNumber
                    : faker.phone.number("+91##########");

            const enrollment = {
                student: student._id,
                course: course._id,
                checkoutDetails: {
                    firstName: useStudentInfo
                        ? student.name
                        : faker.person.firstName(),
                    middleName: useStudentInfo
                        ? student.middleName
                        : faker.helpers.maybe(() => faker.person.middleName(), {
                              probability: 0.3,
                          }),
                    lastName:
                        useStudentInfo && student.lastName
                            ? student.lastName
                            : faker.person.lastName(),
                    collegeName:
                        useStudentInfo && student.collegeName
                            ? student.collegeName
                            : faker.helpers.arrayElement(colleges),
                    degreeCourseName:
                        useStudentInfo && student.courseName
                            ? student.courseName
                            : faker.helpers.arrayElement(degreeCourses),
                    yearOfStudy:
                        useStudentInfo && student.yearOfStudy
                            ? student.yearOfStudy
                            : faker.helpers.arrayElement(years),
                    email: useStudentInfo
                        ? student.email
                        : faker.internet.email().toLowerCase(),
                    phoneNumber: phoneNumber, // FIXED: Always has a value
                    alternatePhone: faker.helpers.maybe(
                        () => faker.phone.number("+91##########"),
                        { probability: 0.3 }
                    ),
                },
                paymentStatus: paymentStatus,
                enrollmentDate: enrollmentDate,
            };

            // Add transaction details for paid/refunded enrollments
            if (paymentStatus === "paid" || paymentStatus === "refunded") {
                enrollment.transactionId = `TXN${faker.string
                    .alphanumeric(16)
                    .toUpperCase()}`;
                enrollment.amountPaid = faker.helpers.arrayElement([
                    500, 999, 1499, 1999, 2499,
                ]);
            }

            // Failed payments might have transaction ID
            if (paymentStatus === "failed") {
                enrollment.transactionId = faker.helpers.maybe(
                    () => `TXN${faker.string.alphanumeric(16).toUpperCase()}`,
                    { probability: 0.6 }
                );
            }

            // LMS credentials issued only for paid enrollments
            if (paymentStatus === "paid") {
                const lmsIssued = faker.datatype.boolean(0.85); // 85% of paid get LMS access
                if (lmsIssued) {
                    enrollment.lmsIssuedId = generateLmsId();
                    enrollment.lmsIssuedPassword = generateLmsPassword();
                }
            }

            // Progress tracking for paid enrollments
            if (paymentStatus === "paid" && daysSinceEnrollment > 7) {
                // Assume course has 10-30 lessons
                const totalLessons = faker.number.int({ min: 10, max: 30 });
                const allLessonIds = generateLessonIds(totalLessons);

                // Progress based on days since enrollment
                let progressPercentage;
                if (daysSinceEnrollment > 180) {
                    progressPercentage = faker.number.int({
                        min: 60,
                        max: 100,
                    });
                } else if (daysSinceEnrollment > 90) {
                    progressPercentage = faker.number.int({ min: 30, max: 80 });
                } else if (daysSinceEnrollment > 30) {
                    progressPercentage = faker.number.int({ min: 10, max: 50 });
                } else {
                    progressPercentage = faker.number.int({ min: 0, max: 30 });
                }

                const completedCount = Math.floor(
                    (progressPercentage / 100) * totalLessons
                );
                enrollment.completedLessons = allLessonIds.slice(
                    0,
                    completedCount
                );
                enrollment.progressPercentage = progressPercentage;

                // Set last accessed lesson
                if (completedCount > 0) {
                    enrollment.lastAccessedLesson =
                        allLessonIds[
                            Math.min(completedCount, totalLessons - 1)
                        ];
                }

                // Mark as completed if 100% progress
                if (progressPercentage === 100) {
                    enrollment.isCompleted = true;
                    enrollment.completionDate = faker.date.between({
                        from: enrollmentDate,
                        to: new Date(),
                    });
                    enrollment.certificateId = generateCertificateId();
                }
            }

            enrollments.push(enrollment);
        }
    }

    // Add some pending enrollments (users who filled form but didn't pay)
    const pendingCount = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < pendingCount && i < students.length; i++) {
        const student = faker.helpers.arrayElement(students);
        const course = faker.helpers.arrayElement(courses);
        const uniqueKey = `${student._id}-${course._id}`;

        if (enrollmentMap.has(uniqueKey)) continue;
        enrollmentMap.add(uniqueKey);

        // FIXED: Ensure phoneNumber is always provided
        const phoneNumber =
            student.phoneNumber || faker.phone.number("+91##########");

        enrollments.push({
            student: student._id,
            course: course._id,
            checkoutDetails: {
                firstName: student.name,
                lastName: student.lastName || faker.person.lastName(),
                collegeName:
                    student.collegeName || faker.helpers.arrayElement(colleges),
                degreeCourseName:
                    student.courseName ||
                    faker.helpers.arrayElement(degreeCourses),
                yearOfStudy:
                    student.yearOfStudy || faker.helpers.arrayElement(years),
                email: student.email,
                phoneNumber: phoneNumber, // FIXED: Always has a value
            },
            paymentStatus: "pending",
            enrollmentDate: faker.date.recent({ days: 30 }),
            progressPercentage: 0,
        });
    }

    await Enrollment.insertMany(enrollments);

    const statusCounts = {
        paid: enrollments.filter((e) => e.paymentStatus === "paid").length,
        pending: enrollments.filter((e) => e.paymentStatus === "pending")
            .length,
        failed: enrollments.filter((e) => e.paymentStatus === "failed").length,
        refunded: enrollments.filter((e) => e.paymentStatus === "refunded")
            .length,
        completed: enrollments.filter((e) => e.isCompleted).length,
        withLMS: enrollments.filter((e) => e.lmsIssuedId).length,
    };

    console.log(`✅ ${enrollments.length} enrollments seeded`);
    console.log(
        `   💳 Payment Status - Paid: ${statusCounts.paid}, Pending: ${statusCounts.pending}, Failed: ${statusCounts.failed}, Refunded: ${statusCounts.refunded}`
    );
    console.log(
        `   🎓 Completed: ${statusCounts.completed} (with certificates)`
    );
    console.log(`   🔐 LMS Access Issued: ${statusCounts.withLMS}`);
};

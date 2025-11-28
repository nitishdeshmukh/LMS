import { faker } from "@faker-js/faker";
import { Submission, User, Course, Enrollment } from "../../models/index.js";

// Sample lesson IDs (you can adjust based on your actual Course structure)
const generateLessonId = () => faker.database.mongodbObjectId();

// Sample feedback messages
const feedbackMessages = [
    "Great work! Your solution is well-structured and efficient.",
    "Good effort, but consider edge cases in your implementation.",
    "Excellent understanding of the concepts. Keep it up!",
    "Needs improvement. Review the lecture notes and try again.",
    "Well done! Your code is clean and follows best practices.",
    "Incomplete submission. Please provide all required files.",
    "Outstanding work! You exceeded expectations.",
    "Good attempt, but there are some logical errors to fix.",
    "Perfect! Your solution handles all test cases correctly.",
    "Review the requirements carefully and resubmit.",
];

// Grade options
const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

export const seedSubmissions = async () => {
    // Get all students, courses, and enrollments
    const students = await User.find({
        role: "student",
        accountStatus: "verified",
    }).limit(30);
    const courses = await Course.find();
    const enrollments = await Enrollment.find().populate("student course");

    if (
        students.length === 0 ||
        courses.length === 0 ||
        enrollments.length === 0
    ) {
        console.log(
            "⚠️  Skipping submissions: Need users, courses, and enrollments first"
        );
        return;
    }

    const submissions = [];

    // Create submissions for each enrollment
    for (const enrollment of enrollments) {
        const submissionCount = faker.number.int({ min: 3, max: 12 });

        for (let i = 0; i < submissionCount; i++) {
            const isAssignment = faker.datatype.boolean(0.6); // 60% assignments, 40% quizzes
            const status = faker.helpers.arrayElement([
                "submitted",
                "graded",
                "graded",
                "graded",
                "graded",
                "rejected",
            ]); // More graded submissions

            const submission = {
                enrollment: enrollment._id,
                student: enrollment.student._id,
                course: enrollment.course._id,
                lessonId: generateLessonId(),
                type: isAssignment ? "assignment" : "quiz",
                status: status,
                createdAt: faker.date.between({
                    from:
                        enrollment.createdAt ||
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                }),
            };

            // Assignment-specific fields
            if (isAssignment) {
                submission.fileUrl = faker.helpers.maybe(
                    () =>
                        `https://storage.example.com/assignments/${faker.string.uuid()}.pdf`,
                    { probability: 0.7 }
                );
                submission.githubLink = faker.helpers.maybe(
                    () =>
                        `https://github.com/${faker.internet.username()}/${faker.word.noun()}-${faker.word.verb()}`,
                    { probability: 0.5 }
                );
            }

            // Quiz-specific fields
            if (!isAssignment) {
                const totalQuestions = faker.helpers.arrayElement([
                    10, 15, 20, 25, 30,
                ]);
                const scorePercentage =
                    status === "graded"
                        ? faker.number.float({
                              min: 0.3,
                              max: 1,
                              fractionDigits: 2,
                          })
                        : faker.number.float({
                              min: 0.5,
                              max: 1,
                              fractionDigits: 2,
                          });

                submission.totalQuestions = totalQuestions;
                submission.quizScore = Math.floor(
                    totalQuestions * scorePercentage
                );
            }

            // Graded submissions have grade and feedback
            if (status === "graded") {
                if (isAssignment) {
                    submission.grade = faker.helpers.arrayElement(grades);
                    submission.feedback =
                        faker.helpers.arrayElement(feedbackMessages);
                } else {
                    // Quiz grade based on score
                    const percentage =
                        (submission.quizScore / submission.totalQuestions) *
                        100;
                    if (percentage >= 90)
                        submission.grade = faker.helpers.arrayElement([
                            "A+",
                            "A",
                        ]);
                    else if (percentage >= 80)
                        submission.grade = faker.helpers.arrayElement([
                            "A-",
                            "B+",
                        ]);
                    else if (percentage >= 70)
                        submission.grade = faker.helpers.arrayElement([
                            "B",
                            "B-",
                        ]);
                    else if (percentage >= 60)
                        submission.grade = faker.helpers.arrayElement([
                            "C+",
                            "C",
                        ]);
                    else
                        submission.grade = faker.helpers.arrayElement([
                            "D",
                            "F",
                        ]);

                    submission.feedback = faker.helpers.maybe(
                        () => faker.helpers.arrayElement(feedbackMessages),
                        { probability: 0.6 }
                    );
                }
            }

            // Rejected submissions might have feedback
            if (status === "rejected") {
                submission.feedback = faker.helpers.arrayElement([
                    "Incomplete submission. Missing required files.",
                    "Plagiarism detected. Please submit original work.",
                    "Does not meet assignment requirements.",
                    "Incorrect file format. Please resubmit.",
                    "Submission deadline exceeded without prior approval.",
                ]);
            }

            submissions.push(submission);
        }
    }

    // Add some submissions without all optional fields (edge cases)
    const incompleteSubmissions = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < incompleteSubmissions && i < enrollments.length; i++) {
        const enrollment = faker.helpers.arrayElement(enrollments);

        submissions.push({
            enrollment: enrollment._id,
            student: enrollment.student._id,
            course: enrollment.course._id,
            lessonId: generateLessonId(),
            type: "assignment",
            status: "submitted",
            // No fileUrl or githubLink (incomplete)
            createdAt: faker.date.recent({ days: 7 }),
        });
    }

    await Submission.insertMany(submissions);
    console.log(
        `✅ ${submissions.length} submissions seeded (assignments and quizzes)`
    );
};

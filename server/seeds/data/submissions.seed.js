import { faker } from "@faker-js/faker";
import { Submission, Student, Course, Enrollment } from "../../models/index.js";

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

// Helper to get all quizzes and tasks from a course
const getQuizzesAndTasks = (course) => {
    const quizzes = [];
    const tasks = [];

    course.modules.forEach((module) => {
        if (module.quizzes) {
            module.quizzes.forEach((quiz) => {
                quizzes.push({
                    id: quiz._id,
                    title: quiz.title,
                    moduleId: module._id,
                    questionCount: quiz.questions?.length || 5
                });
            });
        }
        if (module.tasks) {
            module.tasks.forEach((task) => {
                tasks.push({
                    id: task._id,
                    title: task.title,
                    moduleId: module._id
                });
            });
        }
    });

    return { quizzes, tasks };
};

export const seedSubmissions = async () => {
    // Get all students, courses, and enrollments
    const students = await Student.find({
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
        // Get the actual quizzes and tasks from the course
        const { quizzes, tasks } = getQuizzesAndTasks(enrollment.course);
        
        if (quizzes.length === 0 && tasks.length === 0) continue;

        // Create submissions for some quizzes (60-100% of available)
        const quizSubmissionCount = Math.floor(quizzes.length * faker.number.float({ min: 0.6, max: 1 }));
        const selectedQuizzes = faker.helpers.arrayElements(quizzes, quizSubmissionCount);

        for (const quiz of selectedQuizzes) {
            const status = faker.helpers.arrayElement([
                "submitted",
                "graded",
                "graded",
                "graded",
                "graded",
            ]); // More graded submissions

            const submission = {
                enrollment: enrollment._id,
                student: enrollment.student._id,
                course: enrollment.course._id,
                quizId: quiz.id,
                moduleId: quiz.moduleId,
                type: "quiz",
                status: status,
                createdAt: faker.date.between({
                    from:
                        enrollment.createdAt ||
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                }),
            };

            // Quiz-specific fields
            const totalQuestions = quiz.questionCount || faker.helpers.arrayElement([5, 10, 15]);
            const scorePercentage = faker.number.float({
                min: 0.4,
                max: 1,
                fractionDigits: 2,
            });

            submission.totalQuestions = totalQuestions;
            submission.quizScore = Math.floor(totalQuestions * scorePercentage);

            // Graded submissions have grade and feedback
            if (status === "graded") {
                const percentage = (submission.quizScore / submission.totalQuestions) * 100;
                if (percentage >= 90)
                    submission.grade = faker.helpers.arrayElement(["A+", "A"]);
                else if (percentage >= 80)
                    submission.grade = faker.helpers.arrayElement(["A-", "B+"]);
                else if (percentage >= 70)
                    submission.grade = faker.helpers.arrayElement(["B", "B-"]);
                else if (percentage >= 60)
                    submission.grade = faker.helpers.arrayElement(["C+", "C"]);
                else
                    submission.grade = faker.helpers.arrayElement(["D", "F"]);

                submission.feedback = faker.helpers.maybe(
                    () => faker.helpers.arrayElement(feedbackMessages),
                    { probability: 0.6 }
                );
            }

            submissions.push(submission);
        }

        // Create submissions for some tasks (50-100% of available)
        const taskSubmissionCount = Math.floor(tasks.length * faker.number.float({ min: 0.5, max: 1 }));
        const selectedTasks = faker.helpers.arrayElements(tasks, taskSubmissionCount);

        for (const task of selectedTasks) {
            const status = faker.helpers.arrayElement([
                "submitted",
                "graded",
                "graded",
                "graded",
                "rejected",
            ]);

            const submission = {
                enrollment: enrollment._id,
                student: enrollment.student._id,
                course: enrollment.course._id,
                taskId: task.id,
                moduleId: task.moduleId,
                type: "assignment",
                status: status,
                createdAt: faker.date.between({
                    from:
                        enrollment.createdAt ||
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                }),
            };

            // Assignment-specific fields
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

            // Graded submissions have grade and feedback
            if (status === "graded") {
                submission.grade = faker.helpers.arrayElement(grades);
                submission.feedback = faker.helpers.arrayElement(feedbackMessages);
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

    await Submission.insertMany(submissions);
    
    const quizSubmissions = submissions.filter(s => s.type === "quiz").length;
    const assignmentSubmissions = submissions.filter(s => s.type === "assignment").length;
    const gradedSubmissions = submissions.filter(s => s.status === "graded").length;
    
    console.log(`✅ ${submissions.length} submissions seeded`);
    console.log(`   📝 Quizzes: ${quizSubmissions}, Assignments: ${assignmentSubmissions}`);
    console.log(`   ✅ Graded: ${gradedSubmissions}`);
};

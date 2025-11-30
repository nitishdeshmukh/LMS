import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Course } from "../../models/index.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to courses JSON folder
const COURSES_FOLDER = path.join(__dirname, "courses");

/**
 * Load all course JSON files from the courses folder
 */
const loadCourseFiles = () => {
    const courseFiles = fs.readdirSync(COURSES_FOLDER).filter(file => file.endsWith(".json"));
    const courses = [];

    for (const file of courseFiles) {
        const filePath = path.join(COURSES_FOLDER, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const courseData = JSON.parse(content);
        courses.push(courseData);
    }

    return courses;
};

/**
 * Parse timeline string to get maxTimelineInDays
 * Examples: "Days 1 - 3" => 3, "Day 6" => 1, "Days 27 - 30" => 4
 */
const parseTimeline = (timeline) => {
    if (!timeline) return 7; // default 7 days

    // Match patterns like "Days 1 - 3", "Day 6", "Days 27 - 30"
    const rangeMatch = timeline.match(/Days?\s*(\d+)\s*-\s*(\d+)/i);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        return end - start + 1;
    }

    // Single day pattern "Day 6"
    const singleMatch = timeline.match(/Day\s*(\d+)/i);
    if (singleMatch) {
        return 1;
    }

    return 7; // default
};

/**
 * Transform JSON course data to match the Course model schema
 */
const transformCourseData = (jsonCourse) => {
    const courseId = new mongoose.Types.ObjectId();

    // Transform modules
    const modules = (jsonCourse.modules || []).map((module, index) => {
        const moduleId = new mongoose.Types.ObjectId();

        // Transform quizzes - remove explanation field (not in model)
        const quizzes = (module.quizzes || []).map(quiz => ({
            _id: new mongoose.Types.ObjectId(),
            title: quiz.title,
            questions: (quiz.questions || []).map(q => ({
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                // NOTE: explanation field is intentionally excluded as it's not in the model
            })),
        }));

        // Transform tasks
        const tasks = (module.tasks || []).map(task => ({
            _id: new mongoose.Types.ObjectId(),
            title: task.title,
            description: task.description,
        }));

        return {
            _id: moduleId,
            title: module.title,
            description: module.description || "",
            maxTimelineInDays: parseTimeline(module.timeline),
            textLinks: module.textLinks || [],
            videoLinks: module.videoLinks || [],
            quizzes,
            tasks,
            order: module.order || index + 1,
        };
    });

    // Transform capstone projects
    const capstoneProjects = (jsonCourse.capstoneProjects || []).map(project => ({
        _id: new mongoose.Types.ObjectId(),
        title: project.title,
        description: project.description,
    }));

    return {
        _id: courseId,
        title: jsonCourse.title,
        slug: jsonCourse.slug,
        description: jsonCourse.description,
        thumbnail: jsonCourse.thumbnail || "default-course-thumbnail",
        stream: jsonCourse.stream || "General",
        level: jsonCourse.level || "Beginner",
        price: jsonCourse.price || 500,
        totalDuration: jsonCourse.totalDuration || "",
        isPublished: jsonCourse.isPublished !== false, // default to true if not specified
        tags: jsonCourse.tags || [],
        modules: modules,
        capstoneProjects: capstoneProjects,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
    };
};

/**
 * Seed courses from JSON files
 */
export const seedCourses = async () => {
    // Load course JSON files
    const jsonCourses = loadCourseFiles();

    if (jsonCourses.length === 0) {
        console.log("⚠️  No course JSON files found in seeds/data/courses folder");
        return;
    }

    // Transform to match model schema
    const courses = jsonCourses.map(transformCourseData);

    // Insert into database
    await Course.insertMany(courses);

    // Calculate stats
    let totalModules = 0;
    let totalQuizzes = 0;
    let totalTasks = 0;

    courses.forEach(course => {
        totalModules += course.modules.length;
        course.modules.forEach(module => {
            totalQuizzes += module.quizzes?.length || 0;
            totalTasks += module.tasks?.length || 0;
        });
    });

    console.log(`✅ ${courses.length} courses seeded from JSON files`);
    console.log(`   📚 Total Modules: ${totalModules}`);
    console.log(`   📝 Total Quizzes: ${totalQuizzes}`);
    console.log(`   📋 Total Tasks: ${totalTasks}`);
    console.log("\n   📖 Courses loaded:");
    courses.forEach(course => {
        console.log(`      - ${course.title} (${course.modules.length} modules)`);
    });
};

// Export for other seeds to use
export { loadCourseFiles, transformCourseData };

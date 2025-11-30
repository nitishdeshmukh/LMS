import { faker } from "@faker-js/faker";
import { Course, User } from "../../models/index.js";

// Streams and their related tags
const streams = {
    "Web Development": [
        "web",
        "frontend",
        "backend",
        "fullstack",
        "javascript",
        "react",
        "nodejs",
    ],
    "Mobile Development": [
        "mobile",
        "android",
        "ios",
        "flutter",
        "react-native",
        "kotlin",
        "swift",
    ],
    "Data Science": [
        "data-science",
        "python",
        "pandas",
        "numpy",
        "machine-learning",
        "statistics",
    ],
    "AI & Machine Learning": [
        "ai",
        "ml",
        "deep-learning",
        "neural-networks",
        "tensorflow",
        "pytorch",
    ],
    "Cloud Computing": [
        "cloud",
        "aws",
        "azure",
        "gcp",
        "devops",
        "docker",
        "kubernetes",
    ],
    Cybersecurity: [
        "security",
        "ethical-hacking",
        "penetration-testing",
        "network-security",
    ],
    Blockchain: [
        "blockchain",
        "cryptocurrency",
        "web3",
        "smart-contracts",
        "solidity",
    ],
    "Computer Science": [
        "dsa",
        "algorithms",
        "competitive-programming",
        "system-design",
    ],
    "Database Management": [
        "sql",
        "nosql",
        "mongodb",
        "postgresql",
        "database-design",
    ],
    "UI/UX Design": [
        "design",
        "figma",
        "ui",
        "ux",
        "prototyping",
        "user-research",
    ],
};

const levels = ["Beginner", "Intermediate", "Advanced"];

// Video URLs
const generateVideoUrl = () =>
    `https://storage.example.com/videos/${faker.string.uuid()}.mp4`;
const generateThumbnail = (stream) => {
    const queries = {
        "Web Development": "laptop-code",
        "Mobile Development": "smartphone-mobile",
        "Data Science": "data-analytics",
        "AI & Machine Learning": "artificial-intelligence",
        "Cloud Computing": "cloud-computing",
        Cybersecurity: "cybersecurity",
        Blockchain: "blockchain-technology",
        "Computer Science": "computer-programming",
        "Database Management": "database-server",
        "UI/UX Design": "ui-ux-design",
    };
    return `https://images.unsplash.com/photo-${faker.string.numeric(13)}?q=${
        queries[stream] || "technology"
    }`;
};

// Generate quiz questions
const generateQuizQuestions = (topic, count = 5) => {
    const questions = [];
    for (let i = 0; i < count; i++) {
        questions.push({
            questionText: `${faker.lorem.sentence()}?`,
            options: Array.from({ length: 4 }, () => faker.lorem.words(3)),
            correctAnswer: faker.number.int({ min: 0, max: 3 }),
            explanation: faker.lorem.sentence(),
        });
    }
    return questions;
};

// Generate lessons
const generateLessons = (moduleTitle, count = 3) => {
    const lessonTypes = ["video", "text", "quiz", "assignment"];
    const lessons = [];

    for (let i = 0; i < count; i++) {
        const type = faker.helpers.arrayElement(lessonTypes);
        const lesson = {
            title: `Lesson ${i + 1}: ${faker.lorem.words(4)}`,
            type: type,
            contentUrls: type === "video" ? [generateVideoUrl()] : [],
            duration: faker.number.int({ min: 10, max: 45 }),
            isFreePreview: i === 0 && faker.datatype.boolean(0.5), // First lesson might be free
            notes: faker.lorem.paragraph(),
        };
        lessons.push(lesson);
    }

    return lessons;
};

// Generate tasks
const generateTasks = (count = 1) => {
    const tasks = [];
    for (let i = 0; i < count; i++) {
        tasks.push({
            title: faker.lorem.words(4),
            description: faker.lorem.paragraph(),
            dueInDays: faker.number.int({ min: 5, max: 14 }),
            attachments: faker.helpers.maybe(
                () => [
                    `https://storage.example.com/resources/${faker.string.uuid()}.pdf`,
                ],
                { probability: 0.5 }
            ),
        });
    }
    return tasks;
};

// Generate modules
const generateModules = (stream, count = 5) => {
    const modules = [];
    for (let i = 0; i < count; i++) {
        modules.push({
            title: `Module ${i + 1}: ${faker.lorem.words(3)}`,
            timeline: `Week ${i + 1}`,
            description: faker.lorem.sentence(),
            textLinks: Array.from(
                { length: faker.number.int({ min: 0, max: 3 }) },
                () => faker.internet.url()
            ),
            videoLinks: Array.from(
                { length: faker.number.int({ min: 1, max: 3 }) },
                () => generateVideoUrl()
            ),
            lessons: generateLessons(
                `Module ${i + 1}`,
                faker.number.int({ min: 2, max: 5 })
            ),
            tasks: generateTasks(faker.number.int({ min: 0, max: 2 })),
            quizzes: faker.datatype.boolean(0.7)
                ? [
                      {
                          title: `${faker.lorem.words(2)} Quiz`,
                          questions: generateQuizQuestions(
                              stream,
                              faker.number.int({ min: 3, max: 8 })
                          ),
                      },
                  ]
                : [],
            order: i + 1,
        });
    }
    return modules;
};

// Generate capstone projects
const generateCapstone = (stream) => {
    if (!faker.datatype.boolean(0.6)) return []; // 60% courses have capstone

    return [
        {
            title: `Capstone: ${faker.lorem.words(3)}`,
            description: faker.lorem.paragraph(2),
            requirements: Array.from(
                { length: faker.number.int({ min: 3, max: 6 }) },
                () => faker.lorem.sentence()
            ),
            deliverables: [
                "GitHub repository with source code",
                "Live deployment link",
                "Demo video walkthrough",
                "Project documentation",
            ],
            isLocked: true,
        },
    ];
};

// Sample courses provided by user
const baseCourses = [
    {
        title: "Full Stack Web Development",
        slug: "full-stack-web-development",
        description:
            "Master the art of building complete web applications from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB.",
        thumbnail:
            "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
        stream: "Web Development",
        level: "Beginner",
        price: 4999,
        discountedPrice: 2999,
        totalDuration: "12 weeks",
        isPublished: true,
        tags: ["web", "react", "nodejs", "mongodb", "javascript"],
        difficultyIndex: 2,
        modules: [
            {
                title: "Module 1: HTML & CSS Fundamentals",
                timeline: "Week 1-2",
                description: "Learn the building blocks of web development",
                order: 1,
                lessons: [
                    {
                        title: "Introduction to HTML5",
                        type: "video",
                        contentUrls: ["https://example.com/video1"],
                        duration: 10,
                        isFreePreview: true,
                        notes: "HTML is the standard markup language for creating web pages.",
                    },
                    {
                        title: "CSS Box Model & Flexbox",
                        type: "video",
                        contentUrls: ["https://example.com/video2"],
                        duration: 25,
                        notes: "Understanding the CSS box model and flexbox layout.",
                    },
                    {
                        title: "Responsive Design with Media Queries",
                        type: "video",
                        contentUrls: ["https://example.com/video3"],
                        duration: 20,
                        notes: "Creating responsive layouts for all devices.",
                    },
                ],
                tasks: [
                    {
                        title: "Build a Landing Page",
                        description:
                            "Create a fully responsive landing page using HTML, CSS, and JavaScript. The page must include a header with navigation, a hero section, a features section, and a footer.",
                        dueInDays: 7,
                    },
                ],
                quizzes: [
                    {
                        title: "Frontend Basics Quiz",
                        questions: [
                            {
                                questionText:
                                    "Which HTML tag is used to define an internal style sheet?",
                                options: [
                                    "<css>",
                                    "<script>",
                                    "<style>",
                                    "<link>",
                                ],
                                correctAnswer: 2,
                                explanation:
                                    "The <style> tag is used to define internal CSS styles.",
                            },
                            {
                                questionText: "What does CSS stand for?",
                                options: [
                                    "Cascading Style Sheets",
                                    "Computer Style Sheets",
                                    "Creative Style Sheets",
                                    "Colorful Style Sheets",
                                ],
                                correctAnswer: 0,
                                explanation:
                                    "CSS stands for Cascading Style Sheets.",
                            },
                            {
                                questionText:
                                    "Which property is used to change the background color?",
                                options: [
                                    "color",
                                    "bgcolor",
                                    "background-color",
                                    "bg-color",
                                ],
                                correctAnswer: 2,
                                explanation:
                                    "The background-color property sets the background color of an element.",
                            },
                            {
                                questionText:
                                    'How do you select an element with id "demo"?',
                                options: ["#demo", ".demo", "demo", "*demo"],
                                correctAnswer: 0,
                                explanation:
                                    "In CSS, # is used to select elements by their ID.",
                            },
                            {
                                questionText:
                                    "Which HTML attribute is used to define inline styles?",
                                options: ["class", "style", "font", "styles"],
                                correctAnswer: 1,
                                explanation:
                                    "The style attribute is used for inline CSS.",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Module 2: JavaScript Essentials",
                timeline: "Week 3-4",
                description: "Master JavaScript programming fundamentals",
                order: 2,
                lessons: [
                    {
                        title: "Variables, Types & Functions",
                        type: "video",
                        contentUrls: ["https://example.com/video4"],
                        duration: 15,
                        notes: "Understanding JavaScript variables and functions.",
                    },
                    {
                        title: "DOM Manipulation",
                        type: "video",
                        contentUrls: ["https://example.com/video5"],
                        duration: 30,
                        notes: "Learn to manipulate the Document Object Model.",
                    },
                    {
                        title: "ES6+ Features",
                        type: "video",
                        contentUrls: ["https://example.com/video6"],
                        duration: 25,
                        notes: "Modern JavaScript features like arrow functions, destructuring, etc.",
                    },
                ],
                tasks: [
                    {
                        title: "Interactive To-Do List",
                        description:
                            "Build an interactive to-do list application with add, delete, and complete functionality.",
                        dueInDays: 7,
                    },
                ],
                quizzes: [
                    {
                        title: "JS Logic Quiz",
                        questions: [
                            {
                                questionText:
                                    "Which keyword is used to declare a constant in JavaScript?",
                                options: ["var", "let", "const", "constant"],
                                correctAnswer: 2,
                                explanation:
                                    "The const keyword is used to declare constants.",
                            },
                            {
                                questionText:
                                    "What is the output of typeof null?",
                                options: [
                                    "null",
                                    "undefined",
                                    "object",
                                    "string",
                                ],
                                correctAnswer: 2,
                                explanation:
                                    "typeof null returns 'object' due to a historical bug in JavaScript.",
                            },
                            {
                                questionText:
                                    "Which method adds an element to the end of an array?",
                                options: [
                                    "push()",
                                    "pop()",
                                    "shift()",
                                    "unshift()",
                                ],
                                correctAnswer: 0,
                                explanation:
                                    "The push() method adds elements to the end of an array.",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Module 3: React Framework",
                timeline: "Week 5-7",
                description: "Build modern user interfaces with React",
                order: 3,
                lessons: [
                    {
                        title: "React Components & JSX",
                        type: "video",
                        contentUrls: ["https://example.com/video7"],
                        duration: 20,
                        notes: "Introduction to React components and JSX syntax.",
                    },
                    {
                        title: "React Hooks: useState & useEffect",
                        type: "video",
                        contentUrls: ["https://example.com/video8"],
                        duration: 35,
                        notes: "Managing state and side effects in React.",
                    },
                    {
                        title: "React Router & Navigation",
                        type: "video",
                        contentUrls: ["https://example.com/video9"],
                        duration: 25,
                        notes: "Client-side routing with React Router.",
                    },
                ],
                tasks: [
                    {
                        title: "React Portfolio Website",
                        description:
                            "Create a personal portfolio website using React with multiple pages.",
                        dueInDays: 10,
                    },
                ],
                quizzes: [
                    {
                        title: "React Fundamentals Quiz",
                        questions: [
                            {
                                questionText: "What is the virtual DOM?",
                                options: [
                                    "A copy of the real DOM in memory",
                                    "A new HTML element",
                                    "A CSS framework",
                                    "A JavaScript library",
                                ],
                                correctAnswer: 0,
                                explanation:
                                    "The virtual DOM is a lightweight copy of the real DOM kept in memory.",
                            },
                            {
                                questionText:
                                    "Which hook is used to manage state in functional components?",
                                options: [
                                    "useEffect",
                                    "useState",
                                    "useContext",
                                    "useReducer",
                                ],
                                correctAnswer: 1,
                                explanation:
                                    "useState is the primary hook for managing local state.",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Module 4: Node.js & Express",
                timeline: "Week 8-9",
                description: "Server-side JavaScript with Node.js and Express",
                order: 4,
                lessons: [
                    {
                        title: "Introduction to Node.js",
                        type: "video",
                        contentUrls: ["https://example.com/video10"],
                        duration: 20,
                        notes: "Getting started with Node.js runtime.",
                    },
                    {
                        title: "Building REST APIs with Express",
                        type: "video",
                        contentUrls: ["https://example.com/video11"],
                        duration: 40,
                        notes: "Creating RESTful APIs using Express framework.",
                    },
                ],
                tasks: [
                    {
                        title: "Build a REST API",
                        description:
                            "Create a complete REST API for a blog application.",
                        dueInDays: 7,
                    },
                ],
                quizzes: [
                    {
                        title: "Backend Basics Quiz",
                        questions: [
                            {
                                questionText: "What is Express.js?",
                                options: [
                                    "A database",
                                    "A web framework for Node.js",
                                    "A CSS library",
                                    "A testing tool",
                                ],
                                correctAnswer: 1,
                                explanation:
                                    "Express.js is a minimal web framework for Node.js.",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Module 5: MongoDB & Mongoose",
                timeline: "Week 10-11",
                description: "NoSQL database with MongoDB",
                order: 5,
                lessons: [
                    {
                        title: "MongoDB Basics",
                        type: "video",
                        contentUrls: ["https://example.com/video12"],
                        duration: 25,
                        notes: "Introduction to NoSQL and MongoDB.",
                    },
                    {
                        title: "Mongoose ODM",
                        type: "video",
                        contentUrls: ["https://example.com/video13"],
                        duration: 30,
                        notes: "Object Data Modeling with Mongoose.",
                    },
                ],
                tasks: [
                    {
                        title: "Database Integration",
                        description:
                            "Connect your REST API to MongoDB and implement CRUD operations.",
                        dueInDays: 7,
                    },
                ],
                quizzes: [],
            },
        ],
        capstoneProjects: [
            {
                title: "Capstone: E-Commerce Platform",
                description:
                    "Build a complete e-commerce platform with user authentication, product listings, cart functionality, and payment integration.",
                requirements: [
                    "User authentication (signup/login)",
                    "Product catalog with search and filters",
                    "Shopping cart functionality",
                    "Checkout process",
                    "Admin dashboard for managing products",
                ],
                deliverables: [
                    "GitHub repository with source code",
                    "Live deployment link",
                    "Demo video walkthrough",
                    "Documentation",
                ],
                isLocked: true,
            },
        ],
    },
    {
        title: "Data Structures & Algorithms",
        slug: "data-structures-algorithms",
        description:
            "Master essential data structures and algorithms for coding interviews and competitive programming.",
        thumbnail:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
        stream: "Computer Science",
        level: "Intermediate",
        price: 3999,
        discountedPrice: 1999,
        totalDuration: "10 weeks",
        isPublished: true,
        tags: ["dsa", "algorithms", "coding", "interviews"],
        difficultyIndex: 3,
        modules: [
            {
                title: "Module 1: Introduction to DSA",
                timeline: "Week 1",
                description: "Understanding the importance of DSA",
                order: 1,
                lessons: [
                    {
                        title: "What is DSA?",
                        type: "video",
                        contentUrls: ["https://example.com/dsa1"],
                        duration: 20,
                        isFreePreview: true,
                        notes: "Introduction to Data Structures and Algorithms.",
                    },
                    {
                        title: "Time & Space Complexity",
                        type: "video",
                        contentUrls: ["https://example.com/dsa2"],
                        duration: 30,
                        notes: "Understanding Big O notation.",
                    },
                ],
                tasks: [
                    {
                        title: "Complexity Analysis",
                        description:
                            "Analyze the time and space complexity of given algorithms.",
                        dueInDays: 5,
                    },
                ],
                quizzes: [
                    {
                        title: "Complexity Quiz",
                        questions: [
                            {
                                questionText:
                                    "What is the time complexity of binary search?",
                                options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                                correctAnswer: 1,
                                explanation:
                                    "Binary search has O(log n) time complexity.",
                            },
                            {
                                questionText: "Which data structure uses LIFO?",
                                options: [
                                    "Queue",
                                    "Stack",
                                    "Array",
                                    "Linked List",
                                ],
                                correctAnswer: 1,
                                explanation:
                                    "Stack follows Last In First Out (LIFO) principle.",
                            },
                        ],
                    },
                ],
            },
            {
                title: "Module 2: Arrays & Strings",
                timeline: "Week 2-3",
                description: "Master array and string manipulation",
                order: 2,
                lessons: [
                    {
                        title: "Array Operations",
                        type: "video",
                        contentUrls: ["https://example.com/dsa3"],
                        duration: 25,
                        notes: "Common array operations and techniques.",
                    },
                    {
                        title: "String Algorithms",
                        type: "video",
                        contentUrls: ["https://example.com/dsa4"],
                        duration: 30,
                        notes: "String manipulation and pattern matching.",
                    },
                ],
                tasks: [],
                quizzes: [],
            },
        ],
        capstoneProjects: [
            {
                title: "Capstone: Algorithm Visualizer",
                description:
                    "Build an interactive algorithm visualizer web application.",
                requirements: [
                    "Visualize sorting algorithms",
                    "Visualize pathfinding algorithms",
                ],
                deliverables: ["GitHub repository", "Live demo"],
                isLocked: true,
            },
        ],
    },
    {
        title: "Python for Data Science",
        slug: "python-data-science",
        description:
            "Learn Python programming for data analysis, visualization, and machine learning.",
        thumbnail:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
        stream: "Data Science",
        level: "Beginner",
        price: 4499,
        discountedPrice: 2499,
        totalDuration: "8 weeks",
        isPublished: true,
        tags: ["python", "data-science", "pandas", "numpy", "machine-learning"],
        difficultyIndex: 2,
        modules: [
            {
                title: "Module 1: Python Basics",
                timeline: "Week 1-2",
                description: "Python programming fundamentals",
                order: 1,
                lessons: [
                    {
                        title: "Getting Started with Python",
                        type: "video",
                        contentUrls: ["https://example.com/py1"],
                        duration: 15,
                        isFreePreview: true,
                        notes: "Setting up Python environment.",
                    },
                    {
                        title: "Python Data Types",
                        type: "video",
                        contentUrls: ["https://example.com/py2"],
                        duration: 25,
                        notes: "Understanding Python data types.",
                    },
                ],
                tasks: [
                    {
                        title: "Python Basics Exercise",
                        description:
                            "Complete basic Python programming exercises.",
                        dueInDays: 7,
                    },
                ],
                quizzes: [
                    {
                        title: "Python Basics Quiz",
                        questions: [
                            {
                                questionText:
                                    "Which of the following is NOT a Python data type?",
                                options: [
                                    "list",
                                    "tuple",
                                    "array",
                                    "dictionary",
                                ],
                                correctAnswer: 2,
                                explanation:
                                    "Array is not a built-in Python data type (use list instead).",
                            },
                        ],
                    },
                ],
            },
        ],
        capstoneProjects: [],
    },
];

// Additional course templates
const additionalCourseTitles = {
    "Web Development": [
        "Advanced React Patterns",
        "Vue.js Masterclass",
        "Next.js Complete Guide",
        "TypeScript for Web Developers",
    ],
    "Mobile Development": [
        "Android Development with Kotlin",
        "iOS Development with SwiftUI",
        "Flutter Cross-Platform Apps",
        "React Native Essentials",
    ],
    "AI & Machine Learning": [
        "Deep Learning with PyTorch",
        "Natural Language Processing",
        "Computer Vision Fundamentals",
        "ML Model Deployment",
    ],
    "Cloud Computing": [
        "AWS Solutions Architect",
        "Azure DevOps Engineer",
        "Kubernetes Mastery",
        "Docker for Developers",
    ],
    Cybersecurity: [
        "Ethical Hacking Bootcamp",
        "Network Security Fundamentals",
        "Web Application Security",
        "Penetration Testing",
    ],
    Blockchain: [
        "Ethereum Smart Contracts",
        "Web3 DApp Development",
        "Solidity Programming",
        "Blockchain Architecture",
    ],
    "Database Management": [
        "PostgreSQL Advanced",
        "MongoDB Performance Tuning",
        "SQL Query Optimization",
        "Redis Caching Strategies",
    ],
    "UI/UX Design": [
        "Figma UI Design",
        "User Experience Research",
        "Design Systems",
        "Mobile App Design",
    ],
};

export const seedCourses = async () => {
    // Get admin users to assign as instructors
    const admins = await User.find({ role: "admin" });

    if (admins.length === 0) {
        console.log(
            "⚠️  Warning: No admin users found. Courses will be created without instructors."
        );
    }

    const courses = [...baseCourses];

    // Assign instructors to base courses
    courses.forEach((course) => {
        if (admins.length > 0) {
            course.instructor = faker.helpers.arrayElement(admins)._id;
        }
    });

    // Generate additional courses
    for (const [stream, titles] of Object.entries(additionalCourseTitles)) {
        for (const title of titles) {
            const level = faker.helpers.arrayElement(levels);
            const price = faker.helpers.arrayElement([
                2999, 3499, 3999, 4499, 4999, 5499,
            ]);
            const hasDiscount = faker.datatype.boolean(0.7);

            courses.push({
                title: title,
                description: faker.lorem.paragraph(3),
                thumbnail: generateThumbnail(stream),
                stream: stream,
                level: level,
                price: price,
                discountedPrice: hasDiscount
                    ? Math.floor(
                          price * faker.number.float({ min: 0.5, max: 0.8 })
                      )
                    : undefined,
                totalDuration: `${faker.number.int({ min: 6, max: 16 })} weeks`,
                isPublished: faker.datatype.boolean(0.8), // 80% published
                tags: faker.helpers.arrayElements(
                    streams[stream],
                    faker.number.int({ min: 3, max: 6 })
                ),
                difficultyIndex:
                    level === "Beginner"
                        ? faker.number.int({ min: 1, max: 2 })
                        : level === "Intermediate"
                        ? faker.number.int({ min: 2, max: 4 })
                        : faker.number.int({ min: 4, max: 5 }),
                modules: generateModules(
                    stream,
                    faker.number.int({ min: 4, max: 8 })
                ),
                capstoneProjects: generateCapstone(stream),
                enrolledCount: faker.number.int({ min: 0, max: 500 }),
                courseVersion: `${faker.number.int({
                    min: 1,
                    max: 3,
                })}.${faker.number.int({ min: 0, max: 9 })}.0`,
                instructor:
                    admins.length > 0
                        ? faker.helpers.arrayElement(admins)._id
                        : undefined,
            });
        }
    }

    // Add a few draft/unpublished courses
    const draftCount = 3;
    for (let i = 0; i < draftCount; i++) {
        const stream = faker.helpers.arrayElement(Object.keys(streams));
        courses.push({
            title: `${faker.lorem.words(3)} - Coming Soon`,
            description: faker.lorem.paragraph(2),
            thumbnail: generateThumbnail(stream),
            stream: stream,
            level: faker.helpers.arrayElement(levels),
            price: 3999,
            totalDuration: `${faker.number.int({ min: 6, max: 12 })} weeks`,
            isPublished: false,
            tags: faker.helpers.arrayElements(streams[stream], 4),
            modules: [],
            capstoneProjects: [],
            enrolledCount: 0,
            instructor:
                admins.length > 0
                    ? faker.helpers.arrayElement(admins)._id
                    : undefined,
        });
    }

    await Course.insertMany(courses);

    const publishedCount = courses.filter((c) => c.isPublished).length;
    const streamCounts = {};
    courses.forEach((c) => {
        streamCounts[c.stream] = (streamCounts[c.stream] || 0) + 1;
    });

    console.log(`✅ ${courses.length} courses seeded`);
    console.log(
        `   📚 Published: ${publishedCount}, Draft: ${
            courses.length - publishedCount
        }`
    );
    console.log(`   📊 By Stream:`);
    Object.entries(streamCounts).forEach(([stream, count]) => {
        console.log(`      - ${stream}: ${count}`);
    });
};

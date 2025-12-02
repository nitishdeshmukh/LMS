import { Course } from "../../models/index.js";

/**
 * @description Get all published courses for "Premium Streams" card grid
 * @route GET /api/courses/streams
 * @access Public
 */
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find(
            { isPublished: true },
            {
                title: 1,
                slug: 1,
                description: 1,
                thumbnail: 1,
                stream: 1,
                price: 1,
                level: 1,
                totalDuration: 1,
            }
        ).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching streams:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message,
        });
    }
};

/**
 * @description Get detailed course/internship page data
 * @route GET /api/courses/:slug
 * @access Public
 */
export const getCourseDetails = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug, isPublished: true });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // courseDetails object
        const courseDetails = {
            id: course._id,
            title: course.title,
            subtitle: course.description,
            lastUpdated: new Date(course.updatedAt).toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric",
                }
            ),
            price: `₹${course.price}`,
            originalPrice: `₹${course.price * 10}`,
            discount: "Pay 10% Now",
        };

        // learningPoints from tags
        const learningPoints =
            course.tags.length > 0
                ? course.tags.map((tag) => `Master ${tag}`)
                : [
                      "Build production-ready applications",
                      "Master modern development practices",
                      "Work with real-world projects",
                  ];

        // curriculum from modules
        const curriculum = course.modules.map((module, index) => {
            // Use module.topics if available, else fallback
            const topics =
                module.topics?.length > 0
                    ? module.topics
                    : [
                          "Core concepts and fundamentals",
                          "Practical implementation",
                          "Best practices",
                          "Hands-on exercises",
                      ];

            // practice from first task
            const practice =
                module.tasks && module.tasks.length > 0
                    ? `${module.tasks[0].title}: ${module.tasks[0].description}`
                    : "Complete hands-on exercises and mini-projects.";

            return {
                id: index + 1,
                title: `Module ${index + 1}: ${module.title}`,
                timeline: `Days ${module.order * 3 - 2}-${module.order * 3}`,
                topics,
                practice,
            };
        });

        // capstoneProject
        const capstoneProject = {
            title: course.capstoneProject?.title || "Final Capstone Project",
            description:
                course.capstoneProject?.description ||
                "Build a complete full-stack application",
            timeline: `Days ${curriculum.length * 3 + 1}-${
                curriculum.length * 3 + 4
            }`,
        };

        // benefitsAfterPayment (same for all)
        const benefitsAfterPayment = [
            "Fully Verifiable Internship Certificate (Verifiable on website)",
            "Skill Certificate to prove your technical expertise",
            "Official Letter of Recommendation (LOR)",
            "Premium Benefits worth ₹20,000 (Resume, LinkedIn, Mock Interviews)",
        ];

        // internshipIncludes
        const internshipIncludes = [
            "30-Day Structured Roadmap",
            "Curated Free Resources",
            "Capstone Project",
            "Internship Certificate (Post-Completion)",
            "Letter of Recommendation",
        ];

        // paymentInfo
        const paymentInfo = {
            title: "How the Payment Works",
            description:
                "You only pay 10% to enroll and start the internship. The course content itself is a curated roadmap of high-quality, freely available resources. We do not charge for the content.",
            note: "The fee covers our LMS infrastructure, progress tracking, and the verification systems. You will pay the remaining amount only after completing the internship to unlock your certificates and premium career benefits.",
        };

        // Final response
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                learningPoints,
                curriculum,
                capstoneProject,
                benefitsAfterPayment,
                internshipIncludes,
                paymentInfo,
            },
        });
    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
            error: error.message,
        });
    }
};

import { Course, User } from "../../models/index.js";
import multer from "multer";
import path from "path";

/**
 * Get All Courses with Filters, Search, and Sorting
 */
export const getAllCourses = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = "",
            status = "All",
            sortBy = "createdAt",
            sortOrder = "desc",
            stream = "",
            level = "",
        } = req.query;

        // Build match conditions
        const matchConditions = {};

        // Search by title or course ID (slug)
        if (search) {
            matchConditions.$or = [
                { title: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
                { stream: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by published status
        if (status !== "All") {
            matchConditions.isPublished = status === "Published";
        }

        // Filter by stream
        if (stream && stream !== "All") {
            matchConditions.stream = { $regex: stream, $options: "i" };
        }

        // Filter by level
        if (level && level !== "All") {
            matchConditions.level = level;
        }

        const aggregate = Course.aggregate([
            // Stage 1: Match courses
            { $match: matchConditions },

            // Stage 2: Lookup instructor details
            {
                $lookup: {
                    from: "users",
                    localField: "instructor",
                    foreignField: "_id",
                    as: "instructorDetails",
                },
            },

            {
                $unwind: {
                    path: "$instructorDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Stage 3: Add computed fields
            {
                $addFields: {
                    courseId: {
                        $concat: [
                            "C2D-",
                            { $toUpper: { $substr: ["$slug", 0, 4] } },
                        ],
                    },
                    instructorName: {
                        $concat: [
                            "$instructorDetails.name",
                            " ",
                            { $ifNull: ["$instructorDetails.lastName", ""] },
                        ],
                    },
                    moduleCount: { $size: { $ifNull: ["$modules", []] } },
                    statusBadge: {
                        $cond: ["$isPublished", "Published", "Draft"],
                    },
                },
            },

            // Stage 4: Project fields
            {
                $project: {
                    _id: 1,
                    courseId: 1,
                    title: 1,
                    slug: 1,
                    description: 1,
                    thumbnail: 1,
                    stream: 1,
                    level: 1,
                    price: 1,
                    discountedPrice: 1,
                    moduleCount: 1,
                    totalDuration: 1,
                    enrolledCount: 1,
                    isPublished: 1,
                    statusBadge: 1,
                    tags: 1,
                    difficultyIndex: 1,
                    courseVersion: 1,
                    instructor: 1,
                    instructorName: 1,
                    instructorEmail: "$instructorDetails.email",
                    createdAt: 1,
                    updatedAt: 1,
                },
            },

            // Stage 5: Sort
            {
                $sort: {
                    [sortBy]: sortOrder === "asc" ? 1 : -1,
                    _id: 1,
                },
            },
        ]);

        // Pagination
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            customLabels: {
                docs: "courses",
                totalDocs: "totalCourses",
                limit: "pageSize",
                page: "currentPage",
                totalPages: "totalPages",
                hasNextPage: "hasNext",
                hasPrevPage: "hasPrev",
            },
        };

        const result = await Course.aggregatePaginate(aggregate, options);

        res.json({
            success: true,
            message: "Courses retrieved successfully",
            data: result,
        });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get courses",
            error: error.message,
        });
    }
};


/**
 * Create New Course
 */
export const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            stream,
            level,
            price,
            discountedPrice,
            instructor,
            totalDuration,
            tags,
            difficultyIndex,
            courseVersion,
            thumbnail,
        } = req.body;

        // Check if course with same title exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "A course with this title already exists",
            });
        }

        // Create course
        const course = await Course.create({
            title,
            description,
            stream,
            level,
            price: parseFloat(price),
            discountedPrice: discountedPrice
                ? parseFloat(discountedPrice)
                : undefined,
            instructor,
            totalDuration,
            tags: tags
                ? tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                : [],
            difficultyIndex: difficultyIndex ? parseInt(difficultyIndex) : 1,
            courseVersion: courseVersion || "1.0.0",
            thumbnail,
            isPublished: false, // Draft by default
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    } catch (error) {
        console.error("Create course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

/**
 * Update Existing Course
 */
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {
            title,
            description,
            stream,
            level,
            price,
            discountedPrice,
            instructor,
            totalDuration,
            tags,
            difficultyIndex,
            courseVersion,
            thumbnail,
        } = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Update fields
        const updateData = {
            title,
            description,
            stream,
            level,
            price: parseFloat(price),
            discountedPrice: discountedPrice
                ? parseFloat(discountedPrice)
                : undefined,
            instructor,
            totalDuration,
            tags: tags
                ? tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                : [],
            difficultyIndex: difficultyIndex
                ? parseInt(difficultyIndex)
                : course.difficultyIndex,
            courseVersion: courseVersion || course.courseVersion,
        };

        if (thumbnail) {
            updateData.thumbnail = thumbnail;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true }
        ).populate("instructor", "name lastName email");

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Update course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message,
        });
    }
};

/**
 * Delete Course
 */
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // TODO: Delete related enrollments, submissions, certificates

        res.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message,
        });
    }
};

/**
 * Publish/Unpublish Course
 */
export const toggleCourseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { isPublished } = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            { isPublished },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.json({
            success: true,
            message: `Course ${
                isPublished ? "published" : "unpublished"
            } successfully`,
            data: course,
        });
    } catch (error) {
        console.error("Toggle course status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update course status",
            error: error.message,
        });
    }
};

/**
 * Get Filter Options
 */
export const getCourseFilterOptions = async (req, res) => {
    try {
        const options = await Course.aggregate([
            {
                $facet: {
                    streams: [
                        { $match: { stream: { $exists: true, $ne: null } } },
                        { $group: { _id: "$stream" } },
                        { $sort: { _id: 1 } },
                    ],
                    levels: [
                        { $group: { _id: "$level" } },
                        { $sort: { _id: 1 } },
                    ],
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                streams: options[0].streams.map((s) => s._id),
                levels: options[0].levels.map((l) => l._id),
                statuses: ["All", "Published", "Draft"],
            },
        });
    } catch (error) {
        console.error("Get filter options error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get filter options",
            error: error.message,
        });
    }
};


/**
 * Upload Course Thumbnail
 */
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/course-thumbnails/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "course-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

export const uploadThumbnail = upload.single("thumbnail");

export const handleThumbnailUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const fileUrl = `/uploads/course-thumbnails/${req.file.filename}`;

        res.json({
            success: true,
            message: "Thumbnail uploaded successfully",
            data: {
                url: fileUrl,
                filename: req.file.filename,
            },
        });
    } catch (error) {
        console.error("Upload thumbnail error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload thumbnail",
            error: error.message,
        });
    }
};


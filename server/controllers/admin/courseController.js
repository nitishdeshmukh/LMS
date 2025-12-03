import mongoose from "mongoose";
import { Course } from "../../models/index.js";

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

            // Stage 4: Sort
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
 * Create New Course with Modules and Capstone
 */
export const createCourse = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            stream,
            level,
            price,
            discountedPrice,
            totalDuration,
            tags,
            isPublished,
            modules,
            capstoneProject,
        } = req.body;

        // Validate required fields
        if (!title || !description || !stream || !level || !price) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: title, description, stream, level, price",
            });
        }

        // Check if course with same title exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "A course with this title already exists",
            });
        }

        // Create course data object
        const courseData = {
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
            description,
            stream,
            level,
            price: parseFloat(price),
            discountedPrice: discountedPrice
                ? parseFloat(discountedPrice)
                : null,
            totalDuration: totalDuration || "",
            tags: Array.isArray(tags)
                ? tags
                : tags
                ? tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                : [],
            isPublished: isPublished || false,
            modules: modules || [],
            capstoneProject: capstoneProject || null,
        };

        // Create course
        const course = await Course.create(courseData);

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
 * Update Existing Course with Modules and Capstone
 */
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {
            title,
            slug,
            description,
            stream,
            level,
            price,
            discountedPrice,
            totalDuration,
            tags,
            isPublished,
            modules,
            capstoneProject,
        } = req.body;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Build update data
        const updateData = {
            title: title || course.title,
            slug:
                slug ||
                (title
                    ? title.toLowerCase().replace(/\s+/g, "-")
                    : course.slug),
            description: description || course.description,
            stream: stream || course.stream,
            level: level || course.level,
            price: price !== undefined ? parseFloat(price) : course.price,
            discountedPrice:
                discountedPrice !== undefined
                    ? discountedPrice
                        ? parseFloat(discountedPrice)
                        : null
                    : course.discountedPrice,
            totalDuration:
                totalDuration !== undefined
                    ? totalDuration
                    : course.totalDuration,
            tags: tags
                ? Array.isArray(tags)
                    ? tags
                    : tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                : course.tags,
            isPublished:
                isPublished !== undefined ? isPublished : course.isPublished,
        };

        // Update modules if provided
        if (modules !== undefined) {
            updateData.modules = modules;
        }

        // Update capstone project if provided
        if (capstoneProject !== undefined) {
            updateData.capstoneProject = capstoneProject;
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true }
        );

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
    console.log(req.body);
    console.log(req.params);
    console.log("________----->");
    
    
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
 * Get Single Course by ID
 */
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate courseId
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        // Check if courseId is valid ObjectId format
        if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID format",
            });
        }

        // Use aggregation pipeline (matching getAllCourses structure)
        const courseDetails = await Course.aggregate([
            // Stage 1: Match specific course by ID
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(courseId),
                },
            },

            // Stage 2: Add computed fields
            {
                $addFields: {
                    courseId: {
                        $concat: [
                            "C2D-",
                            { $toUpper: { $substr: ["$slug", 0, 4] } },
                        ],
                    },
                    moduleCount: { $size: { $ifNull: ["$modules", []] } },
                    statusBadge: {
                        $cond: ["$isPublished", "Published", "Draft"],
                    },
                },
            },
        ]);

        // Check if course exists
        if (!courseDetails || courseDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.json({
            success: true,
            message: "Course retrieved successfully",
            data: courseDetails[0],
        });
    } catch (error) {
        console.error("Get course by ID error:", error);

        // Handle invalid ObjectId format
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID format",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to get course",
            error: error.message,
        });
    }
};

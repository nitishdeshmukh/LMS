// routes/admin/pendingUsers.routes.js
import express from "express";
import { ongoingStudentController } from "../../controllers/admin/index.js";

const router = express.Router();

router.get("/", ongoingStudentController.getOngoingUsers);

// GET /api/admin/pending-users/filter-options - Get dropdown options
router.get(
    "/filter-options",
    ongoingStudentController.getOngoingUsersFilterOptions
);

// PATCH /api/admin/pending-users/:userId/approve - Approve single user
router.patch("/:userId/approve", ongoingStudentController.approveOngoingUser);

// PATCH /api/admin/pending-users/:userId/reject - Reject single user
router.patch("/:userId/reject", ongoingStudentController.rejectOngoingUser);

export default router;

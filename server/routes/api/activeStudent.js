import express from "express";
import { acvtiveStudentController } from "../../controllers/admin/index.js";
const router = express.Router();

// GET /api/admin/dashboard/stats - Main dashboard (verified students only)
router.get("/", acvtiveStudentController.getAllStudentsWithEnrollments);
router.get("/stats", acvtiveStudentController.getActiveStudentStats);
router.get("/filter-options", acvtiveStudentController.getFilterOptions);
router.get("/export-csv", acvtiveStudentController.exportStudentsCSV);
router.patch(
    "/enrollment/:enrollmentId/payment",
    acvtiveStudentController.updatePaymentStatus
);
router.patch(
    "/submission/:submissionId/capstone",
    acvtiveStudentController.updateCapstoneStatus
);
router.post("/certificate", acvtiveStudentController.issueCertificate);

export default router;

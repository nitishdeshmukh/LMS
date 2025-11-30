import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import studentRoutes from "./student.js";
import adminDashboardRoutes from "./adminDashboard.js";
import ongoingUserRoutes from "./ongoingStudent.js";
import activeUserRoutes from "./activeStudent.js";
import coursesRoutes from "./courses.js";
import analyticsRoutes from "./analytics.js";
// import paymentRoute from "./payment.js";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "API is working" }));
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/student", studentRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);
router.use("/admin/ongoing/students", ongoingUserRoutes);
router.use("/admin/active/students", activeUserRoutes);
router.use("/admin/course", coursesRoutes);
router.use("/admin/analytics", analyticsRoutes);
// router.use("/payment", paymentRoute);

export default router;

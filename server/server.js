import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/api/index.js";
import configurePassport from "./config/passport.js";
import {
    globalErrorHandler,
    notFoundHandler,
} from "./middlewares/globalErrorHandler.js";

// --- Config ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5001;

// --- Database Connection ---
connectDB();
configurePassport();

// --- Middlewares ---
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
); // Enable CORS with credentials
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: "10mb" })); // Body parser for JSON with increased limit for base64 images
app.use(express.urlencoded({ extended: false, limit: "10mb" })); // Body parser for forms

// --- Static Folders ---
// This serves the 'uploads' folder publicly
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// --- API Routes ---
app.use("/api", apiRoutes);

// --- Error Handlers ---
app.use(notFoundHandler); // Handle 404 for undefined routes
app.use(globalErrorHandler); // Global error handler

// --- Basic Server Listen ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

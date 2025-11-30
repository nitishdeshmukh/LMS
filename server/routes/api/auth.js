import express from "express";
import passport from "passport";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { authValidation } from "../../validation/index.js";
import { authController } from "../../controllers/auth/index.js";

const router = express.Router();

// ============================================
// LOCAL AUTH ROUTES
// ============================================

// router.post("/register", register);
router.post("/login", authValidation.validateLogin, authController.login);
router.post("/lms-login", authController.lmsLogin);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", authController.logout);
router.post("/logout-all", isAuthenticated, authController.logoutAll);
// router.get("/me", isAuthenticated, getCurrentUser);
// router.get("/sessions", isAuthenticated, getActiveSessions);
router.post(
    "/forgot-password",
    authValidation.validateForgotPassword,
    authController.forgotPassword
);
router.post("/reset-password", authController.resetPassword);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth-error?message=Google login failed",
        failureMessage: true,
    }),
    authController.handleOAuthCallback
);

// ============================================
// GITHUB OAUTH ROUTES
// ============================================

router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email", "read:user"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: "/auth-error?message=GitHub login failed",
        failureMessage: true,
    }),
    authController.handleOAuthCallback
);

export default router;

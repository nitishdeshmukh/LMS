import express from "express";
import passport from "passport";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import {
  register,
  lmsLogin,
  refreshAccessToken,
  logout,
  logoutAll,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  getActiveSessions,
  handleOAuthCallback,
} from "../../controllers/authController.js";

const router = express.Router();

// ============================================
// LOCAL AUTH ROUTES
// ============================================

router.post("/register", register);
router.post("/lms-login", lmsLogin);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/logout-all", isAuthenticated, logoutAll);
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/sessions", isAuthenticated, getActiveSessions);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

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
  handleOAuthCallback
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
  handleOAuthCallback
);

export default router;

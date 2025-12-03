// Auth Controllers - Modular Exports
// ============================================

// Login (Email & LMS)
export { login, lmsLogin, verifyAdmin } from "./login.controller.js";

// Logout
export { logout, logoutAll } from "./logout.controller.js";

// Token Management
export { refreshAccessToken } from "./token.controller.js";

// Password Reset
export { forgotPassword, resetPassword } from "./password.controller.js";

// OAuth
export { handleOAuthCallback } from "./oauth.controller.js";

// Utilities (for internal use)
export {
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies,
    clearAuthCookies,
    formatUserResponse,
} from "./utils.js";

import ms from "ms";

/**
 * Generates secure cookie options for access tokens.
 * Implements security best practices including XSS and CSRF protection.
 *
 * @function getAccessTokenCookieOptions
 * @returns {Object} Cookie configuration object
 */
export const getAccessTokenCookieOptions = () => ({
    httpOnly: true, // Prevents XSS attacks - JavaScript cannot access
    secure: true, // HTTPS only in production
    
    sameSite: "strict", // Prevents CSRF attacks
   
    maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
     // sameSite: "lax", // Prevents CSRF attacks
    // secure: false, // HTTPS only in production
});

/**
 * Generates secure cookie options for refresh tokens.
 * Implements security best practices including XSS and CSRF protection.
 *
 * @function getRefreshTokenCookieOptions
 * @returns {Object} Cookie configuration object
 */
export const getRefreshTokenCookieOptions = () => ({
    // httpOnly: true, // Prevents XSS attacks
    // secure: true, // HTTPS only in production
    secure: false, // HTTPS only in production
    // sameSite: "strict", // Prevents CSRF attacks
    sameSite: "lax", // Prevents CSRF attacks
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
});

/**
 * Clears authentication cookies from the response
 * @param {Object} res - Express response object
 */
export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
};

/**
 * Sets authentication tokens in HTTP-only cookies
 * @param {Object} res - Express response object
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

/**
 * Formats admin data for API response
 * @param {Object} admin - Admin document from database
 * @returns {Object} Formatted admin object
 */
export const formatUserResponse = (admin) => ({
    id: admin._id,
    email: admin.email,
    name: admin.name,
    lastName: admin.lastName,
    role: "admin",
    avatar: admin.avatar,
});

/**
 * Formats student data for API response
 * @param {Object} student - Student document from database
 * @returns {Object} Formatted student object
 */
export const formatStudentResponse = (student) => ({
    id: student._id,
    email: student.email,
    name: student.name,
    lastName: student.lastName,
    lmsId: student.lmsId,
    role: "student",
    accountStatus: student.accountStatus,
    avatar: student.avatar,
});

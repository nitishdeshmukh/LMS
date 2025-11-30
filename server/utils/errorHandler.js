/**
 * Custom error handler class that extends the built-in Error object.
 * Designed for standardized error responses in applications such as APIs.
 *
 * @class errorHandler
 * @extends {Error}
 *
 * @param {number} statusCode - HTTP status code representing the error type.
 * @param {string} [message="Something went wrong"] - Human-readable error message.
 * @param {Array} [errors=[]] - Optional array containing additional error details.
 * @param {string} [stack=""] - Optional stack trace. If not provided, it's captured automatically.
 *
 * @property {number} statusCode - HTTP status code.
 * @property {null} data - Set to null to indicate absence of successful data.
 * @property {boolean} success - Always false to indicate failure.
 * @property {Array} errors - Additional error details.
 * @property {string} stack - Stack trace for debugging.
 */

class errorHandler extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default errorHandler;

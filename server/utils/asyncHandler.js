/**
 * Utility function to handle errors in asynchronous route handlers.
 * Wraps a request handler and automatically forwards any thrown errors to Express's error middleware.
 *
 * @function asyncHandler
 *
 * @param {Function} requestHandler - An async function with signature (req, res, next) to handle a request.
 * @returns {Function} A wrapped function that catches errors and passes them to `next()`.
 */

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default asyncHandler;

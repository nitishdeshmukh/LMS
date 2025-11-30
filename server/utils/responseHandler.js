/**
 * Standard response handler class for structuring API responses.
 * Automatically determines success based on HTTP status code.
 *
 * @class ResponseHandler
 *
 * @param {number} statusCode - HTTP status code representing the result of the operation.
 * @param {*} data - The response payload (can be any type).
 * @param {string} [message="Success"] - Human-readable message about the response.
 *
 * @property {number} statusCode - HTTP status code.
 * @property {*} data - Data returned in the response.
 * @property {string} message - Message describing the result.
 * @property {boolean} success - Indicates if the response is successful (true if statusCode < 400).
 */

class responseHandler {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export default responseHandler;

'use strict';

/*
 * FREEzzzGames
 * API error handler
 *
 * Converts internal API errors into safe client responses.
 * Internal error details are never exposed to the client.
 */

const {
    sendError
} = require('./response');

const handleApiError = (
    response,
    error,
    statusCode = 500
) => {
    if (!response || typeof response !== 'object') {
        throw new Error('Response is required');
    }

    const safeStatusCode =
        Number.isInteger(statusCode) &&
        statusCode >= 400 &&
        statusCode <= 599
            ? statusCode
            : 500;

    const errorCode =
        typeof error === 'string' &&
        error.trim().length > 0
            ? error.trim()
            : 'INTERNAL_ERROR';

    sendError(
        response,
        safeStatusCode,
        errorCode
    );
};

module.exports = {
    handleApiError
};
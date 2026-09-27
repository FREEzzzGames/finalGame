'use strict';

/*
 * FREEzzzGames
 * API response module
 *
 * Provides consistent JSON responses for the API.
 * Internal server errors are not exposed to the client.
 */

const sendJson = (response, statusCode, payload) => {
    response.statusCode = statusCode;

    response.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
    );

    response.end(JSON.stringify(payload));
};

const sendSuccess = (response, data = {}) => {
    sendJson(response, 200, {
        ok: true,
        data
    });
};

const sendError = (
    response,
    statusCode,
    errorCode
) => {
    const safeStatusCode =
        Number.isInteger(statusCode) &&
        statusCode >= 400 &&
        statusCode <= 599
            ? statusCode
            : 500;

    const safeErrorCode =
        typeof errorCode === 'string' &&
        errorCode.trim().length > 0
            ? errorCode.trim()
            : 'INTERNAL_ERROR';

    sendJson(response, safeStatusCode, {
        ok: false,
        error: safeErrorCode
    });
};

module.exports = {
    sendJson,
    sendSuccess,
    sendError
};
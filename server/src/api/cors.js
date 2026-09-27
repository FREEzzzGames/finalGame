'use strict';

/*
 * FREEzzzGames
 * API CORS module
 *
 * Provides a minimal same-origin-friendly CORS policy.
 * Authentication, routing and game logic are handled separately.
 */

const ALLOWED_METHODS = 'GET,POST,OPTIONS';

const applyCorsHeaders = response => {
    response.setHeader(
        'Access-Control-Allow-Origin',
        'null'
    );

    response.setHeader(
        'Access-Control-Allow-Methods',
        ALLOWED_METHODS
    );

    response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    response.setHeader(
        'Vary',
        'Origin'
    );
};

const isPreflightRequest = request => {
    if (!request || typeof request !== 'object') {
        return false;
    }

    return (
        request.method === 'OPTIONS' &&
        typeof request.headers === 'object'
    );
};

module.exports = {
    ALLOWED_METHODS,
    applyCorsHeaders,
    isPreflightRequest
};
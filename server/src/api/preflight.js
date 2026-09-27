'use strict';

/*
 * FREEzzzGames
 * API preflight module
 *
 * Handles HTTP OPTIONS preflight requests.
 * Authentication, game logic and persistence are handled separately.
 */

const {
    applyCorsHeaders,
    isPreflightRequest
} = require('./cors');

const handlePreflight = (request, response) => {
    if (!isPreflightRequest(request)) {
        return false;
    }

    applyCorsHeaders(response);

    response.statusCode = 204;
    response.end();

    return true;
};

module.exports = {
    handlePreflight
};
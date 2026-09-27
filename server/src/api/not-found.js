'use strict';

/*
 * FREEzzzGames
 * API not-found module
 *
 * Provides a consistent response for unknown API routes.
 * Authentication, game logic and persistence are handled separately.
 */

const {
    sendError
} = require('./response');

const handleNotFound = response => {
    if (!response || typeof response !== 'object') {
        throw new Error('Response is required');
    }

    sendError(
        response,
        404,
        'NOT_FOUND'
    );
};

module.exports = {
    handleNotFound
};
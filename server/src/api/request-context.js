'use strict';

/*
 * FREEzzzGames
 * API request context module
 *
 * Creates the normalized API context from an HTTP request.
 * Authentication, persistence and game logic remain separate.
 */

const {
    createContext
} = require('./context');

const createRequestContext = (
    request,
    body = {}
) => {
    if (!request || typeof request !== 'object') {
        throw new Error('Request is required');
    }

    return createContext({
        request,
        body
    });
};

module.exports = {
    createRequestContext
};
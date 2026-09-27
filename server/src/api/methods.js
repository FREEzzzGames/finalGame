'use strict';

/*
 * FREEzzzGames
 * API methods module
 *
 * Defines the HTTP methods allowed by the game API.
 * Routing, authentication and game logic are handled separately.
 */

const ALLOWED_METHODS = Object.freeze([
    'GET',
    'POST'
]);

const isAllowedMethod = method => {
    if (typeof method !== 'string') {
        return false;
    }

    return ALLOWED_METHODS.includes(
        method.toUpperCase()
    );
};

module.exports = {
    ALLOWED_METHODS,
    isAllowedMethod
};
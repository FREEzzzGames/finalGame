'use strict';

/*
 * FREEzzzGames
 * API path module
 *
 * Provides safe helpers for identifying API requests.
 * Routing and game logic are handled separately.
 */

const API_PREFIX = '/api';

const isApiPath = path => {
    if (typeof path !== 'string') {
        return false;
    }

    return (
        path === API_PREFIX ||
        path.startsWith(`${API_PREFIX}/`)
    );
};

const normalizeApiPath = path => {
    if (!isApiPath(path)) {
        return null;
    }

    const value = path.slice(API_PREFIX.length);

    return value.length > 0
        ? value
        : '/';
};

module.exports = {
    API_PREFIX,
    isApiPath,
    normalizeApiPath
};
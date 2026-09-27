'use strict';

/*
 * FREEzzzGames
 * API request path module
 *
 * Extracts and normalizes the API path from an HTTP request.
 * Routing and game logic are handled separately.
 */

const {
    parseRequestUrl
} = require('./url');

const {
    isApiPath,
    normalizeApiPath
} = require('./path');

const getApiRequestPath = request => {
    if (!request || typeof request !== 'object') {
        return null;
    }

    if (typeof request.url !== 'string') {
        return null;
    }

    const parsed = parseRequestUrl(request.url);

    if (!parsed || !isApiPath(parsed.pathname)) {
        return null;
    }

    return normalizeApiPath(parsed.pathname);
};

module.exports = {
    getApiRequestPath
};
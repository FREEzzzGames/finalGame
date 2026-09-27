'use strict';

/*
 * FREEzzzGames
 * API URL module
 *
 * Parses request URLs and separates pathname from query data.
 * Authentication and game logic are handled separately.
 */

const parseRequestUrl = requestUrl => {
    if (
        typeof requestUrl !== 'string' ||
        requestUrl.length === 0
    ) {
        return null;
    }

    let parsed;

    try {
        parsed = new URL(
            requestUrl,
            'http://localhost'
        );
    } catch {
        return null;
    }

    return {
        pathname: parsed.pathname,
        search: parsed.search,
        searchParams: parsed.searchParams
    };
};

module.exports = {
    parseRequestUrl
};
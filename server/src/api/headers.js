'use strict';

/*
 * FREEzzzGames
 * HTTP headers module
 *
 * Provides safe access to normalized request headers.
 */

const normalizeHeaderName = name => {
    if (typeof name !== 'string') {
        return '';
    }

    return name
        .trim()
        .toLowerCase();
};

const getHeader = (headers, name) => {
    if (!headers || typeof headers !== 'object') {
        return undefined;
    }

    const normalizedName = normalizeHeaderName(name);

    if (!normalizedName) {
        return undefined;
    }

    return headers[normalizedName];
};

const hasHeader = (headers, name) => (
    getHeader(headers, name) !== undefined
);

module.exports = {
    normalizeHeaderName,
    getHeader,
    hasHeader
};
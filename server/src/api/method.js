'use strict';

/*
 * FREEzzzGames
 * HTTP method module
 *
 * Normalizes HTTP methods before API dispatch.
 */

const normalizeMethod = method => {
    if (typeof method !== 'string') {
        return '';
    }

    return method
        .trim()
        .toUpperCase();
};

const isMethod = (method, expected) => (
    normalizeMethod(method) === normalizeMethod(expected)
);

module.exports = {
    normalizeMethod,
    isMethod
};
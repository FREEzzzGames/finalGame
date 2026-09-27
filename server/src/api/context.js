'use strict';

/*
 * FREEzzzGames
 * API context module
 *
 * Creates a normalized context for API handlers.
 * Authentication, authorization and persistence are handled separately.
 */

const {
    isAllowedMethod
} = require('./methods');

const createContext = ({
    request,
    body = {}
}) => {
    if (!request || typeof request !== 'object') {
        throw new Error('Request is required');
    }

    const method =
        typeof request.method === 'string'
            ? request.method.toUpperCase()
            : null;

    const path =
        typeof request.url === 'string'
            ? request.url
            : null;

    if (!method || !isAllowedMethod(method)) {
        throw new Error('Invalid request method');
    }

    if (!path) {
        throw new Error('Invalid request path');
    }

    if (
        body === null ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        throw new Error('Invalid request body');
    }

    return {
        request,
        method,
        path,
        body
    };
};

module.exports = {
    createContext
};
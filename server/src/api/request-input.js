'use strict';

/*
 * FREEzzzGames
 * API request input module
 *
 * Normalizes HTTP request input before API context creation.
 */

const createRequestInput = ({
    request,
    body = {}
} = {}) => {
    if (!request || typeof request !== 'object') {
        throw new Error('Request is required');
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
        body
    };
};

module.exports = {
    createRequestInput
};
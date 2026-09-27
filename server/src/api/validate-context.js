'use strict';

/*
 * FREEzzzGames
 * API context validation module
 *
 * Validates the normalized API context before dispatch.
 * Authentication, persistence and game logic remain separate.
 */

const validateContext = context => {
    if (
        context === null ||
        typeof context !== 'object'
    ) {
        return false;
    }

    if (
        typeof context.method !== 'string' ||
        context.method.trim().length === 0
    ) {
        return false;
    }

    if (
        typeof context.path !== 'string' ||
        context.path.trim().length === 0
    ) {
        return false;
    }

    if (
        context.body === null ||
        typeof context.body !== 'object' ||
        Array.isArray(context.body)
    ) {
        return false;
    }

    return true;
};

module.exports = {
    validateContext
};
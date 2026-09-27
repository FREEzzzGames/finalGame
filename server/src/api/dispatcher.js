'use strict';

/*
 * FREEzzzGames
 * API dispatcher module
 *
 * Resolves an API route and executes its handler.
 * Authentication, persistence and game logic are handled separately.
 */

const {
    resolveRoute
} = require('./router');

const dispatch = async context => {
    if (
        context === null ||
        typeof context !== 'object'
    ) {
        throw new Error('Invalid API context');
    }

    const {
        method,
        path
    } = context;

    const handler = resolveRoute(
        method,
        path
    );

    if (!handler) {
        return {
            handled: false,
            statusCode: 404,
            error: 'NOT_FOUND'
        };
    }

    const result = await handler(context);

    return {
        handled: true,
        statusCode: 200,
        data: result
    };
};

module.exports = {
    dispatch
};
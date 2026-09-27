'use strict';

/*
 * FREEzzzGames
 * API dispatcher module
 *
 * Resolves an API route and executes its handler.
 * Supports normalized route results with explicit
 * status codes and errors.
 *
 * Authentication, persistence and game logic are
 * handled separately.
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

    /*
     * Route handlers may return an explicit
     * normalized result:
     *
     * {
     *     statusCode: 200,
     *     data: {...}
     * }
     *
     * or:
     *
     * {
     *     statusCode: 401,
     *     error: '...'
     * }
     *
     * Preserve that structure instead of
     * wrapping it into another data object.
     */
    if (
        result &&
        typeof result === 'object' &&
        !Array.isArray(result) &&
        (
            Object.prototype.hasOwnProperty.call(
                result,
                'statusCode'
            ) ||
            Object.prototype.hasOwnProperty.call(
                result,
                'error'
            )
        )
    ) {
        return {
            handled: true,
            statusCode:
                Number.isInteger(result.statusCode)
                    ? result.statusCode
                    : 200,
            ...(typeof result.error === 'string'
                ? {
                    error: result.error
                }
                : {}),
            ...(Object.prototype.hasOwnProperty.call(
                result,
                'data'
            )
                ? {
                    data: result.data
                }
                : {})
        };
    }

    /*
     * Ordinary route result:
     * treat the returned value as response data.
     */
    return {
        handled: true,
        statusCode: 200,
        data: result
    };
};

module.exports = {
    dispatch
};
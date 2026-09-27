'use strict';

/*
 * FREEzzzGames
 * API route result module
 *
 * Provides normalized route resolution results.
 * Authentication, persistence and game logic remain separate.
 */

const createRouteResult = ({
    handled = false,
    statusCode = 404,
    error = null,
    data = undefined
} = {}) => {
    return {
        handled: Boolean(handled),
        statusCode:
            Number.isInteger(statusCode) &&
            statusCode >= 100 &&
            statusCode <= 599
                ? statusCode
                : 500,
        error:
            typeof error === 'string' &&
            error.trim().length > 0
                ? error.trim()
                : null,
        data
    };
};

const createNotFoundResult = () => {
    return createRouteResult({
        handled: false,
        statusCode: 404,
        error: 'NOT_FOUND'
    });
};

const createSuccessResult = data => {
    return createRouteResult({
        handled: true,
        statusCode: 200,
        data
    });
};

module.exports = {
    createRouteResult,
    createNotFoundResult,
    createSuccessResult
};
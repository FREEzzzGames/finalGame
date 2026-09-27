'use strict';

/*
 * FREEzzzGames
 * API handler module
 *
 * Converts dispatcher results into HTTP responses.
 * Authentication, persistence and game logic remain separate.
 */

const {
    sendSuccess,
    sendError
} = require('./response');

const handleResult = (
    response,
    result
) => {
    if (!response || typeof response !== 'object') {
        throw new Error('Response is required');
    }

    if (
        result === null ||
        typeof result !== 'object'
    ) {
        sendError(
            response,
            500,
            'INVALID_API_RESULT'
        );

        return;
    }

    if (result.handled === false) {
        sendError(
            response,
            Number.isInteger(result.statusCode)
                ? result.statusCode
                : 404,
            typeof result.error === 'string'
                ? result.error
                : 'NOT_FOUND'
        );

        return;
    }

    sendSuccess(
        response,
        result.data === undefined
            ? {}
            : result.data
    );
};

module.exports = {
    handleResult
};
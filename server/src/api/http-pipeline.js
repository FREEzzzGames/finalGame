'use strict';

/*
 * FREEzzzGames
 * API HTTP pipeline module
 *
 * Executes the API pipeline and converts its result
 * into a normalized HTTP result.
 */

const {
    executeApiPipeline
} = require('./pipeline');

const {
    createHttpSuccess,
    createHttpError
} = require('./http-result');

const executeHttpPipeline = async context => {
    const result = await executeApiPipeline(context);

    if (
        result === null ||
        typeof result !== 'object'
    ) {
        return createHttpError(
            500,
            'INVALID_API_RESULT'
        );
    }

    if (result.handled === false) {
        return createHttpError(
            Number.isInteger(result.statusCode)
                ? result.statusCode
                : 404,
            typeof result.error === 'string'
                ? result.error
                : 'NOT_FOUND'
        );
    }

    return createHttpSuccess(
        result.data === undefined
            ? {}
            : result.data
    );
};

module.exports = {
    executeHttpPipeline
};
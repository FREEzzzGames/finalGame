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

    /*
     * Route was not found or the API pipeline
     * rejected the request before dispatch.
     */
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

    /*
     * A handled route can still return an error,
     * for example:
     *
     * {
     *     handled: true,
     *     statusCode: 401,
     *     error: 'MISSING_TELEGRAM_INIT_DATA'
     * }
     *
     * Such responses must remain HTTP errors.
     */
    if (
        typeof result.error === 'string' &&
        result.error.length > 0
    ) {
        return createHttpError(
            Number.isInteger(result.statusCode)
                ? result.statusCode
                : 500,
            result.error
        );
    }

    /*
     * Explicit non-success HTTP status codes
     * without an error are also preserved.
     */
    if (
        Number.isInteger(result.statusCode) &&
        (
            result.statusCode < 200 ||
            result.statusCode >= 300
        )
    ) {
        return createHttpError(
            result.statusCode,
            'API_REQUEST_FAILED'
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
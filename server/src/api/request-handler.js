'use strict';

/*
 * FREEzzzGames
 * API request handler
 *
 * Coordinates request parsing, context creation,
 * API execution and HTTP response handling.
 *
 * CORS headers are applied to every API response,
 * not only to OPTIONS preflight responses.
 */

const {
    readJsonBody
} = require('./request');

const {
    createContext
} = require('./context');

const {
    executeHttpPipeline
} = require('./http-pipeline');

const {
    sendSuccess,
    sendError
} = require('./response');

const {
    applyCorsHeaders
} = require('./cors');

const handleApiRequest = async (
    request,
    response
) => {
    if (!request || typeof request !== 'object') {
        throw new Error('Request is required');
    }

    if (!response || typeof response !== 'object') {
        throw new Error('Response is required');
    }

    /*
     * CORS must be present on both:
     *
     * - successful API responses;
     * - API error responses.
     *
     * The preflight request is handled separately.
     */
    applyCorsHeaders(
        response,
        request
    );

    try {
        const body = await readJsonBody(request);

        const context = createContext({
            request,
            body
        });

        const result = await executeHttpPipeline(
            context
        );

        if (
            result === null ||
            typeof result !== 'object'
        ) {
            sendError(
                response,
                500,
                'INVALID_HTTP_RESULT'
            );

            return;
        }

        if (
            typeof result.error === 'string' &&
            result.error.length > 0
        ) {
            sendError(
                response,
                result.statusCode,
                result.error
            );

            return;
        }

        sendSuccess(
            response,
            result.data === undefined
                ? {}
                : result.data
        );
    } catch (error) {
        const statusCode =
            error &&
            Number.isInteger(error.statusCode)
                ? error.statusCode
                : 500;

        const errorCode =
            error &&
            typeof error.error === 'string'
                ? error.error
                : 'INTERNAL_ERROR';

        sendError(
            response,
            statusCode,
            errorCode
        );
    }
};

module.exports = {
    handleApiRequest
};
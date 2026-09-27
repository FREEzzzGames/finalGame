'use strict';

/*
 * FREEzzzGames
 * API pipeline module
 *
 * Validates API context and dispatches the request.
 * Authentication and persistence are handled separately.
 */

const {
    validateContext
} = require('./validate-context');

const {
    dispatch
} = require('./dispatcher');

const executeApiPipeline = async context => {
    if (!validateContext(context)) {
        return {
            handled: false,
            statusCode: 400,
            error: 'INVALID_API_CONTEXT'
        };
    }

    return dispatch(context);
};

module.exports = {
    executeApiPipeline
};
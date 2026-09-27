'use strict';

/*
 * FREEzzzGames
 * API module
 *
 * Central entry point for API functionality.
 */

const {
    MAX_BODY_SIZE,
    readJsonBody
} = require('./request');

const {
    sendJson,
    sendSuccess,
    sendError
} = require('./response');

const {
    registerRoute,
    resolveRoute,
    clearRoutes
} = require('./router');

const {
    createContext
} = require('./context');

const {
    dispatch
} = require('./dispatcher');

const {
    ALLOWED_METHODS,
    isAllowedMethod
} = require('./methods');

const {
    ALLOWED_METHODS: CORS_ALLOWED_METHODS,
    applyCorsHeaders,
    isPreflightRequest
} = require('./cors');

const {
    handlePreflight
} = require('./preflight');

const {
    handleNotFound
} = require('./not-found');

const {
    handleApiError
} = require('./error-handler');

const {
    handleResult
} = require('./handle');

const {
    API_PREFIX,
    isApiPath,
    normalizeApiPath
} = require('./path');

const {
    parseRequestUrl
} = require('./url');

const {
    getApiRequestPath
} = require('./request-path');

const {
    createRouteResult,
    createNotFoundResult,
    createSuccessResult
} = require('./route-result');

const {
    validateContext
} = require('./validate-context');

const {
    executeApiPipeline
} = require('./pipeline');

module.exports = {
    MAX_BODY_SIZE,
    readJsonBody,
    sendJson,
    sendSuccess,
    sendError,
    registerRoute,
    resolveRoute,
    clearRoutes,
    createContext,
    dispatch,
    ALLOWED_METHODS,
    isAllowedMethod,
    CORS_ALLOWED_METHODS,
    applyCorsHeaders,
    isPreflightRequest,
    handlePreflight,
    handleNotFound,
    handleApiError,
    handleResult,
    API_PREFIX,
    isApiPath,
    normalizeApiPath,
    parseRequestUrl,
    getApiRequestPath,
    createRouteResult,
    createNotFoundResult,
    createSuccessResult,
    validateContext,
    executeApiPipeline
};
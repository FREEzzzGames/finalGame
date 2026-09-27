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

const {
    createHttpResult,
    createHttpSuccess,
    createHttpError
} = require('./http-result');

const {
    executeHttpPipeline
} = require('./http-pipeline');

const {
    handleApiRequest
} = require('./request-handler');

const {
    handleApi
} = require('./api-handler');

const {
    createRequestContext
} = require('./request-context');

const {
    createRequestInput
} = require('./request-input');

const {
    normalizeApiResult
} = require('./result-normalizer');

const {
    MIN_STATUS_CODE,
    MAX_STATUS_CODE,
    isValidStatusCode,
    normalizeStatusCode
} = require('./status-code');

const {
    normalizeMethod,
    isMethod
} = require('./method');

const {
    normalizeHeaderName,
    getHeader,
    hasHeader
} = require('./headers');

const {
    registerDefaultRoutes
} = require('./routes');

registerDefaultRoutes();

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
    executeApiPipeline,
    createHttpResult,
    createHttpSuccess,
    createHttpError,
    executeHttpPipeline,
    handleApiRequest,
    handleApi,
    createRequestContext,
    createRequestInput,
    normalizeApiResult,
    MIN_STATUS_CODE,
    MAX_STATUS_CODE,
    isValidStatusCode,
    normalizeStatusCode,
    normalizeMethod,
    isMethod,
    normalizeHeaderName,
    getHeader,
    hasHeader,
    registerDefaultRoutes
};
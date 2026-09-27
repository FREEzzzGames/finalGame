'use strict';

/*
 * FREEzzzGames
 * API configuration module
 *
 * Provides validated configuration values for the API layer.
 * Secrets and authentication configuration remain outside this module.
 */

const DEFAULT_BODY_LIMIT = 1024 * 1024;
const DEFAULT_REQUEST_TIMEOUT = 10000;

const parsePositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return parsed;
};

const API_BODY_LIMIT = parsePositiveInteger(
    process.env.API_BODY_LIMIT,
    DEFAULT_BODY_LIMIT
);

const API_REQUEST_TIMEOUT = parsePositiveInteger(
    process.env.API_REQUEST_TIMEOUT,
    DEFAULT_REQUEST_TIMEOUT
);

const getApiConfig = () => ({
    bodyLimit: API_BODY_LIMIT,
    requestTimeout: API_REQUEST_TIMEOUT
});

module.exports = {
    DEFAULT_BODY_LIMIT,
    DEFAULT_REQUEST_TIMEOUT,
    API_BODY_LIMIT,
    API_REQUEST_TIMEOUT,
    getApiConfig
};
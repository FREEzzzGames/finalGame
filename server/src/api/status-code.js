'use strict';

/*
 * FREEzzzGames
 * HTTP status code module
 *
 * Validates HTTP status codes used by the API layer.
 */

const MIN_STATUS_CODE = 100;
const MAX_STATUS_CODE = 599;

const isValidStatusCode = statusCode => (
    Number.isInteger(statusCode) &&
    statusCode >= MIN_STATUS_CODE &&
    statusCode <= MAX_STATUS_CODE
);

const normalizeStatusCode = (
    statusCode,
    fallback = 200
) => {
    if (isValidStatusCode(statusCode)) {
        return statusCode;
    }

    if (isValidStatusCode(fallback)) {
        return fallback;
    }

    return 200;
};

module.exports = {
    MIN_STATUS_CODE,
    MAX_STATUS_CODE,
    isValidStatusCode,
    normalizeStatusCode
};
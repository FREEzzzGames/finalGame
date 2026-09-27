'use strict';

/*
 * FREEzzzGames
 * API HTTP result module
 *
 * Normalizes API results before they are converted
 * into HTTP responses.
 */

const createHttpResult = ({
    statusCode = 200,
    data = {},
    error = null
} = {}) => {
    const safeStatusCode =
        Number.isInteger(statusCode) &&
        statusCode >= 100 &&
        statusCode <= 599
            ? statusCode
            : 500;

    return {
        statusCode: safeStatusCode,
        data,
        error:
            typeof error === 'string' &&
            error.trim().length > 0
                ? error.trim()
                : null
    };
};

const createHttpSuccess = data => {
    return createHttpResult({
        statusCode: 200,
        data
    });
};

const createHttpError = (
    statusCode,
    error
) => {
    return createHttpResult({
        statusCode,
        error
    });
};

module.exports = {
    createHttpResult,
    createHttpSuccess,
    createHttpError
};
'use strict';

/*
 * FREEzzzGames
 * API result normalizer
 *
 * Converts supported API results into a predictable structure.
 */

const normalizeApiResult = result => {
    if (result === null || result === undefined) {
        return {
            statusCode: 204,
            body: null
        };
    }

    if (
        typeof result !== 'object' ||
        Array.isArray(result)
    ) {
        return {
            statusCode: 200,
            body: result
        };
    }

    const statusCode = Number.isInteger(result.statusCode)
        ? result.statusCode
        : 200;

    return {
        ...result,
        statusCode
    };
};

module.exports = {
    normalizeApiResult
};
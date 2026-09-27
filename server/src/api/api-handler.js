'use strict';

/*
 * FREEzzzGames
 * API handler module
 *
 * Determines whether an HTTP request belongs to the API
 * and executes the API request handler when appropriate.
 */

const {
    getApiRequestPath
} = require('./request-path');

const {
    handleApiRequest
} = require('./request-handler');

const handleApi = async (
    request,
    response
) => {
    const apiPath = getApiRequestPath(request);

    if (apiPath === null) {
        return false;
    }

    const originalUrl = request.url;

    request.url = apiPath;

    try {
        await handleApiRequest(
            request,
            response
        );
    } finally {
        request.url = originalUrl;
    }

    return true;
};

module.exports = {
    handleApi
};
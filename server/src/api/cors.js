'use strict';

/*
 * FREEzzzGames
 * API CORS module
 *
 * Provides the cross-origin policy required by the
 * GitHub Pages client and the public backend.
 *
 * Authentication, routing and game logic are handled
 * separately.
 */

const ALLOWED_METHODS =
    'GET,POST,OPTIONS';

const ALLOWED_HEADERS =
    'Content-Type, Accept, x-telegram-init-data';

const DEFAULT_ALLOWED_ORIGIN =
    'https://freezzzgames.github.io';

const getAllowedOrigin = () => {
    const configuredOrigin =
        process.env.FREEZZGAMES_ALLOWED_ORIGIN;

    if (
        typeof configuredOrigin === 'string' &&
        configuredOrigin.trim().length > 0
    ) {
        return configuredOrigin
            .trim()
            .replace(/\/+$/, '');
    }

    return DEFAULT_ALLOWED_ORIGIN;
};

const applyCorsHeaders = (
    response,
    request = null
) => {
    if (
        !response ||
        typeof response.setHeader !== 'function'
    ) {
        return;
    }

    const allowedOrigin =
        getAllowedOrigin();

    const requestOrigin =
        request &&
        request.headers &&
        typeof request.headers.origin === 'string'
            ? request.headers.origin
            : '';

    /*
     * Only the configured application origin
     * receives the CORS permission.
     */
    const origin =
        requestOrigin === allowedOrigin
            ? requestOrigin
            : allowedOrigin;

    response.setHeader(
        'Access-Control-Allow-Origin',
        origin
    );

    response.setHeader(
        'Access-Control-Allow-Methods',
        ALLOWED_METHODS
    );

    response.setHeader(
        'Access-Control-Allow-Headers',
        ALLOWED_HEADERS
    );

    response.setHeader(
        'Vary',
        'Origin'
    );
};

const isPreflightRequest = request => {
    if (!request || typeof request !== 'object') {
        return false;
    }

    return (
        request.method === 'OPTIONS' &&
        typeof request.headers === 'object'
    );
};

module.exports = {
    ALLOWED_METHODS,
    ALLOWED_HEADERS,
    DEFAULT_ALLOWED_ORIGIN,
    getAllowedOrigin,
    applyCorsHeaders,
    isPreflightRequest
};
'use strict';

/*
 * SYSTeM API client.
 *
 * This module knows HTTP only. Platform credentials are supplied by
 * the caller and are never persisted here.
 */

const DEFAULT_API_BASE_URL =
    'https://universe-fjwj.onrender.com/api';

function getApiBaseUrl() {
    if (
        typeof window !== 'undefined' &&
        typeof window.__FREEZZGAMES_API_BASE_URL__ === 'string'
    ) {
        const configuredUrl =
            window.__FREEZZGAMES_API_BASE_URL__.trim();

        if (configuredUrl) {
            return configuredUrl.replace(/\/+$/, '');
        }
    }

    return DEFAULT_API_BASE_URL;
}

function createApiError(code, status = 0) {
    const error = new Error(code);
    error.code = code;
    error.status = status;
    return error;
}

async function request(path, options = {}) {
    if (typeof path !== 'string' || !path.trim()) {
        throw createApiError('INVALID_API_PATH');
    }

    const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');

    const requestOptions = {
        method: options.method || 'GET',
        headers,
        credentials: 'omit'
    };

    if (options.body !== undefined) {
        requestOptions.body = options.body;
    }

    if (options.signal) {
        requestOptions.signal = options.signal;
    }

    let response;

    try {
        response = await fetch(url, requestOptions);
    } catch {
        throw createApiError('API_REQUEST_FAILED');
    }

    let payload = null;

    try {
        payload = await response.json();
    } catch {
        throw createApiError('INVALID_SERVER_RESPONSE', response.status);
    }

    if (!response.ok) {
        const code =
            payload && typeof payload.error === 'string'
                ? payload.error
                : `HTTP_${response.status}`;
        throw createApiError(code, response.status);
    }

    if (
        !payload ||
        typeof payload !== 'object' ||
        !payload.data ||
        typeof payload.data !== 'object'
    ) {
        throw createApiError('INVALID_SERVER_RESPONSE_DATA', response.status);
    }

    return payload.data;
}

const ApiClient = Object.freeze({ request });

export default ApiClient;

'use strict';

/*
 * FREEzzzGames
 * Request authentication module
 *
 * Extracts raw Telegram Mini App initData from
 * the HTTP request and validates it server-side.
 *
 * The client must never be trusted for user identity.
 */

const {
    validateTelegramInitData
} = require('./telegram-auth');

const AUTH_HEADER = 'x-telegram-init-data';

const getHeaderValue = (headers, name) => {
    if (
        !headers ||
        typeof headers !== 'object'
    ) {
        return null;
    }

    const target = name.toLowerCase();

    for (const key of Object.keys(headers)) {
        if (key.toLowerCase() !== target) {
            continue;
        }

        const value = headers[key];

        if (
            typeof value === 'string' &&
            value.length > 0
        ) {
            return value;
        }

        return null;
    }

    return null;
};

const authenticateRequest = request => {
    if (
        !request ||
        typeof request !== 'object'
    ) {
        return {
            authenticated: false,
            reason: 'INVALID_REQUEST'
        };
    }

    const initData = getHeaderValue(
        request.headers,
        AUTH_HEADER
    );

    if (!initData) {
        return {
            authenticated: false,
            reason: 'MISSING_TELEGRAM_INIT_DATA'
        };
    }

    const result = validateTelegramInitData(
        initData
    );

    if (!result.valid) {
        return {
            authenticated: false,
            reason: result.reason
        };
    }

    return {
        authenticated: true,
        authDate: result.authDate,
        userJson: result.userJson
    };
};

module.exports = {
    AUTH_HEADER,
    authenticateRequest
};
'use strict';

/*
 * FREEzzzGames
 * Telegram authentication
 *
 * Validates Telegram Mini App initData on the server.
 * The client must send the raw initData string.
 *
 * IMPORTANT:
 * - initDataUnsafe must never be used for authentication.
 * - The bot token must never be exposed to the client.
 * - Signature validation is performed server-side.
 */

const crypto = require('crypto');

const MAX_INIT_DATA_AGE_SECONDS = 24 * 60 * 60;

const getBotToken = () => {
    const token =
        process.env.TELEGRAM_BOT_TOKEN ||
        process.env.ID_BOT_TOKEN;

    if (!token || typeof token !== 'string') {
        throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    return token;
};

const buildDataCheckString = params => {
    return Array.from(params.entries())
        .filter(([key]) => key !== 'hash')
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
};

const createSecretKey = botToken => {
    return crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();
};

const createExpectedHash = (dataCheckString, secretKey) => {
    return crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');
};

const safeEqual = (a, b) => {
    if (
        typeof a !== 'string' ||
        typeof b !== 'string' ||
        a.length !== b.length
    ) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(a, 'utf8'),
        Buffer.from(b, 'utf8')
    );
};

const validateAuthDate = authDate => {
    const timestamp = Number.parseInt(authDate, 10);

    if (!Number.isInteger(timestamp)) {
        return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const age = now - timestamp;

    if (age < 0) {
        return false;
    }

    return age <= MAX_INIT_DATA_AGE_SECONDS;
};

const validateTelegramInitData = initData => {
    if (
        typeof initData !== 'string' ||
        initData.length === 0
    ) {
        return {
            valid: false,
            reason: 'INVALID_INIT_DATA'
        };
    }

    let params;

    try {
        params = new URLSearchParams(initData);
    } catch {
        return {
            valid: false,
            reason: 'INVALID_INIT_DATA'
        };
    }

    const receivedHash = params.get('hash');

    if (!receivedHash) {
        return {
            valid: false,
            reason: 'MISSING_HASH'
        };
    }

    const authDate = params.get('auth_date');

    if (!authDate || !validateAuthDate(authDate)) {
        return {
            valid: false,
            reason: 'INVALID_AUTH_DATE'
        };
    }

    let expectedHash;

    try {
        const botToken = getBotToken();
        const secretKey = createSecretKey(botToken);
        const dataCheckString = buildDataCheckString(params);

        expectedHash = createExpectedHash(
            dataCheckString,
            secretKey
        );
    } catch {
        return {
            valid: false,
            reason: 'AUTH_CONFIGURATION_ERROR'
        };
    }

    if (!safeEqual(receivedHash, expectedHash)) {
        return {
            valid: false,
            reason: 'INVALID_SIGNATURE'
        };
    }

    return {
        valid: true,
        authDate,
        userJson: params.get('user') || null
    };
};

module.exports = {
    validateTelegramInitData,
    MAX_INIT_DATA_AGE_SECONDS
};
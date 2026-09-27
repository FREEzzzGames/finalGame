'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const {
    AUTH_HEADER,
    authenticateRequest
} = require('../../src/auth/request-auth');

const TEST_BOT_TOKEN =
    '123456789:TEST_BOT_TOKEN_FOR_UNIT_TEST_ONLY';

const createTelegramInitData = ({
    botToken,
    userJson = '{"id":12345,"first_name":"Test"}',
    authDate = Math.floor(Date.now() / 1000)
} = {}) => {
    const params = new URLSearchParams();

    params.set(
        'auth_date',
        String(authDate)
    );

    params.set(
        'user',
        userJson
    );

    const dataCheckString = Array.from(
        params.entries()
    )
        .sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
        )
        .map(([key, value]) =>
            `${key}=${value}`
        )
        .join('\n');

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

    const hash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    params.set('hash', hash);

    return params.toString();
};

test('authenticateRequest rejects missing Telegram initData', () => {
    const result = authenticateRequest({
        headers: {}
    });

    assert.deepEqual(result, {
        authenticated: false,
        reason: 'MISSING_TELEGRAM_INIT_DATA'
    });
});

test('authenticateRequest rejects invalid Telegram initData', () => {
    const result = authenticateRequest({
        headers: {
            [AUTH_HEADER]: 'invalid-init-data'
        }
    });

    assert.deepEqual(result, {
        authenticated: false,
        reason: 'MISSING_HASH'
    });
});

test('authenticateRequest rejects invalid Telegram signature', () => {
    const previousToken =
        process.env.TELEGRAM_BOT_TOKEN;

    process.env.TELEGRAM_BOT_TOKEN =
        TEST_BOT_TOKEN;

    try {
        const initData =
            createTelegramInitData({
                botToken: TEST_BOT_TOKEN
            });

        const tampered =
            `${initData.slice(0, -1)}0`;

        const result = authenticateRequest({
            headers: {
                [AUTH_HEADER]: tampered
            }
        });

        assert.equal(
            result.authenticated,
            false
        );

        assert.equal(
            result.reason,
            'INVALID_SIGNATURE'
        );
    } finally {
        if (previousToken === undefined) {
            delete process.env.TELEGRAM_BOT_TOKEN;
        } else {
            process.env.TELEGRAM_BOT_TOKEN =
                previousToken;
        }
    }
});

test('authenticateRequest accepts valid Telegram initData', () => {
    const previousToken =
        process.env.TELEGRAM_BOT_TOKEN;

    process.env.TELEGRAM_BOT_TOKEN =
        TEST_BOT_TOKEN;

    try {
        const userJson =
            '{"id":12345,"first_name":"Test"}';

        const initData =
            createTelegramInitData({
                botToken: TEST_BOT_TOKEN,
                userJson
            });

        const result = authenticateRequest({
            headers: {
                [AUTH_HEADER]: initData
            }
        });

        assert.equal(
            result.authenticated,
            true
        );

        assert.equal(
            result.userJson,
            userJson
        );

        assert.equal(
            typeof result.authDate,
            'string'
        );
    } finally {
        if (previousToken === undefined) {
            delete process.env.TELEGRAM_BOT_TOKEN;
        } else {
            process.env.TELEGRAM_BOT_TOKEN =
                previousToken;
        }
    }
});
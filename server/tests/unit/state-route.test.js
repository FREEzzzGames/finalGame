'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const {
    AUTH_HEADER
} = require('../../src/auth/request-auth');

const {
    getState
} = require('../../src/users/state-route');

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
        .createHmac(
            'sha256',
            'WebAppData'
        )
        .update(botToken)
        .digest();

    const hash = crypto
        .createHmac(
            'sha256',
            secretKey
        )
        .update(dataCheckString)
        .digest('hex');

    params.set(
        'hash',
        hash
    );

    return params.toString();
};

test('getState rejects unauthenticated request', () => {
    const result = getState({
        request: {
            headers: {}
        }
    });

    assert.deepEqual(
        result,
        {
            statusCode: 401,
            error: 'MISSING_TELEGRAM_INIT_DATA'
        }
    );
});

test('getState returns initial state for authenticated Telegram user', () => {
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

        const result = getState({
            request: {
                headers: {
                    [AUTH_HEADER]: initData
                }
            }
        });

        assert.equal(
            result.statusCode,
            200
        );

        assert.deepEqual(
            result.data,
            {
                state: {
                    version: 1,
                    economy: {
                        balance: 0
                    }
                }
            }
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

test('getState rejects invalid Telegram user data', () => {
    const previousToken =
        process.env.TELEGRAM_BOT_TOKEN;

    process.env.TELEGRAM_BOT_TOKEN =
        TEST_BOT_TOKEN;

    try {
        const userJson =
            '{"first_name":"Test"}';

        const initData =
            createTelegramInitData({
                botToken: TEST_BOT_TOKEN,
                userJson
            });

        const result = getState({
            request: {
                headers: {
                    [AUTH_HEADER]: initData
                }
            }
        });

        assert.deepEqual(
            result,
            {
                statusCode: 401,
                error: 'INVALID_TELEGRAM_USER'
            }
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
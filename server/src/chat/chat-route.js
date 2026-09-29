'use strict';

/*
 * FREEzzzGames
 * Geek Chat API route
 *
 * Accepts authenticated public-chat messages and mirrors
 * them to the configured Telegram forum topic.
 */

const {
    authenticateRequest
} = require('../auth/request-auth');

const {
    sendTelegramMessage,
    normalizeRoom,
    MAX_AUTHOR_LENGTH,
    MAX_MESSAGE_LENGTH
} = require('./telegram-bridge');

const getString = (value, maxLength) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().slice(0, maxLength);
};

const parseTelegramUser = userJson => {
    if (
        typeof userJson !== 'string' ||
        !userJson
    ) {
        return null;
    }

    try {
        const user = JSON.parse(userJson);

        if (
            !user ||
            typeof user !== 'object' ||
            Array.isArray(user) ||
            user.id === undefined ||
            user.id === null
        ) {
            return null;
        }

        return user;
    } catch {
        return null;
    }
};

const postMessage = async context => {
    if (
        !context ||
        typeof context !== 'object' ||
        !context.request ||
        !context.body
    ) {
        return {
            statusCode: 400,
            error: 'INVALID_REQUEST'
        };
    }

    const authentication =
        authenticateRequest(context.request);

    if (!authentication.authenticated) {
        return {
            statusCode: 401,
            error: authentication.reason
        };
    }

    const telegramUser =
        parseTelegramUser(
            authentication.userJson
        );

    if (!telegramUser) {
        return {
            statusCode: 401,
            error: 'INVALID_TELEGRAM_USER'
        };
    }

    const room = normalizeRoom(
        context.body.room
    );

    if (!room) {
        return {
            statusCode: 400,
            error: 'INVALID_CHAT_ROOM'
        };
    }

    const text = getString(
        context.body.text,
        MAX_MESSAGE_LENGTH
    );

    if (!text) {
        return {
            statusCode: 400,
            error: 'EMPTY_MESSAGE'
        };
    }

    const username =
        getString(
            telegramUser.username,
            MAX_AUTHOR_LENGTH
        );

    const displayName = username ||
        [
            getString(
                telegramUser.first_name,
                MAX_AUTHOR_LENGTH
            ),
            getString(
                telegramUser.last_name,
                MAX_AUTHOR_LENGTH
            )
        ].filter(Boolean).join(' ') ||
        `Player ${telegramUser.id}`;

    const result =
        await sendTelegramMessage({
            room,
            author: displayName,
            text
        });

    if (!result.sent && !result.skipped) {
        return {
            statusCode: 502,
            error: result.reason
        };
    }

    return {
        statusCode: 200,
        data: {
            accepted: true,
            archivedToTelegram: result.sent,
            room,
            threadId: result.threadId ?? null
        }
    };
};

module.exports = {
    postMessage
};

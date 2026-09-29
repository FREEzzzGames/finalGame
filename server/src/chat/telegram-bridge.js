'use strict';

/*
 * FREEzzzGames
 * Telegram chat bridge
 *
 * Routes public Geek Chat messages to Telegram forum topics.
 * The bot token is server-side only.
 */

const ROOM_CONFIG = Object.freeze({
    main: Object.freeze({
        key: 'main',
        threadEnv: 'TELEGRAM_MAIN_THREAD_ID',
        fallbackThreadId: 2
    }),
    games: Object.freeze({
        key: 'games',
        threadEnv: 'TELEGRAM_GAMES_THREAD_ID',
        fallbackThreadId: 3
    }),
    relax: Object.freeze({
        key: 'relax',
        threadEnv: 'TELEGRAM_RELAX_THREAD_ID',
        fallbackThreadId: 4
    }),
    global: Object.freeze({
        key: 'main',
        threadEnv: 'TELEGRAM_MAIN_THREAD_ID',
        fallbackThreadId: 2
    })
});

const MAX_AUTHOR_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 500;

const getConfig = () => {
    const token =
        process.env.ID_BOT_TOKEN ||
        process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
        process.env.TELEGRAM_CHAT_ID ||
        '-1004308818461';

    if (!token || typeof token !== 'string') {
        return {
            configured: false,
            reason: 'TELEGRAM_BOT_TOKEN_NOT_CONFIGURED'
        };
    }

    return {
        configured: true,
        token,
        chatId
    };
};

const normalizeRoom = room => {
    if (
        typeof room !== 'string' ||
        !room.trim()
    ) {
        return 'main';
    }

    const key = room.trim().toLowerCase();

    return ROOM_CONFIG[key]
        ? ROOM_CONFIG[key].key
        : null;
};

const getThreadId = room => {
    const normalizedRoom = normalizeRoom(room);

    if (!normalizedRoom) {
        return null;
    }

    const config = ROOM_CONFIG[normalizedRoom];
    const configuredValue =
        process.env[config.threadEnv];

    if (
        typeof configuredValue === 'string' &&
        configuredValue.trim()
    ) {
        const parsed = Number.parseInt(
            configuredValue,
            10
        );

        if (Number.isInteger(parsed) && parsed > 0) {
            return parsed;
        }
    }

    return config.fallbackThreadId;
};

const sanitizeText = (value, maxLength) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value
        .replace(/\u0000/g, '')
        .trim()
        .slice(0, maxLength);
};

const sendTelegramMessage = async ({
    room,
    author,
    text
}) => {
    const config = getConfig();

    if (!config.configured) {
        return {
            sent: false,
            skipped: true,
            reason: config.reason
        };
    }

    const normalizedRoom = normalizeRoom(room);
    const threadId = getThreadId(room);

    if (!normalizedRoom || !threadId) {
        return {
            sent: false,
            skipped: false,
            reason: 'INVALID_CHAT_ROOM'
        };
    }

    const safeAuthor =
        sanitizeText(author, MAX_AUTHOR_LENGTH) ||
        'Игрок';

    const safeText =
        sanitizeText(text, MAX_MESSAGE_LENGTH);

    if (!safeText) {
        return {
            sent: false,
            skipped: false,
            reason: 'EMPTY_MESSAGE'
        };
    }

    const body = {
        chat_id: config.chatId,
        message_thread_id: threadId,
        text: `💬 ${safeAuthor}: ${safeText}`,
        disable_web_page_preview: true
    };

    let response;

    try {
        response = await fetch(
            `https://api.telegram.org/bot${config.token}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );
    } catch {
        return {
            sent: false,
            skipped: false,
            reason: 'TELEGRAM_REQUEST_FAILED'
        };
    }

    let payload;

    try {
        payload = await response.json();
    } catch {
        return {
            sent: false,
            skipped: false,
            reason: 'INVALID_TELEGRAM_RESPONSE'
        };
    }

    if (
        !response.ok ||
        !payload ||
        payload.ok !== true
    ) {
        return {
            sent: false,
            skipped: false,
            reason: 'TELEGRAM_SEND_FAILED',
            telegramError:
                typeof payload?.description === 'string'
                    ? payload.description
                    : null
        };
    }

    return {
        sent: true,
        skipped: false,
        room: normalizedRoom,
        chatId: config.chatId,
        threadId,
        messageId:
            payload.result?.message_id ?? null
    };
};

module.exports = {
    ROOM_CONFIG,
    MAX_AUTHOR_LENGTH,
    MAX_MESSAGE_LENGTH,
    normalizeRoom,
    getThreadId,
    sendTelegramMessage
};

'use strict';

/*
 * FREEzzzGames
 * Player state API route
 *
 * Reads the authenticated Telegram user and creates
 * the initial server-authoritative game state.
 *
 * Persistent storage is intentionally not connected yet.
 * This module is the first API bridge between authentication
 * and the game-state model.
 */

const {
    authenticateRequest
} = require('../auth/request-auth');

const {
    createGameState
} = require('./game-state');

const parseTelegramUser = userJson => {
    if (
        typeof userJson !== 'string' ||
        userJson.length === 0
    ) {
        return null;
    }

    let user;

    try {
        user = JSON.parse(userJson);
    } catch {
        return null;
    }

    if (
        !user ||
        typeof user !== 'object' ||
        Array.isArray(user)
    ) {
        return null;
    }

    if (
        user.id === undefined ||
        user.id === null
    ) {
        return null;
    }

    return user;
};

const getState = context => {
    if (
        !context ||
        typeof context !== 'object' ||
        !context.request
    ) {
        return {
            statusCode: 400,
            error: 'INVALID_REQUEST'
        };
    }

    const authentication =
        authenticateRequest(
            context.request
        );

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

    const gameState = createGameState({
        userId: String(telegramUser.id)
    });

    return {
        statusCode: 200,
        data: {
            state: {
                version: gameState.version,
                economy: {
                    balance:
                        gameState.economy.balance
                }
            }
        }
    };
};

module.exports = {
    getState
};
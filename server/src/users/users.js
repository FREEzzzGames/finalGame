'use strict';

/*
 * FREEzzzGames
 * Users module
 *
 * Provides the minimal server-side user model.
 * Persistent storage is handled separately.
 */

const createUser = ({
    telegramUserId,
    username = null
}) => {
    if (
        telegramUserId === undefined ||
        telegramUserId === null ||
        String(telegramUserId).trim() === ''
    ) {
        throw new Error('telegramUserId is required');
    }

    return {
        telegramUserId: String(telegramUserId),
        username:
            typeof username === 'string' && username.length > 0
                ? username
                : null
    };
};

const normalizeUsername = username => {
    if (typeof username !== 'string') {
        return null;
    }

    const value = username.trim();

    return value.length > 0 ? value : null;
};

module.exports = {
    createUser,
    normalizeUsername
};
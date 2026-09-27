'use strict';

/*
 * FREEzzzGames
 * User profile module
 *
 * Builds the minimal public game profile from
 * already validated Telegram user data.
 *
 * No persistence is performed here.
 */

const createProfile = ({
    telegramUserId,
    username = null,
    firstName = null,
    lastName = null
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
            typeof username === 'string' && username.trim().length > 0
                ? username.trim()
                : null,
        firstName:
            typeof firstName === 'string' && firstName.trim().length > 0
                ? firstName.trim()
                : null,
        lastName:
            typeof lastName === 'string' && lastName.trim().length > 0
                ? lastName.trim()
                : null
    };
};

module.exports = {
    createProfile
};
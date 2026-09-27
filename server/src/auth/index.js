'use strict';

/*
 * FREEzzzGames
 * Authentication module
 *
 * Central authentication entry point.
 * Telegram validation is implemented separately.
 */

const {
    validateTelegramInitData,
    MAX_INIT_DATA_AGE_SECONDS
} = require('./telegram-auth');

module.exports = {
    validateTelegramInitData,
    MAX_INIT_DATA_AGE_SECONDS
};
'use strict';

/*
 * FREEzzzGames
 * Users module
 *
 * Central entry point for user-related functionality.
 */

const {
    createUser,
    normalizeUsername
} = require('./users');

module.exports = {
    createUser,
    normalizeUsername
};
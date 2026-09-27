'use strict';

/*
 * FREEzzzGames
 * Economy module
 *
 * Central entry point for server-side economy functionality.
 */

const {
    createEconomyState,
    canAfford
} = require('./economy');

const {
    createTransaction,
    isCredit,
    isDebit
} = require('./transactions');

module.exports = {
    createEconomyState,
    canAfford,
    createTransaction,
    isCredit,
    isDebit
};
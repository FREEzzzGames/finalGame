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

const {
    validateTransaction
} = require('./validation');

const {
    MAX_TRANSACTION_AMOUNT,
    isAllowedAmount
} = require('./limits');

const {
    hasSufficientBalance,
    calculateCreditBalance,
    calculateDebitBalance
} = require('./balance');

module.exports = {
    createEconomyState,
    canAfford,
    createTransaction,
    isCredit,
    isDebit,
    validateTransaction,
    MAX_TRANSACTION_AMOUNT,
    isAllowedAmount,
    hasSufficientBalance,
    calculateCreditBalance,
    calculateDebitBalance
};
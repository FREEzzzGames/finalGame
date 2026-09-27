'use strict';

/*
 * FREEzzzGames
 * Economy transaction check module
 *
 * Performs the final validation step before a transaction
 * can be passed to an execution layer.
 *
 * No balance changes or persistence happen here.
 */

const {
    validateTransaction
} = require('./validation');

const checkTransaction = transaction => {
    const validation = validateTransaction(transaction);

    if (!validation.valid) {
        return {
            valid: false,
            reason: validation.reason
        };
    }

    return {
        valid: true,
        transaction: {
            userId: transaction.userId.trim(),
            amount: transaction.amount,
            reason: transaction.reason.trim()
        }
    };
};

module.exports = {
    checkTransaction
};
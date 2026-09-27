'use strict';

/*
 * FREEzzzGames
 * Economy validation module
 *
 * Validates server-side economy transactions before execution.
 * Persistence and atomic balance changes are handled separately.
 */

const {
    isAllowedAmount
} = require('./limits');

const validateTransaction = transaction => {
    if (
        transaction === null ||
        typeof transaction !== 'object'
    ) {
        return {
            valid: false,
            reason: 'INVALID_TRANSACTION'
        };
    }

    if (
        typeof transaction.userId !== 'string' ||
        transaction.userId.trim().length === 0
    ) {
        return {
            valid: false,
            reason: 'INVALID_USER_ID'
        };
    }

    if (!Number.isSafeInteger(transaction.amount)) {
        return {
            valid: false,
            reason: 'INVALID_AMOUNT'
        };
    }

    if (!isAllowedAmount(transaction.amount)) {
        return {
            valid: false,
            reason: 'AMOUNT_LIMIT_EXCEEDED'
        };
    }

    if (
        typeof transaction.reason !== 'string' ||
        transaction.reason.trim().length === 0
    ) {
        return {
            valid: false,
            reason: 'INVALID_REASON'
        };
    }

    return {
        valid: true
    };
};

module.exports = {
    validateTransaction
};
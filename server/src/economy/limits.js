'use strict';

/*
 * FREEzzzGames
 * Economy limits module
 *
 * Defines safe server-side transaction limits.
 * Balance persistence and atomic execution are handled separately.
 */

const MAX_TRANSACTION_AMOUNT = 1_000_000;

const isAllowedAmount = amount => {
    if (!Number.isSafeInteger(amount)) {
        return false;
    }

    if (amount === 0) {
        return false;
    }

    return Math.abs(amount) <= MAX_TRANSACTION_AMOUNT;
};

module.exports = {
    MAX_TRANSACTION_AMOUNT,
    isAllowedAmount
};
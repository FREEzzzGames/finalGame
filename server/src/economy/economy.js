'use strict';

/*
 * FREEzzzGames
 * Server economy module
 *
 * Server-authoritative economy state.
 * Persistent storage and transactions are handled separately.
 */

const createEconomyState = ({
    balance = 0
} = {}) => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0
    ) {
        throw new Error('Invalid economy balance');
    }

    return {
        balance
    };
};

const canAfford = (balance, amount) => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0
    ) {
        return false;
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount < 0
    ) {
        return false;
    }

    return balance >= amount;
};

module.exports = {
    createEconomyState,
    canAfford
};
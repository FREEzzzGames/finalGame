'use strict';

/*
 * FREEzzzGames
 * Player game state module
 *
 * Defines the minimal server-authoritative state
 * required for the first playable game loop.
 *
 * Persistence is handled separately.
 * Authentication is handled separately.
 */

const MAX_BALANCE = Number.MAX_SAFE_INTEGER;

const validateUserId = userId => {
    if (
        userId === undefined ||
        userId === null ||
        String(userId).trim().length === 0
    ) {
        throw new Error('userId is required');
    }

    return String(userId);
};

const validateBalance = balance => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0 ||
        balance > MAX_BALANCE
    ) {
        throw new Error('Invalid game balance');
    }

    return balance;
};

const createGameState = ({
    userId,
    balance = 0
} = {}) => {
    return {
        version: 1,
        userId: validateUserId(userId),
        economy: {
            balance: validateBalance(balance)
        }
    };
};

const addBalance = (state, amount) => {
    if (
        state === null ||
        typeof state !== 'object'
    ) {
        throw new Error('Invalid game state');
    }

    if (
        !state.economy ||
        typeof state.economy !== 'object'
    ) {
        throw new Error('Invalid economy state');
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount < 0
    ) {
        throw new Error('Invalid balance amount');
    }

    const currentBalance = validateBalance(
        state.economy.balance
    );

    if (
        amount >
        MAX_BALANCE - currentBalance
    ) {
        throw new Error('Balance overflow');
    }

    return {
        ...state,
        economy: {
            ...state.economy,
            balance: currentBalance + amount
        }
    };
};

module.exports = {
    MAX_BALANCE,
    createGameState,
    addBalance
};
'use strict';

/*
 * FREEzzzGames
 * Economy balance module
 *
 * Provides safe balance checks.
 * Actual balance changes are handled by atomic transactions.
 */

const hasSufficientBalance = (balance, amount) => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0
    ) {
        return false;
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {
        return false;
    }

    return balance >= amount;
};

const calculateCreditBalance = (balance, amount) => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0
    ) {
        throw new Error('Invalid balance');
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {
        throw new Error('Invalid credit amount');
    }

    const nextBalance = balance + amount;

    if (!Number.isSafeInteger(nextBalance)) {
        throw new Error('Balance overflow');
    }

    return nextBalance;
};

const calculateDebitBalance = (balance, amount) => {
    if (
        !Number.isSafeInteger(balance) ||
        balance < 0
    ) {
        throw new Error('Invalid balance');
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount <= 0
    ) {
        throw new Error('Invalid debit amount');
    }

    if (balance < amount) {
        throw new Error('Insufficient balance');
    }

    return balance - amount;
};

module.exports = {
    hasSufficientBalance,
    calculateCreditBalance,
    calculateDebitBalance
};
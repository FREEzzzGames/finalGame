'use strict';

/*
 * FREEzzzGames
 * Economy transactions module
 *
 * Creates validated economy operations.
 * Actual persistence and atomic execution are handled separately.
 */

const createTransaction = ({
    userId,
    amount,
    reason
}) => {
    if (
        userId === undefined ||
        userId === null ||
        String(userId).trim() === ''
    ) {
        throw new Error('userId is required');
    }

    if (
        !Number.isSafeInteger(amount) ||
        amount === 0
    ) {
        throw new Error('Invalid transaction amount');
    }

    if (
        typeof reason !== 'string' ||
        reason.trim().length === 0
    ) {
        throw new Error('Transaction reason is required');
    }

    return {
        userId: String(userId),
        amount,
        reason: reason.trim()
    };
};

const isCredit = transaction => {
    return (
        transaction !== null &&
        typeof transaction === 'object' &&
        Number.isSafeInteger(transaction.amount) &&
        transaction.amount > 0
    );
};

const isDebit = transaction => {
    return (
        transaction !== null &&
        typeof transaction === 'object' &&
        Number.isSafeInteger(transaction.amount) &&
        transaction.amount < 0
    );
};

module.exports = {
    createTransaction,
    isCredit,
    isDebit
};
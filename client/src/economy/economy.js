'use strict';

/*
 * FREEzzzGames
 * Economy manager
 *
 * Main World economy state.
 * This module manages only the local economy state.
 * Authoritative server validation will be added separately.
 */

const DEFAULT_BALANCE = 0;
const MIN_BALANCE = 0;

class Economy {
    constructor(options = {}) {
        const initialBalance = Number.isFinite(options.balance)
            ? options.balance
            : DEFAULT_BALANCE;

        this.balance = Math.max(
            MIN_BALANCE,
            initialBalance
        );
    }

    getBalance() {
        return this.balance;
    }

    getState() {
        return {
            balance: this.balance
        };
    }

    canAfford(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            return false;
        }

        return this.balance >= amount;
    }

    add(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            return false;
        }

        this.balance += amount;

        return true;
    }

    spend(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            return false;
        }

        if (!this.canAfford(amount)) {
            return false;
        }

        this.balance -= amount;

        return true;
    }

    setBalance(amount) {
        if (!Number.isFinite(amount) || amount < MIN_BALANCE) {
            return false;
        }

        this.balance = amount;

        return true;
    }

    reset() {
        this.balance = DEFAULT_BALANCE;

        return this.getState();
    }
}

const economy = new Economy();

export {
    Economy,
    DEFAULT_BALANCE,
    MIN_BALANCE
};

export default economy;
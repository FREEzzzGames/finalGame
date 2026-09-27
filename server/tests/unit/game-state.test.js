'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
    MAX_BALANCE,
    createGameState,
    addBalance
} = require('../../src/users/game-state');

test('createGameState creates a valid initial state', () => {
    const state = createGameState({
        userId: '12345'
    });

    assert.deepEqual(state, {
        version: 1,
        userId: '12345',
        economy: {
            balance: 0
        }
    });
});

test('createGameState accepts a valid balance', () => {
    const state = createGameState({
        userId: '12345',
        balance: 100
    });

    assert.equal(
        state.economy.balance,
        100
    );
});

test('addBalance increases balance without mutating original state', () => {
    const state = createGameState({
        userId: '12345',
        balance: 100
    });

    const updatedState = addBalance(
        state,
        50
    );

    assert.equal(
        state.economy.balance,
        100
    );

    assert.equal(
        updatedState.economy.balance,
        150
    );
});

test('createGameState rejects invalid userId', () => {
    assert.throws(
        () => createGameState({
            userId: ''
        }),
        /userId is required/
    );
});

test('createGameState rejects invalid balance', () => {
    assert.throws(
        () => createGameState({
            userId: '12345',
            balance: -1
        }),
        /Invalid game balance/
    );
});

test('addBalance rejects invalid amount', () => {
    const state = createGameState({
        userId: '12345'
    });

    assert.throws(
        () => addBalance(
            state,
            -10
        ),
        /Invalid balance amount/
    );
});

test('addBalance rejects balance overflow', () => {
    const state = createGameState({
        userId: '12345',
        balance: MAX_BALANCE
    });

    assert.throws(
        () => addBalance(
            state,
            1
        ),
        /Balance overflow/
    );
});
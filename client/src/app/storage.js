'use strict';

/*
 * FREEzzzGames
 * Local game storage
 *
 * Временный клиентский слой сохранения.
 *
 * Важно:
 * - не является авторитетным хранилищем;
 * - не используется для безопасности;
 * - серверное сохранение будет подключено отдельно;
 * - повреждённые данные не должны ломать игру.
 */

const STORAGE_KEY =
    'freezzgames.game-state.v1';

const DEFAULT_STATE = {
    balance: 0,
    farmLevel: 0
};

function getStorage() {
    try {
        if (
            typeof window === 'undefined' ||
            !window.localStorage
        ) {
            return null;
        }

        return window.localStorage;
    } catch {
        return null;
    }
}

function normalizeInteger(value, fallback) {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        !Number.isInteger(value) ||
        value < 0
    ) {
        return fallback;
    }

    return value;
}

function normalizeState(value) {
    if (
        !value ||
        typeof value !== 'object'
    ) {
        return {
            ...DEFAULT_STATE
        };
    }

    return {
        balance: normalizeInteger(
            value.balance,
            DEFAULT_STATE.balance
        ),

        farmLevel: normalizeInteger(
            value.farmLevel,
            DEFAULT_STATE.farmLevel
        )
    };
}

function loadState() {
    const storage =
        getStorage();

    if (!storage) {
        return {
            ...DEFAULT_STATE
        };
    }

    try {
        const raw =
            storage.getItem(
                STORAGE_KEY
            );

        if (!raw) {
            return {
                ...DEFAULT_STATE
            };
        }

        const parsed =
            JSON.parse(raw);

        return normalizeState(
            parsed
        );
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Local save could not be loaded:',
            error
        );

        return {
            ...DEFAULT_STATE
        };
    }
}

function saveState(state) {
    const storage =
        getStorage();

    if (!storage) {
        return false;
    }

    const normalized =
        normalizeState(state);

    try {
        storage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );

        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Local save could not be written:',
            error
        );

        return false;
    }
}

function clearState() {
    const storage =
        getStorage();

    if (!storage) {
        return false;
    }

    try {
        storage.removeItem(
            STORAGE_KEY
        );

        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Local save could not be cleared:',
            error
        );

        return false;
    }
}

export {
    STORAGE_KEY,
    DEFAULT_STATE,
    loadState,
    saveState,
    clearState,
    normalizeState
};

export default {
    STORAGE_KEY,
    DEFAULT_STATE,
    loadState,
    saveState,
    clearState,
    normalizeState
};
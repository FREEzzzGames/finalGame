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

const LORE_PROGRESS_KEY =
    'freezzgames.world-lore.v1';

const DEFAULT_CITY_STATE = {
    farmLevel: 0,

    buildings: {
        workshop: false,
        stadium: false,
        studio: false,
        shopping: false
    },

    lastSavedAt: 0
};

const DEFAULT_STATE = {
    balance: 0,
    cities: {
        surface: { ...DEFAULT_CITY_STATE, buildings: { ...DEFAULT_CITY_STATE.buildings } },
        undercity: { ...DEFAULT_CITY_STATE, buildings: { ...DEFAULT_CITY_STATE.buildings } }
    },
    lastSavedAt: 0
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

function normalizeTimestamp(value) {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < 0
    ) {
        return 0;
    }

    return Math.floor(value);
}

function normalizeBoolean(value, fallback) {
    return typeof value === 'boolean'
        ? value
        : fallback;
}

function normalizeCityState(value, fallback = DEFAULT_CITY_STATE) {
    const source = value && typeof value === 'object' ? value : {};
    const sourceBuildings = source.buildings && typeof source.buildings === 'object'
        ? source.buildings
        : {};

    return {
        farmLevel: normalizeInteger(source.farmLevel, fallback.farmLevel),
        buildings: {
            workshop: normalizeBoolean(sourceBuildings.workshop, fallback.buildings.workshop),
            stadium: normalizeBoolean(sourceBuildings.stadium, fallback.buildings.stadium),
            studio: normalizeBoolean(sourceBuildings.studio, fallback.buildings.studio),
            shopping: normalizeBoolean(sourceBuildings.shopping, fallback.buildings.shopping)
        },
        lastSavedAt: normalizeTimestamp(source.lastSavedAt)
    };
}

function normalizeState(value) {
    if (
        !value ||
        typeof value !== 'object'
    ) {
        return normalizeState({ balance: DEFAULT_STATE.balance });
    }

    const legacySurface = {
        farmLevel: value.farmLevel,
        buildings: value.buildings,
        lastSavedAt: value.lastSavedAt
    };
    const savedCities = value.cities && typeof value.cities === 'object'
        ? value.cities
        : {};
    const surface = normalizeCityState(
        savedCities.surface || legacySurface
    );
    const undercity = normalizeCityState(savedCities.undercity);

    return {
        balance: normalizeInteger(
            value.balance,
            DEFAULT_STATE.balance
        ),

        cities: {
            surface,
            undercity
        },

        // Legacy aliases keep old client modules and existing saves compatible.
        farmLevel: surface.farmLevel,
        buildings: { ...surface.buildings },

        lastSavedAt: normalizeTimestamp(
            value.lastSavedAt,
        )
    };
}

function normalizeLoreProgress(value) {
    const seenEvents =
        value &&
        typeof value === 'object' &&
        Array.isArray(value.seenEvents)
            ? value.seenEvents.filter(
                eventId =>
                    typeof eventId === 'string' &&
                    eventId.trim()
            )
            : [];

    return {
        seenEvents: [...new Set(seenEvents)]
    };
}

function loadLoreProgress() {
    const storage = getStorage();

    if (!storage) {
        return normalizeLoreProgress(null);
    }

    try {
        const raw = storage.getItem(LORE_PROGRESS_KEY);
        return normalizeLoreProgress(raw ? JSON.parse(raw) : null);
    } catch (error) {
        console.warn(
            '[FREEzzzGames] World lore progress could not be loaded:',
            error
        );

        return normalizeLoreProgress(null);
    }
}

function saveLoreProgress(progress) {
    const storage = getStorage();

    if (!storage) {
        return false;
    }

    try {
        storage.setItem(
            LORE_PROGRESS_KEY,
            JSON.stringify(normalizeLoreProgress(progress))
        );

        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] World lore progress could not be saved:',
            error
        );

        return false;
    }
}

function loadState() {
    const storage =
        getStorage();

    if (!storage) {
        return normalizeState(
            DEFAULT_STATE
        );
    }

    try {
        const raw =
            storage.getItem(
                STORAGE_KEY
            );

        if (!raw) {
            return normalizeState(
                DEFAULT_STATE
            );
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

        return normalizeState(
            DEFAULT_STATE
        );
    }
}

function saveState(state) {
    const storage =
        getStorage();

    if (!storage) {
        return false;
    }

    const normalized =
        normalizeState({
            ...state,
            lastSavedAt: Date.now()
        });

    try {
        storage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );

        window.dispatchEvent(new Event('systemprogresschange'));

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
    LORE_PROGRESS_KEY,
    DEFAULT_STATE,
    DEFAULT_CITY_STATE,
    loadState,
    saveState,
    clearState,
    normalizeState,
    normalizeCityState,
    normalizeLoreProgress,
    loadLoreProgress,
    saveLoreProgress
};

export default {
    STORAGE_KEY,
    LORE_PROGRESS_KEY,
    DEFAULT_STATE,
    loadState,
    saveState,
    clearState,
    normalizeState,
    normalizeLoreProgress,
    loadLoreProgress,
    saveLoreProgress
};

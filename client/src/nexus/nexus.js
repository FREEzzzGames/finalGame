'use strict';

const NEXUS_STATE_KEY = 'system.nexus-state.v1';

const CITY_SIDES = Object.freeze({
    surface: Object.freeze({ id: 'surface', localizationKey: 'nexus.surface' }),
    undercity: Object.freeze({ id: 'undercity', localizationKey: 'nexus.undercity' })
});

const FACTIONS = Object.freeze({
    government: Object.freeze({ id: 'government', localizationKey: 'nexus.factions.government' }),
    mafia: Object.freeze({ id: 'mafia', localizationKey: 'nexus.factions.mafia' })
});

const CITY_BUILDING_ICONS = Object.freeze({
    'nexus-core': '🏙️',
    'undercity-core': '⚙️',
    'civic-center': '🏛️',
    'transit-hub': '🚇',
    'medical-center': '⚕️',
    'network-control': '🌐',
    'power-station': '⚡',
    'central-bank': '🏦',
    'holding-company': '💼',
    casino: '🎰',
    'night-club': '🌃',
    'logistics-company': '🚚',
    'private-finance': '💳',
    'luxury-hotel': '🏨',
    'maintenance-station': '🛠️',
    'research-lab': '🧪',
    'security-bunker': '🛡️',
    'surveillance-node': '📡',
    'grid-control': '🔌',
    'archive-vault': '🗄️',
    'smuggling-hub': '📦',
    'hidden-factory': '🏭',
    'black-market': '🛒',
    'underground-casino': '🎲',
    'arms-depot': '🔫',
    'mafia-hq': '🕴️'
});

const DISTRICT_SCHEMA = Object.freeze({
    coreSlots: 1,
    developmentSlots: 6,
    influenceEnabled: true,
    missionsEnabled: true,
    economicLinksEnabled: true
});

const CITY_SIDE_DATA = Object.freeze({
    surface: Object.freeze({
        id: 'surface',
        district: Object.freeze({
            id: 'nexus-surface-01',
            core: 'nexus-core',
            developmentSlots: 6,
            buildingsByFaction: Object.freeze({
                government: Object.freeze([
                    'civic-center', 'transit-hub', 'medical-center',
                    'network-control', 'power-station', 'central-bank'
                ]),
                mafia: Object.freeze([
                    'holding-company', 'casino', 'night-club',
                    'logistics-company', 'private-finance', 'luxury-hotel'
                ])
            })
        })
    }),
    undercity: Object.freeze({
        id: 'undercity',
        district: Object.freeze({
            id: 'nexus-undercity-01',
            core: 'undercity-core',
            developmentSlots: 6,
            buildingsByFaction: Object.freeze({
                government: Object.freeze([
                    'maintenance-station', 'research-lab', 'security-bunker',
                    'surveillance-node', 'grid-control', 'archive-vault'
                ]),
                mafia: Object.freeze([
                    'smuggling-hub', 'hidden-factory', 'black-market',
                    'underground-casino', 'arms-depot', 'mafia-hq'
                ])
            })
        })
    })
});

const MISSION_BLUEPRINTS = Object.freeze([
    Object.freeze({ id: 'audit-transit-link', districtId: 'nexus-surface-01', factionId: 'government', status: 'locked' }),
    Object.freeze({ id: 'trace-grid-signal', districtId: 'nexus-undercity-01', factionId: 'mafia', status: 'locked' })
]);

const MISSION_BY_ID = new Map(
    MISSION_BLUEPRINTS.map(mission => [mission.id, mission])
);

const ECONOMIC_LINKS = Object.freeze([
    Object.freeze({
        id: 'transit-logistics-market',
        path: Object.freeze([
            'surface.transit-hub',
            'undercity.smuggling-hub',
            'undercity.black-market',
            'surface.night-club'
        ])
    }),
    Object.freeze({
        id: 'power-grid',
        path: Object.freeze(['surface.power-station', 'undercity.grid-control'])
    })
]);

const MISSION_SCHEMA = Object.freeze({
    requiredFields: Object.freeze(['id', 'districtId', 'factionId', 'status']),
    statuses: Object.freeze(['locked', 'available', 'active', 'completed'])
});

const FACTION_BUILDING_INCOME_MULTIPLIER = 1.1;
let memoryState;

function getStorage() {
    try {
        return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
        return null;
    }
}

function normalizeNexusState(value) {
    const sourceMissions = value?.missions && typeof value.missions === 'object'
        ? value.missions
        : {};

    return {
        side: value?.side === 'undercity' ? 'undercity' : 'surface',
        visitedUndercity: value?.visitedUndercity === true,
        faction: value?.faction === 'government' || value?.faction === 'mafia'
            ? value.faction
            : null,
        incomeRemainders: value?.incomeRemainders &&
            typeof value.incomeRemainders === 'object'
            ? Object.fromEntries(Object.entries(value.incomeRemainders)
                .filter(([, remainder]) => Number.isFinite(remainder) && remainder >= 0 && remainder < 1))
            : {},
        missions: Object.fromEntries(MISSION_BLUEPRINTS.map(mission => {
            const status = sourceMissions[mission.id];
            return [mission.id, MISSION_SCHEMA.statuses.includes(status)
                ? status
                : mission.status];
        }))
    };
}

function loadNexusState() {
    const storage = getStorage();
    if (!storage) return normalizeNexusState(memoryState || null);

    try {
        const raw = storage.getItem(NEXUS_STATE_KEY);
        memoryState = normalizeNexusState(raw ? JSON.parse(raw) : memoryState || null);
        return normalizeNexusState(memoryState);
    } catch {
        return normalizeNexusState(memoryState);
    }
}

function saveNexusState(value) {
    const storage = getStorage();
    memoryState = normalizeNexusState(value);
    if (!storage) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('systemprogresschange'));
        }
        return false;
    }

    try {
        storage.setItem(NEXUS_STATE_KEY, JSON.stringify(memoryState));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('systemprogresschange'));
        }
        return true;
    } catch {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('systemprogresschange'));
        }
        return false;
    }
}

function setNexusFaction(state, factionId) {
    const current = normalizeNexusState(state);
    if (current.faction || !Object.hasOwn(FACTIONS, factionId)) return current;
    let nextState = { ...current, faction: factionId };
    saveNexusState(nextState);
    if (factionId === 'government') {
        nextState = setMissionStatus(nextState, 'audit-transit-link', 'available');
    } else if (current.visitedUndercity) {
        nextState = setMissionStatus(nextState, 'trace-grid-signal', 'available');
    }
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('nexusfactionchange'));
    }
    return nextState;
}

function setMissionStatus(state, missionId, status) {
    const mission = MISSION_BY_ID.get(missionId);
    const current = normalizeNexusState(state);
    if (!mission || !MISSION_SCHEMA.statuses.includes(status)) return current;

    const allowedNext = {
        locked: ['available'],
        available: ['active'],
        active: ['completed'],
        completed: []
    };

    if (!allowedNext[current.missions[missionId]].includes(status)) return current;

    const nextState = {
        ...current,
        missions: { ...current.missions, [missionId]: status }
    };
    saveNexusState(nextState);
    return nextState;
}

function getBuildingFaction(side, buildingId) {
    const district = CITY_SIDE_DATA[side]?.district;
    if (!district || typeof buildingId !== 'string') return null;

    for (const [factionId, buildingIds] of Object.entries(district.buildingsByFaction)) {
        if (buildingIds.includes(buildingId)) return factionId;
    }

    return null;
}

function calculateFactionIncome(amount, buildingFaction, playerFaction, remainder = 0) {
    if (!Number.isFinite(amount) || amount < 0) {
        return { income: 0, remainder: 0 };
    }

    const safeRemainder = Number.isFinite(remainder) && remainder >= 0 && remainder < 1
        ? remainder
        : 0;
    const matchesFaction =
        buildingFaction &&
        buildingFaction === playerFaction &&
        Object.hasOwn(FACTIONS, playerFaction);
    const exactIncome = amount * (
        matchesFaction ? FACTION_BUILDING_INCOME_MULTIPLIER : 1
    ) + safeRemainder;
    const income = Math.floor(exactIncome);

    return {
        income,
        remainder: exactIncome - income
    };
}

export {
    NEXUS_STATE_KEY,
    CITY_SIDES,
    FACTIONS,
    CITY_BUILDING_ICONS,
    DISTRICT_SCHEMA,
    CITY_SIDE_DATA,
    ECONOMIC_LINKS,
    MISSION_SCHEMA,
    MISSION_BLUEPRINTS,
    FACTION_BUILDING_INCOME_MULTIPLIER,
    normalizeNexusState,
    loadNexusState,
    saveNexusState,
    setNexusFaction,
    setMissionStatus,
    getBuildingFaction,
    calculateFactionIncome
};

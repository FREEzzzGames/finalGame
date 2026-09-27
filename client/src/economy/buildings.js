'use strict';

/*
 * FREEzzzGames
 * Buildings manager
 *
 * Stores the economic buildings of Main World.
 * This module manages building state only.
 * Production, rendering and collection
 * are handled by separate modules.
 */

const BUILDING_TYPES = Object.freeze([
    'farm',
    'workshop',
    'stadium',
    'studio',
    'shopping_center'
]);

const DEFAULT_BUILDING_LEVEL = 1;
const MIN_BUILDING_LEVEL = 1;

class Buildings {
    constructor() {
        this.buildings = new Map();
    }

    add(type, options = {}) {
        if (
            typeof type !== 'string' ||
            !BUILDING_TYPES.includes(type)
        ) {
            return false;
        }

        if (this.buildings.has(type)) {
            return false;
        }

        const level = Number.isFinite(options.level)
            ? Math.max(MIN_BUILDING_LEVEL, Math.floor(options.level))
            : DEFAULT_BUILDING_LEVEL;

        this.buildings.set(type, {
            type,
            level,
            active: options.active !== false
        });

        return true;
    }

    remove(type) {
        if (typeof type !== 'string') {
            return false;
        }

        return this.buildings.delete(type);
    }

    has(type) {
        return this.buildings.has(type);
    }

    get(type) {
        const building = this.buildings.get(type);

        if (!building) {
            return null;
        }

        return {
            ...building
        };
    }

    getLevel(type) {
        const building = this.buildings.get(type);

        if (!building) {
            return 0;
        }

        return building.level;
    }

    upgrade(type) {
        const building = this.buildings.get(type);

        if (!building) {
            return false;
        }

        building.level += 1;

        return building.level;
    }

    setLevel(type, level) {
        const building = this.buildings.get(type);

        if (
            !building ||
            !Number.isFinite(level) ||
            level < MIN_BUILDING_LEVEL
        ) {
            return false;
        }

        building.level = Math.floor(level);

        return true;
    }

    setActive(type, active) {
        const building = this.buildings.get(type);

        if (!building) {
            return false;
        }

        building.active = Boolean(active);

        return true;
    }

    getUpgradeCost(type, baseCost = 100) {
        const building = this.buildings.get(type);

        if (
            !building ||
            !Number.isFinite(baseCost) ||
            baseCost < 0
        ) {
            return 0;
        }

        return Math.floor(
            baseCost * building.level
        );
    }

    getAll() {
        return Array.from(this.buildings.values()).map(
            building => ({
                ...building
            })
        );
    }

    clear() {
        this.buildings.clear();
    }

    count() {
        return this.buildings.size;
    }
}

const buildings = new Buildings();

export {
    Buildings,
    BUILDING_TYPES,
    DEFAULT_BUILDING_LEVEL,
    MIN_BUILDING_LEVEL
};

export default buildings;
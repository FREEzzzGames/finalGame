'use strict';

/*
 * FREEzzzGames
 * Building upgrades
 *
 * Calculates upgrade costs and validates upgrade levels.
 * This module does not directly modify economy or buildings.
 */

const DEFAULT_UPGRADE_CONFIG = Object.freeze({
    baseCost: 100,
    costMultiplier: 1.5,
    maxLevel: 100
});

class Upgrades {
    constructor(options = {}) {
        const config = options && typeof options === 'object'
            ? options
            : {};

        this.baseCost = Number.isFinite(config.baseCost)
            ? Math.max(0, config.baseCost)
            : DEFAULT_UPGRADE_CONFIG.baseCost;

        this.costMultiplier = Number.isFinite(config.costMultiplier)
            ? Math.max(1, config.costMultiplier)
            : DEFAULT_UPGRADE_CONFIG.costMultiplier;

        this.maxLevel = Number.isFinite(config.maxLevel)
            ? Math.max(1, Math.floor(config.maxLevel))
            : DEFAULT_UPGRADE_CONFIG.maxLevel;
    }

    getUpgradeCost(currentLevel = 1) {
        if (
            !Number.isFinite(currentLevel) ||
            currentLevel < 1 ||
            currentLevel >= this.maxLevel
        ) {
            return 0;
        }

        return Math.floor(
            this.baseCost *
            Math.pow(this.costMultiplier, currentLevel - 1)
        );
    }

    canUpgrade(currentLevel = 1) {
        if (!Number.isFinite(currentLevel)) {
            return false;
        }

        return (
            currentLevel >= 1 &&
            currentLevel < this.maxLevel
        );
    }

    getNextLevel(currentLevel = 1) {
        if (!this.canUpgrade(currentLevel)) {
            return currentLevel;
        }

        return Math.floor(currentLevel) + 1;
    }

    getState() {
        return {
            baseCost: this.baseCost,
            costMultiplier: this.costMultiplier,
            maxLevel: this.maxLevel
        };
    }

    setConfig(options = {}) {
        if (!options || typeof options !== 'object') {
            return false;
        }

        if (Number.isFinite(options.baseCost)) {
            this.baseCost = Math.max(0, options.baseCost);
        }

        if (Number.isFinite(options.costMultiplier)) {
            this.costMultiplier = Math.max(
                1,
                options.costMultiplier
            );
        }

        if (Number.isFinite(options.maxLevel)) {
            this.maxLevel = Math.max(
                1,
                Math.floor(options.maxLevel)
            );
        }

        return true;
    }

    reset() {
        this.baseCost = DEFAULT_UPGRADE_CONFIG.baseCost;
        this.costMultiplier = DEFAULT_UPGRADE_CONFIG.costMultiplier;
        this.maxLevel = DEFAULT_UPGRADE_CONFIG.maxLevel;

        return this.getState();
    }
}

const upgrades = new Upgrades();

export {
    Upgrades,
    DEFAULT_UPGRADE_CONFIG
};

export default upgrades;
'use strict';

/*
 * FREEzzzGames
 * Collection rarity
 *
 * Defines the rarity system used by collectible heroes.
 * This module only stores rarity definitions and ordering.
 */

const RARITIES = Object.freeze([
    'common',
    'rare',
    'epic',
    'legendary',
    'mythic'
]);

const RARITY_LEVELS = Object.freeze({
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    mythic: 5
});

const RARITY_NAMES = Object.freeze({
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic'
});

class Rarity {
    has(rarity) {
        return RARITIES.includes(rarity);
    }

    getLevel(rarity) {
        if (!this.has(rarity)) {
            return 0;
        }

        return RARITY_LEVELS[rarity];
    }

    getName(rarity) {
        if (!this.has(rarity)) {
            return '';
        }

        return RARITY_NAMES[rarity];
    }

    compare(first, second) {
        const firstLevel = this.getLevel(first);
        const secondLevel = this.getLevel(second);

        return firstLevel - secondLevel;
    }

    isHigher(first, second) {
        return this.compare(first, second) > 0;
    }

    isLower(first, second) {
        return this.compare(first, second) < 0;
    }

    getAll() {
        return RARITIES.map(rarity => ({
            id: rarity,
            level: RARITY_LEVELS[rarity],
            name: RARITY_NAMES[rarity]
        }));
    }
}

const rarity = new Rarity();

export {
    Rarity,
    RARITIES,
    RARITY_LEVELS,
    RARITY_NAMES
};

export default rarity;
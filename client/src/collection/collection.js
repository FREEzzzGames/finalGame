'use strict';

/*
 * FREEzzzGames
 * Player collection
 *
 * Stores hero instances owned by the player.
 * This module manages collection state only.
 * Market, ownership history and UI are handled
 * by separate modules.
 */

class Collection {
    constructor() {
        this.items = new Map();
    }

    add(heroId, options = {}) {
        if (
            typeof heroId !== 'string' ||
            !heroId.trim()
        ) {
            return false;
        }

        if (this.items.has(heroId)) {
            return false;
        }

        this.items.set(heroId, {
            heroId,
            acquiredAt: typeof options.acquiredAt === 'string'
                ? options.acquiredAt
                : '',
            active: options.active !== false
        });

        return true;
    }

    remove(heroId) {
        if (typeof heroId !== 'string') {
            return false;
        }

        return this.items.delete(heroId);
    }

    has(heroId) {
        return this.items.has(heroId);
    }

    get(heroId) {
        const item = this.items.get(heroId);

        if (!item) {
            return null;
        }

        return {
            ...item
        };
    }

    setActive(heroId, active) {
        const item = this.items.get(heroId);

        if (!item) {
            return false;
        }

        item.active = Boolean(active);

        return true;
    }

    getByRarity(heroes, rarity) {
        if (
            !Array.isArray(heroes) ||
            typeof rarity !== 'string'
        ) {
            return [];
        }

        const ownedIds = new Set(this.items.keys());

        return heroes
            .filter(hero =>
                ownedIds.has(hero.id) &&
                hero.rarity === rarity
            )
            .map(hero => ({
                ...hero
            }));
    }

    getByCountry(heroes, country) {
        if (
            !Array.isArray(heroes) ||
            typeof country !== 'string'
        ) {
            return [];
        }

        const ownedIds = new Set(this.items.keys());

        return heroes
            .filter(hero =>
                ownedIds.has(hero.id) &&
                hero.country === country
            )
            .map(hero => ({
                ...hero
            }));
    }

    getAll() {
        return Array.from(this.items.values()).map(item => ({
            ...item
        }));
    }

    clear() {
        this.items.clear();
    }

    count() {
        return this.items.size;
    }
}

const collection = new Collection();

export {
    Collection
};

export default collection;
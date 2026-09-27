'use strict';

/*
 * FREEzzzGames
 * Collection heroes
 *
 * Stores collectible hero definitions.
 * This module manages hero data only.
 * Rarity, lore, market and ownership are handled
 * by separate modules.
 */

const HERO_FIELDS = Object.freeze([
    'id',
    'name',
    'rarity',
    'country',
    'era',
    'lore'
]);

class Heroes {
    constructor() {
        this.heroes = new Map();
    }

    add(hero) {
        if (!hero || typeof hero !== 'object') {
            return false;
        }

        if (
            typeof hero.id !== 'string' ||
            !hero.id.trim()
        ) {
            return false;
        }

        if (
            typeof hero.name !== 'string' ||
            !hero.name.trim()
        ) {
            return false;
        }

        if (
            typeof hero.rarity !== 'string' ||
            !hero.rarity.trim()
        ) {
            return false;
        }

        if (this.heroes.has(hero.id)) {
            return false;
        }

        this.heroes.set(hero.id, {
            id: hero.id,
            name: hero.name,
            rarity: hero.rarity,
            country: typeof hero.country === 'string'
                ? hero.country
                : '',
            era: typeof hero.era === 'string'
                ? hero.era
                : '',
            lore: typeof hero.lore === 'string'
                ? hero.lore
                : '',
            active: hero.active !== false
        });

        return true;
    }

    remove(id) {
        if (typeof id !== 'string') {
            return false;
        }

        return this.heroes.delete(id);
    }

    has(id) {
        return this.heroes.has(id);
    }

    get(id) {
        const hero = this.heroes.get(id);

        if (!hero) {
            return null;
        }

        return {
            ...hero
        };
    }

    update(id, changes = {}) {
        const hero = this.heroes.get(id);

        if (!hero || !changes || typeof changes !== 'object') {
            return false;
        }

        if (typeof changes.name === 'string' && changes.name.trim()) {
            hero.name = changes.name;
        }

        if (
            typeof changes.rarity === 'string' &&
            changes.rarity.trim()
        ) {
            hero.rarity = changes.rarity;
        }

        if (typeof changes.country === 'string') {
            hero.country = changes.country;
        }

        if (typeof changes.era === 'string') {
            hero.era = changes.era;
        }

        if (typeof changes.lore === 'string') {
            hero.lore = changes.lore;
        }

        if (typeof changes.active === 'boolean') {
            hero.active = changes.active;
        }

        return true;
    }

    setActive(id, active) {
        const hero = this.heroes.get(id);

        if (!hero) {
            return false;
        }

        hero.active = Boolean(active);

        return true;
    }

    getByRarity(rarity) {
        if (typeof rarity !== 'string') {
            return [];
        }

        return Array.from(this.heroes.values())
            .filter(hero => hero.rarity === rarity)
            .map(hero => ({
                ...hero
            }));
    }

    getByCountry(country) {
        if (typeof country !== 'string') {
            return [];
        }

        return Array.from(this.heroes.values())
            .filter(hero => hero.country === country)
            .map(hero => ({
                ...hero
            }));
    }

    getAll() {
        return Array.from(this.heroes.values()).map(hero => ({
            ...hero
        }));
    }

    clear() {
        this.heroes.clear();
    }

    count() {
        return this.heroes.size;
    }
}

const heroes = new Heroes();

export {
    Heroes,
    HERO_FIELDS
};

export default heroes;
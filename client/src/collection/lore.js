'use strict';

/*
 * FREEzzzGames
 * Hero lore
 *
 * Stores lore text for collectible heroes.
 * This module manages lore data only.
 */

class Lore {
    constructor() {
        this.entries = new Map();
    }

    add(heroId, text = '') {
        if (
            typeof heroId !== 'string' ||
            !heroId.trim()
        ) {
            return false;
        }

        if (typeof text !== 'string') {
            return false;
        }

        if (this.entries.has(heroId)) {
            return false;
        }

        this.entries.set(heroId, text);

        return true;
    }

    set(heroId, text = '') {
        if (
            typeof heroId !== 'string' ||
            !heroId.trim() ||
            typeof text !== 'string'
        ) {
            return false;
        }

        this.entries.set(heroId, text);

        return true;
    }

    has(heroId) {
        return this.entries.has(heroId);
    }

    get(heroId) {
        if (typeof heroId !== 'string') {
            return '';
        }

        return this.entries.get(heroId) || '';
    }

    remove(heroId) {
        if (typeof heroId !== 'string') {
            return false;
        }

        return this.entries.delete(heroId);
    }

    getAll() {
        return Array.from(this.entries.entries()).map(
            ([heroId, text]) => ({
                heroId,
                text
            })
        );
    }

    clear() {
        this.entries.clear();
    }

    count() {
        return this.entries.size;
    }
}

const lore = new Lore();

export {
    Lore
};

export default lore;
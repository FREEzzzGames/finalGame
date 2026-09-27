'use strict';

/*
 * FREEzzzGames
 * World objects
 *
 * Stores interactive objects that exist in Main World.
 * This module manages object data only.
 * Rendering, economy, gestures and interactions
 * are handled by separate modules.
 */

const OBJECT_TYPES = Object.freeze([
    'building',
    'transport',
    'character',
    'interactive'
]);

class WorldObjects {
    constructor() {
        this.objects = new Map();
    }

    add(object) {
        if (!object || typeof object !== 'object') {
            return false;
        }

        if (
            typeof object.id !== 'string' ||
            !object.id.trim()
        ) {
            return false;
        }

        if (
            typeof object.type !== 'string' ||
            !OBJECT_TYPES.includes(object.type)
        ) {
            return false;
        }

        const x = Number.isFinite(object.x) ? object.x : 0;
        const y = Number.isFinite(object.y) ? object.y : 0;

        this.objects.set(object.id, {
            id: object.id,
            type: object.type,
            x,
            y,
            layer: typeof object.layer === 'string'
                ? object.layer
                : 'interactive',
            active: object.active !== false,
            data: object.data && typeof object.data === 'object'
                ? { ...object.data }
                : {}
        });

        return true;
    }

    remove(id) {
        if (typeof id !== 'string') {
            return false;
        }

        return this.objects.delete(id);
    }

    has(id) {
        return this.objects.has(id);
    }

    get(id) {
        const object = this.objects.get(id);

        if (!object) {
            return null;
        }

        return {
            ...object,
            data: { ...object.data }
        };
    }

    update(id, changes = {}) {
        const object = this.objects.get(id);

        if (!object || !changes || typeof changes !== 'object') {
            return false;
        }

        if (Number.isFinite(changes.x)) {
            object.x = changes.x;
        }

        if (Number.isFinite(changes.y)) {
            object.y = changes.y;
        }

        if (typeof changes.layer === 'string') {
            object.layer = changes.layer;
        }

        if (typeof changes.active === 'boolean') {
            object.active = changes.active;
        }

        if (
            changes.data &&
            typeof changes.data === 'object'
        ) {
            object.data = {
                ...object.data,
                ...changes.data
            };
        }

        return true;
    }

    setActive(id, active) {
        const object = this.objects.get(id);

        if (!object) {
            return false;
        }

        object.active = Boolean(active);

        return true;
    }

    getByType(type) {
        if (!OBJECT_TYPES.includes(type)) {
            return [];
        }

        return Array.from(this.objects.values())
            .filter(object => object.type === type)
            .map(object => ({
                ...object,
                data: { ...object.data }
            }));
    }

    getByLayer(layer) {
        if (typeof layer !== 'string') {
            return [];
        }

        return Array.from(this.objects.values())
            .filter(object => object.layer === layer)
            .map(object => ({
                ...object,
                data: { ...object.data }
            }));
    }

    getAll() {
        return Array.from(this.objects.values()).map(object => ({
            ...object,
            data: { ...object.data }
        }));
    }

    clear() {
        this.objects.clear();
    }

    count() {
        return this.objects.size;
    }
}

const objects = new WorldObjects();

export {
    WorldObjects,
    OBJECT_TYPES
};

export default objects;
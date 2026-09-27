'use strict';

/*
 * FREEzzzGames
 * World layers
 *
 * Defines the visual and interaction layers of Main World.
 * This module only manages layer structure and state.
 * Rendering and world objects are handled separately.
 */

const DEFAULT_LAYERS = Object.freeze([
    'background',
    'landscape',
    'city',
    'buildings',
    'transport',
    'characters',
    'effects',
    'interactive'
]);

class Layers {
    constructor(layerNames = DEFAULT_LAYERS) {
        this.layers = new Map();

        for (const name of layerNames) {
            if (typeof name !== 'string' || !name.trim()) {
                continue;
            }

            this.layers.set(name, {
                name,
                visible: true,
                active: true
            });
        }
    }

    has(name) {
        return this.layers.has(name);
    }

    get(name) {
        const layer = this.layers.get(name);

        if (!layer) {
            return null;
        }

        return {
            name: layer.name,
            visible: layer.visible,
            active: layer.active
        };
    }

    setVisible(name, visible) {
        const layer = this.layers.get(name);

        if (!layer) {
            return false;
        }

        layer.visible = Boolean(visible);

        return true;
    }

    setActive(name, active) {
        const layer = this.layers.get(name);

        if (!layer) {
            return false;
        }

        layer.active = Boolean(active);

        return true;
    }

    toggleVisible(name) {
        const layer = this.layers.get(name);

        if (!layer) {
            return false;
        }

        layer.visible = !layer.visible;

        return layer.visible;
    }

    toggleActive(name) {
        const layer = this.layers.get(name);

        if (!layer) {
            return false;
        }

        layer.active = !layer.active;

        return layer.active;
    }

    getAll() {
        return Array.from(this.layers.values()).map(layer => ({
            name: layer.name,
            visible: layer.visible,
            active: layer.active
        }));
    }

    reset() {
        for (const layer of this.layers.values()) {
            layer.visible = true;
            layer.active = true;
        }

        return this.getAll();
    }
}

const layers = new Layers();

export {
    Layers,
    DEFAULT_LAYERS
};

export default layers;
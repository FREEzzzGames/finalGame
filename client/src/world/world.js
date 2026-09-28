'use strict';

/*
 * FREEzzzGames
 * World state manager
 *
 * Main World is the core interactive economic plane.
 * This module manages only world state and movement.
 * Rendering, gestures, layers, objects and economy
 * are handled by separate modules.
 */

const DEFAULT_WORLD = Object.freeze({
    width: 5000,
    height: 8000,
    startX: 2500,
    startY: 4000
});

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 1;

class World {
    constructor(options = {}) {
        const width = Number.isFinite(options.width)
            ? Math.max(1, options.width)
            : DEFAULT_WORLD.width;

        const height = Number.isFinite(options.height)
            ? Math.max(1, options.height)
            : DEFAULT_WORLD.height;

        const startX = Number.isFinite(options.startX)
            ? options.startX
            : width / 2;

        const startY = Number.isFinite(options.startY)
            ? options.startY
            : height / 2;

        this.bounds = {
            width,
            height
        };

        this.camera = {
            x: this.#clamp(startX, 0, width),
            y: this.#clamp(startY, 0, height),
            zoom: DEFAULT_ZOOM
        };
    }

    getState() {
        return {
            bounds: {
                width: this.bounds.width,
                height: this.bounds.height
            },
            camera: {
                x: this.camera.x,
                y: this.camera.y,
                zoom: this.camera.zoom
            }
        };
    }

    move(deltaX = 0, deltaY = 0) {
        const x = Number.isFinite(deltaX) ? deltaX : 0;
        const y = Number.isFinite(deltaY) ? deltaY : 0;

        this.camera.x = this.#clamp(
            this.camera.x + x,
            0,
            this.bounds.width
        );

        this.camera.y = this.#clamp(
            this.camera.y + y,
            0,
            this.bounds.height
        );

        return this.getState();
    }

    setPosition(x, y) {
        if (Number.isFinite(x)) {
            this.camera.x = this.#clamp(
                x,
                0,
                this.bounds.width
            );
        }

        if (Number.isFinite(y)) {
            this.camera.y = this.#clamp(
                y,
                0,
                this.bounds.height
            );
        }

        return this.getState();
    }

    setZoom(zoom) {
        if (!Number.isFinite(zoom)) {
            return this.getState();
        }

        this.camera.zoom = this.#clamp(
            zoom,
            MIN_ZOOM,
            MAX_ZOOM
        );

        return this.getState();
    }

    reset() {
        this.camera.x = this.#clamp(
            DEFAULT_WORLD.startX,
            0,
            this.bounds.width
        );

        this.camera.y = this.#clamp(
            DEFAULT_WORLD.startY,
            0,
            this.bounds.height
        );

        this.camera.zoom = DEFAULT_ZOOM;

        return this.getState();
    }

    #clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}

const world = new World();

export {
    World,
    DEFAULT_WORLD,
    MIN_ZOOM,
    MAX_ZOOM,
    DEFAULT_ZOOM
};

export default world;
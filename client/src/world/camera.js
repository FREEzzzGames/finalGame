'use strict';

/*
 * FREEzzzGames
 * World camera
 *
 * Responsible only for camera transformations.
 * World state, gestures, layers and objects
 * are handled by separate modules.
 */

class Camera {
    constructor(options = {}) {
        this.x = Number.isFinite(options.x) ? options.x : 0;
        this.y = Number.isFinite(options.y) ? options.y : 0;
        this.zoom = Number.isFinite(options.zoom) ? options.zoom : 1;

        this.viewportWidth = Number.isFinite(options.viewportWidth)
            ? Math.max(1, options.viewportWidth)
            : 1;

        this.viewportHeight = Number.isFinite(options.viewportHeight)
            ? Math.max(1, options.viewportHeight)
            : 1;
    }

    setViewport(width, height) {
        if (Number.isFinite(width) && width > 0) {
            this.viewportWidth = width;
        }

        if (Number.isFinite(height) && height > 0) {
            this.viewportHeight = height;
        }

        return this.getState();
    }

    setPosition(x, y) {
        if (Number.isFinite(x)) {
            this.x = x;
        }

        if (Number.isFinite(y)) {
            this.y = y;
        }

        return this.getState();
    }

    move(deltaX = 0, deltaY = 0) {
        if (Number.isFinite(deltaX)) {
            this.x += deltaX;
        }

        if (Number.isFinite(deltaY)) {
            this.y += deltaY;
        }

        return this.getState();
    }

    setZoom(zoom) {
        if (Number.isFinite(zoom) && zoom > 0) {
            this.zoom = zoom;
        }

        return this.getState();
    }

    worldToScreen(worldX, worldY) {
        if (
            !Number.isFinite(worldX) ||
            !Number.isFinite(worldY)
        ) {
            return {
                x: 0,
                y: 0
            };
        }

        return {
            x: (worldX - this.x) * this.zoom + this.viewportWidth / 2,
            y: (worldY - this.y) * this.zoom + this.viewportHeight / 2
        };
    }

    screenToWorld(screenX, screenY) {
        if (
            !Number.isFinite(screenX) ||
            !Number.isFinite(screenY)
        ) {
            return {
                x: this.x,
                y: this.y
            };
        }

        return {
            x: (
                (screenX - this.viewportWidth / 2) / this.zoom
            ) + this.x,

            y: (
                (screenY - this.viewportHeight / 2) / this.zoom
            ) + this.y
        };
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            zoom: this.zoom,
            viewportWidth: this.viewportWidth,
            viewportHeight: this.viewportHeight
        };
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;

        return this.getState();
    }
}

const camera = new Camera();

export {
    Camera
};

export default camera;
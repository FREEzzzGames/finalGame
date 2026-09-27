'use strict';

/*
 * FREEzzzGames
 * World gesture manager
 *
 * Supported interactions:
 * - smooth pointer movement
 * - horizontal swipe
 * - vertical swipe
 * - tap
 *
 * This module only detects gestures.
 * World movement, camera, objects and economy
 * are handled by separate modules.
 */

const DEFAULT_OPTIONS = Object.freeze({
    swipeThreshold: 24,
    tapThreshold: 12,
    maxTapDuration: 350
});

class Gestures {
    constructor(options = {}) {
        this.options = {
            swipeThreshold:
                Number.isFinite(
                    options.swipeThreshold
                )
                    ? Math.max(
                        1,
                        options.swipeThreshold
                    )
                    : DEFAULT_OPTIONS.swipeThreshold,

            tapThreshold:
                Number.isFinite(
                    options.tapThreshold
                )
                    ? Math.max(
                        1,
                        options.tapThreshold
                    )
                    : DEFAULT_OPTIONS.tapThreshold,

            maxTapDuration:
                Number.isFinite(
                    options.maxTapDuration
                )
                    ? Math.max(
                        1,
                        options.maxTapDuration
                    )
                    : DEFAULT_OPTIONS.maxTapDuration
        };

        this.startPoint = null;
        this.lastPoint = null;

        this.startTime = 0;
        this.lastTime = 0;

        this.totalDeltaX = 0;
        this.totalDeltaY = 0;
    }

    start(
        x,
        y,
        timestamp = Date.now()
    ) {
        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            this.reset();
            return false;
        }

        const time =
            Number.isFinite(timestamp)
                ? timestamp
                : Date.now();

        this.startPoint = {
            x,
            y
        };

        this.lastPoint = {
            x,
            y
        };

        this.startTime = time;
        this.lastTime = time;

        this.totalDeltaX = 0;
        this.totalDeltaY = 0;

        return true;
    }

    move(
        x,
        y,
        timestamp = Date.now()
    ) {
        if (
            !this.startPoint ||
            !this.lastPoint ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            return {
                type: 'none'
            };
        }

        const time =
            Number.isFinite(timestamp)
                ? timestamp
                : Date.now();

        const deltaX =
            x -
            this.lastPoint.x;

        const deltaY =
            y -
            this.lastPoint.y;

        this.lastPoint = {
            x,
            y
        };

        this.lastTime =
            time;

        this.totalDeltaX +=
            deltaX;

        this.totalDeltaY +=
            deltaY;

        return {
            type: 'move',

            x,
            y,

            deltaX,
            deltaY,

            totalDeltaX:
                this.totalDeltaX,

            totalDeltaY:
                this.totalDeltaY,

            duration:
                Math.max(
                    0,
                    time -
                    this.startTime
                )
        };
    }

    end(
        x,
        y,
        timestamp = Date.now()
    ) {
        if (
            !this.startPoint ||
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            this.reset();

            return {
                type: 'none'
            };
        }

        const endTime =
            Number.isFinite(timestamp)
                ? timestamp
                : Date.now();

        const deltaX =
            x -
            this.startPoint.x;

        const deltaY =
            y -
            this.startPoint.y;

        const distanceX =
            Math.abs(deltaX);

        const distanceY =
            Math.abs(deltaY);

        const duration =
            Math.max(
                0,
                endTime -
                this.startTime
            );

        let result;

        if (
            distanceX <=
                this.options.tapThreshold &&
            distanceY <=
                this.options.tapThreshold &&
            duration <=
                this.options.maxTapDuration
        ) {
            result = {
                type: 'tap',

                x,
                y,

                duration
            };
        } else if (
            distanceX >=
                this.options.swipeThreshold &&
            distanceX > distanceY
        ) {
            result = {
                type: 'swipe',

                axis: 'horizontal',

                direction:
                    deltaX > 0
                        ? 'right'
                        : 'left',

                deltaX,
                deltaY,

                duration
            };
        } else if (
            distanceY >=
                this.options.swipeThreshold &&
            distanceY > distanceX
        ) {
            result = {
                type: 'swipe',

                axis: 'vertical',

                direction:
                    deltaY > 0
                        ? 'down'
                        : 'up',

                deltaX,
                deltaY,

                duration
            };
        } else {
            result = {
                type: 'none',

                deltaX,
                deltaY,

                duration
            };
        }

        this.reset();

        return result;
    }

    cancel() {
        this.reset();

        return {
            type: 'none'
        };
    }

    reset() {
        this.startPoint = null;
        this.lastPoint = null;

        this.startTime = 0;
        this.lastTime = 0;

        this.totalDeltaX = 0;
        this.totalDeltaY = 0;
    }

    getState() {
        return {
            startPoint:
                this.startPoint
                    ? {
                        x:
                            this.startPoint.x,

                        y:
                            this.startPoint.y
                    }
                    : null,

            lastPoint:
                this.lastPoint
                    ? {
                        x:
                            this.lastPoint.x,

                        y:
                            this.lastPoint.y
                    }
                    : null,

            startTime:
                this.startTime,

            lastTime:
                this.lastTime,

            totalDeltaX:
                this.totalDeltaX,

            totalDeltaY:
                this.totalDeltaY
        };
    }
}

const gestures =
    new Gestures();

export {
    Gestures,
    DEFAULT_OPTIONS
};

export default gestures;
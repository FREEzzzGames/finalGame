'use strict';

/*
 * FREEzzzGames
 * Application router
 *
 * Ответственность:
 * - хранить текущий экран;
 * - регистрировать экраны;
 * - переключать активный экран;
 * - уведомлять приложение о смене экрана.
 *
 * ВАЖНО:
 * Роутер не содержит игровой логики.
 */

const ROUTER_EVENTS = Object.freeze({
    CHANGE: 'routechange'
});

class AppRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.listeners = new Set();
    }

    register(name, screen) {
        if (!name || typeof name !== 'string') {
            throw new TypeError(
                '[FREEzzzGames] Route name must be a non-empty string.'
            );
        }

        if (!screen || typeof screen !== 'object') {
            throw new TypeError(
                `[FREEzzzGames] Invalid screen for route "${name}".`
            );
        }

        if (this.routes.has(name)) {
            throw new Error(
                `[FREEzzzGames] Route "${name}" is already registered.`
            );
        }

        this.routes.set(name, screen);

        return this;
    }

    has(name) {
        return this.routes.has(name);
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getRoutes() {
        return Object.freeze(
            Array.from(this.routes.keys())
        );
    }

    navigate(name, params = {}) {
        if (!this.routes.has(name)) {
            throw new Error(
                `[FREEzzzGames] Route "${name}" is not registered.`
            );
        }

        const previousRoute = this.currentRoute;

        this.currentRoute = name;

        const event = Object.freeze({
            type: ROUTER_EVENTS.CHANGE,
            from: previousRoute,
            to: name,
            params: Object.freeze({ ...params })
        });

        this.emit(event);

        return event;
    }

    subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new TypeError(
                '[FREEzzzGames] Router listener must be a function.'
            );
        }

        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    emit(event) {
        for (const listener of this.listeners) {
            try {
                listener(event);
            } catch (error) {
                console.error(
                    '[FREEzzzGames] Router listener error:',
                    error
                );
            }
        }
    }

    reset() {
        this.currentRoute = null;
    }
}

const router = new AppRouter();

export {
    AppRouter,
    ROUTER_EVENTS
};

export default router;
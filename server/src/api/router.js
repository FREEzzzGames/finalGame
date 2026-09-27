'use strict';

/*
 * FREEzzzGames
 * API router module
 *
 * Resolves HTTP method + path to a registered API handler.
 * Game logic, authentication and persistence are handled separately.
 */

const routes = new Map();

const buildRouteKey = (method, path) => {
    if (
        typeof method !== 'string' ||
        typeof path !== 'string'
    ) {
        return null;
    }

    return `${method.toUpperCase()} ${path}`;
};

const registerRoute = (
    method,
    path,
    handler
) => {
    const key = buildRouteKey(method, path);

    if (!key) {
        throw new Error('Invalid route');
    }

    if (typeof handler !== 'function') {
        throw new Error('Route handler must be a function');
    }

    if (routes.has(key)) {
        throw new Error('Route already registered');
    }

    routes.set(key, handler);
};

const resolveRoute = (method, path) => {
    const key = buildRouteKey(method, path);

    if (!key) {
        return null;
    }

    return routes.get(key) || null;
};

const clearRoutes = () => {
    routes.clear();
};

module.exports = {
    registerRoute,
    resolveRoute,
    clearRoutes
};
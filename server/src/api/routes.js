'use strict';

/*
 * FREEzzzGames
 * API routes module
 *
 * Registers the minimal default API routes.
 * Server integration is handled separately.
 */

const {
    registerRoute
} = require('./router');

const {
    getHealth
} = require('./health');

const registerDefaultRoutes = () => {
    registerRoute(
        'GET',
        '/health',
        () => getHealth()
    );
};

module.exports = {
    registerDefaultRoutes
};
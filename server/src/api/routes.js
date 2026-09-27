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

const {
    getState
} = require('../users/state-route');

const registerDefaultRoutes = () => {
    registerRoute(
        'GET',
        '/health',
        () => getHealth()
    );

    registerRoute(
        'GET',
        '/state',
        context => getState(context)
    );
};

module.exports = {
    registerDefaultRoutes
};
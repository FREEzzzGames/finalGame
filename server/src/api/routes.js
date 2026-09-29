'use strict';

/*
 * FREEzzzGames
 * API routes module
 *
 * Registers the default API routes.
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

const {
    postMessage
} = require('../chat/chat-route');

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

    registerRoute(
        'POST',
        '/chat/message',
        context => postMessage(context)
    );
};

module.exports = {
    registerDefaultRoutes
};

'use strict';

/*
 * FREEzzzGames
 * API health module
 *
 * Provides a minimal health-check handler.
 * No authentication, persistence or game state is involved.
 */

const getHealth = () => {
    return {
        status: 'ok'
    };
};

module.exports = {
    getHealth
};
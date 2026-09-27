'use strict';

/*
 * FREEzzzGames
 * API health module
 *
 * Provides a minimal health response for server/API checks.
 */

const getHealth = () => ({
    status: 'ok'
});

module.exports = {
    getHealth
};
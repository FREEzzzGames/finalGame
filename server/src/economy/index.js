'use strict';

/*
 * FREEzzzGames
 * Economy module
 *
 * Central entry point for server-side economy functionality.
 */

const {
    createEconomyState,
    canAfford
} = require('./economy');

module.exports = {
    createEconomyState,
    canAfford
};
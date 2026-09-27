'use strict';

/*
 * FREEzzzGames
 * Application bootstrap
 *
 * Ответственность:
 * - запустить приложение;
 * - инициализировать Telegram;
 * - создать Main World;
 * - передать управление игровому модулю.
 *
 * Игровая логика находится в world/world.js.
 */

import TelegramAdapter from '../telegram/telegram.js';
import World from '../world/world.js';

const APP_VERSION = '0.2.0';

const appRoot =
    document.querySelector('#app');

const bootScreen =
    document.querySelector('#boot-screen');

const bootStatus =
    document.querySelector('#boot-status');

let world = null;

function updateBootStatus(message) {
    if (!bootStatus) {
        return;
    }

    bootStatus.textContent =
        message;
}

function initializeTelegram() {
    try {
        return TelegramAdapter.init();
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Telegram initialization warning:',
            error
        );

        return null;
    }
}

function createWorldMount() {
    if (!appRoot) {
        throw new Error(
            '[FREEzzzGames] Application root #app was not found.'
        );
    }

    const mount =
        document.createElement('div');

    mount.id =
        'world-mount';

    mount.className =
        'world-mount';

    appRoot.appendChild(
        mount
    );

    return mount;
}

function startWorld() {
    const mount =
        createWorldMount();

    world =
        new World(mount);

    return world;
}

function hideBootScreen() {
    if (!bootScreen) {
        return;
    }

    bootScreen.remove();
}

function startApp() {
    if (!appRoot) {
        throw new Error(
            '[FREEzzzGames] Application root #app was not found.'
        );
    }

    const telegram =
        initializeTelegram();

    if (telegram) {
        updateBootStatus(
            'FREEzzzGames'
        );
    } else {
        updateBootStatus(
            'FREEzzzGames'
        );

        console.info(
            '[FREEzzzGames] Telegram WebApp API is not available. ' +
            'Running in browser mode.'
        );
    }

    appRoot.dataset.appVersion =
        APP_VERSION;

    appRoot.dataset.initialized =
        'true';

    startWorld();

    hideBootScreen();

    console.info(
        `[FREEzzzGames] App initialized. Version: ${APP_VERSION}`
    );
}

try {
    startApp();
} catch (error) {
    console.error(
        '[FREEzzzGames] Application initialization failed:',
        error
    );

    updateBootStatus(
        'FREEzzzGames'
    );
}

export {
    startApp
};

export {
    world
};
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
 *
 * ВАЖНО:
 * Версия модулей используется для исключения ситуации,
 * когда после обновления Mini App браузер/Telegram
 * смешивает старую и новую версии ES-модулей.
 */

const APP_VERSION = '0.2.1';
const MODULE_VERSION = '0.2.1';

const appRoot =
    document.querySelector('#app');

const bootScreen =
    document.querySelector('#boot-screen');

const bootStatus =
    document.querySelector('#boot-status');

let world = null;
let unsubscribeTelegramViewport = null;

let TelegramAdapter = null;
let World = null;

function updateBootStatus(message) {
    if (!bootStatus) {
        return;
    }

    bootStatus.textContent =
        message;
}

function applyTelegramViewportHeight() {
    if (!TelegramAdapter) {
        return;
    }

    const height =
        TelegramAdapter.getViewportHeight();

    if (
        !height ||
        !Number.isFinite(height)
    ) {
        return;
    }

    document.documentElement.style.setProperty(
        '--tg-viewport-height',
        `${height}px`
    );
}

async function loadModules() {
    const telegramModule =
        await import(
            `../telegram/telegram.js?v=${MODULE_VERSION}`
        );

    const worldModule =
        await import(
            `../world/world.js?v=${MODULE_VERSION}`
        );

    TelegramAdapter =
        telegramModule.default;

    World =
        worldModule.default;

    if (
        !TelegramAdapter ||
        !World
    ) {
        throw new Error(
            '[FREEzzzGames] Required application modules were not loaded.'
        );
    }
}

function initializeTelegram() {
    try {
        if (!TelegramAdapter) {
            return null;
        }

        const telegram =
            TelegramAdapter.init();

        if (telegram) {
            applyTelegramViewportHeight();

            unsubscribeTelegramViewport =
                TelegramAdapter.onViewportChanged(
                    () => {
                        applyTelegramViewportHeight();

                        /*
                         * Telegram viewport changes are not guaranteed
                         * to produce a browser resize event.
                         */
                        window.dispatchEvent(
                            new Event('resize')
                        );
                    }
                );
        }

        return telegram;
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
    if (!World) {
        throw new Error(
            '[FREEzzzGames] World module is not loaded.'
        );
    }

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

async function startApp() {
    if (!appRoot) {
        throw new Error(
            '[FREEzzzGames] Application root #app was not found.'
        );
    }

    /*
     * Загружаем игровые модули с новой версией URL.
     * Это не меняет игровую логику.
     */
    await loadModules();

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

    /*
     * После создания World даём браузеру закончить layout.
     * Это только синхронизация layout и не меняет геометрию.
     */
    requestAnimationFrame(
        () => {
            requestAnimationFrame(
                () => {
                    window.dispatchEvent(
                        new Event('resize')
                    );
                }
            );
        }
    );

    console.info(
        `[FREEzzzGames] App initialized. Version: ${APP_VERSION}`
    );
}

startApp()
    .catch(
        (error) => {
            console.error(
                '[FREEzzzGames] Application initialization failed:',
                error
            );

            updateBootStatus(
                'FREEzzzGames'
            );
        }
    );

export {
    startApp
};

export {
    world
};
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
let unsubscribeTelegramViewport = null;

function updateBootStatus(message) {
    if (!bootStatus) {
        return;
    }

    bootStatus.textContent =
        message;
}

function applyTelegramViewportHeight() {
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

/*
 * Временная диагностика геометрии.
 *
 * Ничего не изменяет в игровой геометрии.
 * Только показывает реальные размеры,
 * которые браузер/Telegram дают приложению.
 */
function showViewportDiagnostics() {
    if (!world || !world.viewport) {
        return;
    }

    const rect =
        world.viewport.getBoundingClientRect();

    const appRect =
        appRoot
            ? appRoot.getBoundingClientRect()
            : null;

    const mount =
        document.querySelector(
            '#world-mount'
        );

    const mountRect =
        mount
            ? mount.getBoundingClientRect()
            : null;

    const telegramHeight =
        TelegramAdapter.getViewportHeight();

    const telegramStableHeight =
        TelegramAdapter.getViewportStableHeight();

    const lines = [
        `window: ${window.innerWidth} × ${window.innerHeight}`,
        `html: ${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`,
        `app: ${appRect ? Math.round(appRect.width) : '-'} × ${appRect ? Math.round(appRect.height) : '-'}`,
        `mount: ${mountRect ? Math.round(mountRect.width) : '-'} × ${mountRect ? Math.round(mountRect.height) : '-'}`,
        `world: ${Math.round(rect.width)} × ${Math.round(rect.height)}`,
        `camera: ${Math.round(world.viewport?.clientWidth || 0)} × ${Math.round(world.viewport?.clientHeight || 0)}`,
        `camera viewport: ${Math.round(world.viewport ? world.viewport.getBoundingClientRect().width : 0)} × ${Math.round(world.viewport ? world.viewport.getBoundingClientRect().height : 0)}`,
        `telegram: ${telegramHeight || '-'} / stable ${telegramStableHeight || '-'}`,
        `zoom: ${typeof world.getCameraZoom === 'function' ? world.getCameraZoom() : '1'}`
    ];

    let diagnostic =
        document.querySelector(
            '#viewport-diagnostics'
        );

    if (!diagnostic) {
        diagnostic =
            document.createElement('pre');

        diagnostic.id =
            'viewport-diagnostics';

        diagnostic.style.position =
            'fixed';

        diagnostic.style.left =
            '8px';

        diagnostic.style.right =
            '8px';

        diagnostic.style.bottom =
            '8px';

        diagnostic.style.zIndex =
            '99999';

        diagnostic.style.margin =
            '0';

        diagnostic.style.padding =
            '10px';

        diagnostic.style.borderRadius =
            '10px';

        diagnostic.style.background =
            'rgba(0, 0, 0, 0.85)';

        diagnostic.style.color =
            '#00ff88';

        diagnostic.style.font =
            '12px/1.35 monospace';

        diagnostic.style.whiteSpace =
            'pre-wrap';

        diagnostic.style.pointerEvents =
            'none';

        document.body.appendChild(
            diagnostic
        );
    }

    diagnostic.textContent =
        lines.join('\n');

    console.log(
        '[FREEzzzGames] VIEWPORT DIAGNOSTICS',
        {
            windowWidth:
                window.innerWidth,

            windowHeight:
                window.innerHeight,

            htmlWidth:
                document.documentElement.clientWidth,

            htmlHeight:
                document.documentElement.clientHeight,

            appWidth:
                appRect
                    ? appRect.width
                    : null,

            appHeight:
                appRect
                    ? appRect.height
                    : null,

            mountWidth:
                mountRect
                    ? mountRect.width
                    : null,

            mountHeight:
                mountRect
                    ? mountRect.height
                    : null,

            worldWidth:
                rect.width,

            worldHeight:
                rect.height,

            telegramViewportHeight:
                telegramHeight,

            telegramStableHeight:
                telegramStableHeight
        }
    );
}

function initializeTelegram() {
    try {
        const telegram =
            TelegramAdapter.init();

        if (telegram) {
            applyTelegramViewportHeight();

            unsubscribeTelegramViewport =
                TelegramAdapter.onViewportChanged(
                    () => {
                        applyTelegramViewportHeight();

                        /*
                         * World already listens to resize.
                         * Re-dispatch it here because Telegram viewport
                         * changes are not guaranteed to be browser resizes.
                         */
                        window.dispatchEvent(
                            new Event('resize')
                        );

                        showViewportDiagnostics();
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

    /*
     * Даём браузеру закончить layout после создания World,
     * затем снимаем реальные размеры.
     */
    requestAnimationFrame(
        () => {
            requestAnimationFrame(
                () => {
                    showViewportDiagnostics();
                }
            );
        }
    );

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
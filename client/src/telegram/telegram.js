'use strict';

/*
 * FREEzzzGames
 * Application bootstrap
 *
 * Ответственность:
 * - запустить приложение;
 * - инициализировать Telegram;
 * - авторизовать Telegram-пользователя через сервер;
 * - создать Main World;
 * - создать Geek Chat Widget;
 * - передать проверенный Telegram-профиль в Chat;
 * - передать управление игровым модулям.
 *
 * Архитектура:
 *
 * Telegram WebApp
 *      ↓
 * TelegramAdapter
 *      ↓
 * server authentication
 *      ↓
 * playerSession
 *      ↓
 * ┌───────────────┐
 * │               │
 * World        ChatWidget
 *                ↓
 *              ChatUI
 *                ↓
 *           Chat cluster
 *
 * ВАЖНО:
 * Telegram Mini App является основным целевым runtime.
 *
 * initDataUnsafe НЕ используется.
 * Профиль игрока приходит только после
 * серверной проверки Telegram initData.
 */

const APP_VERSION = '0.2.1';
const MODULE_VERSION = '0.2.3';

const appRoot =
    document.querySelector('#app');

const bootScreen =
    document.querySelector('#boot-screen');

const bootStatus =
    document.querySelector('#boot-status');

let world = null;

let chatWidget = null;

let playerSession = null;

let unsubscribeTelegramViewport = null;

let TelegramAdapter = null;
let World = null;
let ChatWidget = null;

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

    const chatWidgetModule =
        await import(
            `../chat/chat-widget.js?v=${MODULE_VERSION}`
        );

    TelegramAdapter =
        telegramModule.default;

    World =
        worldModule.default;

    ChatWidget =
        chatWidgetModule.default;

    if (
        !TelegramAdapter ||
        !World ||
        !ChatWidget
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

async function authenticateTelegram() {
    if (!TelegramAdapter) {
        return null;
    }

    /*
     * За пределами Telegram авторизация
     * не требуется для локального/веб-тестирования.
     */
    if (!TelegramAdapter.isAvailable()) {
        return null;
    }

    const session =
        await TelegramAdapter.authenticate();

    if (
        !session ||
        !session.authenticated
    ) {
        throw new Error(
            `[FREEzzzGames] Telegram authentication failed: ${
                session && session.error
                    ? session.error
                    : 'UNKNOWN_ERROR'
            }`
        );
    }

    return session;
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

function createChatMount() {
    if (!appRoot) {
        throw new Error(
            '[FREEzzzGames] Application root #app was not found.'
        );
    }

    const mount =
        document.createElement('div');

    mount.id =
        'chat-widget-mount';

    mount.className =
        'chat-widget-mount';

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

function getVerifiedChatAuthor() {
    if (
        !playerSession ||
        !playerSession.authenticated ||
        !playerSession.profile
    ) {
        return '';
    }

    const profile =
        playerSession.profile;

    /*
     * Приоритет:
     *
     * username
     * ↓
     * firstName + lastName
     * ↓
     * пустое значение
     *
     * Все значения приходят от сервера
     * после проверки Telegram initData.
     */
    if (
        typeof profile.username === 'string' &&
        profile.username.trim().length > 0
    ) {
        return profile.username.trim();
    }

    const firstName =
        typeof profile.firstName === 'string'
            ? profile.firstName.trim()
            : '';

    const lastName =
        typeof profile.lastName === 'string'
            ? profile.lastName.trim()
            : '';

    return [
        firstName,
        lastName
    ]
        .filter(Boolean)
        .join(' ');
}

function startChatWidget() {
    if (!ChatWidget) {
        throw new Error(
            '[FREEzzzGames] ChatWidget module is not loaded.'
        );
    }

    const mount =
        createChatMount();

    const author =
        getVerifiedChatAuthor();

    chatWidget =
        new ChatWidget({
            author
        });

    const mounted =
        chatWidget.mountTo(
            mount
        );

    if (!mounted) {
        throw new Error(
            '[FREEzzzGames] Geek Chat Widget could not be mounted.'
        );
    }

    return chatWidget;
}

function applyPlayerSession() {
    if (!appRoot) {
        return;
    }

    if (
        !playerSession ||
        !playerSession.authenticated
    ) {
        appRoot.dataset.telegramAuthenticated =
            'false';

        return;
    }

    appRoot.dataset.telegramAuthenticated =
        'true';

    if (
        playerSession.profile &&
        playerSession.profile.telegramUserId !== undefined
    ) {
        appRoot.dataset.telegramUserId =
            String(
                playerSession.profile.telegramUserId
            );
    }

    if (
        playerSession.profile &&
        typeof playerSession.profile.username === 'string'
    ) {
        appRoot.dataset.telegramUsername =
            playerSession.profile.username;
    }
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
     */
    await loadModules();

    const telegram =
        initializeTelegram();

    if (telegram) {
        updateBootStatus(
            'FREEzzzGames'
        );

        /*
         * Telegram является авторитетным источником
         * идентификации пользователя.
         *
         * World и Chat запускаются только после
         * успешной серверной проверки initData.
         */
        playerSession =
            await authenticateTelegram();

        applyPlayerSession();
    } else {
        updateBootStatus(
            'FREEzzzGames'
        );

        console.info(
            '[FREEzzzGames] Telegram WebApp API is not available. ' +
            'Running in browser mode.'
        );

        appRoot.dataset.telegramAuthenticated =
            'false';
    }

    appRoot.dataset.appVersion =
        APP_VERSION;

    appRoot.dataset.initialized =
        'true';

    /*
     * World остаётся независимым модулем.
     */
    startWorld();

    /*
     * Geek Chat получает только подтверждённое
     * сервером имя пользователя.
     */
    startChatWidget();

    hideBootScreen();

    /*
     * После создания World и Chat даём браузеру
     * закончить layout.
     *
     * Особенно важно для Telegram WebApp,
     * где viewport может измениться уже после
     * первоначального запуска.
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

    if (playerSession) {
        console.info(
            '[FREEzzzGames] Telegram player authenticated.',
            playerSession.profile
        );
    }
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

export {
    chatWidget
};

export {
    playerSession
};
'use strict';

/*
 * FREEzzzGames — application bootstrap.
 *
 * Telegram, World and Chat remain separate modules.
 * Browser mode is supported without Telegram authentication.
 */

import TelegramAdapter from '../telegram/telegram.js?v=0.4.0';
import TelegramTheme from '../telegram/theme.js?v=0.2.0';
import Session from '../session/session.js?v=0.1.0';
import World from '../world/world.js?v=0.4.0';
import ChatWidget from '../chat/chat-widget.js?v=0.3.0';
import LoreWidget from '../lore/lore-widget.js?v=0.4.0';

const APP_VERSION = '0.5.0';

const appRoot = document.querySelector('#app');
const bootScreen = document.querySelector('#boot-screen');
const bootStatus = document.querySelector('#boot-status');

let world = null;
let chatWidget = null;
let loreWidget = null;
let playerSession = null;
let unsubscribeTelegramViewport = null;
let unsubscribeTelegramLifecycle = null;
let startupStage = 'Application startup';

function setBootStatus(message, isError = false) {
    if (!bootStatus) return;

    bootStatus.textContent = String(message || '');
    bootStatus.classList.toggle('is-error', Boolean(isError));
}

function setAppData(name, value) {
    if (!appRoot) return;
    appRoot.dataset[name] = String(value);
}

function applyTelegramViewport() {
    const { height, stableHeight } = TelegramAdapter.getViewport();

    if (Number.isFinite(height) && height > 0) {
        document.documentElement.style.setProperty(
            '--tg-viewport-height',
            `${height}px`
        );
    }

    if (Number.isFinite(stableHeight) && stableHeight > 0) {
        document.documentElement.style.setProperty(
            '--tg-viewport-stable-height',
            `${stableHeight}px`
        );
    }

    const safeArea = TelegramAdapter.getSafeAreaInset();

    for (const [name, value] of [
        ['top', safeArea.top],
        ['right', safeArea.right],
        ['bottom', safeArea.bottom],
        ['left', safeArea.left]
    ]) {
        document.documentElement.style.setProperty(
            `--tg-safe-${name}`,
            Number.isFinite(Number(value)) ? `${Number(value)}px` : '0px'
        );
    }
}

function notifyLayoutChanged() {
    window.dispatchEvent(new Event('resize'));
}

function initializeTelegram() {
    const telegram = TelegramAdapter.initialize();

    if (!telegram) {
        setAppData('runtime', 'browser');
        setAppData('telegramAuthenticated', 'false');
        TelegramTheme.initializeTheme();
        return null;
    }

    setAppData('runtime', TelegramAdapter.isAvailable() ? 'telegram' : 'browser');
    TelegramTheme.initializeTheme();

    applyTelegramViewport();

    if (unsubscribeTelegramViewport) {
        unsubscribeTelegramViewport();
    }

    if (unsubscribeTelegramLifecycle) {
        unsubscribeTelegramLifecycle();
    }

    unsubscribeTelegramViewport =
        TelegramAdapter.onViewportChanged(event => {
            applyTelegramViewport();
            notifyLayoutChanged();

            if (event && event.isStateStable) {
                requestAnimationFrame(notifyLayoutChanged);
            }
        });

    unsubscribeTelegramLifecycle = TelegramAdapter.onLifecycle(({ active }) => {
        setAppData('active', active);
        if (active) notifyLayoutChanged();
    });

    TelegramAdapter.expand();
    applyTelegramViewport();

    TelegramAdapter.setHeaderColor('#111318');
    TelegramAdapter.setBackgroundColor('#111318');

    notifyLayoutChanged();

    return telegram;
}

async function initializeSession() {
    setBootStatus('Connecting…');
    const session = await Session.initialize();
    setAppData('telegramAuthenticated', session.authenticated);

    if (session.error) {
        console.warn('[FREEzzzGames] Session initialization unavailable:', session.error);
    }

    return session;
}

function createMount(id, className) {
    if (!appRoot) {
        throw new Error('[FREEzzzGames] #app is missing.');
    }

    const existing = document.getElementById(id);
    if (existing) return existing;

    const mount = document.createElement('div');
    mount.id = id;
    mount.className = className;
    appRoot.appendChild(mount);

    return mount;
}

function startWorld() {
    const mount = createMount('world-mount', 'world-mount');

    if (world) {
        world.destroy();
    }

    world = new World(mount);
    return world;
}

function getChatAuthor() {
    const profile = playerSession?.profile;

    if (!profile) return '';

    if (
        typeof profile.username === 'string' &&
        profile.username.trim()
    ) {
        return profile.username.trim();
    }

    return [
        typeof profile.firstName === 'string' ? profile.firstName.trim() : '',
        typeof profile.lastName === 'string' ? profile.lastName.trim() : ''
    ].filter(Boolean).join(' ');
}

function startChat() {
    const mount = createMount('chat-widget-mount', 'chat-widget-mount');

    if (chatWidget) {
        chatWidget.destroy();
    }

    chatWidget = new ChatWidget({
        author: getChatAuthor()
    });

    if (!chatWidget.mountTo(mount)) {
        throw new Error('[FREEzzzGames] Geek Chat could not be mounted.');
    }

    return chatWidget;
}

function startLore() {
    const mount = createMount('lore-widget-mount', 'lore-widget-mount');

    if (loreWidget) {
        loreWidget.destroy();
    }

    loreWidget = new LoreWidget();
    if (!loreWidget.mountTo(mount)) {
        throw new Error('[FREEzzzGames] Lore could not be mounted.');
    }

    return loreWidget;
}

function finishBoot() {
    TelegramAdapter.ready();
    setAppData('appVersion', APP_VERSION);
    setAppData('initialized', 'true');

    if (bootScreen) {
        bootScreen.remove();
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(notifyLayoutChanged);
    });
}

function showBootError(error, stage) {
    const errorName =
        error instanceof Error ? error.name : 'NonErrorThrown';

    const message =
        error instanceof Error ? error.message : String(error);

    const stack =
        error instanceof Error && error.stack
            ? `\nStack:\n${error.stack}`
            : '';

    setBootStatus(`Startup error — ${stage}`, true);

    if (!appRoot) return;

    let errorElement = appRoot.querySelector('.app-error');

    if (!errorElement) {
        errorElement = document.createElement('pre');
        errorElement.className = 'app-error';
        appRoot.appendChild(errorElement);
    }

    errorElement.textContent =
        `Stage: ${stage}\nName: ${errorName}\nMessage: ${message}${stack}`;
}

async function startApp() {
    if (!appRoot) {
        throw new Error('[FREEzzzGames] #app was not found.');
    }

    startupStage = 'Telegram initialization';
    setBootStatus('Initializing…');

    initializeTelegram();

    startupStage = 'Session initialization';
    playerSession = await initializeSession();

    startupStage = 'World startup';
    setBootStatus('Starting World…');
    startWorld();

    startupStage = 'Geek Chat startup';
    setBootStatus('Starting Geek Chat…');
    startChat();

    startupStage = 'Lore startup';
    startLore();

    startupStage = 'finish boot';
    finishBoot();

    console.info('[FREEzzzGames] Application initialized.', {
        version: APP_VERSION,
        runtime: appRoot.dataset.runtime,
        telegramAuthenticated:
            appRoot.dataset.telegramAuthenticated === 'true'
    });

    return {
        world,
        chatWidget,
        playerSession
    };
}

startApp().catch(error => {
    console.error(
        '[FREEzzzGames] Application initialization failed:',
        error
    );

    showBootError(error, startupStage);
});

export {
    APP_VERSION,
    startApp,
    world,
    chatWidget,
    loreWidget,
    playerSession
};

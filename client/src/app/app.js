'use strict';

/*
 * FREEzzzGames
 * Application bootstrap
 *
 * Ответственность этого модуля:
 * - запустить клиентское приложение;
 * - подготовить базовый контейнер;
 * - проверить доступность Telegram WebApp;
 * - передать управление следующим модулям.
 *
 * ВАЖНО:
 * Этот модуль пока НЕ содержит игровую логику.
 */

const APP_VERSION = '0.1.0';

const appRoot = document.querySelector('#app');
const bootScreen = document.querySelector('#boot-screen');
const bootStatus = document.querySelector('#boot-status');

function getTelegramWebApp() {
    if (
        typeof window !== 'undefined' &&
        window.Telegram &&
        window.Telegram.WebApp
    ) {
        return window.Telegram.WebApp;
    }

    return null;
}

function initializeTelegram() {
    const telegram = getTelegramWebApp();

    if (!telegram) {
        return null;
    }

    try {
        telegram.ready();

        if (typeof telegram.expand === 'function') {
            telegram.expand();
        }
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Telegram initialization warning:',
            error
        );
    }

    return telegram;
}

function updateBootStatus(message) {
    if (!bootStatus) {
        return;
    }

    bootStatus.textContent = message;
}

function startApp() {
    if (!appRoot) {
        throw new Error(
            '[FREEzzzGames] Application root #app was not found.'
        );
    }

    const telegram = initializeTelegram();

    if (telegram) {
        updateBootStatus('FREEzzzGames');
    } else {
        updateBootStatus('FREEzzzGames');

        console.info(
            '[FREEzzzGames] Telegram WebApp API is not available. ' +
            'Running in browser mode.'
        );
    }

    appRoot.dataset.appVersion = APP_VERSION;
    appRoot.dataset.initialized = 'true';

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

    updateBootStatus('FREEzzzGames');
}
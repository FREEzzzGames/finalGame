'use strict';

/*
 * FREEzzzGames
 * Telegram theme adapter
 *
 * Ответственность:
 * - получить текущую тему Telegram;
 * - безопасно определить цветовую схему;
 * - применить базовые системные цвета;
 * - не смешивать Telegram-тему с игровой графикой.
 *
 * ВАЖНО:
 * Игровые цвета и визуальный стиль мира
 * не должны зависеть от этого модуля.
 */

import TelegramAdapter from './telegram.js?v=0.4.0';

let unsubscribeTheme = null;

function getColorScheme() {
    return TelegramAdapter.getTheme().colorScheme || 'light';
}

function getThemeParams() {
    return TelegramAdapter.getTheme().params;
}

function applyTheme() {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    const scheme = getColorScheme();
    const params = getThemeParams();

    root.dataset.telegramTheme = scheme;

    if (params.bg_color) {
        root.style.setProperty(
            '--telegram-bg',
            params.bg_color
        );
    }

    if (params.text_color) {
        root.style.setProperty(
            '--telegram-text',
            params.text_color
        );
    }

    if (params.hint_color) {
        root.style.setProperty(
            '--telegram-hint',
            params.hint_color
        );
    }

    if (params.link_color) {
        root.style.setProperty(
            '--telegram-link',
            params.link_color
        );
    }

    if (params.button_color) {
        root.style.setProperty(
            '--telegram-button',
            params.button_color
        );
    }

    if (params.button_text_color) {
        root.style.setProperty(
            '--telegram-button-text',
            params.button_text_color
        );
    }
}

function initializeTheme() {
    applyTheme();

    if (unsubscribeTheme) unsubscribeTheme();
    unsubscribeTheme = TelegramAdapter.onThemeChanged(applyTheme);

    return {
        scheme: getColorScheme(),
        params: getThemeParams()
    };
}

const TelegramTheme = Object.freeze({
    getColorScheme,
    getThemeParams,
    applyTheme,
    initializeTheme
});

export default TelegramTheme;

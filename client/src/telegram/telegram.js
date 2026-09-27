'use strict';

/*
 * FREEzzzGames
 * Telegram WebApp adapter
 *
 * Ответственность:
 * - обнаружить Telegram WebApp;
 * - выполнить базовую инициализацию;
 * - предоставить безопасный доступ к API;
 * - не смешивать Telegram-логику с игровой логикой.
 *
 * ВАЖНО:
 * initDataUnsafe НЕ используется для авторизации.
 * Авторизация и проверка пользователя выполняются сервером.
 */

const TelegramAdapter = (() => {
    let webApp = null;
    let initialized = false;

    function detect() {
        if (
            typeof window === 'undefined' ||
            !window.Telegram ||
            !window.Telegram.WebApp
        ) {
            return false;
        }

        webApp = window.Telegram.WebApp;

        return true;
    }

    function init() {
        if (initialized) {
            return webApp;
        }

        if (!detect()) {
            return null;
        }

        try {
            if (typeof webApp.ready === 'function') {
                webApp.ready();
            }

            if (typeof webApp.expand === 'function') {
                webApp.expand();
            }

            initialized = true;

            return webApp;
        } catch (error) {
            console.error(
                '[FREEzzzGames] Telegram initialization failed:',
                error
            );

            return null;
        }
    }

    function isAvailable() {
        return webApp !== null || detect();
    }

    function isInitialized() {
        return initialized;
    }

    function getWebApp() {
        return webApp;
    }

    function getInitData() {
        if (!webApp || typeof webApp.initData !== 'string') {
            return '';
        }

        return webApp.initData;
    }

    function getVersion() {
        if (!webApp) {
            return null;
        }

        return webApp.version || null;
    }

    function getPlatform() {
        if (!webApp) {
            return null;
        }

        return webApp.platform || null;
    }

    function getColorScheme() {
        if (!webApp) {
            return null;
        }

        return webApp.colorScheme || null;
    }

    function isExpanded() {
        if (!webApp) {
            return false;
        }

        return webApp.isExpanded === true;
    }

    function getViewportHeight() {
        if (!webApp) {
            return null;
        }

        const height =
            Number(webApp.viewportHeight);

        return Number.isFinite(height) && height > 0
            ? height
            : null;
    }

    function getViewportStableHeight() {
        if (!webApp) {
            return null;
        }

        const height =
            Number(webApp.viewportStableHeight);

        return Number.isFinite(height) && height > 0
            ? height
            : null;
    }

    function onViewportChanged(callback) {
        if (
            !webApp ||
            typeof callback !== 'function' ||
            typeof webApp.onEvent !== 'function'
        ) {
            return () => {};
        }

        const handler = () => {
            callback({
                height: getViewportHeight(),
                stableHeight: getViewportStableHeight(),
                isStateStable:
                    webApp.isStateStable === true
            });
        };

        try {
            webApp.onEvent(
                'viewportChanged',
                handler
            );

            return () => {
                try {
                    if (
                        typeof webApp.offEvent === 'function'
                    ) {
                        webApp.offEvent(
                            'viewportChanged',
                            handler
                        );
                    }
                } catch (error) {
                    console.warn(
                        '[FREEzzzGames] Telegram viewport listener cleanup error:',
                        error
                    );
                }
            };
        } catch (error) {
            console.warn(
                '[FREEzzzGames] Telegram viewport listener error:',
                error
            );

            return () => {};
        }
    }

    function setHeaderColor(color) {
        if (
            !webApp ||
            typeof webApp.setHeaderColor !== 'function'
        ) {
            return false;
        }

        try {
            webApp.setHeaderColor(color);
            return true;
        } catch (error) {
            console.warn(
                '[FREEzzzGames] Telegram header color error:',
                error
            );

            return false;
        }
    }

    function setBackgroundColor(color) {
        if (
            !webApp ||
            typeof webApp.setBackgroundColor !== 'function'
        ) {
            return false;
        }

        try {
            webApp.setBackgroundColor(color);
            return true;
        } catch (error) {
            console.warn(
                '[FREEzzzGames] Telegram background color error:',
                error
            );

            return false;
        }
    }

    function close() {
        if (
            !webApp ||
            typeof webApp.close !== 'function'
        ) {
            return false;
        }

        try {
            webApp.close();
            return true;
        } catch (error) {
            console.warn(
                '[FREEzzzGames] Telegram close error:',
                error
            );

            return false;
        }
    }

    return Object.freeze({
        init,
        isAvailable,
        isInitialized,
        getWebApp,
        getInitData,
        getVersion,
        getPlatform,
        getColorScheme,
        isExpanded,
        getViewportHeight,
        getViewportStableHeight,
        onViewportChanged,
        setHeaderColor,
        setBackgroundColor,
        close
    });
})();

export default TelegramAdapter;
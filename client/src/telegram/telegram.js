'use strict';

/*
 * FREEzzzGames
 * Telegram WebApp adapter
 *
 * Ответственность:
 * - обнаружить Telegram WebApp;
 * - выполнить базовую инициализацию;
 * - предоставить безопасный доступ к API;
 * - получить проверенный сервером профиль игрока;
 * - не смешивать Telegram-логику с игровой логикой.
 *
 * ВАЖНО:
 * initDataUnsafe НЕ используется для авторизации.
 * Авторизация и проверка пользователя выполняются сервером.
 *
 * API:
 * - по умолчанию используется публичный FREEzzzGames backend;
 * - внешний backend может быть задан через
 *   window.__FREEZZGAMES_API_BASE_URL__.
 */

const DEFAULT_API_BASE_URL =
    'https://universe-fjwj.onrender.com/api';

const TelegramAdapter = (() => {
    let webApp = null;
    let initialized = false;

    const getApiBaseUrl = () => {
        if (
            typeof window !== 'undefined' &&
            typeof window.__FREEZZGAMES_API_BASE_URL__ === 'string'
        ) {
            const value =
                window.__FREEZZGAMES_API_BASE_URL__.trim();

            if (value.length > 0) {
                return value.replace(/\/+$/, '');
            }
        }

        return DEFAULT_API_BASE_URL;
    };

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

    function expand() {
        if (
            !webApp ||
            typeof webApp.expand !== 'function'
        ) {
            return false;
        }

        try {
            webApp.expand();

            return true;
        } catch (error) {
            console.warn(
                '[FREEzzzGames] Telegram expand warning:',
                error
            );

            return false;
        }
    }

    function isAvailable() {
        /*
         * Telegram WebApp JavaScript API может быть загружен
         * и в обычном браузере, потому что telegram-web-app.js
         * подключён глобально в index.html.
         *
         * Поэтому самого наличия window.Telegram.WebApp
         * недостаточно для определения реального Telegram runtime.
         *
         * Для авторизации считаем Telegram доступным только
         * если Telegram передал непустой initData.
         */
        if (!webApp && !detect()) {
            return false;
        }

        return getInitData().length > 0;
    }

    function isInitialized() {
        return initialized;
    }

    function getWebApp() {
        return webApp;
    }

    function getInitData() {
        if (
            !webApp ||
            typeof webApp.initData !== 'string'
        ) {
            return '';
        }

        return webApp.initData;
    }

    async function authenticate() {
        const initData =
            getInitData();

        if (!initData) {
            return {
                authenticated: false,
                profile: null,
                state: null,
                error: 'TELEGRAM_INIT_DATA_MISSING'
            };
        }

        const apiBaseUrl =
            getApiBaseUrl();

        const stateUrl =
            `${apiBaseUrl}/state`;

        try {
            const response =
                await fetch(
                    stateUrl,
                    {
                        method: 'GET',

                        headers: {
                            'x-telegram-init-data':
                                initData,

                            'Accept':
                                'application/json'
                        },

                        /*
                         * Для отдельного backend
                         * авторизация выполняется через
                         * Telegram initData header.
                         *
                         * Cookies backend здесь
                         * не являются источником
                         * идентификации пользователя.
                         */
                        credentials:
                            'omit'
                    }
                );

            let payload = null;

            try {
                payload =
                    await response.json();
            } catch {
                payload = null;
            }

            if (!response.ok) {
                return {
                    authenticated: false,
                    profile: null,
                    state: null,
                    error:
                        payload &&
                        typeof payload.error === 'string'
                            ? payload.error
                            : `HTTP_${response.status}`
                };
            }

            if (
                !payload ||
                typeof payload !== 'object'
            ) {
                return {
                    authenticated: false,
                    profile: null,
                    state: null,
                    error: 'INVALID_SERVER_RESPONSE'
                };
            }

            /*
             * Server API response:
             *
             * {
             *     ok: true,
             *     data: {
             *         profile: {},
             *         state: {}
             *     }
             * }
             *
             * Поддерживаем только серверный
             * формат ответа.
             */
            const data =
                payload.data;

            if (
                !data ||
                typeof data !== 'object'
            ) {
                return {
                    authenticated: false,
                    profile: null,
                    state: null,
                    error: 'INVALID_SERVER_RESPONSE_DATA'
                };
            }

            return {
                authenticated: true,

                profile:
                    data.profile || null,

                state:
                    data.state || null,

                error: null
            };
        } catch (error) {
            console.error(
                '[FREEzzzGames] Telegram authentication request failed:',
                error
            );

            return {
                authenticated: false,
                profile: null,
                state: null,
                error: 'TELEGRAM_AUTH_REQUEST_FAILED'
            };
        }
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

        const height = Number(
            webApp.viewportHeight
        );

        return Number.isFinite(height) && height > 0
            ? height
            : null;
    }

    function getViewportStableHeight() {
        if (!webApp) {
            return null;
        }

        const height = Number(
            webApp.viewportStableHeight
        );

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

        /*
         * Telegram передаёт объект события:
         *
         * {
         *     isStateStable: boolean
         * }
         *
         * Не читаем isStateStable из webApp —
         * это не значение события.
         */
        const handler = (event) => {
            const viewportEvent =
                event && typeof event === 'object'
                    ? event
                    : {};

            callback({
                height:
                    getViewportHeight(),

                stableHeight:
                    getViewportStableHeight(),

                isStateStable:
                    viewportEvent.isStateStable === true
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
        expand,
        isAvailable,
        isInitialized,
        getWebApp,
        getInitData,
        authenticate,
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

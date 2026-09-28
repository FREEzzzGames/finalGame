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
 *
 * Серверные запросы выполняются отдельными API/Session модулями.
 */

const TelegramAdapter = (() => {
    let webApp = null;
    let initialized = false;
    let readyCalled = false;

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

        initialized = true;
        return webApp;
    }

    function ready() {
        if (!webApp || readyCalled || typeof webApp.ready !== 'function') {
            return false;
        }

        try {
            webApp.ready();
            readyCalled = true;
            return true;
        } catch (error) {
            console.warn('[FREEzzzGames] Telegram ready warning:', error);
            return false;
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

    function getInitData() {
        if (
            !webApp ||
            typeof webApp.initData !== 'string'
        ) {
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

    function getTheme() {
        return Object.freeze({
            colorScheme: getColorScheme(),
            params: Object.freeze({
                ...(webApp?.themeParams || {})
            })
        });
    }

    function getSafeAreaInset() {
        const inset = webApp?.safeAreaInset || {};
        return Object.freeze({
            top: Number(inset.top) || 0,
            right: Number(inset.right) || 0,
            bottom: Number(inset.bottom) || 0,
            left: Number(inset.left) || 0
        });
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

    function getViewport() {
        return Object.freeze({
            height: getViewportHeight(),
            stableHeight: getViewportStableHeight()
        });
    }

    function subscribeEvent(eventName, callback) {
        if (
            !webApp ||
            typeof callback !== 'function' ||
            typeof webApp.onEvent !== 'function'
        ) {
            return () => {};
        }

        try {
            webApp.onEvent(eventName, callback);
            return () => {
                try {
                    if (typeof webApp.offEvent === 'function') {
                        webApp.offEvent(eventName, callback);
                    }
                } catch (error) {
                    console.warn(`[FREEzzzGames] Telegram ${eventName} cleanup warning:`, error);
                }
            };
        } catch (error) {
            console.warn(`[FREEzzzGames] Telegram ${eventName} listener warning:`, error);
            return () => {};
        }
    }

    function onThemeChanged(callback) {
        return subscribeEvent('themeChanged', callback);
    }

    function onLifecycle(callback) {
        if (typeof callback !== 'function') return () => {};

        let lastActive = null;
        const notify = active => {
            if (lastActive === active) return;
            lastActive = active;
            callback(Object.freeze({ active }));
        };
        const onVisibilityChanged = () => {
            if (typeof document !== 'undefined') {
                notify(document.visibilityState !== 'hidden');
            }
        };
        const cleanups = [
            subscribeEvent('activated', () => notify(true)),
            subscribeEvent('deactivated', () => notify(false))
        ];

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', onVisibilityChanged);
            onVisibilityChanged();
        }

        return () => {
            cleanups.forEach(cleanup => cleanup());
            if (typeof document !== 'undefined') {
                document.removeEventListener('visibilitychange', onVisibilityChanged);
            }
        };
    }

    function getHapticFeedback() {
        return webApp?.HapticFeedback || null;
    }

    function triggerHaptic(method, value) {
        const haptics = getHapticFeedback();
        const handler = haptics?.[method];
        if (typeof handler !== 'function') return false;

        try {
            if (value === undefined) handler.call(haptics);
            else handler.call(haptics, value);
            return true;
        } catch (error) {
            console.warn(`[FREEzzzGames] Telegram ${method} warning:`, error);
            return false;
        }
    }

    function triggerImpact(style) {
        return triggerHaptic('impactOccurred', style);
    }

    function triggerNotification(type) {
        return triggerHaptic('notificationOccurred', type);
    }

    function triggerSelection() {
        return triggerHaptic('selectionChanged');
    }

    function isHapticsAvailable() {
        return getHapticFeedback() !== null;
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
        initialize: init,
        ready,
        expand,
        isAvailable,
        isInitialized,
        getInitData,
        getVersion,
        getPlatform,
        getColorScheme,
        getTheme,
        getSafeAreaInset,
        isExpanded,
        getViewport,
        getViewportHeight,
        getViewportStableHeight,
        onViewportChanged,
        onThemeChanged,
        onLifecycle,
        isHapticsAvailable,
        triggerImpact,
        triggerNotification,
        triggerSelection,
        setHeaderColor,
        setBackgroundColor,
        close
    });
})();

export default TelegramAdapter;

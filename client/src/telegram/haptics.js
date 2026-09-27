'use strict';

/*
 * FREEzzzGames
 * Telegram haptics adapter
 *
 * Ответственность:
 * - безопасно работать с Telegram HapticFeedback API;
 * - предоставить единый интерфейс тактильной обратной связи;
 * - корректно работать вне Telegram.
 *
 * ВАЖНО:
 * Haptics не являются обязательными для работы игры.
 */

function getHapticFeedback() {
    if (
        typeof window === 'undefined' ||
        !window.Telegram ||
        !window.Telegram.WebApp ||
        !window.Telegram.WebApp.HapticFeedback
    ) {
        return null;
    }

    return window.Telegram.WebApp.HapticFeedback;
}

function isAvailable() {
    return getHapticFeedback() !== null;
}

function impact(style = 'light') {
    const haptics = getHapticFeedback();

    if (
        !haptics ||
        typeof haptics.impactOccurred !== 'function'
    ) {
        return false;
    }

    const allowedStyles = [
        'light',
        'medium',
        'heavy',
        'rigid',
        'soft'
    ];

    const safeStyle = allowedStyles.includes(style)
        ? style
        : 'light';

    try {
        haptics.impactOccurred(safeStyle);
        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Haptic impact error:',
            error
        );

        return false;
    }
}

function notification(type = 'success') {
    const haptics = getHapticFeedback();

    if (
        !haptics ||
        typeof haptics.notificationOccurred !== 'function'
    ) {
        return false;
    }

    const allowedTypes = [
        'error',
        'success',
        'warning'
    ];

    const safeType = allowedTypes.includes(type)
        ? type
        : 'success';

    try {
        haptics.notificationOccurred(safeType);
        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Haptic notification error:',
            error
        );

        return false;
    }
}

function selection() {
    const haptics = getHapticFeedback();

    if (
        !haptics ||
        typeof haptics.selectionChanged !== 'function'
    ) {
        return false;
    }

    try {
        haptics.selectionChanged();
        return true;
    } catch (error) {
        console.warn(
            '[FREEzzzGames] Haptic selection error:',
            error
        );

        return false;
    }
}

const TelegramHaptics = Object.freeze({
    isAvailable,
    impact,
    notification,
    selection
});

export default TelegramHaptics;
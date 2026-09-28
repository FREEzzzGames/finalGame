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

import TelegramAdapter from './telegram.js?v=0.4.0';

function isAvailable() {
    return TelegramAdapter.isHapticsAvailable();
}

function impact(style = 'light') {
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

    return TelegramAdapter.triggerImpact(safeStyle);
}

function notification(type = 'success') {
    const allowedTypes = [
        'error',
        'success',
        'warning'
    ];

    const safeType = allowedTypes.includes(type)
        ? type
        : 'success';

    return TelegramAdapter.triggerNotification(safeType);
}

function selection() {
    return TelegramAdapter.triggerSelection();
}

const TelegramHaptics = Object.freeze({
    isAvailable,
    impact,
    notification,
    selection
});

export default TelegramHaptics;

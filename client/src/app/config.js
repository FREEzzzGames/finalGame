'use strict';

/*
 * FREEzzzGames
 * Application configuration
 *
 * Только базовые настройки приложения.
 * Игровая логика, экономика, мир и другие системы
 * здесь не размещаются.
 */

const APP_CONFIG = Object.freeze({
    name: 'FREEzzzGames',

    version: '0.1.0',

    environment: 'development',

    defaultLanguage: 'ru',

    supportedLanguages: Object.freeze([
        'ru',
        'de',
        'en'
    ]),

    orientation: 'portrait',

    telegram: Object.freeze({
        enabled: true
    })
});

export default APP_CONFIG;
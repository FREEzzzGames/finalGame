'use strict';

/*
 * FREEzzzGames
 * Localization manager
 *
 * Supported languages:
 * RU / DE / EN
 *
 * This module only manages localization.
 * It does not modify UI, routing or game logic.
 */

import RU from './ru.js';
import DE from './de.js';
import EN from './en.js';

const LANGUAGES = Object.freeze({
    ru: RU,
    de: DE,
    en: EN
});

const LANGUAGE_ORDER = Object.freeze(['ru', 'de', 'en']);

let currentLanguage = 'ru';

function isSupportedLanguage(code) {
    return LANGUAGE_ORDER.includes(code);
}

function getLanguage() {
    return currentLanguage;
}

function setLanguage(code) {
    if (!isSupportedLanguage(code)) {
        return false;
    }

    currentLanguage = code;
    return true;
}

function cycleLanguage() {
    const currentIndex = LANGUAGE_ORDER.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % LANGUAGE_ORDER.length;

    currentLanguage = LANGUAGE_ORDER[nextIndex];

    return currentLanguage;
}

function getDictionary(code = currentLanguage) {
    if (!isSupportedLanguage(code)) {
        return LANGUAGES[currentLanguage];
    }

    return LANGUAGES[code];
}

function get(path, fallback = '') {
    const dictionary = getDictionary();

    if (!path || typeof path !== 'string') {
        return fallback;
    }

    const parts = path.split('.');
    let value = dictionary;

    for (const part of parts) {
        if (
            value === null ||
            value === undefined ||
            typeof value !== 'object' ||
            !(part in value)
        ) {
            return fallback;
        }

        value = value[part];
    }

    return typeof value === 'string' ? value : fallback;
}

const I18n = Object.freeze({
    languages: LANGUAGES,
    languageOrder: LANGUAGE_ORDER,
    getLanguage,
    setLanguage,
    cycleLanguage,
    getDictionary,
    get,
    isSupportedLanguage
});

export {
    LANGUAGES,
    LANGUAGE_ORDER,
    getLanguage,
    setLanguage,
    cycleLanguage,
    getDictionary,
    get,
    isSupportedLanguage
};

export default I18n;
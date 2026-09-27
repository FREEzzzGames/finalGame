'use strict';

/*
 * FREEzzzGames
 * Localization manager
 *
 * Ответственность:
 * - хранить текущий язык;
 * - переключать RU → DE → EN → RU;
 * - сохранять выбор языка;
 * - предоставлять текущий словарь.
 *
 * Игровая логика здесь отсутствует.
 */

import RU from './ru.js';
import DE from './de.js';
import EN from './en.js';

const STORAGE_KEY =
    'freezzgames.language.v1';

const LANGUAGES = Object.freeze([
    RU,
    DE,
    EN
]);

const LANGUAGE_CODES = Object.freeze([
    'ru',
    'de',
    'en'
]);

function isSupportedLanguage(code) {
    return LANGUAGE_CODES.includes(
        code
    );
}

function loadLanguage() {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (
            isSupportedLanguage(saved)
        ) {
            return saved;
        }
    } catch {
        // localStorage может быть недоступен.
    }

    return 'ru';
}

function saveLanguage(code) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            code
        );
    } catch {
        // Язык продолжит работать
        // даже без localStorage.
    }
}

class I18n {
    constructor() {
        this.currentCode =
            loadLanguage();
    }

    get code() {
        return this.currentCode;
    }

    get locale() {
        return this.getLocale(
            this.currentCode
        );
    }

    getLocale(code) {
        return (
            LANGUAGES.find(
                language =>
                    language.code === code
            ) || RU
        );
    }

    setLanguage(code) {
        if (
            !isSupportedLanguage(code)
        ) {
            return false;
        }

        this.currentCode =
            code;

        saveLanguage(
            code
        );

        return true;
    }

    nextLanguage() {
        const currentIndex =
            LANGUAGE_CODES.indexOf(
                this.currentCode
            );

        const nextIndex =
            (
                currentIndex + 1
            ) %
            LANGUAGE_CODES.length;

        const nextCode =
            LANGUAGE_CODES[
                nextIndex
            ];

        this.setLanguage(
            nextCode
        );

        return this.locale;
    }

    t(path) {
        const parts =
            String(path)
                .split('.');

        let value =
            this.locale;

        for (
            const part of parts
        ) {
            if (
                value === null ||
                value === undefined
            ) {
                return path;
            }

            value =
                value[part];
        }

        return (
            typeof value === 'string'
                ? value
                : path
        );
    }
}

const i18n =
    new I18n();

export {
    I18n,
    LANGUAGES,
    LANGUAGE_CODES
};

export default i18n;
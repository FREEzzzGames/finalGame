'use strict';

/*
 * FREEzzzGames
 * Profile settings
 *
 * Stores basic local profile settings.
 * Authentication, Telegram identity and server persistence
 * are handled by separate modules.
 */

const DEFAULT_SETTINGS = Object.freeze({
    language: 'ru',
    hintsEnabled: true,
    soundEnabled: true
});

class Settings {
    constructor() {
        this.settings = {
            ...DEFAULT_SETTINGS
        };
    }

    setLanguage(language) {
        if (
            typeof language !== 'string' ||
            !language.trim()
        ) {
            return false;
        }

        this.settings.language = language.trim();

        return true;
    }

    getLanguage() {
        return this.settings.language;
    }

    setHintsEnabled(enabled) {
        this.settings.hintsEnabled = Boolean(enabled);

        return true;
    }

    areHintsEnabled() {
        return this.settings.hintsEnabled;
    }

    setSoundEnabled(enabled) {
        this.settings.soundEnabled = Boolean(enabled);

        return true;
    }

    isSoundEnabled() {
        return this.settings.soundEnabled;
    }

    get() {
        return {
            ...this.settings
        };
    }

    reset() {
        this.settings = {
            ...DEFAULT_SETTINGS
        };
    }
}

const settings = new Settings();

export {
    Settings,
    DEFAULT_SETTINGS
};

export default settings;
'use strict';

/*
 * FREEzzzGames
 * Player profile
 *
 * Stores basic local profile state.
 * Authentication, Telegram identity and server persistence
 * are handled by separate modules.
 */

const DEFAULT_PROFILE = Object.freeze({
    nickname: 'Player',
    avatarId: 'default',
    language: 'ru'
});

class Profile {
    constructor() {
        this.profile = {
            ...DEFAULT_PROFILE
        };
    }

    setNickname(nickname) {
        if (
            typeof nickname !== 'string' ||
            !nickname.trim()
        ) {
            return false;
        }

        this.profile.nickname = nickname.trim();

        return true;
    }

    getNickname() {
        return this.profile.nickname;
    }

    setAvatar(avatarId) {
        if (
            typeof avatarId !== 'string' ||
            !avatarId.trim()
        ) {
            return false;
        }

        this.profile.avatarId = avatarId;

        return true;
    }

    getAvatar() {
        return this.profile.avatarId;
    }

    setLanguage(language) {
        if (
            typeof language !== 'string' ||
            !language.trim()
        ) {
            return false;
        }

        this.profile.language = language.trim();

        return true;
    }

    getLanguage() {
        return this.profile.language;
    }

    get() {
        return {
            ...this.profile
        };
    }

    reset() {
        this.profile = {
            ...DEFAULT_PROFILE
        };
    }
}

const profile = new Profile();

export {
    Profile,
    DEFAULT_PROFILE
};

export default profile;
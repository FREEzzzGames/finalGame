'use strict';

/*
 * FREEzzzGames
 * Chat avatars
 *
 * Stores avatar definitions and user avatar selections.
 * This module manages avatar state only.
 * Chat rooms, messages, realtime and moderation
 * are handled by separate modules.
 */

const DEFAULT_AVATAR = Object.freeze({
    id: 'default',
    name: 'Default',
    rarity: 'common',
    asset: null
});

class Avatars {
    constructor() {
        this.avatars = new Map();
        this.userAvatars = new Map();

        this.avatars.set(DEFAULT_AVATAR.id, {
            ...DEFAULT_AVATAR
        });
    }

    add(id, name = id, rarity = 'common', asset = null) {
        if (
            typeof id !== 'string' ||
            !id.trim()
        ) {
            return false;
        }

        if (this.avatars.has(id)) {
            return false;
        }

        this.avatars.set(id, {
            id,
            name: typeof name === 'string' && name.trim()
                ? name.trim()
                : id,
            rarity: typeof rarity === 'string' && rarity.trim()
                ? rarity.trim()
                : 'common',
            asset
        });

        return true;
    }

    remove(id) {
        if (
            typeof id !== 'string' ||
            id === DEFAULT_AVATAR.id
        ) {
            return false;
        }

        return this.avatars.delete(id);
    }

    has(id) {
        return this.avatars.has(id);
    }

    get(id) {
        const avatar = this.avatars.get(id);

        if (!avatar) {
            return null;
        }

        return {
            ...avatar
        };
    }

    getAll() {
        return Array.from(this.avatars.values()).map(avatar => ({
            ...avatar
        }));
    }

    setUserAvatar(userId, avatarId) {
        if (
            typeof userId !== 'string' ||
            !userId.trim() ||
            !this.avatars.has(avatarId)
        ) {
            return false;
        }

        this.userAvatars.set(userId, avatarId);

        return true;
    }

    getUserAvatar(userId) {
        if (
            typeof userId !== 'string' ||
            !userId.trim()
        ) {
            return null;
        }

        const avatarId = this.userAvatars.get(userId);

        if (!avatarId) {
            return {
                ...DEFAULT_AVATAR
            };
        }

        return this.get(avatarId);
    }

    removeUser(userId) {
        if (
            typeof userId !== 'string' ||
            !userId.trim()
        ) {
            return false;
        }

        return this.userAvatars.delete(userId);
    }

    clear() {
        this.avatars.clear();
        this.userAvatars.clear();

        this.avatars.set(DEFAULT_AVATAR.id, {
            ...DEFAULT_AVATAR
        });
    }

    count() {
        return this.avatars.size;
    }

    userCount() {
        return this.userAvatars.size;
    }
}

const avatars = new Avatars();

export {
    Avatars,
    DEFAULT_AVATAR
};

export default avatars;
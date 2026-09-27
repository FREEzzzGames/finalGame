'use strict';

/*
 * FREEzzzGames
 * Chat messages
 *
 * Stores chat messages for rooms.
 * This module manages message state only.
 * Rooms, avatars, realtime and moderation
 * are handled by separate modules.
 */

class Messages {
    constructor() {
        this.messages = new Map();
    }

    ensureRoom(roomId) {
        if (
            typeof roomId !== 'string' ||
            !roomId.trim()
        ) {
            return false;
        }

        if (!this.messages.has(roomId)) {
            this.messages.set(roomId, []);
        }

        return true;
    }

    add(roomId, message) {
        if (
            !this.ensureRoom(roomId) ||
            !message ||
            typeof message !== 'object'
        ) {
            return false;
        }

        const entry = {
            ...message,
            roomId
        };

        this.messages.get(roomId).push(entry);

        return {
            ...entry
        };
    }

    get(roomId) {
        if (
            typeof roomId !== 'string' ||
            !this.messages.has(roomId)
        ) {
            return [];
        }

        return this.messages.get(roomId).map(message => ({
            ...message
        }));
    }

    remove(roomId, messageId) {
        if (
            typeof roomId !== 'string' ||
            !this.messages.has(roomId)
        ) {
            return false;
        }

        const list = this.messages.get(roomId);
        const index = list.findIndex(
            message => message.id === messageId
        );

        if (index === -1) {
            return false;
        }

        list.splice(index, 1);

        return true;
    }

    clear(roomId) {
        if (
            typeof roomId !== 'string' ||
            !this.messages.has(roomId)
        ) {
            return false;
        }

        this.messages.set(roomId, []);

        return true;
    }

    clearAll() {
        this.messages.clear();
    }

    count(roomId) {
        if (
            typeof roomId !== 'string' ||
            !this.messages.has(roomId)
        ) {
            return 0;
        }

        return this.messages.get(roomId).length;
    }

    countAll() {
        let total = 0;

        for (const list of this.messages.values()) {
            total += list.length;
        }

        return total;
    }
}

const messages = new Messages();

export {
    Messages
};

export default messages;
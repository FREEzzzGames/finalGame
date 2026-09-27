'use strict';

/*
 * FREEzzzGames
 * Chat manager
 *
 * Stores chat messages and basic room state.
 * This module manages chat state only.
 * Rooms, avatars, realtime transport and moderation
 * are handled by separate modules.
 */

const DEFAULT_ROOM = 'global';
const MAX_MESSAGE_LENGTH = 500;

class Chat {
    constructor(options = {}) {
        this.currentRoom = typeof options.room === 'string' &&
            options.room.trim()
            ? options.room
            : DEFAULT_ROOM;

        this.messages = new Map();
    }

    setRoom(room) {
        if (
            typeof room !== 'string' ||
            !room.trim()
        ) {
            return false;
        }

        this.currentRoom = room;

        return true;
    }

    getRoom() {
        return this.currentRoom;
    }

    send(text, options = {}) {
        if (
            typeof text !== 'string' ||
            !text.trim()
        ) {
            return false;
        }

        const messageText = text.trim();

        if (messageText.length > MAX_MESSAGE_LENGTH) {
            return false;
        }

        const id = typeof options.id === 'string' &&
            options.id.trim()
            ? options.id
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 10)}`;

        if (this.messages.has(id)) {
            return false;
        }

        const message = {
            id,
            room: this.currentRoom,
            text: messageText,
            author: typeof options.author === 'string'
                ? options.author
                : '',
            createdAt: typeof options.createdAt === 'string'
                ? options.createdAt
                : new Date().toISOString()
        };

        this.messages.set(id, message);

        return {
            ...message
        };
    }

    remove(id) {
        if (typeof id !== 'string') {
            return false;
        }

        return this.messages.delete(id);
    }

    get(id) {
        const message = this.messages.get(id);

        if (!message) {
            return null;
        }

        return {
            ...message
        };
    }

    getMessages(room = this.currentRoom) {
        if (
            typeof room !== 'string' ||
            !room.trim()
        ) {
            return [];
        }

        return Array.from(this.messages.values())
            .filter(message => message.room === room)
            .map(message => ({
                ...message
            }));
    }

    getAll() {
        return Array.from(this.messages.values()).map(
            message => ({
                ...message
            })
        );
    }

    clearRoom(room = this.currentRoom) {
        if (
            typeof room !== 'string' ||
            !room.trim()
        ) {
            return false;
        }

        for (const [id, message] of this.messages) {
            if (message.room === room) {
                this.messages.delete(id);
            }
        }

        return true;
    }

    clear() {
        this.messages.clear();
    }

    count(room = null) {
        if (room === null) {
            return this.messages.size;
        }

        return this.getMessages(room).length;
    }
}

const chat = new Chat();

export {
    Chat,
    DEFAULT_ROOM,
    MAX_MESSAGE_LENGTH
};

export default chat;
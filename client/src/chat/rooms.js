'use strict';

/*
 * FREEzzzGames
 * Chat rooms
 *
 * Stores chat room definitions.
 * This module manages room state only.
 * Messages, avatars, realtime and moderation
 * are handled by separate modules.
 */

const DEFAULT_ROOM = Object.freeze({
    id: 'global',
    name: 'Global',
    active: true
});

class Rooms {
    constructor() {
        this.rooms = new Map();

        this.rooms.set(DEFAULT_ROOM.id, {
            ...DEFAULT_ROOM
        });
    }

    add(id, name = id, options = {}) {
        if (
            typeof id !== 'string' ||
            !id.trim()
        ) {
            return false;
        }

        if (this.rooms.has(id)) {
            return false;
        }

        const roomName = typeof name === 'string' && name.trim()
            ? name.trim()
            : id;

        this.rooms.set(id, {
            id,
            name: roomName,
            active: options.active !== false
        });

        return true;
    }

    remove(id) {
        if (
            typeof id !== 'string' ||
            id === DEFAULT_ROOM.id
        ) {
            return false;
        }

        return this.rooms.delete(id);
    }

    has(id) {
        return this.rooms.has(id);
    }

    get(id) {
        const room = this.rooms.get(id);

        if (!room) {
            return null;
        }

        return {
            ...room
        };
    }

    rename(id, name) {
        const room = this.rooms.get(id);

        if (
            !room ||
            typeof name !== 'string' ||
            !name.trim()
        ) {
            return false;
        }

        room.name = name.trim();

        return true;
    }

    setActive(id, active) {
        const room = this.rooms.get(id);

        if (!room) {
            return false;
        }

        room.active = Boolean(active);

        return true;
    }

    getActive() {
        return this.getAll().filter(room => room.active);
    }

    getAll() {
        return Array.from(this.rooms.values()).map(room => ({
            ...room
        }));
    }

    clear() {
        this.rooms.clear();

        this.rooms.set(DEFAULT_ROOM.id, {
            ...DEFAULT_ROOM
        });
    }

    count() {
        return this.rooms.size;
    }
}

const rooms = new Rooms();

export {
    Rooms,
    DEFAULT_ROOM
};

export default rooms;
'use strict';

/*
 * FREEzzzGames
 * Development mode
 *
 * Stores local development/test flags only.
 * Production gameplay state and server-authoritative
 * data are handled by separate modules.
 */

const DEFAULT_DEV_MODE = false;

class DevMode {
    constructor() {
        this.enabled = DEFAULT_DEV_MODE;
        this.flags = new Map();
    }

    enable() {
        this.enabled = true;

        return true;
    }

    disable() {
        this.enabled = false;

        return true;
    }

    isEnabled() {
        return this.enabled;
    }

    setFlag(name, value = true) {
        if (
            !this.enabled ||
            typeof name !== 'string' ||
            !name.trim()
        ) {
            return false;
        }

        this.flags.set(name, value);

        return true;
    }

    getFlag(name, fallback = null) {
        if (typeof name !== 'string') {
            return fallback;
        }

        return this.flags.has(name)
            ? this.flags.get(name)
            : fallback;
    }

    hasFlag(name) {
        return (
            typeof name === 'string' &&
            this.flags.has(name)
        );
    }

    removeFlag(name) {
        if (typeof name !== 'string') {
            return false;
        }

        return this.flags.delete(name);
    }

    getAllFlags() {
        return Object.fromEntries(this.flags.entries());
    }

    clearFlags() {
        this.flags.clear();
    }

    reset() {
        this.enabled = DEFAULT_DEV_MODE;
        this.flags.clear();
    }

    count() {
        return this.flags.size;
    }
}

const devMode = new DevMode();

export {
    DevMode,
    DEFAULT_DEV_MODE
};

export default devMode;
'use strict';

/*
 * FREEzzzGames
 * Tutorial hints
 *
 * Stores contextual hint state.
 * UI rendering and game logic are handled
 * by separate modules.
 */

const DEFAULT_HINTS_ENABLED = true;

class Hints {
    constructor() {
        this.enabled = DEFAULT_HINTS_ENABLED;
        this.hints = new Map();
        this.completed = new Set();
    }

    add(id, text = '') {
        if (
            typeof id !== 'string' ||
            !id.trim()
        ) {
            return false;
        }

        if (this.hints.has(id)) {
            return false;
        }

        this.hints.set(id, {
            id,
            text: typeof text === 'string'
                ? text
                : ''
        });

        return true;
    }

    remove(id) {
        if (typeof id !== 'string') {
            return false;
        }

        this.completed.delete(id);

        return this.hints.delete(id);
    }

    has(id) {
        return this.hints.has(id);
    }

    get(id) {
        const hint = this.hints.get(id);

        if (!hint) {
            return null;
        }

        return {
            ...hint
        };
    }

    getAll() {
        return Array.from(this.hints.values()).map(hint => ({
            ...hint
        }));
    }

    complete(id) {
        if (!this.hints.has(id)) {
            return false;
        }

        this.completed.add(id);

        return true;
    }

    isCompleted(id) {
        return this.completed.has(id);
    }

    getPending() {
        return this.getAll().filter(
            hint => !this.completed.has(hint.id)
        );
    }

    setEnabled(enabled) {
        this.enabled = Boolean(enabled);

        return true;
    }

    isEnabled() {
        return this.enabled;
    }

    clearCompleted() {
        this.completed.clear();
    }

    clear() {
        this.hints.clear();
        this.completed.clear();
    }

    reset() {
        this.enabled = DEFAULT_HINTS_ENABLED;
        this.hints.clear();
        this.completed.clear();
    }

    count() {
        return this.hints.size;
    }

    pendingCount() {
        return this.getPending().length;
    }
}

const hints = new Hints();

export {
    Hints,
    DEFAULT_HINTS_ENABLED
};

export default hints;
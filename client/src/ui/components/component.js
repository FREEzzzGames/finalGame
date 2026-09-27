'use strict';

/*
 * FREEzzzGames
 * Base UI component
 *
 * Provides a minimal reusable component foundation.
 * Rendering, screens and game logic are handled
 * by separate modules.
 */

class Component {
    constructor(options = {}) {
        this.id = typeof options.id === 'string'
            ? options.id
            : '';

        this.element = null;
        this.mounted = false;
    }

    create() {
        if (typeof document === 'undefined') {
            return null;
        }

        if (this.element) {
            return this.element;
        }

        const element = document.createElement('div');

        if (this.id) {
            element.id = this.id;
        }

        this.element = element;

        return this.element;
    }

    mount(parent) {
        if (
            typeof document === 'undefined' ||
            !parent ||
            typeof parent.appendChild !== 'function'
        ) {
            return false;
        }

        const element = this.create();

        if (!element) {
            return false;
        }

        if (!element.parentNode) {
            parent.appendChild(element);
        }

        this.mounted = true;

        return true;
    }

    unmount() {
        if (
            !this.element ||
            !this.element.parentNode
        ) {
            this.mounted = false;

            return false;
        }

        this.element.parentNode.removeChild(this.element);
        this.mounted = false;

        return true;
    }

    destroy() {
        this.unmount();
        this.element = null;
    }

    isMounted() {
        return this.mounted;
    }
}

export {
    Component
};

export default Component;
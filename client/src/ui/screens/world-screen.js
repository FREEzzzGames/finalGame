'use strict';

/*
 * FREEzzzGames
 * World screen
 *
 * Provides the base UI container for the main world.
 * World rendering, camera, gestures and economy
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class WorldScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'world-screen'
        });

        this.world = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('world-screen');

        return element;
    }

    setWorld(world) {
        this.world = world || null;

        return true;
    }

    getWorld() {
        return this.world;
    }

    clearWorld() {
        this.world = null;

        return true;
    }
}

const worldScreen = new WorldScreen();

export {
    WorldScreen
};

export default worldScreen;
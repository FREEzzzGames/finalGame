'use strict';

/*
 * FREEzzzGames
 * Application screen
 *
 * Provides the base UI container for the application.
 * Individual screens and application routing
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class AppScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'app-screen'
        });

        this.currentScreen = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('app-screen');

        return element;
    }

    setCurrentScreen(screen) {
        this.currentScreen = screen || null;

        return true;
    }

    getCurrentScreen() {
        return this.currentScreen;
    }

    clearCurrentScreen() {
        this.currentScreen = null;

        return true;
    }
}

const appScreen = new AppScreen();

export {
    AppScreen
};

export default appScreen;
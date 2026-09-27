'use strict';

/*
 * FREEzzzGames
 * Settings screen
 *
 * Provides the base UI container for profile settings.
 * Settings state and application configuration
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class SettingsScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'settings-screen'
        });

        this.settings = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('settings-screen');

        return element;
    }

    setSettings(settings) {
        this.settings = settings || null;

        return true;
    }

    getSettings() {
        return this.settings;
    }

    clearSettings() {
        this.settings = null;

        return true;
    }
}

const settingsScreen = new SettingsScreen();

export {
    SettingsScreen
};

export default settingsScreen;
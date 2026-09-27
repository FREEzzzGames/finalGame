'use strict';

/*
 * FREEzzzGames
 * Profile screen
 *
 * Provides the base UI container for the player profile.
 * Profile state and settings are handled by separate modules.
 */

import Component from '../components/component.js';

class ProfileScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'profile-screen'
        });

        this.profile = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('profile-screen');

        return element;
    }

    setProfile(profile) {
        this.profile = profile || null;

        return true;
    }

    getProfile() {
        return this.profile;
    }

    clearProfile() {
        this.profile = null;

        return true;
    }
}

const profileScreen = new ProfileScreen();

export {
    ProfileScreen
};

export default profileScreen;
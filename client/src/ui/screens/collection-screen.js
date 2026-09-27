'use strict';

/*
 * FREEzzzGames
 * Collection screen
 *
 * Provides the base UI container for the player collection.
 * Collection data, heroes, rarity and market logic
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class CollectionScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'collection-screen'
        });

        this.collection = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('collection-screen');

        return element;
    }

    setCollection(collection) {
        this.collection = collection || null;

        return true;
    }

    getCollection() {
        return this.collection;
    }

    clearCollection() {
        this.collection = null;

        return true;
    }
}

const collectionScreen = new CollectionScreen();

export {
    CollectionScreen
};

export default collectionScreen;
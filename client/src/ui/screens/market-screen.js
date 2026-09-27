'use strict';

/*
 * FREEzzzGames
 * Market screen
 *
 * Provides the base UI container for the player market.
 * Market data, listings, auctions and ownership
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class MarketScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'market-screen'
        });

        this.market = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('market-screen');

        return element;
    }

    setMarket(market) {
        this.market = market || null;

        return true;
    }

    getMarket() {
        return this.market;
    }

    clearMarket() {
        this.market = null;

        return true;
    }
}

const marketScreen = new MarketScreen();

export {
    MarketScreen
};

export default marketScreen;
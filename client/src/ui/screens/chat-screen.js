'use strict';

/*
 * FREEzzzGames
 * Chat screen
 *
 * Provides the base UI container for chat.
 * Chat state, rooms, messages and avatars
 * are handled by separate modules.
 */

import Component from '../components/component.js';

class ChatScreen extends Component {
    constructor(options = {}) {
        super({
            id: options.id || 'chat-screen'
        });

        this.chat = null;
    }

    create() {
        const element = super.create();

        if (!element) {
            return null;
        }

        element.classList.add('chat-screen');

        return element;
    }

    setChat(chat) {
        this.chat = chat || null;

        return true;
    }

    getChat() {
        return this.chat;
    }

    clearChat() {
        this.chat = null;

        return true;
    }
}

const chatScreen = new ChatScreen();

export {
    ChatScreen
};

export default chatScreen;
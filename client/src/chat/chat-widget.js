'use strict';

/*
 * FREEzzzGames
 * GEEK CHAT WIDGET
 *
 * Плавающий виджет Chat поверх World.
 *
 * Архитектура:
 *
 * World
 *   ↓
 * ChatWidget
 *   ↓
 * ChatUI
 *   ↓
 * Chat cluster
 *
 * ВАЖНО:
 * Этот модуль не изменяет World.
 * Он только создаёт собственную кнопку и
 * контейнер ChatUI поверх приложения.
 */

import ChatUI from './chat-ui.js';
import chat from './chat.js';
import rooms from './rooms.js';
import avatars from './avatars.js';

const WIDGET_TEXT = Object.freeze({
    ru: {
        open: 'Открыть Geek Chat',
        close: 'Закрыть Geek Chat',
        label: 'Geek Chat'
    },

    de: {
        open: 'Geek Chat öffnen',
        close: 'Geek Chat schließen',
        label: 'Geek Chat'
    },

    en: {
        open: 'Open Geek Chat',
        close: 'Close Geek Chat',
        label: 'Geek Chat'
    }
});

const DEFAULT_LOCALE = 'ru';

function getLocale(locale) {
    if (
        typeof locale === 'string' &&
        WIDGET_TEXT[locale]
    ) {
        return locale;
    }

    return DEFAULT_LOCALE;
}

class ChatWidget {
    constructor(options = {}) {
        this.chat =
            options.chat || chat;

        this.rooms =
            options.rooms || rooms;

        this.avatars =
            options.avatars || avatars;

        this.locale =
            getLocale(options.locale);

        this.author =
            typeof options.author === 'string'
                ? options.author.trim()
                : '';

        this.root =
            null;

        this.mount =
            null;

        this.button =
            null;

        this.chatUI =
            null;

        this.isOpen =
            false;
    }

    mountTo(element) {
        if (
            !element ||
            !(element instanceof HTMLElement)
        ) {
            return false;
        }

        this.destroy();

        this.root =
            element;

        this.createStructure();

        this.chatUI =
            new ChatUI({
                chat: this.chat,
                rooms: this.rooms,
                avatars: this.avatars,
                locale: this.locale,
                author: this.author
            });

        this.chatUI.mountTo(
            this.mount
        );

        return true;
    }

    createStructure() {
        if (!this.root) {
            return;
        }

        this.root.innerHTML = '';

        this.root.className =
            'chat-widget';

        this.mount =
            document.createElement('div');

        this.mount.className =
            'chat-widget-panel';

        this.button =
            document.createElement('button');

        this.button.type =
            'button';

        this.button.className =
            'chat-widget-button';

        this.button.setAttribute(
            'aria-expanded',
            'false'
        );

        this.button.addEventListener(
            'click',
            event => {
                event.stopPropagation();

                this.toggle();
            }
        );

        this.root.append(
            this.mount,
            this.button
        );

        this.updateButton();
    }

    updateButton() {
        if (!this.button) {
            return;
        }

        const text =
            WIDGET_TEXT[this.locale];

        this.button.textContent =
            this.isOpen
                ? '×'
                : '💬';

        this.button.setAttribute(
            'aria-label',
            this.isOpen
                ? text.close
                : text.open
        );

        this.button.setAttribute(
            'title',
            this.isOpen
                ? text.close
                : text.open
        );

        this.button.setAttribute(
            'aria-expanded',
            String(this.isOpen)
        );

        this.button.dataset.label =
            text.label;
    }

    open() {
        if (!this.chatUI) {
            return false;
        }

        this.isOpen =
            true;

        this.chatUI.open();

        this.updateButton();

        return true;
    }

    close() {
        if (!this.chatUI) {
            return false;
        }

        this.isOpen =
            false;

        this.chatUI.close();

        this.updateButton();

        return true;
    }

    toggle() {
        if (this.isOpen) {
            return this.close();
        }

        return this.open();
    }

    setLocale(locale) {
        this.locale =
            getLocale(locale);

        if (this.chatUI) {
            this.chatUI.setLocale(
                this.locale
            );
        }

        this.updateButton();

        return true;
    }

    setAuthor(author) {
        this.author =
            typeof author === 'string'
                ? author.trim()
                : '';

        if (this.chatUI) {
            this.chatUI.setAuthor(
                this.author
            );
        }

        return true;
    }

    setRoom(roomId) {
        if (!this.chatUI) {
            return false;
        }

        return this.chatUI.setRoom(
            roomId
        );
    }

    destroy() {
        if (this.chatUI) {
            this.chatUI.destroy();
        }

        this.chatUI =
            null;

        if (this.root) {
            this.root.innerHTML =
                '';
        }

        this.root =
            null;

        this.mount =
            null;

        this.button =
            null;

        this.isOpen =
            false;
    }
}

export {
    ChatWidget,
    WIDGET_TEXT,
    DEFAULT_LOCALE
};

export default ChatWidget;
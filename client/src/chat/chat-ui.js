'use strict';

/*
 * FREEzzzGames
 * GEEK CHAT UI
 *
 * Самостоятельный интерфейс Chat-кластера.
 *
 * Этот модуль НЕ подключается к World.
 * Он работает поверх существующих:
 * - chat.js
 * - rooms.js
 * - avatars.js
 *
 * Realtime-соединение и серверная синхронизация
 * будут добавлены отдельным этапом.
 */

import ApiClient from '../api/client.js';
import TelegramAdapter from '../telegram/telegram.js?v=0.4.0';
import chat from './chat.js';
import rooms from './rooms.js';
import avatars from './avatars.js';

const CHAT_TEXT = Object.freeze({
    ru: {
        title: 'GEEK CHAT',
        room: 'Комната',
        input: 'Написать сообщение…',
        send: 'Отправить',
        close: 'Закрыть',
        empty: 'Сообщений пока нет.',
        global: 'Глобальный чат',
        player: 'Игрок'
    },

    de: {
        title: 'GEEK CHAT',
        room: 'Raum',
        input: 'Nachricht schreiben…',
        send: 'Senden',
        close: 'Schließen',
        empty: 'Noch keine Nachrichten.',
        global: 'Globaler Chat',
        player: 'Spieler'
    },

    en: {
        title: 'GEEK CHAT',
        room: 'Room',
        input: 'Write a message…',
        send: 'Send',
        close: 'Close',
        empty: 'No messages yet.',
        global: 'Global Chat',
        player: 'Player'
    }
});

const DEFAULT_LOCALE = 'ru';

function getLocale(locale) {
    if (
        typeof locale === 'string' &&
        CHAT_TEXT[locale]
    ) {
        return locale;
    }

    return DEFAULT_LOCALE;
}

function escapeText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

class ChatUI {
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

        this.mount =
            null;

        this.panel =
            null;

        this.messagesElement =
            null;

        this.input =
            null;

        this.roomElement =
            null;

        this.isOpen =
            false;

        this.onClose =
            typeof options.onClose === 'function'
                ? options.onClose
                : null;

        this.unsubscribeMessages =
            null;
    }

    mountTo(element) {
        if (
            !element ||
            !(element instanceof HTMLElement)
        ) {
            return false;
        }

        this.destroy();

        this.mount =
            element;

        this.renderShell();

        this.renderMessages();

        if (typeof this.chat.subscribe === 'function') {
            this.unsubscribeMessages = this.chat.subscribe(message => {
                if (message.room === this.chat.getRoom()) {
                    this.renderMessages();
                }
            });
        }

        return true;
    }

    renderShell() {
        if (!this.mount) {
            return;
        }

        const text =
            CHAT_TEXT[this.locale];

        const room =
            this.rooms.get(
                this.chat.getRoom()
            );

        this.mount.innerHTML = `
            <section
                class="chat-panel"
                aria-label="${escapeText(text.title)}"
                hidden
            >
                <header class="chat-header">

                    <div class="chat-header-copy">

                        <div class="chat-title">
                            ${escapeText(text.title)}
                        </div>

                        <div class="chat-room-label">
                            ${escapeText(text.room)}:
                            <span data-chat-room>
                                ${escapeText(
                                    room?.name || text.global
                                )}
                            </span>
                        </div>

                    </div>

                    <button
                        type="button"
                        class="chat-close"
                        data-chat-close
                        aria-label="${escapeText(text.close)}"
                    >
                        ×
                    </button>

                </header>

                <div
                    class="chat-messages"
                    data-chat-messages
                    aria-live="polite"
                ></div>

                <form
                    class="chat-composer"
                    data-chat-form
                >

                    <input
                        class="chat-input"
                        data-chat-input
                        type="text"
                        maxlength="500"
                        autocomplete="off"
                        placeholder="${escapeText(text.input)}"
                    />

                    <button
                        class="chat-send"
                        type="submit"
                    >
                        ${escapeText(text.send)}
                    </button>

                </form>

            </section>
        `;

        this.panel =
            this.mount.querySelector(
                '.chat-panel'
            );

        this.messagesElement =
            this.mount.querySelector(
                '[data-chat-messages]'
            );

        this.input =
            this.mount.querySelector(
                '[data-chat-input]'
            );

        this.roomElement =
            this.mount.querySelector(
                '[data-chat-room]'
            );

        const form =
            this.mount.querySelector(
                '[data-chat-form]'
            );

        const closeButton =
            this.mount.querySelector(
                '[data-chat-close]'
            );

        if (form) {
            form.addEventListener(
                'submit',
                event => {
                    event.preventDefault();

                    this.submit();
                }
            );
        }

        if (closeButton) {
            closeButton.addEventListener(
                'click',
                () => {
                    this.close();
                }
            );
        }
    }

    renderMessages() {
        if (!this.messagesElement) {
            return;
        }

        const text =
            CHAT_TEXT[this.locale];

        const messages =
            this.chat.getMessages();

        if (!messages.length) {
            this.messagesElement.innerHTML = `
                <div class="chat-empty">
                    ${escapeText(text.empty)}
                </div>
            `;

            return;
        }

        this.messagesElement.innerHTML =
            messages
                .map(message => {

                    const avatar =
                        this.avatars.getUserAvatar(
                            message.author
                        );

                    const avatarText =
                        avatar?.asset || '●';

                    const author =
                        message.author ||
                        text.player;

                    return `
                        <article class="chat-message">

                            <div class="chat-avatar">
                                ${escapeText(
                                    avatarText
                                )}
                            </div>

                            <div class="chat-message-body">

                                <div class="chat-message-meta">
                                    <span class="chat-author">
                                        ${escapeText(
                                            author
                                        )}
                                    </span>
                                </div>

                                <div class="chat-message-text">
                                    ${escapeText(
                                        message.text
                                    )}
                                </div>

                            </div>

                        </article>
                    `;
                })
                .join('');

        this.messagesElement.scrollTop =
            this.messagesElement.scrollHeight;
    }

    async submit() {
        if (!this.input) {
            return false;
        }

        const value =
            this.input.value.trim();

        if (!value) {
            return false;
        }

        /*
         * Telegram Mini App:
         * authenticate on the server and mirror the message
         * into the selected Telegram forum topic.
         */
        const initData =
            TelegramAdapter.getInitData();

        if (initData) {
            try {
                await ApiClient.request(
                    '/chat/message',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-telegram-init-data': initData
                        },
                        body: JSON.stringify({
                            room: this.chat.getRoom(),
                            text: value
                        })
                    }
                );
            } catch (error) {
                console.warn(
                    '[FREEzzzGames] Chat message was not archived:',
                    error?.code || error
                );

                return false;
            }
        }

        const message =
            this.chat.send(
                value,
                {
                    author: this.author
                }
            );

        if (!message) {
            return false;
        }

        this.input.value = '';

        this.renderMessages();

        return true;
    }

    open() {
        if (!this.panel) {
            return false;
        }

        this.isOpen =
            true;

        this.panel.hidden =
            false;

        this.renderMessages();

        requestAnimationFrame(
            () => {
                if (this.input) {
                    this.input.focus();
                }
            }
        );

        return true;
    }

    close() {
        if (!this.panel) {
            return false;
        }

        const wasOpen = this.isOpen;

        this.isOpen =
            false;

        this.panel.hidden =
            true;

        if (wasOpen && this.onClose) {
            this.onClose();
        }

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

        if (!this.mount) {
            return false;
        }

        const wasOpen =
            this.isOpen;

        this.renderShell();

        this.renderMessages();

        if (wasOpen) {
            this.open();
        }

        return true;
    }

    setAuthor(author) {
        this.author =
            typeof author === 'string'
                ? author.trim()
                : '';

        return true;
    }

    setRoom(roomId) {
        if (
            !this.chat.setRoom(
                roomId
            )
        ) {
            return false;
        }

        const room =
            this.rooms.get(
                roomId
            );

        if (this.roomElement) {
            this.roomElement.textContent =
                room?.name ||
                roomId;
        }

        this.renderMessages();

        return true;
    }

    destroy() {
        if (this.unsubscribeMessages) {
            this.unsubscribeMessages();
            this.unsubscribeMessages = null;
        }

        if (this.mount) {
            this.mount.innerHTML =
                '';
        }

        this.mount =
            null;

        this.panel =
            null;

        this.messagesElement =
            null;

        this.input =
            null;

        this.roomElement =
            null;

        this.isOpen =
            false;
    }
}

export {
    ChatUI,
    CHAT_TEXT,
    DEFAULT_LOCALE
};

export default ChatUI;

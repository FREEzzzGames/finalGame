'use strict';

/*
 * FREEzzzGames
 * GEEK CHAT cluster
 *
 * Единая публичная точка входа Chat-кластера.
 *
 * Этот модуль:
 * - объединяет состояние чата;
 * - объединяет комнаты;
 * - объединяет сообщения;
 * - объединяет аватары;
 * - экспортирует Chat UI.
 *
 * World и Application bootstrap
 * здесь намеренно НЕ подключаются.
 */

export {
    default as chat,
    Chat,
    DEFAULT_ROOM as CHAT_DEFAULT_ROOM,
    MAX_MESSAGE_LENGTH
} from './chat.js';

export {
    default as rooms,
    Rooms
} from './rooms.js';

export {
    default as messages,
    Messages
} from './messages.js';

export {
    default as avatars,
    Avatars,
    DEFAULT_AVATAR
} from './avatars.js';

export {
    default as ChatUI,
    CHAT_TEXT,
    DEFAULT_LOCALE
} from './chat-ui.js';
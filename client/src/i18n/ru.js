'use strict';

/*
 * FREEzzzGames
 * Russian localization
 *
 * Только системные строки приложения.
 * Игровой контент добавляется отдельными модулями
 * после утверждения соответствующего функционала.
 */

const RU = Object.freeze({
    code: 'ru',

    name: 'Русский',

    system: Object.freeze({
        loading: 'Загрузка…',
        error: 'Произошла ошибка',
        close: 'Закрыть',
        back: 'Назад',
        settings: 'Настройки',
        language: 'Язык'
    }),

    app: Object.freeze({
        name: 'FREEzzzGames'
    })
});

export default RU;
'use strict';

/*
 * FREEzzzGames
 * Russian localization
 *
 * Системные и игровые строки.
 * Игровая логика здесь отсутствует.
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
    }),

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'SYSTEM // INITIALIZATION',
                text: 'Система не помнит, кто её запустил.\nВ памяти отсутствуют первые записи.\n\nДоступен только один сектор.\n\nOBJECT: FARM\n\nСтранно.\n\nПочему система начинает с фермы?\nПочему некоторые объекты уже существуют в её структуре?\n\nИ главное —\nкто оставил здесь этот мир?'
            }),

            firstResource: Object.freeze({
                title: 'СОБЫТИЕ СИСТЕМЫ',
                text: 'Первичный цикл завершён.\nПолучен ресурс: 🪙 1\nСистема продолжает работу.'
            }),

            farmOnline: Object.freeze({
                title: 'СТРУКТУРА АКТИВНА',
                text: 'Первый объект активирован.\nСистема больше не пуста.\n\nНо она уже знала, что делать.'
            }),

            unknownStructure: Object.freeze({
                title: 'ОБНАРУЖЕНА НЕИЗВЕСТНАЯ СТРУКТУРА',
                text: 'Объект присутствовал в системе до активации.\nПроисхождение: неизвестно.\nДоступ: ограничен.'
            })
        })
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'ФЕРМА',
            built: 'Ферма построена',
            tap: 'Ферма',
            info: 'Ферма приносит доход при нажатии.',
            level: 'Уровень'
        }),

        workshop: Object.freeze({
            title: 'МАСТЕРСКАЯ',
            built: 'Мастерская построена',
            tap: 'Мастерская',
            info: 'Мастерская приносит пассивный доход.',
            passive: '+1 🪙 каждые 10 секунд'
        }),

        stadium: Object.freeze({
            title: 'СТАДИОН',
            built: 'Стадион построен',
            tap: 'Стадион',
            info: 'Стадион открывает следующий этап развития мира.'
        }),

        studio: Object.freeze({
            title: 'СТУДИЯ',
            built: 'Студия построена',
            tap: 'Студия',
            info: 'Студия открывает следующий этап развития мира.'
        }),

        shopping: Object.freeze({
            title: 'ТОРГОВЫЙ ЦЕНТР',
            built: 'Торговый центр построен',
            tap: 'Торговый центр',
            info: 'Торговый центр открывает следующий этап развития мира.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Нажми на ферму',
        insufficient: '🔒 Нужно',
        built: 'построен',
        purchased: '✓ Построено'
    })
});

export default RU;

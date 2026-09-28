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

    nexus: Object.freeze({
        surface: 'SURFACE CITY',
        undercity: 'UNDERCITY',
        factions: Object.freeze({ government: 'GOVERNMENT', mafia: 'MAFIA' }),
        buildings: Object.freeze({
            'nexus-core': 'NEXUS CORE',
            'undercity-core': 'ЯДРО ПОДЗЕМНОГО ГОРОДА',
            'civic-center': 'ГОРОДСКОЙ ЦЕНТР',
            'transit-hub': 'ТРАНЗИТНЫЙ УЗЕЛ',
            'medical-center': 'МЕДИЦИНСКИЙ ЦЕНТР',
            'network-control': 'СЕТЕВОЙ КОНТРОЛЬ',
            'power-station': 'ЭЛЕКТРОСТАНЦИЯ',
            'central-bank': 'ЦЕНТРАЛЬНЫЙ БАНК',
            'holding-company': 'ХОЛДИНГОВАЯ КОМПАНИЯ',
            casino: 'КАЗИНО',
            'night-club': 'НОЧНОЙ КЛУБ',
            'logistics-company': 'ЛОГИСТИЧЕСКАЯ КОМПАНИЯ',
            'private-finance': 'ЧАСТНЫЙ ФИНАНСОВЫЙ ФОНД',
            'luxury-hotel': 'ЭЛИТНЫЙ ОТЕЛЬ',
            'maintenance-station': 'СТАНЦИЯ ОБСЛУЖИВАНИЯ',
            'research-lab': 'ИССЛЕДОВАТЕЛЬСКАЯ ЛАБОРАТОРИЯ',
            'security-bunker': 'БЕЗОПАСНЫЙ БУНКЕР',
            'surveillance-node': 'УЗЕЛ НАБЛЮДЕНИЯ',
            'grid-control': 'УПРАВЛЕНИЕ ЭНЕРГОСЕТЬЮ',
            'archive-vault': 'АРХИВНОЕ ХРАНИЛИЩЕ',
            'smuggling-hub': 'УЗЕЛ КОНТРАБАНДЫ',
            'hidden-factory': 'СКРЫТАЯ ФАБРИКА',
            'black-market': 'ЧЁРНЫЙ РЫНОК',
            'underground-casino': 'ПОДЗЕМНОЕ КАЗИНО',
            'arms-depot': 'СКЛАД ОРУЖИЯ',
            'mafia-hq': 'ШТАБ МАФИИ'
        }),
        switchTo: Object.freeze({
            surface: 'Перевернуть монету к Surface City',
            undercity: 'Перевернуть монету к Undercity'
        }),
        undercityLocked: 'Undercity откроется после активации транспортного узла.',
        factionChoiceLocked: 'Выбор фракции откроется после активации транспортного узла.'
    }),

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'NEXUS // ONLINE',
                text: 'Добро пожаловать в NEXUS.\n\nВаш профиль практически пуст.\nЭто хорошо.\n\nЗначит, пока нечего терять.'
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
        }),
        main: Object.freeze({
            title: 'SYSTEM // LORE',
            open: 'Открыть лор',
            previous: 'Предыдущая глава',
            next: 'Следующая глава',
            factionRegistered: 'Фракция выбрана',
            missions: Object.freeze({
                'audit-transit-link': Object.freeze({
                    title: 'МИССИЯ // ТРАНЗИТНАЯ СВЯЗЬ',
                    description: 'Проследить, куда уходит сеть транзитного узла за пределами Surface City.',
                    accept: 'Принять миссию',
                    active: 'МИССИЯ АКТИВНА',
                    completed: 'МИССИЯ ЗАВЕРШЕНА'
                }),
                'trace-grid-signal': Object.freeze({
                    title: 'МИССИЯ // СИГНАЛ ИЗ СЕТИ',
                    description: 'Найти источник сигнала в старой энергосети Undercity.',
                    accept: 'Принять миссию',
                    active: 'МИССИЯ АКТИВНА',
                    completed: 'МИССИЯ ЗАВЕРШЕНА'
                })
            }),
            chapters: Object.freeze([
                Object.freeze({ id: 'prologue', heading: 'ПРОЛОГ // NEXUS ONLINE', text: 'Добро пожаловать в NEXUS.\n\nВаш профиль практически пуст.\nЭто хорошо.\nЗначит, пока нечего терять.' }),
                Object.freeze({ id: 'city-online', heading: 'ГЛАВА I // CITY ONLINE', text: 'DISTRICT ACCESS GRANTED\n\nВам предоставлен доступ к району.\nРайон небольшой.\nГород считает его перспективным.\nГород часто ошибается.\n\nSTRUCTURE ONLINE\n\nПоздравляем. Теперь у города стало на одно здание больше.\nА у вас — на одну статью расходов.\n\nINCOME DETECTED\n\nДеньги поступили. Происхождение подтверждено.\nПотрачены они будут ещё быстрее.' }),
                Object.freeze({ id: 'development', heading: 'ГЛАВА II // DEVELOPMENT', text: 'NEXUS CORE ONLINE\n\nЦентральный объект района активирован.\nТеперь район официально считается существующим.\n\nДо этого момента он тоже существовал.\n\nDEVELOPMENT NODE AVAILABLE\n\nОдин сектор готов к развитию. Выберите направление.\nОшибиться можно. Исправить — за деньги.' }),
                Object.freeze({ id: 'two-powers', heading: 'ГЛАВА III // THE TWO POWERS', text: 'FACTION SIGNAL DETECTED\n\nGOVERNMENT: «Порядок».\nMAFIA: «Свобода».\n\nФормулировки требуют уточнения.\nПравительство предпочитает слово «порядок».\nМафия предпочитает слово «свобода».\nОба предпочитают деньги.' }),
                Object.freeze({ id: 'the-choice', heading: 'ГЛАВА IV // THE CHOICE', text: 'GOVERNMENT\n\nВы выбираете порядок. Государственные здания работают эффективнее. Контроль увеличивается. Свободы… обсуждаются отдельно.\n\nMAFIA\n\nВы выбираете независимость. Нелегальные структуры работают эффективнее. Риск увеличивается. Документы… исчезают быстрее.\n\nFACTION REGISTERED\n\nВаш выбор сохранён. Теперь город знает, на чьей вы стороне. Теоретически.' }),
                Object.freeze({ id: 'city-grows', heading: 'ГЛАВА V // CITY GROWS', text: 'NEON MARKET\nЗдесь всё продаётся. Некоторые вещи даже официально.\n\nINDUSTRIAL SECTOR\nЗдесь город производит то, что потом продаёт сам себе.\n\nDATA DISTRICT\nСамый ценный ресурс города. Никто точно не знает, кому он принадлежит.\n\nCORPORATE ZONE\nЗдесь деньги работают. Люди — по возможности.\n\nNIGHT DISTRICT\nДнём здесь ничего не происходит. Поэтому днём район закрыт.\n\nINDUSTRIAL EDGE\nЗдесь заканчивается официальный город. За пределами начинается территория, которой официально не существует.' }),
                Object.freeze({ id: 'the-hole', heading: 'ГЛАВА VI // THE HOLE', text: 'ANOMALOUS STRUCTURE DETECTED\n\nПод районом обнаружена дополнительная архитектурная структура.\n\nГлубина: неизвестна.\nВозраст: данные повреждены.\nПроисхождение: не подтверждено.\n\nСистема помечает объект как часть города.\nАрхивы утверждают, что его там быть не должно.' })
            ])
        })
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'NEXUS CORE',
            built: 'Ядро активировано',
            tap: 'Ядро',
            info: 'Ядро приносит городские кредиты при нажатии.',
            level: 'Уровень'
        }),

        workshop: Object.freeze({
            title: 'ЭНЕРГОУЗЕЛ',
            built: 'Энергоузел активирован',
            tap: 'Энергоузел',
            info: 'Энергоузел приносит пассивный доход.',
            passive: '+1 🪙 каждые 10 секунд'
        }),

        stadium: Object.freeze({
            title: 'ТРАНЗИТНЫЙ УЗЕЛ',
            built: 'Транзитный узел активирован',
            tap: 'Транзитный узел',
            info: 'Транзитный узел открывает следующий этап развития города.'
        }),

        studio: Object.freeze({
            title: 'СЕТЕВОЙ КОНТРОЛЬ',
            built: 'Сетевой контроль активирован',
            tap: 'Сетевой контроль',
            info: 'Сетевой контроль открывает следующий этап развития города.'
        }),

        shopping: Object.freeze({
            title: 'ЦЕНТРАЛЬНЫЙ БАНК',
            built: 'Центральный банк активирован',
            tap: 'Центральный банк',
            info: 'Центральный банк открывает следующий этап развития города.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Нажми на ядро',
        activated: 'активирован',
        insufficient: '🔒 Нужно',
        built: 'построен',
        purchased: '✓ Построено'
    })
});

export default RU;

'use strict';

/*
 * FREEzzzGames
 * German localization
 *
 * System- und Spieltexte.
 * Keine Spiellogik.
 */

const DE = Object.freeze({
    code: 'de',

    name: 'Deutsch',

    system: Object.freeze({
        loading: 'Wird geladen…',
        error: 'Ein Fehler ist aufgetreten',
        close: 'Schließen',
        back: 'Zurück',
        settings: 'Einstellungen',
        language: 'Sprache'
    }),

    app: Object.freeze({
        name: 'FREEzzzGames'
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'FARM',
            built: 'Farm gebaut',
            tap: 'Farm',
            info: 'Die Farm bringt Einkommen durch Tippen.',
            level: 'Stufe'
        }),

        workshop: Object.freeze({
            title: 'WERKSTATT',
            built: 'Werkstatt gebaut',
            tap: 'Werkstatt',
            info: 'Die Werkstatt bringt passives Einkommen.',
            passive: '+1 🪙 alle 10 Sekunden'
        }),

        stadium: Object.freeze({
            title: 'STADION',
            built: 'Stadion gebaut',
            tap: 'Stadion',
            info: 'Das Stadion eröffnet die nächste Entwicklungsstufe der Welt.'
        }),

        studio: Object.freeze({
            title: 'STUDIO',
            built: 'Studio gebaut',
            tap: 'Studio',
            info: 'Das Studio eröffnet die nächste Entwicklungsstufe der Welt.'
        }),

        shopping: Object.freeze({
            title: 'EINKAUFSZENTRUM',
            built: 'Einkaufszentrum gebaut',
            tap: 'Einkaufszentrum',
            info: 'Das Einkaufszentrum eröffnet die nächste Entwicklungsstufe der Welt.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Tippe auf die Farm',
        insufficient: '🔒 Benötigt',
        built: 'gebaut',
        purchased: '✓ Gebaut'
    })
});

export default DE;
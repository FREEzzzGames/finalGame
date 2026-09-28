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

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'SYSTEM // INITIALISIERUNG',
                text: 'Das System erinnert sich nicht daran, wer es gestartet hat.\nDie ersten Einträge fehlen im Speicher.\n\nNur ein Sektor ist verfügbar.\n\nOBJECT: FARM\n\nSeltsam.\n\nWarum beginnt das System mit einer Farm?\nWarum existieren einige Objekte bereits in seiner Struktur?\n\nUnd vor allem —\nwer hat diese Welt hier hinterlassen?'
            }),

            firstResource: Object.freeze({
                title: 'SYSTEMEREIGNIS',
                text: 'Der erste Zyklus ist abgeschlossen.\nRessource erhalten: 🪙 1\nDas System setzt seine Arbeit fort.'
            }),

            farmOnline: Object.freeze({
                title: 'STRUKTUR ONLINE',
                text: 'Das erste Objekt wurde aktiviert.\nDas System ist nicht mehr leer.\n\nAber es wusste bereits, was zu tun war.'
            }),

            unknownStructure: Object.freeze({
                title: 'UNBEKANNTE STRUKTUR ERKANNT',
                text: 'Das Objekt war bereits vor der Aktivierung im System vorhanden.\nHerkunft: unbekannt.\nZugriff: eingeschränkt.'
            })
        })
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

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

    nexus: Object.freeze({
        surface: 'SURFACE CITY',
        undercity: 'UNDERCITY',
        factions: Object.freeze({ government: 'GOVERNMENT', mafia: 'MAFIA' }),
        buildings: Object.freeze({
            'nexus-core': 'NEXUS-KERN',
            'undercity-core': 'UNDERCITY-KERN',
            'civic-center': 'BÜRGERZENTRUM',
            'transit-hub': 'VERKEHRSKNOTEN',
            'medical-center': 'MEDIZINZENTRUM',
            'network-control': 'NETZWERKKONTROLLE',
            'power-station': 'KRAFTWERK',
            'central-bank': 'ZENTRALBANK',
            'holding-company': 'HOLDINGGESELLSCHAFT',
            casino: 'CASINO',
            'night-club': 'NACHTCLUB',
            'logistics-company': 'LOGISTIKUNTERNEHMEN',
            'private-finance': 'PRIVATFINANZIERUNG',
            'luxury-hotel': 'LUXUSHOTEL',
            'maintenance-station': 'WARTUNGSSTATION',
            'research-lab': 'FORSCHUNGSLABOR',
            'security-bunker': 'SICHERHEITSBUNKER',
            'surveillance-node': 'ÜBERWACHUNGSKNOTEN',
            'grid-control': 'STROMNETZKONTROLLE',
            'archive-vault': 'ARCHIVTRESOR',
            'smuggling-hub': 'SCHMUGGELZENTRUM',
            'hidden-factory': 'GEHEIME FABRIK',
            'black-market': 'SCHWARZMARKT',
            'underground-casino': 'UNTERGRUNDCASINO',
            'arms-depot': 'WAFFENLAGER',
            'mafia-hq': 'MAFIA-HAUPTQUARTIER'
        }),
        switchTo: Object.freeze({
            surface: 'Zur Surface City umdrehen',
            undercity: 'Zur Undercity umdrehen'
        }),
        undercityLocked: 'Undercity wird nach Aktivierung des Verkehrsknotens freigeschaltet.',
        factionChoiceLocked: 'Die Fraktionswahl wird nach Aktivierung des Verkehrsknotens freigeschaltet.'
    }),

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'NEXUS // ONLINE',
                text: 'Willkommen in NEXUS.\n\nIhr Profil ist nahezu leer.\nDas ist gut.\n\nEs bedeutet, dass es noch nichts zu verlieren gibt.'
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
        }),
        main: Object.freeze({
            title: 'SYSTEM // LORE',
            open: 'Hintergrundgeschichte öffnen',
            previous: 'Vorheriges Kapitel',
            next: 'Nächstes Kapitel',
            factionRegistered: 'Fraktion gewählt',
            missions: Object.freeze({
                'audit-transit-link': Object.freeze({
                    title: 'MISSION // TRANSITVERBINDUNG',
                    description: 'Verfolgen Sie, wohin das Netz des Verkehrsknotens außerhalb der Surface City führt.',
                    accept: 'Mission annehmen',
                    active: 'MISSION AKTIV',
                    completed: 'MISSION ABGESCHLOSSEN'
                }),
                'trace-grid-signal': Object.freeze({
                    title: 'MISSION // NETZSIGNAL',
                    description: 'Finden Sie die Quelle des Signals im alten Stromnetz der Undercity.',
                    accept: 'Mission annehmen',
                    active: 'MISSION AKTIV',
                    completed: 'MISSION ABGESCHLOSSEN'
                })
            }),
            chapters: Object.freeze([
                Object.freeze({ id: 'prologue', heading: 'PROLOG // NEXUS ONLINE', text: 'Willkommen in NEXUS.\n\nIhr Profil ist nahezu leer.\nDas ist gut.\nEs bedeutet, dass es noch nichts zu verlieren gibt.' }),
                Object.freeze({ id: 'city-online', heading: 'KAPITEL I // CITY ONLINE', text: 'DISTRICT ACCESS GRANTED\n\nSie erhalten Zugang zu einem Bezirk.\nDer Bezirk ist klein.\nDie Stadt hält ihn für vielversprechend.\nDie Stadt irrt sich oft.\n\nSTRUCTURE ONLINE\n\nGlückwunsch. Die Stadt hat ein Gebäude mehr.\nUnd Sie einen weiteren Kostenpunkt.\n\nINCOME DETECTED\n\nGeld ist eingegangen. Die Herkunft wurde bestätigt.\nAusgegeben wird es noch schneller sein.' }),
                Object.freeze({ id: 'development', heading: 'KAPITEL II // DEVELOPMENT', text: 'NEXUS CORE ONLINE\n\nDas zentrale Objekt des Bezirks wurde aktiviert.\nDer Bezirk gilt nun offiziell als existent.\n\nBis zu diesem Moment existierte er ebenfalls.\n\nDEVELOPMENT NODE AVAILABLE\n\nEin Sektor kann entwickelt werden. Wählen Sie eine Richtung.\nFehler sind möglich. Korrekturen kosten Geld.' }),
                Object.freeze({ id: 'two-powers', heading: 'KAPITEL III // THE TWO POWERS', text: 'FACTION SIGNAL DETECTED\n\nGOVERNMENT: „Ordnung.“\nMAFIA: „Freiheit.“\n\nDie Formulierungen bedürfen einer Präzisierung.\nDie Regierung bevorzugt das Wort „Ordnung“.\nDie Mafia bevorzugt das Wort „Freiheit“.\nBeide bevorzugen Geld.' }),
                Object.freeze({ id: 'the-choice', heading: 'KAPITEL IV // THE CHOICE', text: 'GOVERNMENT\n\nSie wählen Ordnung. Regierungsgebäude arbeiten effizienter. Die Kontrolle nimmt zu. Die Freiheit… wird gesondert besprochen.\n\nMAFIA\n\nSie wählen Unabhängigkeit. Illegale Strukturen arbeiten effizienter. Das Risiko steigt. Dokumente… verschwinden schneller.\n\nFACTION REGISTERED\n\nIhre Wahl wurde gespeichert. Die Stadt weiß nun, auf wessen Seite Sie stehen. Theoretisch.' }),
                Object.freeze({ id: 'city-grows', heading: 'KAPITEL V // CITY GROWS', text: 'NEON MARKET\nHier wird alles verkauft. Manche Dinge sogar offiziell.\n\nINDUSTRIAL SECTOR\nHier produziert die Stadt, was sie später an sich selbst verkauft.\n\nDATA DISTRICT\nDie wertvollste Ressource der Stadt. Niemand weiß genau, wem sie gehört.\n\nCORPORATE ZONE\nHier arbeitet das Geld. Menschen, wenn möglich.\n\nNIGHT DISTRICT\nTagsüber passiert hier nichts. Deshalb ist der Bezirk tagsüber geschlossen.\n\nINDUSTRIAL EDGE\nHier endet die offizielle Stadt. Dahinter beginnt ein Gebiet, das offiziell nicht existiert.' }),
                Object.freeze({ id: 'the-hole', heading: 'KAPITEL VI // THE HOLE', text: 'ANOMALOUS STRUCTURE DETECTED\n\nUnter dem Bezirk wurde eine zusätzliche architektonische Struktur entdeckt.\n\nTiefe: unbekannt.\nAlter: Daten beschädigt.\nUrsprung: nicht bestätigt.\n\nDas System markiert das Objekt als Teil der Stadt.\nDie Archive behaupten, dass es dort nicht sein dürfte.' })
            ])
        })
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'NEXUS-KERN',
            built: 'Kern aktiviert',
            tap: 'Kern',
            info: 'Der Kern erzeugt beim Antippen Stadtkredite.',
            level: 'Stufe'
        }),

        workshop: Object.freeze({
            title: 'ENERGIEKNOTEN',
            built: 'Energieknoten aktiviert',
            tap: 'Energieknoten',
            info: 'Der Energieknoten erzeugt passives Einkommen.',
            passive: '+1 🪙 alle 10 Sekunden'
        }),

        stadium: Object.freeze({
            title: 'VERKEHRSKNOTEN',
            built: 'Verkehrsknoten aktiviert',
            tap: 'Verkehrsknoten',
            info: 'Der Verkehrsknoten eröffnet die nächste Entwicklungsstufe der Stadt.'
        }),

        studio: Object.freeze({
            title: 'NETZWERKKONTROLLE',
            built: 'Netzwerkkontrolle aktiviert',
            tap: 'Netzwerkkontrolle',
            info: 'Die Netzwerkkontrolle eröffnet die nächste Entwicklungsstufe der Stadt.'
        }),

        shopping: Object.freeze({
            title: 'ZENTRALBANK',
            built: 'Zentralbank aktiviert',
            tap: 'Zentralbank',
            info: 'Die Zentralbank eröffnet die nächste Entwicklungsstufe der Stadt.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Tippe auf den Kern',
        activated: 'aktiviert',
        insufficient: '🔒 Benötigt',
        built: 'gebaut',
        purchased: '✓ Gebaut'
    })
});

export default DE;

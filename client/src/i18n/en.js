'use strict';

/*
 * FREEzzzGames
 * English localization
 *
 * System and game strings.
 * No game logic.
 */

const EN = Object.freeze({
    code: 'en',

    name: 'English',

    system: Object.freeze({
        loading: 'Loading…',
        error: 'An error occurred',
        close: 'Close',
        back: 'Back',
        settings: 'Settings',
        language: 'Language'
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
            'undercity-core': 'UNDERCITY CORE',
            'civic-center': 'CIVIC CENTER',
            'transit-hub': 'TRANSIT HUB',
            'medical-center': 'MEDICAL CENTER',
            'network-control': 'NETWORK CONTROL',
            'power-station': 'POWER STATION',
            'central-bank': 'CENTRAL BANK',
            'holding-company': 'HOLDING COMPANY',
            casino: 'CASINO',
            'night-club': 'NIGHT CLUB',
            'logistics-company': 'LOGISTICS COMPANY',
            'private-finance': 'PRIVATE FINANCE',
            'luxury-hotel': 'LUXURY HOTEL',
            'maintenance-station': 'MAINTENANCE STATION',
            'research-lab': 'RESEARCH LAB',
            'security-bunker': 'SECURITY BUNKER',
            'surveillance-node': 'SURVEILLANCE NODE',
            'grid-control': 'GRID CONTROL',
            'archive-vault': 'ARCHIVE VAULT',
            'smuggling-hub': 'SMUGGLING HUB',
            'hidden-factory': 'HIDDEN FACTORY',
            'black-market': 'BLACK MARKET',
            'underground-casino': 'UNDERGROUND CASINO',
            'arms-depot': 'ARMS DEPOT',
            'mafia-hq': 'MAFIA HQ'
        }),
        switchTo: Object.freeze({
            surface: 'Flip to Surface City',
            undercity: 'Flip to Undercity'
        }),
        undercityLocked: 'Undercity unlocks after activating the Transit Hub.',
        factionChoiceLocked: 'Faction selection unlocks after activating the Transit Hub.'
    }),

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'NEXUS // ONLINE',
                text: 'Welcome to NEXUS.\n\nYour profile is almost empty.\nThat is good.\n\nIt means there is nothing to lose. Yet.'
            }),

            firstResource: Object.freeze({
                title: 'SYSTEM EVENT',
                text: 'The primary cycle is complete.\nResource received: 🪙 1\nThe system continues to operate.'
            }),

            farmOnline: Object.freeze({
                title: 'STRUCTURE ONLINE',
                text: 'The first object has been activated.\nThe system is no longer empty.\n\nBut it already knew what to do.'
            }),

            unknownStructure: Object.freeze({
                title: 'UNKNOWN STRUCTURE DETECTED',
                text: 'The object was present in the system before activation.\nOrigin: unknown.\nAccess: restricted.'
            })
        }),
        main: Object.freeze({
            title: 'SYSTEM // LORE',
            open: 'Open lore',
            previous: 'Previous chapter',
            next: 'Next chapter',
            factionRegistered: 'Faction registered',
            missions: Object.freeze({
                'audit-transit-link': Object.freeze({
                    title: 'MISSION // TRANSIT LINK',
                    description: 'Trace where the Transit Hub network leads beyond Surface City.',
                    accept: 'Accept mission',
                    active: 'MISSION ACTIVE',
                    completed: 'MISSION COMPLETE'
                }),
                'trace-grid-signal': Object.freeze({
                    title: 'MISSION // GRID SIGNAL',
                    description: 'Find the source of a signal inside Undercity’s old power grid.',
                    accept: 'Accept mission',
                    active: 'MISSION ACTIVE',
                    completed: 'MISSION COMPLETE'
                })
            }),
            chapters: Object.freeze([
                Object.freeze({ id: 'prologue', heading: 'PROLOGUE // NEXUS ONLINE', text: 'Welcome to NEXUS.\n\nYour profile is almost empty.\nThat is good.\nIt means there is nothing to lose. Yet.' }),
                Object.freeze({ id: 'city-online', heading: 'CHAPTER I // CITY ONLINE', text: 'DISTRICT ACCESS GRANTED\n\nYou have been granted access to a district.\nThe district is small.\nThe city considers it promising.\nThe city is often wrong.\n\nSTRUCTURE ONLINE\n\nCongratulations. The city has one more building.\nYou have one more expense.\n\nINCOME DETECTED\n\nMoney received. Origin confirmed.\nIt will be spent even faster.' }),
                Object.freeze({ id: 'development', heading: 'CHAPTER II // DEVELOPMENT', text: 'NEXUS CORE ONLINE\n\nThe district’s central object has been activated.\nThe district is now officially considered to exist.\n\nIt existed before this moment too.\n\nDEVELOPMENT NODE AVAILABLE\n\nOne sector is ready for development. Choose a direction.\nMistakes are possible. Fixing them costs money.' }),
                Object.freeze({ id: 'two-powers', heading: 'CHAPTER III // THE TWO POWERS', text: 'FACTION SIGNAL DETECTED\n\nGOVERNMENT: “Order.”\nMAFIA: “Freedom.”\n\nThe wording requires clarification.\nThe Government prefers the word “order.”\nThe Mafia prefers the word “freedom.”\nBoth prefer money.' }),
                Object.freeze({ id: 'the-choice', heading: 'CHAPTER IV // THE CHOICE', text: 'GOVERNMENT\n\nYou choose order. Government buildings operate more efficiently. Control increases. Freedom… is discussed separately.\n\nMAFIA\n\nYou choose independence. Illegal structures operate more efficiently. Risk increases. Documents… disappear faster.\n\nFACTION REGISTERED\n\nYour choice has been saved. The city now knows whose side you are on. Theoretically.' }),
                Object.freeze({ id: 'city-grows', heading: 'CHAPTER V // CITY GROWS', text: 'NEON MARKET\nEverything is for sale here. Some things even officially.\n\nINDUSTRIAL SECTOR\nThe city makes things here, then sells them to itself.\n\nDATA DISTRICT\nThe city’s most valuable resource. Nobody knows exactly who owns it.\n\nCORPORATE ZONE\nMoney works here. People, when possible.\n\nNIGHT DISTRICT\nNothing happens here during the day. That is why it is closed during the day.\n\nINDUSTRIAL EDGE\nThis is where the official city ends. Beyond it begins territory that officially does not exist.' }),
                Object.freeze({ id: 'the-hole', heading: 'CHAPTER VI // THE HOLE', text: 'ANOMALOUS STRUCTURE DETECTED\n\nAn additional architectural structure was found beneath the district.\n\nDepth: unknown.\nAge: data corrupted.\nOrigin: unconfirmed.\n\nThe system marks the object as part of the city.\nThe archives claim it should not be there.' })
            ])
        })
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'NEXUS CORE',
            built: 'Core activated',
            tap: 'Core',
            info: 'The Core generates city credits when tapped.',
            level: 'Level'
        }),

        workshop: Object.freeze({
            title: 'POWER STATION',
            built: 'Power Station activated',
            tap: 'Power Station',
            info: 'The Power Station generates passive income.',
            passive: '+1 🪙 every 10 seconds'
        }),

        stadium: Object.freeze({
            title: 'TRANSIT HUB',
            built: 'Transit Hub activated',
            tap: 'Transit Hub',
            info: 'The Transit Hub unlocks the next stage of city development.'
        }),

        studio: Object.freeze({
            title: 'NETWORK CONTROL',
            built: 'Network Control activated',
            tap: 'Network Control',
            info: 'Network Control unlocks the next stage of city development.'
        }),

        shopping: Object.freeze({
            title: 'CENTRAL BANK',
            built: 'Central Bank activated',
            tap: 'Central Bank',
            info: 'The Central Bank unlocks the next stage of city development.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Tap the Core',
        activated: 'activated',
        insufficient: '🔒 Required',
        built: 'built',
        purchased: '✓ Built'
    })
});

export default EN;

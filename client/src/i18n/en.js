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

    lore: Object.freeze({
        world: Object.freeze({
            initialization: Object.freeze({
                title: 'SYSTEM // INITIALIZATION',
                text: 'The system does not remember who started it.\nThe first records are missing from memory.\n\nOnly one sector is available.\n\nOBJECT: FARM\n\nStrange.\n\nWhy does the system begin with a farm?\nWhy do some objects already exist in its structure?\n\nAnd most of all —\nwho left this world here?'
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
        })
    }),

    buildings: Object.freeze({
        farm: Object.freeze({
            title: 'FARM',
            built: 'Farm built',
            tap: 'Farm',
            info: 'The farm generates income when tapped.',
            level: 'Level'
        }),

        workshop: Object.freeze({
            title: 'WORKSHOP',
            built: 'Workshop built',
            tap: 'Workshop',
            info: 'The workshop generates passive income.',
            passive: '+1 🪙 every 10 seconds'
        }),

        stadium: Object.freeze({
            title: 'STADIUM',
            built: 'Stadium built',
            tap: 'Stadium',
            info: 'The stadium unlocks the next stage of world development.'
        }),

        studio: Object.freeze({
            title: 'STUDIO',
            built: 'Studio built',
            tap: 'Studio',
            info: 'The studio unlocks the next stage of world development.'
        }),

        shopping: Object.freeze({
            title: 'SHOPPING CENTER',
            built: 'Shopping center built',
            tap: 'Shopping center',
            info: 'The shopping center unlocks the next stage of world development.'
        })
    }),

    hints: Object.freeze({
        tapFarm: '👆 Tap the farm',
        insufficient: '🔒 Required',
        built: 'built',
        purchased: '✓ Built'
    })
});

export default EN;

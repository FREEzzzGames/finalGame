'use strict';

/*
 * In-memory player session.
 *
 * Telegram initData is forwarded only for the current authentication
 * request. The server response is the source of player identity; no
 * credential, profile, or session token is stored in localStorage.
 */

import ApiClient from '../api/client.js';
import TelegramAdapter from '../telegram/telegram.js?v=0.4.0';

let currentSession = Object.freeze({
    authenticated: false,
    profile: null,
    state: null,
    platform: 'browser',
    stateRevision: null,
    syncState: 'idle',
    error: null
});

function setSession(session) {
    currentSession = Object.freeze({ ...session });
    return currentSession;
}

async function initialize() {
    const initData = TelegramAdapter.getInitData();

    if (!initData) {
        return setSession({
            authenticated: false,
            profile: null,
            state: null,
            platform: 'browser',
            stateRevision: null,
            syncState: 'idle',
            error: null
        });
    }

    setSession({
        authenticated: false,
        profile: null,
        state: null,
        platform: 'telegram',
        stateRevision: null,
        syncState: 'syncing',
        error: null
    });

    try {
        const data = await ApiClient.request('/state', {
            headers: {
                'x-telegram-init-data': initData
            }
        });

        if (!data.profile || typeof data.profile !== 'object') {
            throw Object.assign(new Error('INVALID_SERVER_PROFILE'), {
                code: 'INVALID_SERVER_PROFILE'
            });
        }

        const state = data.state && typeof data.state === 'object'
            ? data.state
            : null;

        return setSession({
            authenticated: true,
            profile: data.profile,
            state,
            platform: 'telegram',
            stateRevision: state?.revision ?? state?.version ?? null,
            syncState: 'synced',
            error: null
        });
    } catch (error) {
        return setSession({
            authenticated: false,
            profile: null,
            state: null,
            platform: 'telegram',
            stateRevision: null,
            syncState: 'error',
            error: error?.code || 'SESSION_INITIALIZATION_FAILED'
        });
    }
}

function getSnapshot() {
    return currentSession;
}

const Session = Object.freeze({
    initialize,
    getSnapshot
});

export default Session;

'use strict';

import i18n from '../i18n/i18n.js';
import { loadState } from '../app/storage.js';
import {
    loadNexusState,
    setNexusFaction,
    setMissionStatus
} from '../nexus/nexus.js';

const STORAGE_KEY = 'system.main-lore.read.v1';

class LoreWidget {
    constructor() {
        this.root = null;
        this.button = null;
        this.panel = null;
        this.missionControls = null;
        this.title = null;
        this.chapter = null;
        this.text = null;
        this.choiceControls = null;
        this.progress = null;
        this.previousButton = null;
        this.nextButton = null;
        this.closeButton = null;
        this.unread = null;
        this.isOpen = false;
        this.index = 0;
        this.readChapters = this.loadReadChapters();
        this.unsubscribeLanguage = null;
        this.progressChangeHandler = null;
        this.pointerStart = null;
    }

    loadReadChapters() {
        try {
            const value = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );
            return Array.isArray(value)
                ? value.filter(id => typeof id === 'string')
                : [];
        } catch {
            return [];
        }
    }

    saveReadChapters() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.readChapters));
        } catch {
            // Lore remains usable when browser storage is unavailable.
        }
    }

    mountTo(element) {
        if (!element || !(element instanceof HTMLElement)) return false;
        this.destroy();
        this.root = element;
        this.root.className = 'lore-widget';
        this.createStructure();
        this.unsubscribeLanguage = i18n.subscribe(() => this.render());
        this.progressChangeHandler = () => this.render();
        window.addEventListener('systemprogresschange', this.progressChangeHandler);
        this.render();
        return true;
    }

    createStructure() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.className = 'lore-widget-button';
        this.button.textContent = '📖';
        this.button.addEventListener('click', () => this.toggle());

        this.unread = document.createElement('span');
        this.unread.className = 'lore-widget-unread';
        this.unread.setAttribute('aria-hidden', 'true');
        this.button.append(this.unread);

        this.panel = document.createElement('section');
        this.panel.className = 'lore-widget-panel';
        this.panel.hidden = true;

        const header = document.createElement('header');
        header.className = 'lore-widget-header';
        this.title = document.createElement('strong');
        this.closeButton = document.createElement('button');
        this.closeButton.type = 'button';
        this.closeButton.className = 'lore-widget-close';
        this.closeButton.addEventListener('click', () => this.close());
        header.append(this.title, this.closeButton);

        this.chapter = document.createElement('div');
        this.chapter.className = 'lore-widget-chapter';
        this.text = document.createElement('div');
        this.text.className = 'lore-widget-text';
        this.choiceControls = document.createElement('div');
        this.choiceControls.className = 'lore-widget-choice';
        this.missionControls = document.createElement('div');
        this.missionControls.className = 'lore-widget-mission';

        const navigation = document.createElement('nav');
        navigation.className = 'lore-widget-navigation';
        this.previousButton = document.createElement('button');
        this.previousButton.type = 'button';
        this.previousButton.addEventListener('click', () => this.move(-1));
        this.progress = document.createElement('div');
        this.progress.className = 'lore-widget-progress';
        this.nextButton = document.createElement('button');
        this.nextButton.type = 'button';
        this.nextButton.addEventListener('click', () => this.move(1));
        navigation.append(this.previousButton, this.progress, this.nextButton);

        this.panel.append(
            header,
            this.chapter,
            this.text,
            this.choiceControls,
            this.missionControls,
            navigation
        );
        this.panel.addEventListener('pointerdown', event => {
            this.pointerStart = { x: event.clientX, y: event.clientY };
        });
        this.panel.addEventListener('pointerup', event => {
            if (!this.pointerStart) return;
            const dx = event.clientX - this.pointerStart.x;
            const dy = event.clientY - this.pointerStart.y;
            this.pointerStart = null;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                this.move(dx < 0 ? 1 : -1);
            }
        });
        this.panel.addEventListener('pointercancel', () => {
            this.pointerStart = null;
        });

        this.root.append(this.button, this.panel);
    }

    getChapters() {
        const state = loadState();
        const nexusState = loadNexusState();
        const unlocked = {
            prologue: true,
            'city-online': state.balance > 0,
            development: state.farmLevel > 0,
            'two-powers': state.buildings.stadium,
            'the-choice': state.buildings.stadium,
            'city-grows': state.buildings.studio,
            'the-hole': nexusState.visitedUndercity
        };

        return i18n.locale.lore.main.chapters.filter(
            chapter => unlocked[chapter.id] === true
        );
    }

    toggle() {
        return this.isOpen ? this.close() : this.open();
    }

    open() {
        if (!this.panel) return false;
        this.isOpen = true;
        this.index = 0;
        this.panel.hidden = false;
        this.button.setAttribute('aria-expanded', 'true');
        this.render();
        return true;
    }

    close() {
        this.isOpen = false;
        if (this.panel) this.panel.hidden = true;
        this.button?.setAttribute('aria-expanded', 'false');
        return true;
    }

    move(amount) {
        const chapters = this.getChapters();
        this.index = Math.max(0, Math.min(chapters.length - 1, this.index + amount));
        this.render();
    }

    render() {
        if (!this.root) return;
        const locale = i18n.locale;
        const chapters = this.getChapters();
        this.index = Math.max(0, Math.min(chapters.length - 1, this.index));
        const entry = chapters[this.index];
        const strings = locale.lore.main;

        this.button.setAttribute('aria-label', strings.open);
        this.button.title = strings.open;
        this.unread.hidden = chapters.every(item => this.readChapters.includes(item.id));
        this.title.textContent = strings.title;
        this.closeButton.textContent = '×';
        this.closeButton.setAttribute('aria-label', locale.system.close);
        this.previousButton.textContent = '‹';
        this.previousButton.setAttribute('aria-label', strings.previous);
        this.nextButton.textContent = '›';
        this.nextButton.setAttribute('aria-label', strings.next);
        this.previousButton.disabled = this.index === 0;
        this.nextButton.disabled = this.index === chapters.length - 1;
        this.chapter.textContent = entry.heading;
        this.text.textContent = entry.text;
        this.renderFactionChoice(entry);
        this.renderMissionControls(entry);
        this.progress.replaceChildren(...chapters.map((item, index) => {
            const dot = document.createElement('span');
            dot.className = index === this.index ? 'is-current' : '';
            dot.textContent = '●';
            dot.setAttribute('aria-label', `${index + 1}/${chapters.length}`);
            return dot;
        }));

        if (this.isOpen && !this.readChapters.includes(entry.id)) {
            this.readChapters.push(entry.id);
            this.saveReadChapters();
            this.unread.hidden = chapters.every(item => this.readChapters.includes(item.id));
        }
    }

    renderFactionChoice(entry) {
        this.choiceControls.replaceChildren();
        this.choiceControls.hidden = entry.id !== 'the-choice';
        if (this.choiceControls.hidden) return;

        const nexusState = loadNexusState();
        if (nexusState.faction) {
            const selected = document.createElement('p');
            selected.textContent = `${i18n.locale.lore.main.factionRegistered}: ${i18n.t(`nexus.factions.${nexusState.faction}`)}`;
            this.choiceControls.append(selected);
            return;
        }

        const unlocked = Boolean(loadState().buildings.stadium);
        for (const factionId of ['government', 'mafia']) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = i18n.t(`nexus.factions.${factionId}`);
            button.disabled = !unlocked;
            button.title = unlocked ? '' : i18n.t('nexus.factionChoiceLocked');
            button.addEventListener('click', () => {
                setNexusFaction(nexusState, factionId);
                this.render();
            });
            this.choiceControls.append(button);
        }

        if (!unlocked) {
            const note = document.createElement('small');
            note.textContent = i18n.t('nexus.factionChoiceLocked');
            this.choiceControls.append(note);
        }
    }

    renderMissionControls(entry) {
        this.missionControls.replaceChildren();
        this.missionControls.hidden = true;

        const nexusState = loadNexusState();
        const missionId = entry.id === 'the-choice' && nexusState.faction === 'government'
            ? 'audit-transit-link'
            : entry.id === 'the-hole' && nexusState.faction === 'mafia'
                ? 'trace-grid-signal'
                : '';
        if (!missionId) return;

        const strings = i18n.locale.lore.main.missions[missionId];
        let status = nexusState.missions[missionId];
        const undercity = loadState().cities.undercity;
        const objectiveComplete = missionId === 'audit-transit-link'
            ? nexusState.visitedUndercity
            : undercity.farmLevel > 0 || Object.values(undercity.buildings).some(Boolean);

        if (status === 'active' && objectiveComplete) {
            status = setMissionStatus(nexusState, missionId, 'completed').missions[missionId];
        }
        if (status === 'locked') return;

        this.missionControls.hidden = false;
        const title = document.createElement('strong');
        title.textContent = strings.title;
        const description = document.createElement('p');
        description.textContent = strings.description;
        const action = document.createElement('button');
        action.type = 'button';
        action.textContent = status === 'available'
            ? strings.accept
            : status === 'completed'
                ? strings.completed
                : strings.active;
        action.disabled = status !== 'available';
        action.addEventListener('click', () => {
            setMissionStatus(loadNexusState(), missionId, 'active');
            this.render();
        });

        this.missionControls.append(title, description, action);
    }

    destroy() {
        this.unsubscribeLanguage?.();
        this.unsubscribeLanguage = null;
        if (this.progressChangeHandler) {
            window.removeEventListener('systemprogresschange', this.progressChangeHandler);
            this.progressChangeHandler = null;
        }
        this.root?.replaceChildren();
        this.root = null;
        this.button = null;
        this.panel = null;
        this.missionControls = null;
    }
}

export { LoreWidget };
export default LoreWidget;

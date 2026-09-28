'use strict';

/*
 * FREEzzzGames — Main World.
 *
 * Contract:
 * - root is a full-screen mount supplied by app.js;
 * - viewport size comes from the actual DOM viewport;
 * - camera uses world coordinates;
 * - Telegram logic never enters this module;
 * - existing economy, storage, i18n, gestures and objects modules remain intact.
 */

import gestures from './gestures.js';
import camera from './camera.js';
import objects from './objects.js';
import economy from '../economy/economy.js';
import storage from '../app/storage.js';
import i18n from '../i18n/i18n.js';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 3600;

const COIN_REWARD = 1;
const FARM_BASE_COST = 10;
const FARM_LEVEL_REWARD = 2;

const WORLD_LORE_EVENTS = Object.freeze({
    initialization: Object.freeze({
        era: 1,
        titleKey: 'lore.world.initialization.title',
        textKey: 'lore.world.initialization.text',
        duration: 9000
    }),

    firstResource: Object.freeze({
        era: 1,
        titleKey: 'lore.world.firstResource.title',
        textKey: 'lore.world.firstResource.text',
        duration: 6000
    }),

    farmOnline: Object.freeze({
        era: 1,
        titleKey: 'lore.world.farmOnline.title',
        textKey: 'lore.world.farmOnline.text',
        duration: 7000
    }),

    unknownStructure: Object.freeze({
        era: 1,
        titleKey: 'lore.world.unknownStructure.title',
        textKey: 'lore.world.unknownStructure.text',
        duration: 8000
    })
});

const SPHERE_RADIUS_MULTIPLIER = 1.5;
const SPHERE_MIN_SCALE = 0.50;

const BUILDINGS = Object.freeze({
    workshop: {
        id: 'workshop',
        icon: '🔧',
        cost: 75,
        passiveIncome: 1,
        passiveInterval: 10000,
        x: WORLD_WIDTH / 2 - 240,
        y: WORLD_HEIGHT / 2
    },

    stadium: {
        id: 'stadium',
        icon: '🏟️',
        cost: 400,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2 + 240,
        y: WORLD_HEIGHT / 2
    },

    studio: {
        id: 'studio',
        icon: '🎬',
        cost: 2000,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2 - 220
    },

    shopping: {
        id: 'shopping',
        icon: '🏢',
        cost: 10000,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2 + 220
    }
});

const SIDE_BUILDINGS_DISTANCE =
    Math.abs(BUILDINGS.workshop.x - BUILDINGS.stadium.x);

const SPHERE_RADIUS =
    SIDE_BUILDINGS_DISTANCE * SPHERE_RADIUS_MULTIPLIER;

class World {
    constructor(root) {
        if (!root || !(root instanceof HTMLElement)) {
            throw new Error('[FREEzzzGames] World root is invalid.');
        }

        this.root = root;
        this.viewport = null;
        this.scene = null;
        this.hud = null;
        this.balanceElement = null;
        this.hintElement = null;
        this.languageButton = null;

        this.unsubscribeLanguage = null;
        this.resizeHandler = null;
        this.pointerDownHandler = null;
        this.pointerMoveHandler = null;
        this.pointerUpHandler = null;
        this.pointerCancelHandler = null;

        this.pointerActive = false;
        this.lastPointer = null;

        this.farmLevel = 0;
        this.buildings = {
            workshop: false,
            stadium: false,
            studio: false,
            shopping: false
        };

        this.lastSavedAt = 0;
        this.loreProgress = storage.loadLoreProgress();
        this.lastTapTime = 0;
        this.hintTimer = null;
        this.passiveTimer = null;
        this.destroyed = false;

        this.init();
    }

    init() {
        this.loadSavedState();
        this.createStructure();
        this.createObjects();
        this.bindEvents();

        this.updateViewport();

        camera.setPosition(
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2
        );

        this.clampCamera();

        this.applyOfflinePassiveIncome();
        this.startPassiveIncome();
        this.render();

        if (!this.showLoreEvent('initialization')) {
            this.showHint(i18n.t('hints.tapFarm'));
        }
    }

    loadSavedState() {
        const state = storage.loadState();

        economy.setBalance(state.balance);
        this.farmLevel = state.farmLevel;

        this.buildings = {
            workshop: state.buildings.workshop,
            stadium: state.buildings.stadium,
            studio: state.buildings.studio,
            shopping: state.buildings.shopping
        };

        this.lastSavedAt = state.lastSavedAt;
    }

    saveState() {
        storage.saveState({
            balance: economy.getBalance(),
            farmLevel: this.farmLevel,
            buildings: { ...this.buildings },
            lastSavedAt: Date.now()
        });

        this.lastSavedAt = Date.now();
    }

    createStructure() {
        this.root.innerHTML = '';
        this.root.className = 'game-world';

        this.viewport = document.createElement('div');
        this.viewport.className = 'world-viewport';

        this.scene = document.createElement('div');
        this.scene.className = 'world-scene';

        this.hud = document.createElement('div');
        this.hud.className = 'world-hud';

        this.balanceElement = document.createElement('div');
        this.balanceElement.className = 'world-balance';

        this.hintElement = document.createElement('div');
        this.hintElement.className = 'world-hint';

        this.languageButton = document.createElement('button');
        this.languageButton.type = 'button';
        this.languageButton.className = 'world-language-button';

        this.languageButton.addEventListener('click', event => {
            event.stopPropagation();
            i18n.nextLanguage();
        });

        this.hud.append(
            this.languageButton,
            this.balanceElement,
            this.hintElement
        );

        this.unsubscribeLanguage = i18n.subscribe(() => {
            this.updateLocalization();
            this.render();
        });

        this.updateLocalization();

        this.viewport.append(this.scene);
        this.root.append(this.viewport, this.hud);
    }

    createObjects() {
        this.scene.innerHTML = '';
        objects.clear();

        this.createBuildingElement('farm', '🌾', 150, 130);

        objects.add({
            id: 'farm',
            type: 'building',
            x: WORLD_WIDTH / 2,
            y: WORLD_HEIGHT / 2,
            layer: 'buildings',
            data: { level: this.farmLevel }
        });

        Object.values(BUILDINGS).forEach(building => {
            this.createBuildingElement(
                building.id,
                building.icon,
                118,
                116
            );

            objects.add({
                id: building.id,
                type: 'building',
                x: building.x,
                y: building.y,
                layer: 'buildings',
                data: {
                    level: this.buildings[building.id] ? 1 : 0,
                    cost: building.cost
                }
            });
        });
    }

    createBuildingElement(id, icon, width, height) {
        const element = document.createElement('button');

        element.type = 'button';
        element.dataset.objectId = id;

        if (id === 'farm') {
            element.className = 'world-object world-farm';

            element.innerHTML = `
                <span class="object-icon">${icon}</span>
                <span class="object-title"></span>
                <span class="object-level"></span>
            `;

            element.addEventListener('click', event => {
                event.stopPropagation();
                this.interactWithFarm();
            });
        } else {
            element.className = 'world-object world-locked-upgrade';

            element.innerHTML = `
                <span class="locked-icon">${icon}</span>
                <span class="locked-title"></span>
                <span class="locked-price"></span>
                <span class="locked-state">🔒</span>
            `;

            element.addEventListener('click', event => {
                event.stopPropagation();
                this.interactWithBuilding(id);
            });
        }

        element.style.width = `${width}px`;
        element.style.minHeight = `${height}px`;

        this.scene.appendChild(element);
    }

    bindEvents() {
        this.pointerDownHandler = event => {
            if (
                this.destroyed ||
                (event.button > 0 && event.pointerType === 'mouse')
            ) {
                return;
            }

            this.pointerActive = true;
            this.lastPointer = {
                x: event.clientX,
                y: event.clientY
            };

            try {
                this.viewport.setPointerCapture(event.pointerId);
            } catch {}

            gestures.start(
                event.clientX,
                event.clientY,
                event.timeStamp
            );
        };

        this.pointerMoveHandler = event => {
            if (!this.pointerActive) return;

            const result = gestures.move(
                event.clientX,
                event.clientY,
                event.timeStamp
            );

            if (!result || result.type !== 'move') return;

            camera.move(
                -result.deltaX / Math.max(camera.zoom, 0.0001),
                -result.deltaY / Math.max(camera.zoom, 0.0001)
            );

            this.clampCamera();
            this.render();

            this.lastPointer = {
                x: event.clientX,
                y: event.clientY
            };
        };

        this.pointerUpHandler = event => {
            if (!this.pointerActive) return;

            this.pointerActive = false;

            const result = gestures.end(
                event.clientX,
                event.clientY,
                event.timeStamp
            );

            if (result?.type === 'swipe') {
                this.clampCamera();
                this.render();
            }

            try {
                this.viewport.releasePointerCapture(event.pointerId);
            } catch {}

            this.lastPointer = null;
        };

        this.pointerCancelHandler = () => {
            this.pointerActive = false;
            this.lastPointer = null;
            gestures.cancel();
        };

        this.resizeHandler = () => {
            if (this.destroyed) return;

            this.updateViewport();
            this.clampCamera();
            this.render();
        };

        this.viewport.addEventListener(
            'pointerdown',
            this.pointerDownHandler
        );

        this.viewport.addEventListener(
            'pointermove',
            this.pointerMoveHandler
        );

        this.viewport.addEventListener(
            'pointerup',
            this.pointerUpHandler
        );

        this.viewport.addEventListener(
            'pointercancel',
            this.pointerCancelHandler
        );

        window.addEventListener(
            'resize',
            this.resizeHandler
        );
    }

    updateViewport() {
        if (!this.viewport) return;

        const rect = this.viewport.getBoundingClientRect();

        camera.setViewport(
            Math.max(1, rect.width),
            Math.max(1, rect.height)
        );
    }

    clampCamera() {
        const halfWidth =
            camera.viewportWidth / (2 * camera.zoom);

        const halfHeight =
            camera.viewportHeight / (2 * camera.zoom);

        camera.x =
            WORLD_WIDTH <= halfWidth * 2
                ? WORLD_WIDTH / 2
                : Math.min(
                    WORLD_WIDTH - halfWidth,
                    Math.max(halfWidth, camera.x)
                );

        camera.y =
            WORLD_HEIGHT <= halfHeight * 2
                ? WORLD_HEIGHT / 2
                : Math.min(
                    WORLD_HEIGHT - halfHeight,
                    Math.max(halfHeight, camera.y)
                );
    }

    interactWithFarm() {
        const now = Date.now();

        if (now - this.lastTapTime < 120) return;
        this.lastTapTime = now;

        if (this.farmLevel === 0) {
            if (economy.getBalance() < FARM_BASE_COST) {
                economy.add(COIN_REWARD);
                this.saveState();

                if (!this.showLoreEvent('firstResource')) {
                    this.showHint('🪙 +1');
                }

                this.render();
                return;
            }

            if (!economy.spend(FARM_BASE_COST)) return;

            this.farmLevel = 1;

            objects.update('farm', {
                data: { level: 1 }
            });

            this.saveState();

            if (!this.showLoreEvent('farmOnline')) {
                this.showHint(
                    i18n.t('buildings.farm.built')
                );
            }

            this.render();
            return;
        }

        const reward =
            FARM_LEVEL_REWARD * this.farmLevel;

        economy.add(reward);
        this.saveState();

        this.showHint(`🪙 +${reward}`);
        this.render();
    }

    interactWithBuilding(id) {
        const building = BUILDINGS[id];
        if (!building) return;

        if (this.buildings[id]) {
            this.showHint(
                `${building.icon} ${i18n.t(
                    `buildings.${id}.title`
                )}`
            );
            return;
        }

        if (!economy.canAfford(building.cost)) {
            const feedback =
                `${i18n.t('hints.insufficient')} ${building.cost} 🪙`;

            if (!this.showLoreEvent('unknownStructure', feedback)) {
                this.showHint(feedback);
            }

            return;
        }

        if (!economy.spend(building.cost)) return;

        this.buildings[id] = true;

        objects.update(id, {
            data: { level: 1 }
        });

        this.saveState();

        const feedback =
            `${building.icon} ${i18n.t(
                `buildings.${id}.built`
            )}`;

        if (!this.showLoreEvent('unknownStructure', feedback)) {
            this.showHint(feedback);
        }

        if (id === 'workshop') {
            this.startPassiveIncome();
        }

        this.render();
    }

    applyPassiveIncome() {
        if (!this.buildings.workshop) return;

        economy.add(
            BUILDINGS.workshop.passiveIncome
        );
    }

    applyOfflinePassiveIncome() {
        if (
            !this.buildings.workshop ||
            !this.lastSavedAt
        ) {
            return;
        }

        const elapsed =
            Math.max(0, Date.now() - this.lastSavedAt);

        const cycles =
            Math.floor(
                elapsed / BUILDINGS.workshop.passiveInterval
            );

        if (cycles <= 0) return;

        const safeCycles =
            Math.min(cycles, 8640);

        economy.add(
            safeCycles *
            BUILDINGS.workshop.passiveIncome
        );

        this.saveState();
    }

    startPassiveIncome() {
        clearTimeout(this.passiveTimer);

        if (!this.buildings.workshop) {
            this.passiveTimer = null;
            return;
        }

        this.passiveTimer = setTimeout(() => {
            if (
                this.destroyed ||
                !this.buildings.workshop
            ) {
                return;
            }

            this.applyPassiveIncome();
            this.saveState();

            this.showHint('🪙 +1');
            this.render();
            this.startPassiveIncome();
        }, BUILDINGS.workshop.passiveInterval);
    }

    updateLocalization() {
        if (!this.languageButton) return;

        this.languageButton.textContent =
            i18n.code.toUpperCase();

        const farm =
            this.scene?.querySelector('.world-farm');

        if (farm) {
            const title =
                farm.querySelector('.object-title');

            if (title) {
                title.textContent =
                    i18n.t('buildings.farm.title');
            }
        }

        Object.values(BUILDINGS).forEach(building => {
            const element =
                this.scene?.querySelector(
                    `[data-object-id="${building.id}"]`
                );

            if (!element) return;

            const title =
                element.querySelector('.locked-title');

            if (title) {
                title.textContent =
                    i18n.t(
                        `buildings.${building.id}.title`
                    );
            }
        });
    }

    updateBalance() {
        if (!this.balanceElement) return;

        this.balanceElement.textContent =
            `🪙 ${economy.getBalance()}`;
    }

    showHint(message) {
        if (!this.hintElement) return;

        clearTimeout(this.hintTimer);

        this.hintElement.classList.remove('is-lore');
        this.hintElement.textContent = message;
        this.hintElement.classList.add('is-visible');

        this.hintTimer = setTimeout(() => {
            if (this.hintElement) {
                this.hintElement.classList.remove('is-visible');
            }
        }, 1800);
    }

    showLoreEvent(eventId, additionalText = '') {
        const event = WORLD_LORE_EVENTS[eventId];

        if (
            !event ||
            this.loreProgress.seenEvents.includes(eventId) ||
            !this.hintElement
        ) {
            return false;
        }

        this.loreProgress.seenEvents.push(eventId);
        storage.saveLoreProgress(this.loreProgress);

        clearTimeout(this.hintTimer);

        const message = [
            i18n.t(event.titleKey),
            i18n.t(event.textKey),
            additionalText
        ].filter(Boolean).join('\n\n');

        this.hintElement.textContent = message;
        this.hintElement.classList.add('is-lore', 'is-visible');

        this.hintTimer = setTimeout(() => {
            if (this.hintElement) {
                this.hintElement.classList.remove('is-visible', 'is-lore');
            }
        }, event.duration);

        return true;
    }

    applySphereProjection(element, worldX, worldY) {
        if (!element) return;

        const centerX = WORLD_WIDTH / 2;
        const centerY = WORLD_HEIGHT / 2;

        const dx = worldX - centerX;
        const dy = worldY - centerY;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        const normalized =
            Math.min(1, distance / SPHERE_RADIUS);

        const scale =
            Math.max(
                SPHERE_MIN_SCALE,
                1 - normalized * 0.5
            );

        element.style.scale = String(scale);
    }

    render() {
        if (
            this.destroyed ||
            !this.scene ||
            !this.viewport
        ) {
            return;
        }

        this.updateBalance();
        this.updateLocalization();
        this.clampCamera();

        const width = camera.viewportWidth;
        const height = camera.viewportHeight;

        const offsetX =
            width / 2 - camera.x;

        const offsetY =
            height / 2 - camera.y;

        this.scene.style.width =
            `${WORLD_WIDTH}px`;

        this.scene.style.height =
            `${WORLD_HEIGHT}px`;

        this.scene.style.transform =
            `translate3d(${offsetX}px, ${offsetY}px, 0)`;

        const farm =
            this.scene.querySelector('.world-farm');

        if (farm) {
            farm.style.left =
                `${WORLD_WIDTH / 2}px`;

            farm.style.top =
                `${WORLD_HEIGHT / 2}px`;

            const level =
                farm.querySelector('.object-level');

            if (level) {
                level.textContent =
                    `${i18n.t('buildings.farm.level')} ${this.farmLevel}`;
            }

            this.applySphereProjection(
                farm,
                WORLD_WIDTH / 2,
                WORLD_HEIGHT / 2
            );
        }

        Object.values(BUILDINGS).forEach(building => {
            const element =
                this.scene.querySelector(
                    `[data-object-id="${building.id}"]`
                );

            if (!element) return;

            element.style.left = `${building.x}px`;
            element.style.top = `${building.y}px`;

            const purchased =
                this.buildings[building.id];

            const affordable =
                economy.canAfford(building.cost);

            element.classList.toggle(
                'is-purchased',
                purchased
            );

            element.classList.toggle(
                'is-affordable',
                !purchased && affordable
            );

            element.classList.toggle(
                'is-locked',
                !purchased
            );

            const price =
                element.querySelector('.locked-price');

            if (price) {
                price.textContent =
                    purchased
                        ? i18n.t('hints.purchased')
                        : `${building.cost} 🪙`;
            }

            const state =
                element.querySelector('.locked-state');

            if (state) {
                state.textContent =
                    purchased
                        ? '✓'
                        : affordable
                            ? '🔓'
                            : '🔒';
            }

            this.applySphereProjection(
                element,
                building.x,
                building.y
            );
        });
    }

    destroy() {
        this.destroyed = true;

        clearTimeout(this.hintTimer);
        clearTimeout(this.passiveTimer);

        this.hintTimer = null;
        this.passiveTimer = null;

        if (this.unsubscribeLanguage) {
            this.unsubscribeLanguage();
            this.unsubscribeLanguage = null;
        }

        if (this.viewport) {
            if (this.pointerDownHandler) {
                this.viewport.removeEventListener(
                    'pointerdown',
                    this.pointerDownHandler
                );
            }

            if (this.pointerMoveHandler) {
                this.viewport.removeEventListener(
                    'pointermove',
                    this.pointerMoveHandler
                );
            }

            if (this.pointerUpHandler) {
                this.viewport.removeEventListener(
                    'pointerup',
                    this.pointerUpHandler
                );
            }

            if (this.pointerCancelHandler) {
                this.viewport.removeEventListener(
                    'pointercancel',
                    this.pointerCancelHandler
                );
            }
        }

        if (this.resizeHandler) {
            window.removeEventListener(
                'resize',
                this.resizeHandler
            );
        }

        gestures.cancel();

        this.root.innerHTML = '';

        this.viewport = null;
        this.scene = null;
        this.hud = null;
    }
}

export {
    World,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    BUILDINGS,
    WORLD_LORE_EVENTS
};

export default World;

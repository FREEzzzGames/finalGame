'use strict';

/*
 * FREEzzzGames
 * Main World playable module
 *
 * Первый игровой вертикальный срез:
 * - вертикальный 2D мир;
 * - горизонтальное перемещение;
 * - вертикальное перемещение;
 * - плавное управление камерой пальцем;
 * - tap по объекту;
 * - активная экономика FARM;
 * - здания следующего уровня;
 * - пассивный доход с WORKSHOP;
 * - локальное сохранение состояния;
 * - минимальный HUD.
 *
 * Серверная авторитетность будет подключена отдельно.
 */

import gestures from './gestures.js';
import camera from './camera.js';
import objects from './objects.js';
import economy from '../economy/economy.js';
import storage from '../app/storage.js';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 3600;

const COIN_REWARD = 1;
const FARM_BASE_COST = 10;
const FARM_LEVEL_REWARD = 2;

/*
 * Экономическая лестница.
 *
 * FARM       10
 * WORKSHOP   75
 * STADIUM    400
 * STUDIO     2000
 * SHOPPING   10000
 */
const BUILDINGS = Object.freeze({
    workshop: {
        id: 'workshop',
        icon: '🔧',
        title: 'WORKSHOP',
        cost: 75,
        passiveIncome: 1,
        passiveInterval: 10000,
        x: WORLD_WIDTH / 2 - 240,
        y: WORLD_HEIGHT / 2
    },

    stadium: {
        id: 'stadium',
        icon: '🏟️',
        title: 'STADIUM',
        cost: 400,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2 + 240,
        y: WORLD_HEIGHT / 2
    },

    studio: {
        id: 'studio',
        icon: '🎬',
        title: 'STUDIO',
        cost: 2000,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2 - 220
    },

    shopping: {
        id: 'shopping',
        icon: '🏢',
        title: 'SHOPPING',
        cost: 10000,
        passiveIncome: 0,
        passiveInterval: 0,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2 + 220
    }
});

class World {
    constructor(root) {
        if (!root) {
            throw new Error(
                '[FREEzzzGames] World root is required.'
            );
        }

        this.root = root;

        this.viewport = null;
        this.scene = null;
        this.hud = null;
        this.balanceElement = null;
        this.hintElement = null;

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

        this.lastTapTime = 0;
        this.hintTimer = null;
        this.passiveTimer = null;

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

        this.applyOfflinePassiveIncome();

        this.startPassiveIncome();

        this.render();

        this.showHint(
            '👆 Нажми на ферму'
        );
    }

    loadSavedState() {
        const state =
            storage.loadState();

        economy.setBalance(
            state.balance
        );

        this.farmLevel =
            state.farmLevel;

        this.buildings = {
            workshop:
                state.buildings.workshop,

            stadium:
                state.buildings.stadium,

            studio:
                state.buildings.studio,

            shopping:
                state.buildings.shopping
        };

        this.lastSavedAt =
            state.lastSavedAt;
    }

    saveState() {
        storage.saveState({
            balance:
                economy.getBalance(),

            farmLevel:
                this.farmLevel,

            buildings: {
                ...this.buildings
            },

            lastSavedAt:
                Date.now()
        });

        this.lastSavedAt =
            Date.now();
    }

    createStructure() {
        this.root.innerHTML = '';

        this.root.className =
            'game-world';

        this.viewport =
            document.createElement('div');

        this.viewport.className =
            'world-viewport';

        this.scene =
            document.createElement('div');

        this.scene.className =
            'world-scene';

        this.hud =
            document.createElement('div');

        this.hud.className =
            'world-hud';

        this.balanceElement =
            document.createElement('div');

        this.balanceElement.className =
            'world-balance';

        this.hintElement =
            document.createElement('div');

        this.hintElement.className =
            'world-hint';

        this.hud.append(
            this.balanceElement,
            this.hintElement
        );

        this.viewport.appendChild(
            this.scene
        );

        this.root.append(
            this.viewport,
            this.hud
        );
    }

    createObjects() {
        this.scene.innerHTML = '';

        /*
         * FARM
         */
        const farm =
            document.createElement('button');

        farm.type = 'button';

        farm.className =
            'world-object world-farm';

        farm.dataset.objectId =
            'farm';

        farm.innerHTML = `
            <span class="object-icon">🌾</span>
            <span class="object-title">FARM</span>
            <span class="object-level">LVL 0</span>
        `;

        farm.addEventListener(
            'click',
            event => {
                event.stopPropagation();

                this.interactWithFarm();
            }
        );

        this.scene.appendChild(
            farm
        );

        objects.add({
            id: 'farm',
            type: 'building',
            x: WORLD_WIDTH / 2,
            y: WORLD_HEIGHT / 2,
            layer: 'buildings',
            data: {
                level:
                    this.farmLevel
            }
        });

        /*
         * БУДУЩИЕ ЗДАНИЯ
         */
        Object.values(
            BUILDINGS
        ).forEach(
            building => {
                const element =
                    document.createElement('button');

                element.type = 'button';

                element.className =
                    'world-object world-locked-upgrade';

                element.dataset.objectId =
                    building.id;

                element.innerHTML = `
                    <span class="locked-icon">
                        ${building.icon}
                    </span>

                    <span class="locked-title">
                        ${building.title}
                    </span>

                    <span class="locked-price">
                        ${building.cost} 🪙
                    </span>

                    <span class="locked-state">
                        🔒
                    </span>
                `;

                element.addEventListener(
                    'click',
                    event => {
                        event.stopPropagation();

                        this.interactWithBuilding(
                            building.id
                        );
                    }
                );

                this.scene.appendChild(
                    element
                );

                objects.add({
                    id: building.id,
                    type: 'building',
                    x: building.x,
                    y: building.y,
                    layer: 'buildings',
                    data: {
                        level:
                            this.buildings[
                                building.id
                            ]
                                ? 1
                                : 0,

                        cost:
                            building.cost
                    }
                });
            }
        );
    }

    bindEvents() {
        this.viewport.addEventListener(
            'pointerdown',
            event => {
                this.pointerActive = true;

                this.lastPointer = {
                    x: event.clientX,
                    y: event.clientY
                };

                try {
                    this.viewport.setPointerCapture(
                        event.pointerId
                    );
                } catch {
                    // Pointer capture is optional.
                }

                gestures.start(
                    event.clientX,
                    event.clientY,
                    event.timeStamp
                );
            }
        );

        this.viewport.addEventListener(
            'pointermove',
            event => {
                if (!this.pointerActive) {
                    return;
                }

                const result =
                    gestures.move(
                        event.clientX,
                        event.clientY,
                        event.timeStamp
                    );

                if (
                    !result ||
                    result.type !== 'move'
                ) {
                    return;
                }

                /*
                 * Камера следует за пальцем.
                 *
                 * Движение мира происходит
                 * в противоположную сторону
                 * движения пальца.
                 */
                camera.move(
                    -result.deltaX,
                    -result.deltaY
                );

                this.clampCamera();
                this.render();

                this.lastPointer = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        );

        this.viewport.addEventListener(
            'pointerup',
            event => {
                if (!this.pointerActive) {
                    return;
                }

                this.pointerActive = false;

                const result =
                    gestures.end(
                        event.clientX,
                        event.clientY,
                        event.timeStamp
                    );

                this.handleGesture(
                    result
                );

                try {
                    this.viewport.releasePointerCapture(
                        event.pointerId
                    );
                } catch {
                    // Pointer capture is optional.
                }

                this.lastPointer = null;
            }
        );

        this.viewport.addEventListener(
            'pointercancel',
            () => {
                this.pointerActive = false;
                this.lastPointer = null;

                gestures.cancel();
            }
        );

        window.addEventListener(
            'resize',
            () => {
                this.updateViewport();
                this.clampCamera();
                this.render();
            }
        );
    }

    handleGesture(result) {
        if (
            !result ||
            result.type === 'none'
        ) {
            return;
        }

        if (
            result.type === 'tap'
        ) {
            this.handleWorldTap(
                result.x,
                result.y
            );

            return;
        }

        /*
         * При swipe камера уже двигалась
         * вместе с пальцем через pointermove.
         *
         * Поэтому здесь больше НЕ делаем
         * дополнительный скачок на 180px.
         */
        if (
            result.type === 'swipe'
        ) {
            this.clampCamera();
            this.render();
        }
    }

    clampCamera() {
        const viewportWidth =
            camera.viewportWidth;

        const viewportHeight =
            camera.viewportHeight;

        const halfWidth =
            viewportWidth /
            (2 * camera.zoom);

        const halfHeight =
            viewportHeight /
            (2 * camera.zoom);

        const minX =
            Math.min(
                halfWidth,
                WORLD_WIDTH / 2
            );

        const maxX =
            Math.max(
                WORLD_WIDTH - halfWidth,
                WORLD_WIDTH / 2
            );

        const minY =
            Math.min(
                halfHeight,
                WORLD_HEIGHT / 2
            );

        const maxY =
            Math.max(
                WORLD_HEIGHT - halfHeight,
                WORLD_HEIGHT / 2
            );

        const nextX =
            Math.min(
                maxX,
                Math.max(
                    minX,
                    camera.x
                )
            );

        const nextY =
            Math.min(
                maxY,
                Math.max(
                    minY,
                    camera.y
                )
            );

        camera.setPosition(
            nextX,
            nextY
        );
    }

    handleWorldTap(x, y) {
        const target =
            document.elementFromPoint(
                x,
                y
            );

        if (
            target &&
            target.closest(
                '.world-farm'
            )
        ) {
            return;
        }

        if (
            target &&
            target.closest(
                '.world-locked-upgrade'
            )
        ) {
            return;
        }

        this.showHint(
            '👆 Нажми на объект'
        );
    }

    interactWithFarm() {
        const now =
            Date.now();

        if (
            now - this.lastTapTime <
            120
        ) {
            return;
        }

        this.lastTapTime =
            now;

        if (
            this.farmLevel === 0
        ) {
            if (
                economy.getBalance() <
                FARM_BASE_COST
            ) {
                economy.add(
                    COIN_REWARD
                );

                this.saveState();

                this.showHint(
                    '🪙 +1'
                );

                this.updateBalance();

                return;
            }

            economy.spend(
                FARM_BASE_COST
            );

            this.farmLevel = 1;

            objects.update(
                'farm',
                {
                    data: {
                        level: 1
                    }
                }
            );

            this.saveState();

            this.showHint(
                '🌾 Ферма построена'
            );

            this.render();

            return;
        }

        const reward =
            FARM_LEVEL_REWARD *
            this.farmLevel;

        economy.add(
            reward
        );

        this.saveState();

        this.showHint(
            `🪙 +${reward}`
        );

        this.updateBalance();

        this.render();
    }

    interactWithBuilding(id) {
        const building =
            BUILDINGS[id];

        if (!building) {
            return;
        }

        if (
            this.buildings[id]
        ) {
            this.showHint(
                `${building.icon} ${building.title}`
            );

            return;
        }

        if (
            !economy.canAfford(
                building.cost
            )
        ) {
            this.showHint(
                `🔒 ${building.cost} 🪙`
            );

            return;
        }

        const spent =
            economy.spend(
                building.cost
            );

        if (!spent) {
            return;
        }

        this.buildings[id] =
            true;

        objects.update(
            id,
            {
                data: {
                    level: 1
                }
            }
        );

        this.saveState();

        this.showHint(
            `${building.icon} ${building.title} построен`
        );

        /*
         * WORKSHOP начинает приносить
         * первый пассивный доход сразу
         * после покупки.
         */
        if (
            id === 'workshop'
        ) {
            this.startPassiveIncome();
        }

        this.render();
    }

    /*
     * WORKSHOP:
     * Первый пассивный доход.
     *
     * +1 🪙 каждые 10 секунд.
     */
    applyPassiveIncome() {
        if (
            !this.buildings.workshop
        ) {
            return;
        }

        const building =
            BUILDINGS.workshop;

        economy.add(
            building.passiveIncome
        );
    }

    applyOfflinePassiveIncome() {
        if (
            !this.buildings.workshop
        ) {
            return;
        }

        if (
            !this.lastSavedAt
        ) {
            return;
        }

        const now =
            Date.now();

        const elapsed =
            Math.max(
                0,
                now - this.lastSavedAt
            );

        const building =
            BUILDINGS.workshop;

        const cycles =
            Math.floor(
                elapsed /
                building.passiveInterval
            );

        if (
            cycles <= 0
        ) {
            return;
        }

        /*
         * Максимум 24 часа
         * офлайн-дохода в текущей
         * клиентской версии.
         */
        const safeCycles =
            Math.min(
                cycles,
                8640
            );

        economy.add(
            safeCycles *
            building.passiveIncome
        );

        this.saveState();
    }

    /*
     * Последовательный таймер:
     *
     * 10 секунд
     * ↓
     * +1 🪙
     * ↓
     * сохранение
     * ↓
     * следующий цикл
     *
     * Это исключает несколько
     * параллельных интервалов.
     */
    startPassiveIncome() {
        clearTimeout(
            this.passiveTimer
        );

        if (
            !this.buildings.workshop
        ) {
            this.passiveTimer = null;
            return;
        }

        this.passiveTimer =
            setTimeout(
                () => {
                    if (
                        !this.buildings.workshop
                    ) {
                        this.passiveTimer = null;
                        return;
                    }

                    this.applyPassiveIncome();

                    this.saveState();

                    this.showHint(
                        '🪙 +1'
                    );

                    this.render();

                    this.startPassiveIncome();
                },
                BUILDINGS.workshop.passiveInterval
            );
    }

    updateViewport() {
        if (!this.viewport) {
            return;
        }

        const rect =
            this.viewport.getBoundingClientRect();

        camera.setViewport(
            rect.width,
            rect.height
        );
    }

    updateBalance() {
        if (!this.balanceElement) {
            return;
        }

        this.balanceElement.textContent =
            `🪙 ${economy.getBalance()}`;
    }

    showHint(message) {
        if (!this.hintElement) {
            return;
        }

        clearTimeout(
            this.hintTimer
        );

        this.hintElement.textContent =
            message;

        this.hintElement.classList.add(
            'is-visible'
        );

        this.hintTimer =
            setTimeout(
                () => {
                    if (!this.hintElement) {
                        return;
                    }

                    this.hintElement.classList.remove(
                        'is-visible'
                    );
                },
                1800
            );
    }

    render() {
        if (!this.scene) {
            return;
        }

        this.updateBalance();

        this.clampCamera();

        const rect =
            this.viewport.getBoundingClientRect();

         const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const offsetX =
            centerX - camera.x;

        const offsetY =
            centerY - camera.y;

        this.scene.style.width =
            `${WORLD_WIDTH}px`;

        this.scene.style.height =
            `${WORLD_HEIGHT}px`;

        this.scene.style.transform =
            `translate3d(${offsetX}px, ${offsetY}px, 0)`;

        const farm =
            this.scene.querySelector(
                '.world-farm'
            );

        if (farm) {
            farm.style.left =
                `${WORLD_WIDTH / 2}px`;

            farm.style.top =
                `${WORLD_HEIGHT / 2}px`;

            const levelElement =
                farm.querySelector(
                    '.object-level'
                );

            if (levelElement) {
                levelElement.textContent =
                    `LVL ${this.farmLevel}`;
            }
        }

        Object.values(
            BUILDINGS
        ).forEach(
            building => {
                const element =
                    this.scene.querySelector(
                        `[data-object-id="${building.id}"]`
                    );

                if (!element) {
                    return;
                }

                element.style.left =
                    `${building.x}px`;

                element.style.top =
                    `${building.y}px`;

                const purchased =
                    this.buildings[
                        building.id
                    ];

                const affordable =
                    economy.canAfford(
                        building.cost
                    );

                element.classList.toggle(
                    'is-purchased',
                    purchased
                );

                element.classList.toggle(
                    'is-affordable',
                    !purchased &&
                    affordable
                );

                element.classList.toggle(
                    'is-locked',
                    !purchased
                );

                const stateElement =
                    element.querySelector(
                        '.locked-state'
                    );

                if (stateElement) {
                    if (purchased) {
                        stateElement.textContent =
                            '✓';
                    } else if (affordable) {
                        stateElement.textContent =
                            '🔓';
                    } else {
                        stateElement.textContent =
                            '🔒';
                    }
                }

                const priceElement =
                    element.querySelector(
                        '.locked-price'
                    );

                if (priceElement) {
                    priceElement.textContent =
                        purchased
                            ? 'BUILT'
                            : `${building.cost} 🪙`;
                }
            }
        );
    }

    destroy() {
        clearTimeout(
            this.hintTimer
        );

        clearTimeout(
            this.passiveTimer
        );

        this.hintTimer = null;
        this.passiveTimer = null;

        this.pointerActive = false;
        this.lastPointer = null;

        gestures.cancel();

        if (this.root) {
            this.root.innerHTML = '';
        }
    }
}

export {
    World,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    BUILDINGS
};

export default World;
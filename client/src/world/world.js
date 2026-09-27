'use strict';

/*
 * FREEzzzGames
 * Main World playable module
 *
 * Первый игровой вертикальный срез:
 * - вертикальный 2D мир;
 * - горизонтальное перемещение;
 * - вертикальное перемещение;
 * - tap по объекту;
 * - получение монет;
 * - развитие первого объекта;
 * - минимальный HUD.
 *
 * Серверная авторитетность будет подключена
 * отдельно. Этот модуль отвечает только за
 * клиентское представление и взаимодействие.
 */

import gestures from './gestures.js';
import camera from './camera.js';
import objects from './objects.js';
import economy from '../economy/economy.js';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 3600;

const COIN_REWARD = 1;
const FARM_BASE_COST = 10;
const FARM_LEVEL_REWARD = 2;

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
        this.lastTapTime = 0;

        this.init();
    }

    init() {
        this.createStructure();
        this.createObjects();
        this.bindEvents();

        this.updateViewport();
        this.render();

        this.showHint(
            '👆 Нажми на ферму'
        );
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

        const farm = document.createElement('button');

        farm.type = 'button';
        farm.className =
            'world-object world-farm';

        farm.dataset.objectId = 'farm';

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

        this.scene.appendChild(farm);

        objects.add({
            id: 'farm',
            type: 'building',
            x: 0,
            y: 0,
            layer: 'buildings',
            data: {
                level: 0
            }
        });
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
            'pointerup',
            event => {
                if (!this.pointerActive) {
                    return;
                }

                this.pointerActive = false;

                const result = gestures.end(
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
                this.render();
            }
        );
    }

    handleGesture(result) {
        if (!result || result.type === 'none') {
            return;
        }

        if (result.type === 'tap') {
            this.handleWorldTap(
                result.x,
                result.y
            );

            return;
        }

        if (
            result.type === 'swipe' &&
            result.axis === 'horizontal'
        ) {
            const distance =
                result.direction === 'left'
                    ? 180
                    : -180;

            camera.move(
                distance,
                0
            );

            this.render();

            return;
        }

        if (
            result.type === 'swipe' &&
            result.axis === 'vertical'
        ) {
            const distance =
                result.direction === 'up'
                    ? 180
                    : -180;

            camera.move(
                0,
                distance
            );

            this.render();
        }
    }

    handleWorldTap(x, y) {
        /*
         * The farm is currently the only interactive
         * world object.
         *
         * If the tap happens on the farm button,
         * its own click handler handles the action.
         */
        const target =
            document.elementFromPoint(
                x,
                y
            );

        if (
            target &&
            target.closest('.world-farm')
        ) {
            return;
        }

        this.showHint(
            '👆 Нажми на 🌾'
        );
    }

    interactWithFarm() {
        const now = Date.now();

        if (
            now - this.lastTapTime < 120
        ) {
            return;
        }

        this.lastTapTime = now;

        if (this.farmLevel === 0) {
            if (
                economy.getBalance() <
                FARM_BASE_COST
            ) {
                economy.add(
                    COIN_REWARD
                );

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

        this.showHint(
            `🪙 +${reward}`
        );

        this.updateBalance();
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

    render() {
        if (!this.scene) {
            return;
        }

        this.updateBalance();

        const rect =
            this.viewport.getBoundingClientRect();

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        /*
         * World is larger than the screen.
         * Camera position changes through swipes.
         */
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

            farm.querySelector(
                '.object-level'
            ).textContent =
                `LVL ${this.farmLevel}`;
        }

        this.root.style.setProperty(
            '--world-x',
            `${camera.x}px`
        );

        this.root.style.setProperty(
            '--world-y',
            `${camera.y}px`
        );
    }

    updateBalance() {
        if (!this.balanceElement) {
            return;
        }

        this.balanceElement.textContent =
            `🪙 ${Math.floor(
                economy.getBalance()
            )}`;
    }

    showHint(message) {
        if (!this.hintElement) {
            return;
        }

        this.hintElement.textContent =
            message;

        this.hintElement.classList.add(
            'is-visible'
        );

        clearTimeout(
            this.hintTimer
        );

        this.hintTimer = setTimeout(
            () => {
                this.hintElement.classList.remove(
                    'is-visible'
                );
            },
            1600
        );
    }

    getState() {
        return {
            balance:
                economy.getBalance(),

            farmLevel:
                this.farmLevel,

            camera:
                camera.getState()
        };
    }

    destroy() {
        clearTimeout(
            this.hintTimer
        );

        this.root.innerHTML = '';

        objects.clear();
        camera.reset();
        gestures.cancel();
    }
}

export {
    World
};

export default World;
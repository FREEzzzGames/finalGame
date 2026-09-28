'use strict';

import {
    CITY_SIDE_DATA,
    CITY_BUILDING_ICONS,
    calculateFactionIncome,
    getBuildingFaction,
    loadNexusState,
    saveNexusState,
    setMissionStatus
} from './nexus.js';
import i18n from '../i18n/i18n.js';

const BUILDING_SLOT_ORDER = Object.freeze([
    'workshop',
    'stadium',
    'studio',
    'shopping'
]);

class NexusWorldIntegration {
    constructor() {
        this.worldFlipTimer = null;
        this.factionChangeHandler = null;
    }

    getState() {
        return loadNexusState();
    }

    getSide() {
        return this.getState().side;
    }

    getDistrict(side = this.getSide()) {
        return CITY_SIDE_DATA[side].district;
    }

    initialize(cityStates) {
        const state = this.getState();
        if (!cityStates.surface.buildings.stadium && state.side !== 'surface') {
            state.side = 'surface';
            saveNexusState(state);
        }
        return state.side;
    }

    getCityBuildingKey(id, side = this.getSide()) {
        const state = this.getState();
        const district = this.getDistrict(side);

        if (id === 'farm') {
            return side === 'surface' ? 'nexus-core' : 'undercity-core';
        }

        const faction = state.faction || 'government';
        const factionBuildings = district.buildingsByFaction[faction];
        const buildingIndex = BUILDING_SLOT_ORDER.indexOf(id);
        return factionBuildings[buildingIndex] || id;
    }

    isUndercityUnlocked(cityStates) {
        const state = this.getState();
        return Boolean(
            cityStates?.surface?.buildings.stadium ||
            state.visitedUndercity
        );
    }

    calculateBuildingIncome(amount, buildingId, side) {
        const state = this.getState();
        const buildingKey = this.getCityBuildingKey(buildingId, side);
        const buildingFaction = getBuildingFaction(side, buildingKey);
        const playerFaction = state.faction;
        const key = `${side}:${buildingId}`;
        const result = calculateFactionIncome(
            amount,
            buildingFaction,
            playerFaction,
            state.incomeRemainders[key]
        );

        state.incomeRemainders[key] = result.remainder;
        saveNexusState(state);
        return result.income;
    }

    bindFactionChanges(onChange) {
        if (typeof onChange !== 'function' || typeof window === 'undefined') return;
        this.factionChangeHandler = onChange;
        window.addEventListener('nexusfactionchange', this.factionChangeHandler);
    }

    bindWorldSwitch(button, world) {
        button.addEventListener('click', event => {
            event.stopPropagation();
            this.flipWorld(world);
        });
    }

    flipWorld(world) {
        if (!this.isUndercityUnlocked(world.cityStates) || this.worldFlipTimer) {
            if (!this.isUndercityUnlocked(world.cityStates)) {
                world.showHint(i18n.t('nexus.undercityLocked'));
            }
            return false;
        }

        world.root.classList.add('is-flipping');
        world.worldSwitchButton.disabled = true;

        this.worldFlipTimer = setTimeout(() => {
            let state = this.getState();
            state.side = state.side === 'surface' ? 'undercity' : 'surface';
            if (state.side === 'undercity') {
                state.visitedUndercity = true;
                if (state.faction === 'mafia') {
                    state = setMissionStatus(state, 'trace-grid-signal', 'available');
                }
            }
            saveNexusState(state);
            world.loadCityState(state.side);
            world.updateLocalization();
            world.render();

            this.worldFlipTimer = setTimeout(() => {
                world.root.classList.remove('is-flipping');
                this.worldFlipTimer = null;
                world.updateLocalization();
            }, 340);
        }, 320);

        return true;
    }

    updateLocalization(world, buildingDefinitions) {
        const state = this.getState();
        const targetSide = state.side === 'surface' ? 'undercity' : 'surface';
        const undercityUnlocked = this.isUndercityUnlocked(world.cityStates);
        const translate = key => i18n.t(key);

        world.worldSwitchButton.textContent =
            `${undercityUnlocked ? '↻' : '🔒'} ${translate(`nexus.${targetSide}`)}`;
        world.worldSwitchButton.setAttribute(
            'aria-label',
            translate(`nexus.switchTo.${targetSide}`)
        );
        world.worldSwitchButton.disabled = Boolean(this.worldFlipTimer);
        world.worldSwitchButton.setAttribute(
            'aria-disabled',
            String(!undercityUnlocked || Boolean(this.worldFlipTimer))
        );
        world.worldSwitchButton.title = undercityUnlocked
            ? translate(`nexus.switchTo.${targetSide}`)
            : translate('nexus.undercityLocked');

        const farm = world.scene?.querySelector('.world-farm');
        if (farm) {
            const buildingKey = this.getCityBuildingKey('farm', state.side);
            const icon = farm.querySelector('.object-icon');
            if (icon) icon.textContent = CITY_BUILDING_ICONS[buildingKey];

            const title = farm.querySelector('.object-title');
            if (title) title.textContent = translate(`nexus.buildings.${buildingKey}`);
        }

        Object.values(buildingDefinitions).forEach(building => {
            const element = world.scene?.querySelector(
                `[data-object-id="${building.id}"]`
            );
            if (!element) return;

            const buildingKey = this.getCityBuildingKey(building.id, state.side);
            const title = element.querySelector('.locked-title');
            if (title) title.textContent = translate(`nexus.buildings.${buildingKey}`);

            const icon = element.querySelector('.locked-icon');
            if (icon) icon.textContent = CITY_BUILDING_ICONS[buildingKey] || building.icon;
        });
    }

    applyWorldMetadata(root) {
        const state = this.getState();
        const district = this.getDistrict(state.side);
        root.dataset.citySide = state.side;
        root.dataset.districtId = district.id;
        root.dataset.developmentSlots = String(district.developmentSlots);
    }

    destroy(root) {
        clearTimeout(this.worldFlipTimer);
        this.worldFlipTimer = null;
        if (root) root.classList.remove('is-flipping');

        if (this.factionChangeHandler && typeof window !== 'undefined') {
            window.removeEventListener('nexusfactionchange', this.factionChangeHandler);
        }
        this.factionChangeHandler = null;
    }
}

export { NexusWorldIntegration };
export default NexusWorldIntegration;

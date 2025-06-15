// uiManager.js - Handles DOM interactions and UI updates

import { ITEMS } from './items.js';
import * as gameState from './gameState.js';
import * as config from './config.js';

// UI Element selections
export const welcomeScreen = document.getElementById('welcomeScreen');
export const gamePlayScreen = document.getElementById('gamePlayScreen');
export const startButton = document.getElementById('startButton');
export const staminaValueElem = document.getElementById('staminaValue');
export const staminaBarElem = document.getElementById('staminaBar');
export const waterValueElem = document.getElementById('waterValue');
export const waterBarElem = document.getElementById('waterBar');
export const progressTextElem = document.getElementById('progressText');
export const stageProgressTextElem = document.getElementById('stageProgressText');
export const stageProgressBarElem = document.getElementById('stageProgressBar');
export const eventTextElem = document.getElementById('eventText');
export const outcomeTextElem = document.getElementById('outcomeText');
export const optionsArea = document.getElementById('optionsArea');
export const gameOverPopup = document.getElementById('gameOverPopup');
export const popupTitleElem = document.getElementById('popupTitle');
export const popupMessageElem = document.getElementById('popupMessage');
export const restartButtonPopup = document.getElementById('restartButtonPopup');
export const popupContent = document.getElementById('popupContent');

// Audio elements
export const audioClick = document.getElementById('audioClick');
export const audioPositive = document.getElementById('audioPositive');
export const audioNegative = document.getElementById('audioNegative');
export const audioItemPickup = document.getElementById('audioItemPickup');
export const audioGameWin = document.getElementById('audioGameWin');
export const audioGameLose = document.getElementById('audioGameLose');

// Item display elements
export const itemDisplayElements = {};
for (const key in ITEMS) {
    itemDisplayElements[key] = document.getElementById(ITEMS[key].id);
}

export function playSound(audioElement) {
    if (audioElement && typeof audioElement.play === 'function') {
        audioElement.currentTime = 0;
        audioElement.play().catch(error => {
            console.warn("音效播放失敗 (瀏覽器可能限制了自動播放):", error);
        });
    }
}

export function updateUIDisplay() {
    // Stamina
    staminaValueElem.textContent = gameState.currentStamina;
    const staminaPercentage = Math.max(0, (gameState.currentStamina / config.INITIAL_STAMINA) * 100);
    staminaBarElem.style.width = `${staminaPercentage}%`;
    staminaBarElem.className = `resource-bar-fill h-full rounded-full ${gameState.currentStamina > (config.INITIAL_STAMINA * 0.7) ? 'bg-green-400' : (gameState.currentStamina > (config.INITIAL_STAMINA * 0.3) ? 'bg-yellow-400' : 'bg-red-400')}`;
    staminaBarElem.parentElement.setAttribute('aria-valuenow', Math.round(staminaPercentage));

    // Water
    waterValueElem.textContent = gameState.currentWater;
    const waterPercentage = Math.max(0, (gameState.currentWater / config.INITIAL_WATER) * 100);
    waterBarElem.style.width = `${waterPercentage}%`;
    waterBarElem.className = `resource-bar-fill h-full rounded-full ${gameState.currentWater > (config.INITIAL_WATER * 0.7) ? 'bg-blue-400' : (gameState.currentWater > (config.INITIAL_WATER * 0.3) ? 'bg-indigo-400' : 'bg-red-400')}`;
    waterBarElem.parentElement.setAttribute('aria-valuenow', Math.round(waterPercentage));

    // Progress
    if (gameState.currentEventSequence.length > 0) {
        const totalEvents = gameState.currentEventSequence.length;
        const currentProgress = Math.min(gameState.sequenceIndex, totalEvents - 1);
        const progressPercentageVal = (currentProgress / (totalEvents - 1)) * 100;
        stageProgressBarElem.style.width = `${progressPercentageVal}%`;
        stageProgressTextElem.textContent = `${currentProgress + 1} / ${totalEvents}`;
        stageProgressBarElem.parentElement.setAttribute('aria-valuenow', Math.round(progressPercentageVal));
        stageProgressBarElem.className = `resource-bar-fill h-full rounded-full ${progressPercentageVal > 75 ? 'bg-emerald-400' : (progressPercentageVal > 40 ? 'bg-lime-400' : 'bg-purple-400')}`;
    } else {
        stageProgressTextElem.textContent = "0 / 0";
        stageProgressBarElem.parentElement.setAttribute('aria-valuenow', 0);
        stageProgressBarElem.style.width = "0%";
    }

    // Stage Name
    if (gameState.currentEventSequence[gameState.sequenceIndex]) {
        progressTextElem.textContent = gameState.currentEventSequence[gameState.sequenceIndex].stage;
    } else {
        progressTextElem.textContent = "旅程接近尾聲 🌄";
    }

    // Inventory
    for (const itemKey in gameState.inventory) {
        if (itemDisplayElements[itemKey]) {
            itemDisplayElements[itemKey].classList.toggle('opacity-50', !gameState.inventory[itemKey]);
        }
    }
}

export function showPopup(title, message) {
    popupTitleElem.textContent = title;
    popupMessageElem.textContent = message;
    gameOverPopup.classList.remove('hidden');
    gameOverPopup.classList.add('flex');
    popupContent.classList.remove('scale-90', 'opacity-0');
    popupContent.classList.add('scale-100', 'opacity-100');
}

export function hidePopup() {
    gameOverPopup.classList.remove('flex');
    gameOverPopup.classList.add('hidden');
    popupContent.classList.remove('scale-100', 'opacity-100');
    popupContent.classList.add('scale-90', 'opacity-0');
}

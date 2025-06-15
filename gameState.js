// gameState.js - Manages the dynamic state of the game
import { INITIAL_STAMINA, INITIAL_WATER, MIN_EVENTS_PER_STAGE, MAX_EVENTS_PER_STAGE, ALL_PHOTO_FILENAMES, PHOTO_BASE_PATH } from './config.js';
import { ITEMS } from './items.js';
import { eventsByStage } from './eventsData.js';
import { shuffleArray } from './utils.js';

export let currentStamina = INITIAL_STAMINA;
export let currentWater = INITIAL_WATER;
export let sequenceIndex = 0;
export let inventory = {};
export let currentEventSequence = [];
export let unlockedPhotos = new Set(); // 新增：用來儲存已解鎖照片的識別碼

export function initializeInventory() {
    for (const key in ITEMS) {
        inventory[key] = ITEMS[key].initial;
    }
}

export function initializeEventSequence() {
    currentEventSequence = [];
    currentEventSequence.push(eventsByStage.intro[0]);

    const numForestEvents = MIN_EVENTS_PER_STAGE.forest + Math.floor(Math.random() * (MAX_EVENTS_PER_STAGE.forest - MIN_EVENTS_PER_STAGE.forest + 1));
    const numPathEvents = MIN_EVENTS_PER_STAGE.path + Math.floor(Math.random() * (MAX_EVENTS_PER_STAGE.path - MIN_EVENTS_PER_STAGE.path + 1));
    const numSlopeEvents = MIN_EVENTS_PER_STAGE.slope + Math.floor(Math.random() * (MAX_EVENTS_PER_STAGE.slope - MIN_EVENTS_PER_STAGE.slope + 1));

    currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.forest]).slice(0, Math.min(eventsByStage.forest.length, numForestEvents)));
    currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.path]).slice(0, Math.min(eventsByStage.path.length, numPathEvents)));
    currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.slope]).slice(0, Math.min(eventsByStage.slope.length, numSlopeEvents)));

    currentEventSequence.push(eventsByStage.climax[0]);
    sequenceIndex = 0;
}

export function resetGameState() {
    currentStamina = INITIAL_STAMINA;
    currentWater = INITIAL_WATER;
    sequenceIndex = 0;
    unlockedPhotos.clear(); // 重設遊戲時清空已解鎖照片
    initializeInventory();
}

export function updateResource(type, value) {
    if (type === 'stamina') currentStamina = Math.min(INITIAL_STAMINA, Math.max(0, value));
    if (type === 'water') currentWater = Math.min(INITIAL_WATER, Math.max(0, value));
}

export function advanceSequence() {
    sequenceIndex++;
}

export function setInventoryItem(itemKey, hasItem) {
    if (inventory.hasOwnProperty(itemKey)) {
        inventory[itemKey] = hasItem;
    }
}

// 新增：添加已解鎖的照片
export function addUnlockedPhoto(photoKey) {
    // photoKey 參數現在實際上只是個觸發信號 (true)
    if (photoKey === true) {
        const availablePhotos = ALL_PHOTO_FILENAMES.filter(filename => !unlockedPhotos.has(filename));

        if (availablePhotos.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePhotos.length);
            const photoToUnlock = availablePhotos[randomIndex];
            unlockedPhotos.add(photoToUnlock);
            console.log(`照片已解鎖: ${photoToUnlock}`);

            // 你可以在這裡觸發UI提示，告知玩家解鎖了新照片
            // 例如: uiManager.showPhotoUnlockNotification(PHOTO_BASE_PATH + photoToUnlock);
        } else {
            console.log("所有照片都已解鎖！");
            // 可以選擇性地給予玩家一些其他獎勵或提示
        }
    }
}

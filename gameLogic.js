// gameLogic.js - Core game logic for event handling and progression

import * as gameState from './gameState.js';
import * as uiManager from './uiManager.js';
import * as config from './config.js';
import { ITEMS } from './items.js';
import { getRandomStudentName } from './utils.js';

function formatTextWithStudentNames(text, numStudents = 1) {
    let formattedText = text;
    // Ensure we request enough names if placeholders exist
    const actualNumStudentsNeeded = Math.max(
        (text.includes("[studentName1]") ? 1 : 0) + (text.includes("[studentName2]") ? 1 : 0),
        (text.includes("[studentName]") ? 1 : 0),
        numStudents // Respect the passed numStudents if it's higher
    );
    const studentNamesForText = getRandomStudentName(config.studentNames, actualNumStudentsNeeded);

    // Replace studentName first to avoid conflicts if studentName1/2 are also present and numStudents is low
    if (text.includes("[studentName]")) {
        formattedText = formattedText.replace(/\[studentName\]/g, studentNamesForText[0] || "某同學");
    }
    if (text.includes("[studentName1]")) {
        formattedText = formattedText.replace(/\[studentName1\]/g, studentNamesForText[0] || "某同學");
    }
    if (text.includes("[studentName2]")) {
        // Ensure we have a second name if [studentName2] is present
        formattedText = formattedText.replace(/\[studentName2\]/g, (studentNamesForText.length > 1 ? studentNamesForText[1] : studentNamesForText[0]) || "某同學");
    }
    formattedText = formattedText.replace(/\[studentName\]/g, studentNamesForText[0] || "某同學");
    return formattedText;
}

function getItemDisplayName(itemKey) {
    return ITEMS[itemKey] ? ITEMS[itemKey].name : itemKey;
}

export function displayEvent() {
    uiManager.outcomeTextElem.textContent = '';
    uiManager.optionsArea.innerHTML = '';
    uiManager.eventTextElem.classList.remove('animate-shake-text', 'animate-bounce-text');

    const event = gameState.currentEventSequence[gameState.sequenceIndex];
    if (!event) {
        checkGameStatus();
        return;
    }

    gameState.updateResource('stamina', gameState.currentStamina - config.PER_TURN_STAMINA_COST);
    gameState.updateResource('water', gameState.currentWater - config.PER_TURN_WATER_COST);
    uiManager.updateUIDisplay();

    if (gameState.currentStamina <= 0 || gameState.currentWater <= 0) {
        checkGameStatus();
        return;
    }

    // Determine number of students needed for the main event text
    let numStudentsForEventText = 0;
    if (event.text.includes("[studentName1]")) numStudentsForEventText = 1;
    if (event.text.includes("[studentName2]")) numStudentsForEventText = 2;
    if (event.text.includes("[studentName]") && numStudentsForEventText === 0) numStudentsForEventText = 1;
    if (numStudentsForEventText === 0 && (event.text.includes("[studentName1]") || event.text.includes("[studentName2]") || event.text.includes("[studentName]"))) {
        // Default to 1 if any placeholder is present but logic above failed (should not happen with current placeholders)
         numStudentsForEventText = 1;
    } else if (numStudentsForEventText === 0) {
        numStudentsForEventText = event.needsStudent ? 1 : 0; // Fallback if needsStudent is true
    }

    uiManager.eventTextElem.innerHTML = formatTextWithStudentNames(event.text, numStudentsForEventText || 1);

    event.options.forEach((option) => {
        const button = document.createElement('button');
        let numStudentsForOption = option.numStudents || 0;
        if (option.text.includes("[studentName1]")) numStudentsForOption = Math.max(numStudentsForOption, 1);
        if (option.text.includes("[studentName2]")) numStudentsForOption = Math.max(numStudentsForOption, 2);
        if (option.text.includes("[studentName]") && numStudentsForOption === 0) numStudentsForOption = 1;
        let optionTextFormatted = formatTextWithStudentNames(option.text, numStudentsForOption || 1);

        button.className = "bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95";
        button.textContent = optionTextFormatted;

        if (option.requiredItem) {
            const requiredItems = Array.isArray(option.requiredItem) ? option.requiredItem : [option.requiredItem];
            let hasAllRequiredItems = true;
            let missingItemDisplayName = '';

            for (const itemKey of requiredItems) {
                if (!gameState.inventory[itemKey]) {
                    hasAllRequiredItems = false;
                    missingItemDisplayName = getItemDisplayName(itemKey);
                    break;
                }
            }

            if (!hasAllRequiredItems) {
                button.disabled = true;
                button.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                button.classList.add('bg-gray-400', 'cursor-not-allowed');
                button.textContent += ` (缺少${missingItemDisplayName})`;
            } else {
                button.classList.add('bg-blue-500', 'hover:bg-blue-600');
            }
        }

        button.onclick = () => {
            uiManager.playSound(uiManager.audioClick);
            handleOption(option);
        };
        uiManager.optionsArea.appendChild(button);
    });
    uiManager.updateUIDisplay();
}

function handleOption(selectedOption) {
    if (selectedOption.requiredItem) {
        const consumedItems = Array.isArray(selectedOption.requiredItem) ? selectedOption.requiredItem : [selectedOption.requiredItem];
        if (selectedOption.consumeItem) {
            for (const itemKey of consumedItems) {
                if (gameState.inventory[itemKey]) {
                    gameState.setInventoryItem(itemKey, false);
                }
            }
        }
    }

    if (selectedOption.giveItem) {
        selectedOption.giveItem.forEach(itemKey => {
            gameState.setInventoryItem(itemKey, true);
            if (itemKey === 'waterBottle') {
                gameState.updateResource('water', gameState.currentWater + 10);
            }
            const itemElement = uiManager.itemDisplayElements[itemKey];
            if (itemElement) {
                itemElement.classList.add('animate-pulse-item');
                setTimeout(() => itemElement.classList.remove('animate-pulse-item'), 800);
            }
        });
        uiManager.playSound(uiManager.audioItemPickup);
    }

    // 處理照片解鎖
    if (selectedOption.unlocksPhoto) {
        // selectedOption.unlocksPhoto 現在應該是 true
        // gameState.addUnlockedPhoto 內部會處理隨機選擇
        if (selectedOption.unlocksPhoto === true) {
            gameState.addUnlockedPhoto(true);
            // 可以在此處觸發一個更明顯的UI提示，例如一個小彈窗告知玩家解鎖了新照片
            // 注意：如果要在UI上顯示照片，需要從 gameState.unlockedPhotos 中獲取最新解鎖的照片
            // 或者讓 addUnlockedPhoto 返回解鎖的照片名
            // uiManager.showRandomPhotoUnlockNotification();
        }
    }

    gameState.updateResource('stamina', gameState.currentStamina + selectedOption.staminaChange);
    gameState.updateResource('water', gameState.currentWater + selectedOption.waterChange);

    let numStudentsForOutcome = 0;
    if (selectedOption.outcomeText.includes("[studentName1]")) numStudentsForOutcome = 1;
    if (selectedOption.outcomeText.includes("[studentName2]")) numStudentsForOutcome = 2;
    if (selectedOption.outcomeText.includes("[studentName]") && numStudentsForOutcome === 0) numStudentsForOutcome = 1;


    uiManager.outcomeTextElem.textContent = formatTextWithStudentNames(selectedOption.outcomeText, numStudentsForOutcome || 1);

    if (selectedOption.staminaChange > 0 || selectedOption.waterChange > 0) {
        uiManager.eventTextElem.classList.add('animate-bounce-text');
        uiManager.playSound(uiManager.audioPositive);
    } else if (selectedOption.staminaChange < 0 || selectedOption.waterChange < 0) {
        uiManager.eventTextElem.classList.add('animate-shake-text');
        uiManager.playSound(uiManager.audioNegative);
    }

    uiManager.updateUIDisplay();
    Array.from(uiManager.optionsArea.children).forEach(button => button.disabled = true);

    setTimeout(() => {
        gameState.advanceSequence();
        if (!checkGameStatus()) { // if game not over
            displayEvent();
        }
    }, 2000);
}

export function checkGameStatus() {
    if (gameState.currentStamina <= 0) {
        uiManager.playSound(uiManager.audioGameLose);
        uiManager.showPopup("挑戰失敗！😭", `全班體力不足了！${config.teacherName}和同學們因疲憊倒下，無法繼續前進…`);
        return true;
    } else if (gameState.currentWater <= 0) {
        uiManager.playSound(uiManager.audioGameLose);
        uiManager.showPopup("挑戰失敗！😭", `全班水分不足了！${config.teacherName}和同學們因脫水而倒下，冒險終止…`);
        return true;
    } else if (gameState.sequenceIndex >= gameState.currentEventSequence.length) {
        uiManager.playSound(uiManager.audioGameWin);
        uiManager.showPopup("恭喜過關！🏆", `${config.teacherName}和六年四班的同學們成功登上山頂！這就是團結、智慧與堅持的力量！🎉`);
        return true;
    }
    return false; // Game not over
}

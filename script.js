// ==== 全域常數設定 ===================================================
// 遊戲變數初始化
const INITIAL_STAMINA = 60; // 全班共享體力值上限及初始值
const INITIAL_WATER = 60; // 全班共享水分值上限及初始值
const PER_TURN_STAMINA_COST = 2; // 每回合固定消耗體力
const PER_TURN_WATER_COST = 1;   // 每回合固定消耗水分

// UI 視覺閾值 (用於資源條顏色和進度條顏色)
const HIGH_RESOURCE_THRESHOLD_RATIO = 0.7; // 高資源閾值比例 (70%)
const LOW_RESOURCE_THRESHOLD_RATIO = 0.3;  // 低資源閾值比例 (30%)
const HIGH_PROGRESS_THRESHOLD_PERCENT = 75; // 高進度閾值百分比
const MID_PROGRESS_THRESHOLD_PERCENT = 40;  // 中進度閾值百分比
const HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT = 70; // 學生單項資源高閾值百分比
const LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT = 30;  // 學生單項資源低閾值百分比

// 持續時間設定 (毫秒)
const OUTCOME_DISPLAY_DURATION_MS = 2800; // 顯示結果後等待的時間
const ITEM_PULSE_ANIMATION_MS = 800;     // 物品獲得時的脈衝動畫時間

// 物品效果數值
const WATER_BOTTLE_RECOVERY_AMOUNT = 12; // 獲得水瓶時恢復的水量

// 老師名稱
// const teacherName = "賴冠儒老師"; // 已在 index.html 中定義 window.teacherName，此處可移除

// 學生名單
const studentNames = [
    "蔡宥丞", "蔡羽恩", "陳湘晴", "陳芊錡", "陳楷恩", "江芊妏", "賴玧樂", "廖予謙",
    "林泓佑", "林書玉", "林瑋琦", "李承宥", "劉苪希", "彭唯", "潘祐丞", "許翔淏",
    "徐翊庭", "謝從偉", "吳宥珈", "王懸", "王品勛", "黃宜潔", "黃保慈", "黃馨恩",
    "黃郁晴", "黃志懿", "張辰煥", "周宇桐"
];

// 全域狀態
let students = [];
let inventory = {};
let sequenceIndex = 0;
let currentEventSequence = [];
let totalCollaborationScore = 0;
let photosUnlockedThisSession = 0;

// === 角色系統 初始設定 ===
let selectedStudent = null;
let selectedRole    = null;
let roleSkillUsed   = false;
let rescueTriggered = false;
let navigatorMapBonusActive = false; // Flag for Navigator's map skill

const ROLES = {
  physicalCaptain: {
    name   : '體能隊長',
    passive: ({avgSta}) => avgSta <= 30 ? { stamina: 1 } : {},
    active : { type: 'stamina', amount: 6 }
  },
  navigator: {
    name   : '智慧導航員',
    passive: () => {
        // 25% 觸發機率
        return Math.random() < 0.25 ? { preserveMapOnUse: true } : {};
    },
    active : { type: 'cartographersInsight' } // Changed skill type
  },
  waterOfficer: {
    name   : '水資源官',
    passive: ({avgWat}) => avgWat <= 30 ? { water: 1 } : {},
    active : { type: 'water', amount: 6 }
  },
  rescueLeader: {
    name   : '救援隊長',
    passive: () => ({}),
    active : { type: 'revive', amount: { stamina: 5, water: 5 } }
  }
};

// ===== 宣告所有會在 updateUI/handleOption/displayEvent 使用的 UI 變數 =====
let welcomeScreen,
    gamePlayScreen,
    startButton,
    playerSelect, roleSelect,
    roleBadge, skillBtn,
    staminaValueElem, staminaBarElem,
    waterValueElem,   waterBarElem,
    stageProgressBarElem, stageProgressTextElem,
    progressTextElem, studentStatusTextElem,
    eventTextElem, outcomeTextElem,
    optionsArea,
    inventoryDisplayElem,
    studentListArea,
    gameOverPopup, popupTitleElem, popupMessageElem, restartButtonPopup,
    photoUnlockPopup, unlockedPhotoImg, unlockedPhotoName, closePhotoPopupButton,
    audioClick, audioPositive, audioNegative, audioItemPickup, audioGameWin, audioGameLose,
    itemDisplayElements = {};


// 集中管理物品定義
const ITEMS = {
    energyBar:       { id: 'itemEnergyBar',       name: '能量棒🍫', initial: true },
    snack:           { id: 'itemSnack',           name: '零食🍪',   initial: true },
    map:             { id: 'itemMap',             name: '地圖🗺️',   initial: true },
    insectRepellent: { id: 'itemInsectRepellent', name: '驅蟲劑🧴', initial: true },
    survivalRope:    { id: 'itemSurvivalRope',    name: '求生繩索🎗️', initial: true },
    waterBottle:     { id: 'itemWaterBottle',     name: '水瓶💧',   initial: true },
    firstAidKit:     { id: 'itemFirstAidKit',     name: '急救包🩹', initial: true }
};


// 生成照片檔名
function generatePhotoFilenames(count) {
    const filenames = [];
    for (let i = 1; i <= count; i++) {
        filenames.push(`photo_${String(i).padStart(3, '0')}.JPG`);
    }
    return filenames;
}
const ALL_PHOTO_FILENAMES = generatePhotoFilenames(204);
let unlockedPhotos = new Set();
const POINTS_PER_PHOTO = 10;
// Define the base path for photos
// Make sure this path is correct relative to your HTML file or server root
const PHOTO_BASE_PATH = "photos/"; // Example: assuming photos are in a 'photos' folder at the root

// 初始化學生狀態
function initializeStudentStats() {
    students = studentNames.map(name => ({
        name: name,
        stamina: INITIAL_STAMINA,
        water: INITIAL_WATER,
        active: true,
        rescued: false
    }));
}

// 初始化物品欄
function initializeInventory() {
    for (const key in ITEMS) {
        inventory[key] = ITEMS[key].initial;
    }
}

// Fisher-Yates 隨機排序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 初始化遊戲事件序列
function initializeEventSequence() {
    currentEventSequence = [];
    currentEventSequence.push(window.gameEventsIntro[0]);
    const numForestEvents = 9;
    const numPathEvents   = 9;
    const numSlopeEvents  = 9;
    currentEventSequence = currentEventSequence
      .concat(shuffleArray([...window.gameEventsForest]).slice(0, numForestEvents))
      .concat(shuffleArray([...window.gameEventsPath]).slice(0, numPathEvents))
      .concat(shuffleArray([...window.gameEventsSlope]).slice(0, numSlopeEvents));
    currentEventSequence.push(window.gameEventsClimax[0]);
    sequenceIndex = 0;
}

// 隨機取得學生姓名
function getRandomStudentName(currentStudents, count = 1) {
    const activeStudents = currentStudents.filter(s => s.active);
    if (!activeStudents.length) return Array(count).fill("某同學");
    const picked = new Set(), result = [];
    while (result.length < count) {
        const name = activeStudents[Math.floor(Math.random() * activeStudents.length)].name;
        if (!picked.has(name)) {
            picked.add(name);
            result.push(name);
        }
    }
    return result;
}

// 播放音效
function playSound(audioElement) {
    if (audioElement && typeof audioElement.play === 'function') {
        audioElement.currentTime = 0;
        audioElement.play().catch(() => {});
    }
}

// 轉義 Regex
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 格式化文字並替換 [studentName]
function formatTextWithStudentNames(text, numStudentsHint = 1) {
    const teacherRegex = new RegExp(escapeRegExp(teacherName), 'g');
    let ft = text.replace(teacherRegex,
        `<span class="text-gray-800 font-bold">${teacherName}</span>`);
    const hasS1 = ft.includes("[studentName1]");
    const hasS2 = ft.includes("[studentName2]");
    const hasS  = ft.includes("[studentName]");
    let count = 0;
    if (hasS2) count = 2;
    else if (hasS1 || hasS) count = 1;
    const names = getRandomStudentName(students, count);
    const n1 = names[0] || "某同學", n2 = names[1] || n1;
    if (hasS1) {
        ft = ft.replace(/\[studentName1\]/g,
            `<span class="text-gray-800 font-semibold">${n1}</span>`);
    }
    if (hasS2) {
        ft = ft.replace(/\[studentName2\]/g,
            `<span class="text-gray-800 font-semibold">${n2}</span>`);
    }
    if (hasS) {
        ft = ft.replace(/\[studentName\]/g,
            `<span class="text-gray-800 font-semibold">${n1}</span>`);
    }
    // 修正：應返回包含隨機選取學生姓名的陣列，以便 handleOption 等函式使用
    return { formattedText: ft, names: names }; // 'names' is the array from getRandomStudentName
}

// 照片解鎖通知
function showPhotoUnlockNotification(photoPath, photoFilename, playSoundEffect = true) {
    photoUnlockPopup.classList.remove('hidden','opacity-0');
    photoUnlockPopup.classList.add('flex','opacity-100');
    unlockedPhotoImg.src = photoPath;
    unlockedPhotoName.textContent = photoFilename;
    if (playSoundEffect) playSound(audioItemPickup);
}
function hidePhotoUnlockNotification() {
    photoUnlockPopup.classList.remove('flex','opacity-100');
    photoUnlockPopup.classList.add('hidden','opacity-0');
    unlockedPhotoImg.src = "";
    unlockedPhotoName.textContent = "";
}
// 根據協作分數解鎖照片
function checkAndUnlockPhotosBasedOnCollaboration() {
    const possible = Math.floor(totalCollaborationScore / POINTS_PER_PHOTO);
    const toUnlock = possible - photosUnlockedThisSession;
    for (let i = 0; i < toUnlock; i++) {
        const available = ALL_PHOTO_FILENAMES.filter(f => !unlockedPhotos.has(f));
        if (!available.length) break;
        const pick = available[Math.floor(Math.random() * available.length)];
        unlockedPhotos.add(pick);
        showPhotoUnlockNotification(PHOTO_BASE_PATH + pick, pick);
        photosUnlockedThisSession++;
    }
}

// 被動回血
function applyRolePassive() {
    if (!selectedRole) return;
    const role = ROLES[selectedRole];
    const active = students.filter(s=>s.active);
    if (!active.length) return;
    const avgSta = active.reduce((t,s)=>t+s.stamina,0)/active.length;
    const avgWat = active.reduce((t,s)=>t+s.water,0)/active.length;
    const delta  = role.passive({ avgSta, avgWat });
    let passiveTriggeredMessage = "";

    active.forEach(s=>{
        if (delta.stamina) {
            s.stamina = Math.min(INITIAL_STAMINA, s.stamina + delta.stamina);
            if (!passiveTriggeredMessage && selectedRole === 'physicalCaptain') {
                passiveTriggeredMessage = `${ROLES.physicalCaptain.name}的被動技能觸發，全體同學體力微幅恢復！`;
            }
        }
        if (delta.water)   {
            s.water   = Math.min(INITIAL_WATER,   s.water   + delta.water);
            if (!passiveTriggeredMessage && selectedRole === 'waterOfficer') {
                passiveTriggeredMessage = `${ROLES.waterOfficer.name}的被動技能觸發，全體同學水分微幅補充！`;
            }
        }
    });

    if (passiveTriggeredMessage && outcomeTextElem && gamePlayScreen && !gamePlayScreen.classList.contains('hidden')) {
        // 避免覆蓋其他重要提示，如果 outcomeTextElem 為空才顯示
        if (!outcomeTextElem.innerHTML.trim()) {
            outcomeTextElem.innerHTML = `<span class="text-sky-600 font-semibold">${passiveTriggeredMessage}</span>`;
            setTimeout(() => {
                if (outcomeTextElem.innerHTML.includes(passiveTriggeredMessage)) {
                    outcomeTextElem.innerHTML = "";
                }
            }, 3000); // 顯示 3 秒
        }
    }
}

// 檢查遊戲狀態
function checkGameStatus() {
    // 救援隊長被動：首位倒下自動救援一次
    if (selectedRole==='rescueLeader' && !rescueTriggered) {
        const down = students.find(s=>!s.active && !s.rescued);
        if (down) {
            down.active = true;
            // 使用角色定義中的恢復量
            const reviveAmount = ROLES.rescueLeader.active.amount;
            down.stamina = Math.min(INITIAL_STAMINA, reviveAmount.stamina);
            down.water = Math.min(INITIAL_WATER, reviveAmount.water);
            down.rescued = true;
            rescueTriggered = true;
            // 增加被動技能觸發提示
            if (outcomeTextElem && gamePlayScreen && !gamePlayScreen.classList.contains('hidden')) {
                // 使用 setTimeout 避免與其他 UI 更新衝突
                // 僅當 outcomeTextElem 為空時顯示，避免覆蓋其他消息
                if (!outcomeTextElem.innerHTML.trim()) {
                    setTimeout(() => {
                        outcomeTextElem.innerHTML = `<span class="text-blue-600 font-semibold">${ROLES.rescueLeader.name}的被動技能觸發！${down.name}在鼓舞下重新站起來了！</span>`;
                        setTimeout(() => { // 一段時間後清除提示
                            if (outcomeTextElem.innerHTML.includes(down.name)) {
                                outcomeTextElem.innerHTML = "";
                            }
                        }, 4000);
                    }, 100);
                }
            }
        }
    }
    const alive = students.filter(s=>s.active).length;
    if (!alive) {
        playSound(audioGameLose);
        showPopup("挑戰失敗！😭",
            `所有同學已精疲力盡或脫水！${teacherName}和同學們無法繼續前進…`);
        return true;
    }
    if (sequenceIndex >= currentEventSequence.length) {
        playSound(audioGameWin);
        showPhotoUnlockNotification(PHOTO_BASE_PATH+"end.jpg","通關紀念！",false);
        closePhotoPopupButton.addEventListener('click', ()=>{ /* 省略 */ },{once:true});
        return true;
    }
    return false;
}

// 顯示結束彈窗
function showPopup(title, message) {
    const rgx = new RegExp(escapeRegExp(teacherName),'g');
    popupTitleElem.textContent = title;
    popupMessageElem.innerHTML = message.replace(rgx,
        `<span class="text-emerald-700 font-bold">${teacherName}</span>`);
    gameOverPopup.classList.remove('hidden','opacity-0');
    popupContent.classList.remove('scale-90','opacity-0');
    popupContent.classList.add('scale-100','opacity-100');
}

// 重置遊戲
function resetGame() {
    initializeStudentStats();
    initializeInventory();
    initializeEventSequence();
    totalCollaborationScore = 0;
    photosUnlockedThisSession = 0;
    unlockedPhotos.clear();
    gameOverPopup.classList.add('hidden','opacity-0');
    popupContent.classList.add('scale-90','opacity-0');
    updateUI();
    displayEvent();
}

// 處理選項
function handleOption(opt, namesUsed) {
    playSound(audioClick);
    eventTextElem.innerHTML = "";

    // 消耗物品
    // (此處假設您已修復 formatTextWithStudentNames 以返回 namesUsed)

    // 修正：應用選項導致的體力與水分變化
    if (opt.staminaChange !== undefined || opt.waterChange !== undefined) {
        const staminaDelta = opt.staminaChange || 0;
        const waterDelta = opt.waterChange || 0;
        const targetStudents = opt.effectScope === 'all_active'
            ? students.filter(s => s.active)
            : (namesUsed && namesUsed.length > 0 ? students.filter(s => namesUsed.includes(s.name) && s.active) : []);

        if (targetStudents.length > 0) {
            students.forEach(student => {
                if (targetStudents.some(ts => ts.name === student.name)) {
                    student.stamina = Math.max(0, Math.min(INITIAL_STAMINA, student.stamina + staminaDelta));
                    student.water = Math.max(0, Math.min(INITIAL_WATER, student.water + waterDelta));
                    if (student.stamina === 0 || student.water === 0) {
                        student.active = false;
                    }
                }
            });
        } else if (opt.effectScope === 'all_active') { // Fallback for all_active if namesUsed is not applicable
            students.forEach(student => {
                if (student.active) {
                    student.stamina = Math.max(0, Math.min(INITIAL_STAMINA, student.stamina + staminaDelta));
                    student.water = Math.max(0, Math.min(INITIAL_WATER, student.water + waterDelta));
                    if (student.stamina === 0 || student.water === 0) {
                        student.active = false;
                    }
                }
            });
        }
    }

    if (opt.requiredItem && opt.consumeItem) {
        // Ensure consumeItem is treated as an array
        const itemsToConsume = Array.isArray(opt.consumeItem) ? opt.consumeItem : (opt.consumeItem ? [opt.consumeItem] : []);

        itemsToConsume.forEach(itemKey => {
            if (inventory.hasOwnProperty(itemKey)) { // Check if itemKey is a valid key in inventory
                if (itemKey === 'map' && navigatorMapBonusActive) {
                    console.log("智慧導航員主動技能：本回合地圖免消耗。");
                    navigatorMapBonusActive = false; // Bonus is consumed
                    // 主動技能優先，如果主動技能生效，則不檢查被動
                } else {
                    let consumeThisItem = true;
                    // 檢查智慧導航員的被動技能
                    if (itemKey === 'map' && selectedRole === 'navigator' && !navigatorMapBonusActive) {
                        const passiveEffect = ROLES.navigator.passive();
                        if (passiveEffect.preserveMapOnUse) {
                            consumeThisItem = false;
                            console.log("智慧導航員被動技能：路徑記憶觸發，地圖未消耗！");
                            if (eventTextElem) { // 確保元素存在
                                // 將被動技能提示附加到主事件結果之後
                                const passiveMsg = "<br><span class='text-indigo-600 font-semibold'>智慧導航員的路徑記憶發揮作用，本次地圖使用未消耗！</span>";
                                eventTextElem.innerHTML += passiveMsg; //附加到 eventTextElem
                            } else if (outcomeTextElem && !outcomeTextElem.innerHTML.trim()) { // 如果 eventTextElem 不可用，嘗試 outcomeTextElem
                                outcomeTextElem.innerHTML = "<span class='text-indigo-600 font-semibold'>智慧導航員的路徑記憶發揮作用，本次地圖使用未消耗！</span>";
                                // 此處的清除可能需要額外處理，因為它不在 eventTextElem 的正常流程中
                            }
                        }
                    }

                    if (consumeThisItem) {
                        inventory[itemKey] = false;
                    }
                }
            } else {
                console.warn(`Attempted to consume non-existent item: ${itemKey}`);
            }
        });
    }
    // 獲得物品
    if (opt.giveItem) {
        opt.giveItem.forEach(k => {
            inventory[k] = true;
            if (k === 'waterBottle') {
                let stu = students.find(s => s.name === namesUsed[0] && s.active)
                       || students.filter(s => s.active)[Math.floor(Math.random() * students.filter(s=>s.active).length)];
                if (stu) {
                    stu.water = Math.min(INITIAL_WATER, stu.water + WATER_BOTTLE_RECOVERY_AMOUNT);
                }
            }
            const el = document.getElementById(ITEMS[k].id);
            if (el) {
                el.classList.add('animate-pulse-item');
                setTimeout(() => el.classList.remove('animate-pulse-item'), ITEM_PULSE_ANIMATION_MS);
            }
        });
    }

    // 計算影響對象及狀態變更
    const outRes = formatTextWithStudentNames(
        opt.outcomeText,
        opt.numStudents
            || (opt.outcomeText.includes("[studentName2]") ? 2
            : (opt.outcomeText.includes("[studentName1]") || opt.outcomeText.includes("[studentName]") ? 1 : 0))
    );
    const msg = outRes.formattedText;

    // 協作分數
    if (opt.collaborationPointsAwarded) {
        totalCollaborationScore += opt.collaborationPointsAwarded;
    }
    // 播放音效
    if (opt.staminaChange > 0 || opt.waterChange > 0) {
        eventTextElem.classList.add('animate-bounce-text');
        playSound(audioPositive);
    } else if (opt.staminaChange < 0 || opt.waterChange < 0) {
        eventTextElem.classList.add('animate-shake-text');
        playSound(audioNegative);
    }

    eventTextElem.innerHTML = msg;
    updateUI();
    Array.from(optionsArea.children).forEach(b => b.disabled = true);
    if (opt.giveItem && opt.giveItem.length) playSound(audioItemPickup);

    setTimeout(() => {
        // eventTextElem 包含主結果和可能的被動技能提示，將在下一個 displayEvent 開始時被清空。
        // outcomeTextElem 主要用於主動技能的結果，也會在 displayEvent 開始時被清空。
        sequenceIndex++;
        const over = checkGameStatus();
        if (!over) {
            checkAndUnlockPhotosBasedOnCollaboration();
            displayEvent();
        }
    }, OUTCOME_DISPLAY_DURATION_MS);
}

// 更新 UI
function updateUI() {
    // 更新存活人數文字
    const activeStudentCount = students.filter(s => s.active).length;
    const totalStudentCount  = students.length;
    const statusElement = studentStatusTextElem; // 使用已獲取的元素
    if (statusElement) {
        statusElement.textContent = `存活學生: ${activeStudentCount}/${totalStudentCount}`;
    }

    // 計算並顯示平均體力與水分
    const active = students.filter(s => s.active);
    const avgStamina = active.length ? active.reduce((a,s) => a + s.stamina, 0) / active.length : 0;
    const avgWater   = active.length ? active.reduce((a,s) => a + s.water, 0) / active.length : 0;

    // 體力條
    if (staminaValueElem && staminaBarElem) {
        staminaValueElem.textContent = Math.round(avgStamina);
        const staPerc = Math.max(0, (avgStamina / INITIAL_STAMINA) * 100);
        staminaBarElem.style.width = `${staPerc}%`;
        // 更新 class name 時，保留基礎 class，只改變顏色相關的 class
        staminaBarElem.className = `resource-bar-fill h-full rounded-full flex items-center justify-center text-xs font-medium text-white ${
            avgStamina > INITIAL_STAMINA * HIGH_RESOURCE_THRESHOLD_RATIO ? 'bg-green-500 hover:bg-green-600'
          : avgStamina > INITIAL_STAMINA * LOW_RESOURCE_THRESHOLD_RATIO ? 'bg-yellow-500 hover:bg-yellow-600'
          : 'bg-red-500 hover:bg-red-600'
        }`;
    }

    // 水分條
    if (waterValueElem && waterBarElem) {
        waterValueElem.textContent = Math.round(avgWater);
        const watPerc = Math.max(0, (avgWater / INITIAL_WATER) * 100);
        waterBarElem.style.width = `${watPerc}%`;
        waterBarElem.className = `resource-bar-fill h-full rounded-full flex items-center justify-center text-xs font-medium text-white ${
            (avgWater / INITIAL_WATER) > HIGH_RESOURCE_THRESHOLD_RATIO ? 'bg-blue-500 hover:bg-blue-600'
          : (avgWater / INITIAL_WATER) > LOW_RESOURCE_THRESHOLD_RATIO ? 'bg-indigo-500 hover:bg-indigo-600'
          : 'bg-red-500 hover:bg-red-600'
        }`;
    }

    // 關卡進度條
    if (currentEventSequence.length && stageProgressBarElem && stageProgressTextElem) {
        const total = currentEventSequence.length;
        const prog  = Math.min(sequenceIndex, total - 1);
        const perc  = total > 1 ? (prog / (total - 1) * 100) : 100;
        stageProgressBarElem.style.width = `${perc}%`;
        stageProgressTextElem.textContent = `${prog + 1} / ${total}`;
        stageProgressBarElem.className = `resource-bar-fill h-full rounded-full ${
            perc > HIGH_PROGRESS_THRESHOLD_PERCENT ? 'bg-emerald-400'
          : perc > MID_PROGRESS_THRESHOLD_PERCENT  ? 'bg-lime-400'
          : 'bg-purple-400'
        }`;
    }

    // 物品欄更新
    for (const k in inventory) {
        if (itemDisplayElements[k]) { // 確保元素存在
            itemDisplayElements[k].classList.toggle('opacity-30', !inventory[k]);
            itemDisplayElements[k].classList.toggle('saturate-50', !inventory[k]); // 可以增加一些視覺效果表示不可用
        }
    }

    // 學生列表重繪
    const listArea = studentListArea; // 使用已獲取的元素
    if (listArea) {
        let node = listArea.firstChild; // Clear existing student list items
        while (node) {
            const next = node.nextSibling;
            listArea.removeChild(node);
            node = next;
        }

        // 區分活躍 & 倒下
        const activeList   = students.filter(s => s.active);
        const inactiveList = students.filter(s => !s.active);

        // 元素生成函式
        function createEl(s) {
            const d = document.createElement('div');
            // 底色：根據總資源百分比 (stamina + water)
            const totalPerc = ((s.stamina + s.water) / (INITIAL_STAMINA + INITIAL_WATER)) * 100; // Calculate total resource percentage
            const bgClass = totalPerc > HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT
                          ? 'bg-green-100 hover:bg-green-200'
                          : totalPerc < LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT
                          ? 'bg-red-100 hover:bg-red-200 opacity-80'
                          : 'bg-yellow-100 hover:bg-yellow-200';
            d.className = `p-2 rounded-md shadow-sm flex items-center space-x-2 transition-colors duration-200 ${bgClass}`; // Added transition

            // 名稱
            const nameP = document.createElement('p');
            nameP.className = `font-semibold text-base flex-1 truncate ${
                s.active ? 'text-green-800' : 'text-red-800'
            }`;
            nameP.textContent = s.name + (s.active ? '' : ' (昏迷)');
            d.appendChild(nameP);

            // 體力量表
            const staDiv = document.createElement('div');
            staDiv.className = 'flex items-center text-xs w-[60px]'; // Adjusted width slightly for better alignment
            const staSpan = document.createElement('span');
            staSpan.className = `mr-1 w-5 text-right ${
                s.stamina > INITIAL_STAMINA * LOW_RESOURCE_THRESHOLD_RATIO
                ? 'text-gray-700'
                : 'text-red-600 font-medium'
            }`;
            staSpan.textContent = s.stamina;
            staDiv.appendChild(staSpan);
            const staOut = document.createElement('div');
            staOut.className = 'flex-1 h-2.5 bg-gray-300 rounded-full shadow-inner overflow-hidden'; // Added overflow-hidden
            const staIn  = document.createElement('div');
            const sPerc  = Math.max(0, (s.stamina / INITIAL_STAMINA) * 100);
            staIn.className = `h-full rounded-full transition-all duration-300 ease-out ${
                sPerc > HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT ? 'bg-green-500' // Use student resource thresholds
              : sPerc > LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT  ? 'bg-yellow-400'
              : 'bg-red-500'
            }`;
            staIn.style.width = `${sPerc}%`;
            staOut.appendChild(staIn);
            staDiv.appendChild(staOut);
            d.appendChild(staDiv);

            // 水力量表 (同理)
            const watDiv = document.createElement('div');
            watDiv.className = 'flex items-center text-xs w-[60px]'; // Adjusted width slightly
            const watSpan = document.createElement('span');
            watSpan.className = `mr-1 w-5 text-right ${
                s.water > INITIAL_WATER * LOW_RESOURCE_THRESHOLD_RATIO
                ? 'text-gray-700'
                : 'text-red-600 font-medium'
            }`;
            watSpan.textContent = s.water;
            watDiv.appendChild(watSpan);
            const watOut = document.createElement('div');
            watOut.className = 'flex-1 h-2.5 bg-gray-300 rounded-full shadow-inner overflow-hidden'; // Added overflow-hidden
            const watIn  = document.createElement('div');
            const wPerc  = Math.max(0, (s.water / INITIAL_WATER) * 100);
            watIn.className = `h-full rounded-full transition-all duration-300 ease-out ${
                wPerc > HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT ? 'bg-blue-500' // Use student resource thresholds
              : wPerc > LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT  ? 'bg-indigo-400'
              : 'bg-red-500'
            }`;
            watIn.style.width = `${wPerc}%`;
            watOut.appendChild(watIn);
            watDiv.appendChild(watOut);
            d.appendChild(watDiv);

            return d;
        }

        // 活躍同學
        if (activeList.length) {
            const secA = document.createElement('div');
            secA.className = 'mb-1 p-2 rounded bg-slate-100/60'; // Removed custom-scrollbar, flex-1 and overflow-y-auto
            const h3A  = document.createElement('h3');
            h3A.className = 'text-md font-medium text-green-700 mb-2 sticky top-0 bg-white/80 backdrop-blur-sm py-1.5 z-10 px-1 rounded'; // Sticky header for scrollable section
            h3A.textContent = `💪 活躍同學 (${activeList.length})`;
            secA.appendChild(h3A);
            const cA = document.createElement('div');
            cA.className = 'space-y-1.5 pr-1';
            activeList.sort((a,b)=> (a.stamina+a.water) - (b.stamina+b.water))
                      .forEach(s=>cA.appendChild(createEl(s)));
            secA.appendChild(cA);
            listArea.appendChild(secA);
        }

        // 倒下同學
        if (inactiveList.length) {
            const secI = document.createElement('div');
            secI.className = 'mt-1 p-2 rounded bg-slate-100/60'; // Removed custom-scrollbar, flex-1 and overflow-y-auto
            const h3I  = document.createElement('h3');
            h3I.className = 'text-md font-medium text-red-700 mb-2 sticky top-0 bg-white/80 backdrop-blur-sm py-1.5 z-10 px-1 rounded'; // Sticky header for scrollable section
            h3I.textContent = `🤕 已倒下同學 (${inactiveList.length})`;
            secI.appendChild(h3I);
            const cI = document.createElement('div');
            cI.className = 'space-y-1.5 pr-1';
            inactiveList.sort((a,b)=> (a.stamina+a.water) - (b.stamina+b.water))
                        .forEach(s=>cI.appendChild(createEl(s)));
            secI.appendChild(cI);
            listArea.appendChild(secI);
        }
    }
}

// Expose updateUI globally for potential external calls (e.g., from patched functions)
// This is necessary if the monkey-patching script is used and calls updateUI.
// If only the MutationObserver is used, this might not be strictly necessary
// unless other parts of your code call updateUI directly.
window.updateUI = updateUI;


// 顯示事件
function displayEvent() {
    // 確保核心 UI 元素已獲取
    if (!eventTextElem || !optionsArea) {
        console.error("Event display elements not found!");
        // Consider more robust error handling or UI feedback if elements are missing
        return;
    }
    eventTextElem.innerHTML = "";
    optionsArea.innerHTML  = "";

    if (!currentEventSequence[sequenceIndex]) {
        checkGameStatus();
        return;
    }

    // 清除上回合的 outcomeText 和 eventText，確保被動技能提示等不會殘留
    if(outcomeTextElem) outcomeTextElem.innerHTML = "";
    // eventTextElem 會在下面被新的事件文本覆蓋，所以這裡不需要顯式清空

    // Reset navigator map bonus at the start of a new event display if it wasn't used
    // navigatorMapBonusActive = false; // This was moved to handleOption to ensure bonus is only consumed on use

    // 回合開始時的資源消耗
    if (sequenceIndex > 0) {
        students.forEach(s => {
            if (s.active) {
                s.stamina = Math.max(0, s.stamina - PER_TURN_STAMINA_COST);
                s.water   = Math.max(0, s.water   - PER_TURN_WATER_COST);
                if (s.stamina === 0 || s.water === 0) s.active = false;
            }
        });
        updateUI(); // 更新UI以反映資源消耗
        if (checkGameStatus()) { // 檢查遊戲是否因資源耗盡而結束
            checkGameStatus();
            return;
        }
    }

    const evt = currentEventSequence[sequenceIndex];
    let numHint = evt.needsStudent ? 1 : 0;
    if (evt.text.includes("[studentName2]")) numHint = 2;
    else if (evt.text.includes("[studentName]")) numHint = 1;

    const res = formatTextWithStudentNames(evt.text, numHint);
    eventTextElem.innerHTML = res.formattedText;

    evt.options.forEach(opt => {
        const btn = document.createElement('button');
        const optHint = opt.numStudents
            || (opt.text.includes("[studentName2]") ? 2
            : (opt.text.includes("[studentName1]") || opt.text.includes("[studentName]") ? 1 : 0));
        const optRes = formatTextWithStudentNames(opt.text, optHint);

        btn.innerHTML = optRes.formattedText;
        btn.className = "w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 text-left text-base";

        if (opt.requiredItem) {
            const reqs = [].concat(opt.requiredItem);
            const ok = reqs.every(k => inventory[k]);
            if (!ok) {
                btn.disabled = true;
                btn.classList.remove('bg-purple-500','hover:bg-purple-600', 'bg-blue-500','hover:bg-blue-600');
                btn.classList.add('bg-gray-400','cursor-not-allowed');
                btn.innerHTML += `<span class="text-xs italic opacity-80"> (缺少${ITEMS[reqs.find(k=>!inventory[k])].name})</span>`;
            } else {
                btn.classList.add('bg-blue-500','hover:bg-blue-600');
            }
        }

        btn.onclick = () => {
            playSound(audioClick);
            handleOption(opt, optRes.names); // 傳遞隨機選中的學生姓名陣列
        };
        optionsArea.appendChild(btn);
    });

    // 每次顯示後刷新一次 UI
    applyRolePassive();
    updateUI();
}

// Expose displayEvent globally for potential external calls (e.g., from patched functions)
// This is necessary if the monkey-patching script is used.
// If only the MutationObserver is used, this might not be strictly necessary
// unless other parts of your code call displayEvent directly.
window.displayEvent = displayEvent;


// =======================================================================
// DOMContentLoaded 內綁定所有按鈕 & 讀取下拉
// =======================================================================
window.addEventListener('DOMContentLoaded', () => {
  // —— 1. 先拿到所有節點 ——
  welcomeScreen      = document.getElementById('welcomeScreen');
  gamePlayScreen     = document.getElementById('gamePlayScreen');
  startButton        = document.getElementById('startButton');
  playerSelect       = document.getElementById('playerSelect');
  roleSelect         = document.getElementById('roleSelect');
  roleBadge          = document.getElementById('roleBadge');
  skillBtn           = document.getElementById('roleSkillBtn');

  staminaValueElem       = document.getElementById('staminaValue');
  staminaBarElem         = document.getElementById('staminaBar');
  waterValueElem         = document.getElementById('waterValue');
  waterBarElem           = document.getElementById('waterBar');
  stageProgressBarElem   = document.getElementById('stageProgressBar');
  stageProgressTextElem  = document.getElementById('stageProgressText');
  // progressTextElem    = document.getElementById('progressText'); // 註解：似乎未使用，可以考慮移除
  studentStatusTextElem  = document.getElementById('studentStatusText');

  eventTextElem      = document.getElementById('eventText'); // Main event text area
  outcomeTextElem    = document.getElementById('outcomeText');
  optionsArea        = document.getElementById('optionsArea');

  inventoryDisplayElem = document.getElementById('inventoryDisplay');
  studentListArea      = document.getElementById('studentListArea');

  gameOverPopup       = document.getElementById('gameOverPopup');
  popupTitleElem      = document.getElementById('popupTitle');
  popupMessageElem    = document.getElementById('popupMessage');
  restartButtonPopup  = document.getElementById('restartButtonPopup');

  photoUnlockPopup    = document.getElementById('photoUnlockPopup');
  unlockedPhotoImg    = document.getElementById('unlockedPhotoImg');
  unlockedPhotoName   = document.getElementById('unlockedPhotoName');
  closePhotoPopupButton = document.getElementById('closePhotoPopupButton');

  audioClick        = document.getElementById('audioClick');
  audioPositive     = document.getElementById('audioPositive');
  audioNegative     = document.getElementById('audioNegative');
  audioItemPickup   = document.getElementById('audioItemPickup');
  audioGameWin      = document.getElementById('audioGameWin');
  audioGameLose     = document.getElementById('audioGameLose');

  // 物品欄元件也一併存到 itemDisplayElements
  for (const key in ITEMS) {
    const elem = document.getElementById(ITEMS[key].id);
    if (elem) {
        itemDisplayElements[key] = elem; // Store item elements for easy access
    } // else console.warn(`Item element ${ITEMS[key].id} not found`);
  }

  // —— 2. 填下拉、綁事件 ——
  studentNames.forEach(n => {
    const o = document.createElement('option');
    o.value = o.textContent = n;
    playerSelect.appendChild(o);
  });
  // Enable start button only when both player and role are selected
  if (playerSelect && roleSelect && startButton) {
      [playerSelect, roleSelect].forEach(sel =>
        sel.addEventListener('change', () => startButton.disabled = !(playerSelect.value && roleSelect.value))
      );
  }

  // —— 3. 綁定開始遊戲按鈕 ——
  startButton.disabled = true;
  startButton.addEventListener('click', () => {
    // Validate selections before starting
    playSound(audioClick);
    selectedStudent = playerSelect.value;
    selectedRole    = roleSelect.value;
    roleSkillUsed   = false;
    rescueTriggered = false;
    welcomeScreen.classList.add('hidden');
    gamePlayScreen.classList.remove('hidden');
    initializeStudentStats();
    initializeInventory(); // 確保物品欄也重置
    initializeEventSequence();
    updateUI();
    displayEvent();
    refreshRoleBadge();

    // 為技能按鈕添加事件監聽器
    if (skillBtn) {
        skillBtn.addEventListener('click', () => {
            if (roleSkillUsed || !selectedRole) return;

            const roleDefinition = ROLES[selectedRole];
            if (!roleDefinition || !roleDefinition.active) return;

            const activeSkill = roleDefinition.active;
            let skillUsedSuccessfully = false;
            let skillOutcomeMessage = "";

            playSound(audioPositive); // 播放通用積極音效，或可替換為專用技能音效

            switch (activeSkill.type) {
                case 'stamina':
                    students.forEach(s => {
                        if (s.active) {
                            s.stamina = Math.min(INITIAL_STAMINA, s.stamina + activeSkill.amount);
                        }
                    });
                    skillOutcomeMessage = `${roleDefinition.name}使用了技能，全體同學恢復了 ${activeSkill.amount} 點體力！`;
                    skillUsedSuccessfully = true;
                    break;
                case 'water':
                    students.forEach(s => {
                        if (s.active) {
                            s.water = Math.min(INITIAL_WATER, s.water + activeSkill.amount);
                        }
                    });
                    skillOutcomeMessage = `${roleDefinition.name}使用了技能，全體同學補充了 ${activeSkill.amount} 點水分！`;
                    skillUsedSuccessfully = true;
                    break;
                case 'cartographersInsight':
                    if (!inventory['map']) {
                        inventory['map'] = true;
                        // Pulse animation for map item
                        const mapElem = document.getElementById(ITEMS['map'].id);
                        if (mapElem) {
                            mapElem.classList.add('animate-pulse-item');
                            setTimeout(() => mapElem.classList.remove('animate-pulse-item'), ITEM_PULSE_ANIMATION_MS);
                        }
                        skillOutcomeMessage = "智慧導航員憑藉對地形的敏銳直覺，繪製了一張簡易地圖！🗺️";
                    } else {
                        navigatorMapBonusActive = true; // Activate the bonus for next map use
                        skillOutcomeMessage = "智慧導航員集中精神研究地圖，下次使用地圖時將更加熟練，不會耗損地圖！🧠";
                    }
                    skillUsedSuccessfully = true;
                    break;
                case 'revive':
                    const studentToRevive = students.find(s => !s.active);
                    if (studentToRevive) {
                        studentToRevive.active = true;
                        studentToRevive.stamina = Math.min(INITIAL_STAMINA, activeSkill.amount.stamina);
                        studentToRevive.water = Math.min(INITIAL_WATER, activeSkill.amount.water);
                        // 注意：主動技能的復活不設置 student.rescued，該標記專用於被動技能
                        skillOutcomeMessage = `${roleDefinition.name}使用了救援技能！${studentToRevive.name}恢復了意識！`;
                        skillUsedSuccessfully = true;
                    } else {
                        skillOutcomeMessage = `${roleDefinition.name}嘗試使用救援技能，但目前沒有同學需要救援。`;
                        skillUsedSuccessfully = true; // 技能依然視為已使用
                    }
                    break;
                default:
                    console.warn("未知技能類型:", activeSkill.type);
            }

            if (skillUsedSuccessfully) {
                roleSkillUsed = true;
                refreshRoleBadge(); // 更新徽章和按鈕狀態
                updateUI();         // 更新學生狀態條等
                if (activeSkill.type === 'stamina' || activeSkill.type === 'water' || activeSkill.type === 'revive') {
                    if (checkGameStatus()) return; // 如果遊戲結束則返回
                }
                if (outcomeTextElem && skillOutcomeMessage) {
                    outcomeTextElem.innerHTML = `<span class="text-purple-600 font-semibold">${skillOutcomeMessage}</span>`;
                    setTimeout(() => { // 一段時間後清除技能結果提示
                        if (outcomeTextElem.innerHTML.includes(skillOutcomeMessage)) {
                           outcomeTextElem.innerHTML = "";
                        }
                    }, 4000); // 顯示 4 秒
                }
            }
        });
    }
  });

  // —— 4. 定義角色徽章更新函式 ——
  function refreshRoleBadge() {
    if (!selectedRole) {
      roleBadge.classList.add('hidden');
    } else {
      const r = ROLES[selectedRole];
      if (r) {
          roleBadge.textContent =
            `${roleSkillUsed ? '✅' : '✨'} ${r.name} · ${roleSkillUsed ? '已用' : '未用'}`;
          roleBadge.classList.remove('hidden');
          skillBtn.classList.remove('hidden'); // 技能按鈕也在此時顯示
          skillBtn.disabled = roleSkillUsed; // 如果技能已用，則禁用按鈕
      } else {
          roleBadge.classList.add('hidden');
          skillBtn.classList.add('hidden');
      }
    }
  }
  window.refreshRoleBadge = refreshRoleBadge; // Expose globally if needed

  // 初次 UI 更新 (主要用於確保歡迎畫面元素正確)
  updateUI();
}); // ← 結束 DOMContentLoaded 回呼

// ===== 同步左右兩邊高度 =====
// 建議移除此函式及相關的 'load' 和 'resize' 事件監聽器，
// 改為依賴 index.html 中的 MutationObserver 和 adjustStudentListHeight 函式。
// window.addEventListener('load', syncSideHeights);
// window.addEventListener('resize', syncSideHeights);

// 初次載入與視窗調整
// Monkey-patching displayEvent to call syncSideHeights after it runs.
// This should be done after DOMContentLoaded to ensure displayEvent is defined.
window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.displayEvent === 'function') {
        const originalDisplayEvent = window.displayEvent;
        window.displayEvent = function(...args) {
            const result = originalDisplayEvent.apply(this, args);
            // 改為呼叫 index.html 中定義的觸發函式
            if (typeof window.triggerStudentListHeightAdjust === 'function') {
                window.triggerStudentListHeightAdjust();
            }
            return result;
        };
    }
});

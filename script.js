// 遊戲變數初始化
const INITIAL_STAMINA = 300; // 全班共享體力值上限及初始值
const INITIAL_WATER = 300; // 全班共享水分值上限及初始值
const PER_TURN_STAMINA_COST = 2; // 每回合固定消耗體力 (此處未按要求修改，僅修改水分)
const PER_TURN_WATER_COST = 1;   // 每回合固定消耗水分 (per active student) - 已修改為 1

// UI 視覺閾值 (用於資源條顏色和進度條顏色)
const HIGH_RESOURCE_THRESHOLD_RATIO = 0.7; // 高資源閾值比例 (例如 70%)
const LOW_RESOURCE_THRESHOLD_RATIO = 0.3;  // 低資源閾值比例 (例如 30%)
const HIGH_PROGRESS_THRESHOLD_PERCENT = 75; // 高進度閾值百分比
const MID_PROGRESS_THRESHOLD_PERCENT = 40;  // 中進度閾值百分比
const HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT = 70; // 學生單項資源高閾值百分比
const LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT = 30;  // 學生單項資源低閾值百分比

// 持續時間設定 (毫秒)
const OUTCOME_DISPLAY_DURATION_MS = 280; // 顯示結果後等待的時間
const ITEM_PULSE_ANIMATION_MS = 800;      // 物品獲得時的脈衝動畫時間
// 物品效果數值
const WATER_BOTTLE_RECOVERY_AMOUNT = 12; // 獲得水瓶時恢復的水量

const studentNames = [
    "蔡宥丞", "蔡羽恩", "陳湘晴", "陳芊錡", "陳楷恩", "江芊妏", "賴玧樂", "廖予謙",
    "林泓佑", "林書玉", "林瑋琦", "李承宥", "劉苪希", "彭唯", "潘祐丞", "許翔淏",
    "徐翊庭", "謝從偉", "吳宥珈", "王懸", "王品勛", "黃宜潔", "黃保慈", "黃馨恩",
    "黃郁晴", "黃志懿", "張辰煥", "周宇桐"
];

let students = [];

function initializeStudentStats() {
    students = studentNames.map(name => ({
        name: name,
        stamina: INITIAL_STAMINA,
        water: INITIAL_WATER,
        active: true // true if student can participate, false if fainted
    }));
}

// 照片相關設定 (如果沒有 config.js，則定義於此)
const PHOTO_BASE_PATH = "images/life_photos/";

// 輔助函數生成照片檔名
function generatePhotoFilenames(count) {
    const filenames = [];
    for (let i = 1; i <= count; i++) {
        filenames.push(`photo_${String(i).padStart(3, '0')}.JPG`);
    }
    return filenames;
}
const ALL_PHOTO_FILENAMES = generatePhotoFilenames(204); // 生成 photo_001.JPG 到 photo_204.JPG
let unlockedPhotos = new Set(); // 用來儲存已解鎖照片的識別碼
let totalCollaborationScore = 0; // 新增：全班協作總分
let photosUnlockedThisSession = 0; // 新增：本局遊戲已透過協作解鎖的照片數量
const POINTS_PER_PHOTO = 10; // 修改：每解鎖一張照片所需的協作點數 (調整為10)

(function() { // IIFE Start

    // 集中管理物品定義
    const ITEMS = {
        energyBar:       { id: 'itemEnergyBar',       name: '能量棒🍫',       initial: true },
        snack:           { id: 'itemSnack',           name: '零食🍪',           initial: true },
        map:             { id: 'itemMap',             name: '地圖🗺️',           initial: true },
        insectRepellent: { id: 'itemInsectRepellent', name: '驅蟲劑🧴',       initial: true },
        survivalRope:    { id: 'itemSurvivalRope',    name: '求生繩索🎗️',   initial: true },
        waterBottle:     { id: 'itemWaterBottle',     name: '水瓶💧',           initial: true },
        firstAidKit:     { id: 'itemFirstAidKit',     name: '急救包🩹',       initial: true }
    };

    // 物品狀態
    let inventory = {};
    function initializeInventory() {
        for (const key in ITEMS) {
            inventory[key] = ITEMS[key].initial;
        }
    }
    initializeInventory(); // 初始化物品

    let sequenceIndex = 0; // 當前事件在序列中的索引

    // UI 元素獲取
    const welcomeScreen = document.getElementById('welcomeScreen');
    const gamePlayScreen = document.getElementById('gamePlayScreen');
    const startButton = document.getElementById('startButton');
    const staminaValueElem = document.getElementById('staminaValue');
    const staminaBarElem = document.getElementById('staminaBar');
    const waterValueElem = document.getElementById('waterValue');
    const waterBarElem = document.getElementById('waterBar');
    const progressTextElem = document.getElementById('progressText');
    const stageProgressTextElem = document.getElementById('stageProgressText');
    const stageProgressBarElem = document.getElementById('stageProgressBar');
    const eventTextElem = document.getElementById('eventText');
    // const outcomeTextElem = document.getElementById('outcomeText'); // 此元素似乎未使用
    const optionsArea = document.getElementById('optionsArea'); // Moved inside IIFE
    const gameOverPopup = document.getElementById('gameOverPopup'); // Moved inside IIFE
    const popupTitleElem = document.getElementById('popupTitle'); // Moved inside IIFE
    const popupMessageElem = document.getElementById('popupMessage'); // Moved inside IIFE
    const restartButtonPopup = document.getElementById('restartButtonPopup'); // Moved inside IIFE
    // const studentListContainer = document.getElementById('studentListContainer'); // 將由 updateUI 動態管理 // Moved inside IIFE
    const popupContent = document.getElementById('popupContent'); // Moved inside IIFE

    // 照片解鎖彈出視窗 UI 元素 // Moved inside IIFE
    const photoUnlockPopup = document.getElementById('photoUnlockPopup');
    const unlockedPhotoImg = document.getElementById('unlockedPhotoImg');
    const unlockedPhotoName = document.getElementById('unlockedPhotoName');
    const closePhotoPopupButton = document.getElementById('closePhotoPopupButton');

    // 音效元素獲取 (假設這些 ID 存在於 HTML 中) // Moved inside IIFE
    const audioClick = document.getElementById('audioClick');
    const audioPositive = document.getElementById('audioPositive');
    const audioNegative = document.getElementById('audioNegative');
    const audioItemPickup = document.getElementById('audioItemPickup');
    const audioGameWin = document.getElementById('audioGameWin');
    const audioGameLose = document.getElementById('audioGameLose');

    // 物品欄顯示元素 (動態獲取或預先存儲) // Moved inside IIFE
    const itemDisplayElements = {};
    for (const key in ITEMS) {
        itemDisplayElements[key] = document.getElementById(ITEMS[key].id);
    }

    // 遊戲事件資料庫，按階段分類 - REMOVED as data is now in separate files
    // const eventsByStage = { ... };

    let currentEventSequence = []; // 每次遊戲都會重新生成的事件序列 // Moved inside IIFE

    // 隨機打亂陣列順序的輔助函數 (Fisher-Yates shuffle)
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
        console.log("Before accessing gameEventsIntro:", window.gameEventsIntro); // DEBUG
        if (!window.gameEventsIntro || window.gameEventsIntro.length === 0) {
            console.error("ERROR: gameEventsIntro is not defined or is empty! Check if events-intro.js loaded correctly and has no errors.");
            alert("遊戲初始化錯誤：無法載入開場事件。請檢查瀏覽器控制台獲取更多資訊。");
            return; // Prevent further execution if critical data is missing
        }
        currentEventSequence.push(window.gameEventsIntro[0]);

        // 從各階段事件池中隨機選取更多事件加入序列
        // 固定總關卡數為30 (1 intro + 28 main stages + 1 climax)
        // 將28個主要關卡分配給三個階段
        const numForestEvents = 9;
        const numPathEvents = 9;
const numSlopeEvents = 9;  // 新增斜坡階段事件數量定義
        currentEventSequence = currentEventSequence.concat(shuffleArray([...window.gameEventsForest]).slice(0, numForestEvents));
        currentEventSequence = currentEventSequence.concat(shuffleArray([...window.gameEventsPath]).slice(0, numPathEvents));
        currentEventSequence = currentEventSequence.concat(shuffleArray([...window.gameEventsSlope]).slice(0, numSlopeEvents));
        currentEventSequence = currentEventSequence.concat(shuffleArray([...window.gameEventsSlope]).slice(0, Math.min(window.gameEventsSlope.length, numSlopeEvents)));

        // console.log("Total events after main stages:", currentEventSequence.length); // 應該是 1 (intro) + 28 = 29
        currentEventSequence.push(window.gameEventsClimax[0]); // 加入結尾事件 (到達山頂前)

        sequenceIndex = 0; // 重設事件索引
    }

    // 隨機獲取一位或多位學生名字的輔助函數
    function getRandomStudentName(currentStudents, count = 1) {
        if (count <= 0) return [];

        const activeStudents = currentStudents.filter(s => s.active);
        if (activeStudents.length === 0) {
            // 如果沒有活躍的學生，則返回佔位符
            return Array(count).fill("某同學");
        }

        if (count >= activeStudents.length) {
            // 如果需要的數量大於等於總數，則打亂並返回整個列表的副本
            return shuffleArray(activeStudents.map(s => s.name));
        }

        const pickedNames = new Set();
        const result = [];
        while (result.length < count) {
            const randomIndex = Math.floor(Math.random() * activeStudents.length);
            const name = activeStudents[randomIndex].name;
            if (!pickedNames.has(name)) {
                pickedNames.add(name);
                result.push(name);
            }
        }
        return result;
    }

    // 播放音效的輔助函數
    function playSound(audioElement) {
        if (audioElement && typeof audioElement.play === 'function') {
            audioElement.currentTime = 0; // 從頭播放
            audioElement.play().catch(error => {
                console.warn("音效播放失敗 (瀏覽器可能限制了自動播放):", error);
            });
        } else {
            // console.warn("嘗試播放無效的音效元素:", audioElement);
        }
    }

    // 更新 UI 顯示 (體力條、水分條、進度文字、物品欄)
    function updateUI() {
        // 體力更新
        // NOTE: INITIAL_STAMINA and INITIAL_WATER are inside the IIFE, but used here. They should also be moved outside or into a config.js.
        const activeStudents = students.filter(s => s.active);
        const avgStamina = activeStudents.length > 0 ? activeStudents.reduce((sum, s) => sum + s.stamina, 0) / activeStudents.length : 0;
        const avgWater = activeStudents.length > 0 ? activeStudents.reduce((sum, s) => sum + s.water, 0) / activeStudents.length : 0;

        staminaValueElem.textContent = Math.round(avgStamina);
        const staminaPercentage = Math.max(0, (avgStamina / INITIAL_STAMINA) * 100);
        staminaBarElem.style.width = `${staminaPercentage}%`;
        staminaBarElem.className = `resource-bar-fill h-full rounded-full ${avgStamina > (INITIAL_STAMINA * HIGH_RESOURCE_THRESHOLD_RATIO) ? 'bg-green-400' : (avgStamina > (INITIAL_STAMINA * LOW_RESOURCE_THRESHOLD_RATIO) ? 'bg-yellow-400' : 'bg-red-400')}`;
        staminaBarElem.parentElement.setAttribute('aria-valuenow', Math.round(staminaPercentage));

        // 水分更新
        waterValueElem.textContent = Math.round(avgWater);
        const waterPercentage = Math.max(0, (avgWater / INITIAL_WATER) * 100);
        waterBarElem.style.width = `${waterPercentage}%`;
        waterBarElem.className = `resource-bar-fill h-full rounded-full ${avgWater > (INITIAL_WATER * 0.7) ? 'bg-blue-400' : (avgWater > (INITIAL_WATER * 0.3) ? 'bg-indigo-400' : 'bg-red-400')}`;
        waterBarElem.parentElement.setAttribute('aria-valuenow', Math.round(waterPercentage)); // 使用 0.7 和 0.3 常數

        // 關卡進度更新
        if (currentEventSequence.length > 0) {
            const totalEvents = currentEventSequence.length;
            const currentProgress = Math.min(sequenceIndex, totalEvents - 1); // 避免超過總事件數
            const progressPercentage = totalEvents > 1 ? (currentProgress / (totalEvents - 1)) * 100 : (totalEvents === 1 ? 100 : 0); // 減1因為起始為0
            stageProgressBarElem.style.width = `${progressPercentage}%`;
            stageProgressTextElem.textContent = `${currentProgress + 1} / ${totalEvents}`; // 顯示當前事件數/總事件數
            stageProgressBarElem.parentElement.setAttribute('aria-valuenow', Math.round(progressPercentage)); // 使用 75 和 40 常數
            stageProgressBarElem.className = `resource-bar-fill h-full rounded-full ${progressPercentage > 75 ? 'bg-emerald-400' : (progressPercentage > 40 ? 'bg-lime-400' : 'bg-purple-400')}`;

            // Display number of active students
            const activeStudentCount = students.filter(s => s.active).length;
            const totalStudentCount = students.length;
            const studentStatusTextContent = `存活學生: ${activeStudentCount}/${totalStudentCount}`;
            const statusElement = document.getElementById('studentStatusText');
            if (statusElement) {
                statusElement.textContent = studentStatusTextContent;
            }
        } else {
             stageProgressTextElem.textContent = "0 / 0";
             stageProgressBarElem.parentElement.setAttribute('aria-valuenow', 0);
             stageProgressBarElem.style.width = "0%";
        }


        // 當前關卡文字更新
        if (currentEventSequence[sequenceIndex]) {
            progressTextElem.textContent = currentEventSequence[sequenceIndex].stage;
        } else {
            progressTextElem.textContent = "旅程接近尾聲 🌄";
        }

        // 更新物品欄顯示
        for (const itemKey in inventory) {
            if (itemDisplayElements[itemKey]) {
                itemDisplayElements[itemKey].classList.toggle('opacity-50', !inventory[itemKey]);
            }
        }

        // 更新右側學生列表
        const studentListArea = document.getElementById('studentListArea');
        if (studentListArea) {
            // Preserve the title, clear everything else under studentListArea
            const titleElement = studentListArea.querySelector('h2');
            let currentElement = titleElement ? titleElement.nextSibling : studentListArea.firstChild;
            while (currentElement) {
                const nextElement = currentElement.nextSibling;
                studentListArea.removeChild(currentElement);
                currentElement = nextElement;
            }

            // 分別獲取活躍和不活躍的學生
            const activeStudentsDisplay = students.filter(student => student.active);
            const inactiveStudentsDisplay = students.filter(student => !student.active);
            const createStudentElement = (student) => {
                const studentDiv = document.createElement('div');
                // 使用 flex 讓姓名和體力/水分水平排列
                studentDiv.className = `p-2 rounded-md shadow-sm flex items-center space-x-2 ${student.active ? 'bg-green-100' : 'bg-red-100 opacity-75'}`;


                const nameElem = document.createElement('p');
                studentDiv.appendChild(nameElem);
                // 將字體調整為 text-base 以獲得更好的可讀性
                nameElem.className = `font-semibold text-base flex-1 truncate ${student.active ? 'text-green-800' : 'text-red-800'}`;
                nameElem.textContent = student.name + (student.active ? '' : ' (倒)');
                nameElem.title = student.name + (student.active ? '' : ' (已倒下)'); // Tooltip for full name

                // 體力顯示 (值 + 迷你條)
                const staminaDisplay = document.createElement('div');
                staminaDisplay.className = 'flex items-center text-xs w-[55px]'; // 縮短體力條寬度
                const staminaVal = document.createElement('span');
                staminaVal.className = `mr-1 w-5 text-right ${student.stamina > (INITIAL_STAMINA * 0.3) ? 'text-gray-700' : 'text-red-600 font-medium'}`;
                staminaVal.textContent = student.stamina; // 使用 0.3 常數
                const staminaBarOuter = document.createElement('div');
                staminaBarOuter.className = 'flex-1 h-2 bg-gray-300 rounded-full'; // flex-1 for bar to take rest of space // 使用 70 和 30 常數
                const staminaBarInner = document.createElement('div');
                const sPercent = Math.max(0, (student.stamina / INITIAL_STAMINA) * 100);
                staminaBarInner.className = `h-full rounded-full ${sPercent > 70 ? 'bg-green-500' : sPercent > 30 ? 'bg-yellow-400' : 'bg-red-500'}`;
                staminaBarInner.style.width = `${sPercent}%`;
                staminaBarOuter.appendChild(staminaBarInner);
                staminaDisplay.appendChild(staminaVal);
                staminaDisplay.appendChild(staminaBarOuter);
                studentDiv.appendChild(staminaDisplay);

                // 水分顯示 (值 + 迷你條)
                const waterDisplay = document.createElement('div');
                waterDisplay.className = 'flex items-center text-xs w-[55px]'; // 縮短水分條寬度
                const waterVal = document.createElement('span');
                waterVal.className = `mr-1 w-5 text-right ${student.water > (INITIAL_WATER * 0.3) ? 'text-gray-700' : 'text-red-600 font-medium'}`;
                waterVal.textContent = student.water; // 使用 0.3 常數
                const waterBarOuter = document.createElement('div');
                waterBarOuter.className = 'flex-1 h-2 bg-gray-300 rounded-full'; // flex-1 for bar // 使用 70 和 30 常數
                const waterBarInner = document.createElement('div');
                const wPercent = Math.max(0, (student.water / INITIAL_WATER) * 100);
                waterBarInner.className = `h-full rounded-full ${wPercent > 70 ? 'bg-blue-500' : wPercent > 30 ? 'bg-indigo-400' : 'bg-red-500'}`;
                waterBarInner.style.width = `${wPercent}%`;
                waterBarOuter.appendChild(waterBarInner);
                waterDisplay.appendChild(waterVal);
                waterDisplay.appendChild(waterBarOuter);
                studentDiv.appendChild(waterDisplay);

                return studentDiv;
            };

            if (inactiveStudentsDisplay.length > 0) {
                // 情況一：有學生倒下，分割成上下兩個區塊
                const activeSection = document.createElement('div');
                activeSection.id = 'activeStudentListSection';
                activeSection.className = 'flex-1 overflow-y-auto mb-1 p-2 rounded bg-slate-100/50 custom-scrollbar';

                const activeTitle = document.createElement('h3');
                activeTitle.className = 'text-md font-medium text-green-700 mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-1 z-10 px-1';
                activeTitle.textContent = `💪 活躍同學 (${activeStudentsDisplay.length})`;
                activeSection.appendChild(activeTitle);

                const activeContainer = document.createElement('div');
                activeContainer.id = 'activeStudentListContainer';
                activeContainer.className = 'space-y-1.5 pr-1';
                activeSection.appendChild(activeContainer);
                studentListArea.appendChild(activeSection);

                if (activeStudentsDisplay.length > 0) {
                    activeStudentsDisplay.sort(sortByTotalResource).forEach(student => {
                        activeContainer.appendChild(createStudentElement(student));
                    });
                } else {
                    const emptyMsg = document.createElement('p');
                    emptyMsg.className = 'text-sm text-gray-500 text-center py-4';
                    emptyMsg.textContent = '沒有活躍的同學了...';
                    activeContainer.appendChild(emptyMsg);
                }

                const inactiveSection = document.createElement('div');
                inactiveSection.id = 'inactiveStudentListSection';
                inactiveSection.className = 'flex-1 overflow-y-auto mt-1 p-2 rounded bg-slate-100/50 custom-scrollbar';

                const inactiveTitle = document.createElement('h3');
                inactiveTitle.className = 'text-md font-medium text-red-700 mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-1 z-10 px-1';
                inactiveTitle.textContent = `🤕 已倒下同學 (${inactiveStudentsDisplay.length})`;
                inactiveSection.appendChild(inactiveTitle);

                const inactiveContainer = document.createElement('div');
                inactiveContainer.id = 'inactiveStudentListContainer';
                inactiveContainer.className = 'space-y-1.5 pr-1';
                inactiveSection.appendChild(inactiveContainer);
                studentListArea.appendChild(inactiveSection);

                inactiveStudentsDisplay.sort(sortByTotalResource).forEach(student => {
                    inactiveContainer.appendChild(createStudentElement(student));
                });

            } else {
                // 情況二：所有學生都活躍，顯示在一個區塊
                const singleSection = document.createElement('div');
                singleSection.id = 'allStudentListSection'; // 或 studentListContainerWrapper
                singleSection.className = 'flex-1 overflow-y-auto p-1 custom-scrollbar'; // p-1 to align with pr-1 in container

                const container = document.createElement('div');
                container.id = 'studentListContainer'; // 可以重用舊ID，如果其他地方沒有依賴
                container.className = 'space-y-1.5 pr-1'; // pr-1 for scrollbar space
                singleSection.appendChild(container);
                studentListArea.appendChild(singleSection);

                activeStudentsDisplay.sort(sortByTotalResource).forEach(student => {
                    container.appendChild(createStudentElement(student));
                });
            }
        }
    }

        // 輔助函數：根據體力+水分總和排序學生
    function sortByTotalResource(studentA, studentB) {
        const totalA = studentA.stamina + studentA.water;
        const totalB = studentB.stamina + studentB.water;
        return totalA - totalB; // 升冪排序 (總和低的在前)
    }

    // 輔助函數：轉義正則表達式特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    // 輔助函數：格式化包含學生姓名的文字
    function formatTextWithStudentNames(text, numStudentsHint = 1) {
    // 先统一给老师名字上色
    const teacherNameRegex = new RegExp(escapeRegExp(teacherName), 'g');
    let formattedText = text.replace(
        teacherNameRegex,
        `<span class="text-gray-800 font-bold">${teacherName}</span>` // Changed to text-gray-800 for #1F2937
    );

    // 以下逻辑跟你原来的一样，只把 formattedText 当作初始字符串继续处理
    const hasS1 = formattedText.includes("[studentName1]");
    const hasS2 = formattedText.includes("[studentName2]");
    const hasS  = formattedText.includes("[studentName]");

    // 强制根据占位符数量获取名字
    let namesToFetchCount = 0;
    if (hasS2) namesToFetchCount = 2;
    else if (hasS1 || hasS) namesToFetchCount = 1;

    const studentNamesForText = getRandomStudentName(students, namesToFetchCount);
    let actualNamesUsed = [];

    const name1 = studentNamesForText[0] || "某同學";
    const name2 = studentNamesForText[1] || name1;

    if (hasS1) {
        formattedText = formattedText.replace(/\[studentName1\]/g,
            `<span class="text-gray-800 font-semibold">${name1}</span>`); // Changed to text-gray-800
        actualNamesUsed.push(name1);
    }
    if (hasS2) {
        formattedText = formattedText.replace(/\[studentName2\]/g,
            `<span class="text-gray-800 font-semibold">${name2}</span>`); // Changed to text-gray-800
        actualNamesUsed.push(name2);
    }
    if (hasS) {
        formattedText = formattedText.replace(/\[studentName\]/g,
            `<span class="text-gray-800 font-semibold">${name1}</span>`); // Changed to text-gray-800
        actualNamesUsed.push(name1);
    }

    // 确保名字去重
    actualNamesUsed = [...new Set(actualNamesUsed)];
    return { formattedText, namesUsed: actualNamesUsed };
    }


    // 新增：顯示照片解鎖通知
    function showPhotoUnlockNotification(photoPath, photoFilename, playSoundEffect = true) {
        if (unlockedPhotoImg && photoUnlockPopup && unlockedPhotoName) {
            unlockedPhotoImg.src = photoPath;
            unlockedPhotoName.textContent = photoFilename;
            photoUnlockPopup.classList.remove('hidden');
            photoUnlockPopup.classList.add('flex');
            photoUnlockPopup.classList.remove('opacity-0'); // 移除透明
            photoUnlockPopup.classList.add('opacity-100');  // 設置為完全可見 (配合 transition-opacity)
            if (playSoundEffect) {
                playSound(audioItemPickup); // 可以重用物品拾取音效或新增專用音效
            }
        }
    }

    // 新增：隱藏照片解鎖通知
    function hidePhotoUnlockNotification() {
        if (photoUnlockPopup) {
            photoUnlockPopup.classList.remove('flex');
            photoUnlockPopup.classList.add('hidden');
            photoUnlockPopup.classList.remove('opacity-100'); // 移除可見
            photoUnlockPopup.classList.add('opacity-0');   // 恢復初始透明狀態
            if (unlockedPhotoImg) unlockedPhotoImg.src = ""; // 清除圖片
            if (unlockedPhotoName) unlockedPhotoName.textContent = "";
        }
    }

    // 修改：此函數現在僅負責挑選並顯示一張隨機未解鎖照片的通知
    // 它會被 checkAndUnlockPhotosBasedOnCollaboration 調用
    function _unlockAndShowSpecificRandomPhoto() {
        const availablePhotos = ALL_PHOTO_FILENAMES.filter(filename => !unlockedPhotos.has(filename));
        if (availablePhotos.length > 0) {
            const photoToUnlock = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
            unlockedPhotos.add(photoToUnlock);
            console.log(`照片已解鎖: ${photoToUnlock}`);
            showPhotoUnlockNotification(PHOTO_BASE_PATH + photoToUnlock, photoToUnlock);
            return true; // 表示成功解鎖並顯示了一張照片
        } else {
            console.log("所有照片都已解鎖！");
            return false; // 表示沒有照片可解鎖
        }
    }

    // 新增：根據協作分數檢查並解鎖照片
    function checkAndUnlockPhotosBasedOnCollaboration() {
        const potentialTotalUnlocksBasedOnScore = Math.floor(totalCollaborationScore / POINTS_PER_PHOTO);

        if (potentialTotalUnlocksBasedOnScore > photosUnlockedThisSession) {
            const numToUnlockNow = potentialTotalUnlocksBasedOnScore - photosUnlockedThisSession;
            for (let i = 0; i < numToUnlockNow; i++) {
                if (_unlockAndShowSpecificRandomPhoto()) {
                    photosUnlockedThisSession++;
                } else {
                    break; // 如果沒有更多照片可解鎖，則停止
                }
            }
        }
    }

        // 顯示當前事件
    function displayEvent() {
        eventTextElem.innerHTML = ''; // 清除上次的事件問題或結果文字
        optionsArea.innerHTML = ''; // 清除上次的選項按鈕
        eventTextElem.classList.remove('animate-shake-text', 'animate-bounce-text'); // 移除舊動畫

        const event = currentEventSequence[sequenceIndex];
        if (!event) {
            checkGameStatus();
            return;
        }

        // Apply per-turn costs only if it's not the first event (intro event)
        if (sequenceIndex > 0) {
            // 應用回合消耗
            let anyStudentFaintedThisTurn = false;
            students.forEach(student => {
                if (student.active) {
                    student.stamina = Math.max(0, student.stamina - PER_TURN_STAMINA_COST);
                    student.water = Math.max(0, student.water - PER_TURN_WATER_COST);
                    // console.log(`回合消耗後 - ${student.name}: 體力=${student.stamina}, 水分=${student.water}`); // Log for debugging
                    if (student.stamina === 0 || student.water === 0) {
                        student.active = false;
                        anyStudentFaintedThisTurn = true;
                        // outcomeTextElem.textContent += `\n${student.name} 因回合消耗而倒下了！`; // Optional immediate feedback
                    }
                }
            });

            updateUI(); // Update UI to reflect turn costs
            // console.log(`回合消耗後活躍學生數: ${students.filter(s => s.active).length}`); // Log for debugging
            // If all students fainted due to turn costs, end the game
            if (students.filter(s => s.active).length === 0) {
                 checkGameStatus(); // This will trigger the game over popup
                 return; // Prevent displaying event options
            }
        }

        // 替換事件文字中的學生名字佔位符
        // Determine numStudentsHint for event text
        let numStudentsHintForEvent = event.needsStudent ? 1 : 0;
        if (event.text.includes("[studentName1]") || event.text.includes("[studentName2]")) numStudentsHintForEvent = 2;
        else if (event.text.includes("[studentName]")) numStudentsHintForEvent = 1; //This was an existing line, ensure it's not removed by mistake


        const eventTextResult = formatTextWithStudentNames(event.text, numStudentsHintForEvent);
        eventTextElem.innerHTML = eventTextResult.formattedText;

        // 為每個選項創建按鈕
        event.options.forEach((option) => {
            const button = document.createElement('button');
            const optionTextResult = formatTextWithStudentNames(option.text, option.numStudents || (option.text.includes("[studentName2]") ? 2 : (option.text.includes("[studentName1]") || option.text.includes("[studentName]") ? 1 : 0)));
            button.innerHTML = optionTextResult.formattedText; // 使用 innerHTML 以渲染 span

            button.className = "bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95 text-left"; // Adjusted for potentially longer text

            // 處理需要物品的選項
            if (option.requiredItem) {
                const requiredItems = Array.isArray(option.requiredItem) ? option.requiredItem : [option.requiredItem];
                let hasAllRequiredItems = true;
                let missingItemDisplayName = '';

                for (const itemKey of requiredItems) {
                    if (!inventory[itemKey]) {
                        hasAllRequiredItems = false;
                        missingItemDisplayName = getItemDisplayName(itemKey);
                        break;
                    }
                }

                if (!hasAllRequiredItems) {
                    button.disabled = true;
                    button.classList.remove('bg-purple-500', 'hover:bg-purple-600');
                    button.classList.add('bg-gray-400', 'cursor-not-allowed');
                    // For innerHTML, we need to be careful if optionTextResult.formattedText already contains HTML
                    const missingTextSpan = `<span class="text-xs italic opacity-80"> (缺少${getItemDisplayName(missingItemDisplayName)})</span>`;
                    button.innerHTML += missingTextSpan;
                } else {
                    button.classList.add('bg-blue-500', 'hover:bg-blue-600'); // 區分物品選項
                }
            }

            button.onclick = () => {
                playSound(audioClick); // 選項按鈕點擊音效
                handleOption(option, optionTextResult.namesUsed); // Pass names used in option
            };
            optionsArea.appendChild(button);
        });

        // Update UI after setting up the event text and options
        updateUI();
    }

    // 獲取物品的中文顯示名稱
    function getItemDisplayName(itemKey) {
        return ITEMS[itemKey] ? ITEMS[itemKey].name : itemKey;
    }

    // 處理選項選擇
    function handleOption(selectedOption, namesInOptionText) {
        let outcomeZusatz = ""; // Additional text for outcome if students faint
        // NOTE: WATER_BOTTLE_RECOVERY_AMOUNT is inside the IIFE, but used here. It should also be moved outside or into a config.js.
        let waterBottleRecipientName = null; // To store the name of the student who got a water bottle and immediate bonus

        const willWinNext = (sequenceIndex + 1) >= currentEventSequence.length;

        playSound(audioClick); // 選項按鈕點擊音效放在最前面
        eventTextElem.innerHTML = ''; // 問題消失

        // 處理物品消耗
        if (selectedOption.requiredItem) {
            const consumedItems = Array.isArray(selectedOption.requiredItem) ? selectedOption.requiredItem : [selectedOption.requiredItem];
            if (selectedOption.consumeItem) {
                for (const itemKey of consumedItems) {
                    if (inventory[itemKey]) {
                        inventory[itemKey] = false;
                    }
                }
            }
        }

        // 處理獲得物品
        if (selectedOption.giveItem) {
            selectedOption.giveItem.forEach(itemKey => {
                inventory[itemKey] = true; // 標記為擁有

                // If a water bottle is obtained, a specific student gets an immediate water bonus.
                if (itemKey === 'waterBottle') {
                    let studentForBottleEffect = null;
                    // Priority: Student mentioned in the option button text that led to this.
                    if (namesInOptionText.length > 0) { // namesInOptionText are from the button clicked
                        studentForBottleEffect = students.find(s => s.name === namesInOptionText[0] && s.active);
                    }

                    if (!studentForBottleEffect) {
                        // If no specific student from the option text, pick a random active student.
                        // This covers general "found item" events.
                        const activeStudentsList = students.filter(s => s.active);
                        if (activeStudentsList.length > 0) {
                            studentForBottleEffect = activeStudentsList[Math.floor(Math.random() * activeStudentsList.length)];
                        }
                    }

                    if (studentForBottleEffect) {
                        studentForBottleEffect.water = Math.min(INITIAL_WATER, studentForBottleEffect.water + WATER_BOTTLE_RECOVERY_AMOUNT);
                        waterBottleRecipientName = studentForBottleEffect.name; // Store for the outcome message
                        console.log(`${waterBottleRecipientName} 獲得水瓶並立即補充 ${WATER_BOTTLE_RECOVERY_AMOUNT} 水分。`);
                    }
                }

                const itemElement = document.getElementById(ITEMS[itemKey].id);
                if (itemElement) {
                    itemElement.classList.add('animate-pulse-item');
                    setTimeout(() => itemElement.classList.remove('animate-pulse-item'), 800); // 縮短一點動畫時間配合音效
                }
            });
        }

        let affectedStudentList = [];
        const outcomeTextResultForScope = formatTextWithStudentNames(selectedOption.outcomeText, selectedOption.numStudents || (selectedOption.outcomeText.includes("[studentName2]") ? 2 : (selectedOption.outcomeText.includes("[studentName1]") || selectedOption.outcomeText.includes("[studentName]") ? 1 : 0)));
        const namesFromOutcome = outcomeTextResultForScope.namesUsed; // 從結果文字中提取的學生姓名
        const namesFromOptionButton = namesInOptionText; // 從選項按鈕文字中提取的學生姓名 (作為參數傳入)

        // Determine scope of effect
        if (selectedOption.effectScope === 'all_active' || outcomeTextResultForScope.formattedText.includes("全班") || outcomeTextResultForScope.formattedText.includes("大家")) {
            affectedStudentList = students.filter(s => s.active);
        } else if (namesFromOutcome && namesFromOutcome.length > 0) { // 優先使用結果文字中提到的學生
            affectedStudentList = namesFromOutcome
                .map(name => students.find(s => s.name === name && s.active))
                .filter(Boolean); // Filter out undefined if a name wasn't found or student inactive
        } else if (namesFromOptionButton && namesFromOptionButton.length > 0) { // 其次使用選項按鈕文字中提到的學生
            affectedStudentList = namesFromOptionButton
                .map(name => students.find(s => s.name === name && s.active))
                .filter(Boolean); // 過濾掉未找到或不活躍的學生
        } else {
            // As a fallback, if there are changes but no clear target, apply to one random active student.
            if ((selectedOption.staminaChange !== 0 || selectedOption.waterChange !== 0) && students.filter(s => s.active).length > 0) {
                 const randomActiveStudent = students.filter(s => s.active)[Math.floor(Math.random() * students.filter(s => s.active).length)];
                 if (randomActiveStudent) affectedStudentList.push(randomActiveStudent);
            }
        }

        affectedStudentList.forEach(student => {
            student.stamina = Math.min(INITIAL_STAMINA, Math.max(0, student.stamina + selectedOption.staminaChange));
            student.water = Math.min(INITIAL_WATER, Math.max(0, student.water + selectedOption.waterChange));
            console.log(`選項結果後 - ${student.name}: 體力=${student.stamina}, 水分=${student.water}`); // 新增 log
            // Check if student fainted *after* applying option changes, but only if they were active before this option
            if (!student.active && !(student.stamina === 0 || student.water === 0)) return; // If already inactive and not due to this option, skip.
            if (student.stamina === 0 || student.water === 0) {
                student.active = false;
                outcomeZusatz += `\n${student.name} 精疲力盡倒下了！`;
            }
        });

        // 替換結果文字中的學生名字佔位符
        const numStudentsHintForOutcome = selectedOption.numStudents || (selectedOption.outcomeText.includes("[studentName2]") ? 2 : (selectedOption.outcomeText.includes("[studentName1]") || selectedOption.outcomeText.includes("[studentName]") ? 1 : 0));
        const mainOutcomeTextResult = formatTextWithStudentNames(selectedOption.outcomeText, numStudentsHintForOutcome);

        let finalOutcomeDisplay = mainOutcomeTextResult.formattedText;

        // Append message for water bottle recipient, if any
        if (waterBottleRecipientName) {
            finalOutcomeDisplay += `<br><em class="text-sm text-blue-600 italic">${waterBottleRecipientName} 因新獲得的水瓶💧，額外補充了 ${WATER_BOTTLE_RECOVERY_AMOUNT} 點水分！</em>`;
        }

        // Append message for fainted students
        if (outcomeZusatz) {
            finalOutcomeDisplay += `<br><em class="text-sm text-gray-500 italic">${outcomeZusatz.trim().replace(/\n/g, "<br>")}</em>`;
        }
        eventTextElem.innerHTML = finalOutcomeDisplay; // 結果顯示在 eventTextElem

        // 處理協作點數獎勵
        if (selectedOption.collaborationPointsAwarded) {
            totalCollaborationScore += selectedOption.collaborationPointsAwarded;
            console.log(`協作分數增加: ${selectedOption.collaborationPointsAwarded}, 總分: ${totalCollaborationScore}`);
        }

        // Only play outcome-related sounds and animations if not winning immediately after this option
        if (!willWinNext) {
            // 根據體力/水分變化，為事件文本添加動畫效果和音效
            if (selectedOption.staminaChange > 0 || selectedOption.waterChange > 0) {
                eventTextElem.classList.add('animate-bounce-text');
                playSound(audioPositive); // 正面效果音效
            } else if (selectedOption.staminaChange < 0 || selectedOption.waterChange < 0) {
                eventTextElem.classList.add('animate-shake-text');
                playSound(audioNegative); // 負面效果音效
            }
        }

        updateUI(); // 更新 UI 顯示

        // 禁用所有選項按鈕，防止重複點擊
        Array.from(optionsArea.children).forEach(button => button.disabled = true);

        // 物品拾取音效 (如果在 giveItem 後播放)
        // Only play if not winning and item was given
        if (!willWinNext && selectedOption.giveItem && selectedOption.giveItem.length > 0) {
            playSound(audioItemPickup);
        }

        // 短暫延遲後，進入下一個事件或檢查遊戲狀態
        setTimeout(() => {
            sequenceIndex++; // 進入下一個事件 // 使用 OUTCOME_DISPLAY_DURATION_MS 常數
            const isGameOver = checkGameStatus(); // 檢查遊戲是否結束或勝利
            if (!isGameOver) checkAndUnlockPhotosBasedOnCollaboration(); // 在顯示下個事件前，檢查是否解鎖照片
            if (!isGameOver) { // 如果遊戲未結束
                displayEvent();
            }
        }, 3000); // 等待 3 秒讓玩家看清結果
    }

    // 檢查遊戲狀態 (勝利或失敗)
    function checkGameStatus() {
        const activeStudentCount = students.filter(s => s.active).length;
        // NOTE: PHOTO_BASE_PATH is inside the IIFE, but used here. It should also be moved outside or into a config.js.
        console.log(`檢查遊戲狀態: 活躍學生數=${activeStudentCount}, 當前事件索引=${sequenceIndex}, 總事件數=${currentEventSequence.length}`); // 新增 log
        if (activeStudentCount === 0) {
            console.log("所有學生已倒下，準備顯示失敗彈窗..."); // 新增 log
            playSound(audioGameLose);
            // Message can be more specific, e.g., "所有同學都已精疲力盡..."
            showPopup("挑戰失敗！😭", `所有同學都已精疲力盡或脫水！${teacherName}和同學們無法繼續前進…`);
            return true; // 遊戲結束

        // 遊戲勝利分支 (checkGameStatus)
        } else if (sequenceIndex >= currentEventSequence.length) {
            playSound(audioGameWin);

            // 顯示通關照片
            showPhotoUnlockNotification(PHOTO_BASE_PATH + "end.jpg", "通關紀念！", false);

            // --- 新增：勝利時才綁這個監聽，並設定 { once: true } ---
            const closePhotoBtn = document.getElementById('closePhotoPopupButton');
            closePhotoBtn.addEventListener('click', () => {
                hidePhotoUnlockNotification();

                // 計算倖存者名字
                let survivorNames = students.filter(s => s.active).map(s => s.name).join("、");
                if (students.filter(s => s.active).length === students.length) {
                survivorNames = "六年四班全體同學";
                }

                // 顯示文字版過關彈窗
                showPopup(
                "恭喜過關！🏆",
                `${teacherName}和 ${survivorNames} 成功登上山頂！這就是團結、智慧與堅持的力量！🎉`
                );
            }, { once: true });  // 加上 once: true，點一次自動解除

            return true;
            }

        console.log("遊戲繼續..."); // 新增 log
        return false; // 遊戲未結束
    }

    // 顯示遊戲結束/勝利彈出視窗
    function showPopup(title, message) {
        // 先给老师名字上色
        const teacherNameRegex = new RegExp(escapeRegExp(teacherName), 'g');
    // 使用實際的 HTML 標籤，而不是實體編碼
    const formattedMessage = message.replace(teacherNameRegex, `<span class="text-emerald-700 font-bold">${teacherName}</span>`);

        popupTitleElem.textContent = title;
        popupMessageElem.innerHTML = formattedMessage;  // 用 innerHTML 渲染样式

        gameOverPopup.classList.remove('hidden', 'opacity-0');
        gameOverPopup.classList.add('opacity-100');
        popupContent.classList.remove('scale-90', 'opacity-0');
        popupContent.classList.add('scale-100', 'opacity-100');
    }

    // 重置遊戲並隱藏彈出視窗
    function resetGame() {
        initializeStudentStats(); // Resets all students' stamina, water, and active status
        // NOTE: INITIAL_STAMINA and INITIAL_WATER are inside the IIFE, but used in initializeStudentStats. They should also be moved outside or into a config.js.
        initializeInventory(); // 重置物品欄
        initializeEventSequence(); // 重新初始化事件序列
        totalCollaborationScore = 0; // 重置協作分數
        photosUnlockedThisSession = 0; // 重置本局協作解鎖照片計數
        unlockedPhotos.clear(); // 重設遊戲時清空已解鎖照片
        // outcomeTextElem.textContent = ''; // 清除結果文字 (如果元素被使用的話)

        // 隱藏彈出視窗並重設動畫類別
        // For gameOverPopup (the overlay)
        gameOverPopup.classList.remove('opacity-100'); // 移除完全不透明狀態
        gameOverPopup.classList.add('opacity-0');    // 加回初始的透明狀態，為下次顯示做準備
        gameOverPopup.classList.add('hidden');
        // For popupContent (the modal box)
        popupContent.classList.remove('scale-100', 'opacity-100');
        popupContent.classList.add('scale-90', 'opacity-0');
        displayEvent(); // 顯示第一個事件，開始新遊戲
    }

    // 事件監聽器
    startButton.addEventListener('click', () => {
        playSound(audioClick); // 開始按鈕點擊音效
        welcomeScreen.classList.add('hidden'); // 隱藏歡迎畫面
        gamePlayScreen.classList.remove('hidden'); // 顯示遊戲畫面
        initializeStudentStats(); // Initialize student stats at game start
        initializeEventSequence(); // 初始化事件序列
        updateUI(); // 首次進入遊戲畫面時更新UI，包含體力值、水分值和物品欄
        displayEvent(); // 顯示第一個事件
    });

    restartButtonPopup.addEventListener('click', () => {
        playSound(audioClick); // 重玩按鈕點擊音效
        resetGame();
    });

    // 照片彈出視窗關閉按鈕
    if (closePhotoPopupButton) {
        closePhotoPopupButton.addEventListener('click', hidePhotoUnlockNotification);
    }

    // 初始化 UI 顯示 (初次載入時)
    initializeInventory(); // Ensure inventory is set before first UI update if game not started
    updateUI();

})(); // IIFE End

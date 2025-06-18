
// 遊戲變數初始化
const INITIAL_STAMINA = 50; // 全班共享體力值上限及初始值
const INITIAL_WATER = 50; // 全班共享水分值上限及初始值
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
const OUTCOME_DISPLAY_DURATION_MS = 280; // 顯示結果後等待的時間
const ITEM_PULSE_ANIMATION_MS = 800;     // 物品獲得時的脈衝動畫時間

// 物品效果數值
const WATER_BOTTLE_RECOVERY_AMOUNT = 12; // 獲得水瓶時恢復的水量

// 老師名稱（需在其他地方定義或在此處設置）
const teacherName = "賴冠儒"; // 例如

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
        active: true
    }));
}

// 照片相關設定
const PHOTO_BASE_PATH = "images/life_photos/";
function generatePhotoFilenames(count) {
    const filenames = [];
    for (let i = 1; i <= count; i++) {
        filenames.push(`photo_${String(i).padStart(3, '0')}.JPG`);
    }
    return filenames;
}
const ALL_PHOTO_FILENAMES = generatePhotoFilenames(204); // photo_001.JPG 到 photo_204.JPG
let unlockedPhotos = new Set();
let totalCollaborationScore = 0;
let photosUnlockedThisSession = 0;
const POINTS_PER_PHOTO = 10;

(function() { // IIFE Start

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

    // 物品狀態
    let inventory = {};
    function initializeInventory() {
        for (const key in ITEMS) {
            inventory[key] = ITEMS[key].initial;
        }
    }
    initializeInventory();

    let sequenceIndex = 0;
    let currentEventSequence = [];

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
    const optionsArea = document.getElementById('optionsArea');
    const gameOverPopup = document.getElementById('gameOverPopup');
    const popupTitleElem = document.getElementById('popupTitle');
    const popupMessageElem = document.getElementById('popupMessage');
    const restartButtonPopup = document.getElementById('restartButtonPopup');
    const popupContent = document.getElementById('popupContent');
    const photoUnlockPopup = document.getElementById('photoUnlockPopup');
    const unlockedPhotoImg = document.getElementById('unlockedPhotoImg');
    const unlockedPhotoName = document.getElementById('unlockedPhotoName');
    const closePhotoPopupButton = document.getElementById('closePhotoPopupButton');
    const audioClick = document.getElementById('audioClick');
    const audioPositive = document.getElementById('audioPositive');
    const audioNegative = document.getElementById('audioNegative');
    const audioItemPickup = document.getElementById('audioItemPickup');
    const audioGameWin = document.getElementById('audioGameWin');
    const audioGameLose = document.getElementById('audioGameLose');
    const itemDisplayElements = {};
    for (const key in ITEMS) {
        itemDisplayElements[key] = document.getElementById(ITEMS[key].id);
    }

    // 隨機打亂陣列順序 (Fisher-Yates)
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
        if (!window.gameEventsIntro || !window.gameEventsIntro.length) {
            console.error("遊戲初始化錯誤：無法載入開場事件。");
            return;
        }
        currentEventSequence.push(window.gameEventsIntro[0]);
        const numForestEvents = 9;
        const numPathEvents = 9;
        const numSlopeEvents = 9;
        currentEventSequence = currentEventSequence
            .concat(shuffleArray([...window.gameEventsForest]).slice(0, numForestEvents))
            .concat(shuffleArray([...window.gameEventsPath]).slice(0, numPathEvents))
            .concat(shuffleArray([...window.gameEventsSlope]).slice(0, numSlopeEvents));
        currentEventSequence.push(window.gameEventsClimax[0]);
        sequenceIndex = 0;
    }

    // 隨機獲取學生名字
    function getRandomStudentName(currentStudents, count = 1) {
        if (count <= 0) return [];
        const activeStudents = currentStudents.filter(s => s.active);
        if (!activeStudents.length) return Array(count).fill("某同學");
        if (count >= activeStudents.length) {
            return shuffleArray(activeStudents.map(s => s.name));
        }
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

    // 更新 UI
    function updateUI() {
        /* >>> 新增／搬移到函式一開始 <<< */
        const activeStudentCount = students.filter(s => s.active).length;
        const totalStudentCount  = students.length;
        const statusElement = document.getElementById('studentStatusText');
        if (statusElement) {
            statusElement.textContent = `存活學生: ${activeStudentCount}/${totalStudentCount}`;
        }
        // 計算平均資源
        const active = students.filter(s => s.active);
        const avgStamina = active.length ? active.reduce((a,s) => a+s.stamina,0)/active.length : 0;
        const avgWater = active.length ? active.reduce((a,s) => a+s.water,0)/active.length : 0;
        // 體力條
        staminaValueElem.textContent = Math.round(avgStamina);
        const staPerc = Math.max(0,(avgStamina/INITIAL_STAMINA)*100);
        staminaBarElem.style.width = `${staPerc}%`;
        staminaBarElem.className = `resource-bar-fill h-full rounded-full ${
            avgStamina > (INITIAL_STAMINA*HIGH_RESOURCE_THRESHOLD_RATIO)?'bg-green-400':
            (avgStamina > (INITIAL_STAMINA*LOW_RESOURCE_THRESHOLD_RATIO)?'bg-yellow-400':'bg-red-400')
        }`;
        // 水分條
        waterValueElem.textContent = Math.round(avgWater);
        const watPerc = Math.max(0,(avgWater/INITIAL_WATER)*100);
        waterBarElem.style.width = `${watPerc}%`;
        waterBarElem.className = `resource-bar-fill h-full rounded-full ${
            watPerc > (HIGH_RESOURCE_THRESHOLD_RATIO*100)?'bg-blue-400':
            (watPerc > (LOW_RESOURCE_THRESHOLD_RATIO*100)?'bg-indigo-400':'bg-red-400')
        }`;
        // 進度條
        if (currentEventSequence.length) {
            const total = currentEventSequence.length;
            const prog = Math.min(sequenceIndex, total-1);
            const perc = total>1?(prog/(total-1)*100):100;
            stageProgressBarElem.style.width = `${perc}%`;
            stageProgressTextElem.textContent = `${prog+1} / ${total}`;
            stageProgressBarElem.className = `resource-bar-fill h-full rounded-full ${
                perc>HIGH_PROGRESS_THRESHOLD_PERCENT?'bg-emerald-400':
                (perc>MID_PROGRESS_THRESHOLD_PERCENT?'bg-lime-400':'bg-purple-400')
            }`;
        }
        // 物品欄
        for (const k in inventory) {
            itemDisplayElements[k].classList.toggle('opacity-50',!inventory[k]);
        }
        // 學生列表
        const listArea = document.getElementById('studentListArea');
        if (listArea) {
            const title = listArea.querySelector('h2');
            let node = title?title.nextSibling:listArea.firstChild;
            while (node) { const next=node.nextSibling; listArea.removeChild(node); node=next; }
            const activeList=students.filter(s=>s.active), inactive=students.filter(s=>!s.active);
            const createEl=s=>{const d=document.createElement('div');
                const totalPerc = ((s.stamina+s.water)/(INITIAL_STAMINA+INITIAL_WATER))*100;
                const bg = totalPerc>HIGH_STUDENT_RESOURCE_THRESHOLD_PERCENT?'bg-green-100':
                    (totalPerc<LOW_STUDENT_RESOURCE_THRESHOLD_PERCENT?'bg-red-100 opacity-75':'bg-yellow-100');
                d.className=`p-2 rounded-md shadow-sm flex items-center space-x-2 ${bg}`;
                const nameP=document.createElement('p');nameP.className=`font-semibold text-base flex-1 truncate ${
                    s.active?'text-green-800':'text-red-800'
                }`;nameP.textContent=s.name+(s.active?'':' (倒)');d.appendChild(nameP);
                // stamina bar
                const staDiv=document.createElement('div');staDiv.className='flex items-center text-xs w-[55px]';
                const staSpan=document.createElement('span');
                staSpan.className=`mr-1 w-5 text-right ${
                    s.stamina>(INITIAL_STAMINA*LOW_RESOURCE_THRESHOLD_RATIO)?'text-gray-700':'text-red-600 font-medium'
                }`;staSpan.textContent=s.stamina;staDiv.appendChild(staSpan);
                const staOut=document.createElement('div');staOut.className='flex-1 h-2 bg-gray-300 rounded-full';
                const staIn=document.createElement('div');
                const sPerc=Math.max(0,(s.stamina/INITIAL_STAMINA)*100);
                staIn.className=`h-full rounded-full ${
                    sPerc>HIGH_RESOURCE_THRESHOLD_RATIO*100?'bg-green-500':
                    (sPerc>LOW_RESOURCE_THRESHOLD_RATIO*100?'bg-yellow-400':'bg-red-500')
                }`;staIn.style.width=`${sPerc}%`;staOut.appendChild(staIn);staDiv.appendChild(staOut);d.appendChild(staDiv);
                // water bar
                const watDiv=document.createElement('div');watDiv.className='flex items-center text-xs w-[55px]';
                const watSpan=document.createElement('span');
                watSpan.className=`mr-1 w-5 text-right ${
                    s.water>(INITIAL_WATER*LOW_RESOURCE_THRESHOLD_RATIO)?'text-gray-700':'text-red-600 font-medium'
                }`;watSpan.textContent=s.water;watDiv.appendChild(watSpan);
                const watOut=document.createElement('div');watOut.className='flex-1 h-2 bg-gray-300 rounded-full';
                const watIn=document.createElement('div');
                const wPerc=Math.max(0,(s.water/INITIAL_WATER)*100);
                watIn.className=`h-full rounded-full ${
                    wPerc>HIGH_RESOURCE_THRESHOLD_RATIO*100?'bg-blue-500':
                    (wPerc>LOW_RESOURCE_THRESHOLD_RATIO*100?'bg-indigo-400':'bg-red-500')
                }`;watIn.style.width=`${wPerc}%`;watOut.appendChild(watIn);watDiv.appendChild(watOut);d.appendChild(watDiv);
                return d;
            };
            if (inactive.length) {
                const secA=document.createElement('div');secA.className='flex-1 overflow-y-auto mb-1 p-2 rounded bg-slate-100/50 custom-scrollbar';
                const h3A=document.createElement('h3');h3A.className='text-md font-medium text-green-700 mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-1 z-10 px-1';
                h3A.textContent=`💪 活躍同學 (${activeList.length})`;secA.appendChild(h3A);
                const cA=document.createElement('div');cA.className='space-y-1.5 pr-1';secA.appendChild(cA);
                activeList.sort((a,b)=> (a.stamina+a.water)-(b.stamina+b.water)).forEach(s=>cA.appendChild(createEl(s)));
                listArea.appendChild(secA);
                const secI=document.createElement('div');secI.className='flex-1 overflow-y-auto mt-1 p-2 rounded bg-slate-100/50 custom-scrollbar';
                const h3I=document.createElement('h3');h3I.className='text-md font-medium text-red-700 mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-1 z-10 px-1';
                h3I.textContent=`🤕 已倒下同學 (${inactive.length})`;secI.appendChild(h3I);
                const cI=document.createElement('div');cI.className='space-y-1.5 pr-1';secI.appendChild(cI);
                inactive.sort((a,b)=> (a.stamina+a.water)-(b.stamina+b.water)).forEach(s=>cI.appendChild(createEl(s)));
                listArea.appendChild(secI);
            } else {
                const sec=document.createElement('div');sec.className='flex-1 overflow-y-auto p-1 custom-scrollbar';
                const c=document.createElement('div');c.className='space-y-1.5 pr-1';
                activeList.sort((a,b)=>(a.stamina+a.water)-(b.stamina+b.water)).forEach(s=>c.appendChild(createEl(s)));
                sec.appendChild(c);listArea.appendChild(sec);
            }
        }
    }

    // 轉義正則用於老師名字
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // 格式化文字
    function formatTextWithStudentNames(text, numStudentsHint = 1) {
        const teacherRegex = new RegExp(escapeRegExp(teacherName), 'g');
        let ft = text.replace(teacherRegex, `<span class="text-gray-800 font-bold">${teacherName}</span>`);
        const hasS1 = ft.includes("[studentName1]");
        const hasS2 = ft.includes("[studentName2]");
        const hasS = ft.includes("[studentName]");
        let count = 0;
        if (hasS2) count = 2;
        else if (hasS1||hasS) count = 1;
        const names = getRandomStudentName(students, count);
        const n1 = names[0]||"某同學", n2 = names[1]||n1;
        const used = [];
        if (hasS1) { ft = ft.replace(/\[studentName1\]/g, `<span class="text-gray-800 font-semibold">${n1}</span>`); used.push(n1); }
        if (hasS2) { ft = ft.replace(/\[studentName2\]/g, `<span class="text-gray-800 font-semibold">${n2}</span>`); used.push(n2); }
        if (hasS)  { ft = ft.replace(/\[studentName\]/g, `<span class="text-gray-800 font-semibold">${n1}</span>`); used.push(n1); }
        return { formattedText: ft, namesUsed: [...new Set(used)] };
    }

    // 顯示照片解鎖通知
    function showPhotoUnlockNotification(photoPath, photoFilename, playSoundEffect = true) {
        unlockedPhotoImg.src = photoPath;
        unlockedPhotoName.textContent = photoFilename;
        photoUnlockPopup.classList.remove('hidden', 'opacity-0');
        photoUnlockPopup.classList.add('flex', 'opacity-100');
        if (playSoundEffect) playSound(audioItemPickup);
    }

    // 隱藏照片通知
    function hidePhotoUnlockNotification() {
        photoUnlockPopup.classList.remove('flex','opacity-100');
        photoUnlockPopup.classList.add('hidden','opacity-0');
        unlockedPhotoImg.src = "";
        unlockedPhotoName.textContent = "";
    }

    // 解鎖隨機照片
    function _unlockAndShowSpecificRandomPhoto() {
        const available = ALL_PHOTO_FILENAMES.filter(f => !unlockedPhotos.has(f));
        if (!available.length) return false;
        const pick = available[Math.floor(Math.random()*available.length)];
        unlockedPhotos.add(pick);
        showPhotoUnlockNotification(PHOTO_BASE_PATH+pick, pick);
        return true;
    }

    // 根據協作分數解鎖照片
    function checkAndUnlockPhotosBasedOnCollaboration() {
        const possible = Math.floor(totalCollaborationScore/POINTS_PER_PHOTO);
        const toUnlock = possible - photosUnlockedThisSession;
        for (let i=0;i<toUnlock;i++) {
            if (_unlockAndShowSpecificRandomPhoto()) photosUnlockedThisSession++;
            else break;
        }
    }

    // 顯示事件
    function displayEvent() {
        eventTextElem.innerHTML = "";
        optionsArea.innerHTML = "";
        if (!currentEventSequence[sequenceIndex]) {
            checkGameStatus();
            return;
        }
        if (sequenceIndex>0) {
            let anyF = false;
            students.forEach(s => {
                if (s.active) {
                    s.stamina = Math.max(0, s.stamina-PER_TURN_STAMINA_COST);
                    s.water = Math.max(0, s.water-PER_TURN_WATER_COST);
                    if (s.stamina===0||s.water===0) { s.active=false; anyF=true; }
                }
            });
            updateUI();
            if (!students.find(s=>s.active)) { checkGameStatus(); return; }
        }
        const evt = currentEventSequence[sequenceIndex];
        let numHint = evt.needsStudent?1:0;
        if (evt.text.includes("[studentName2]")) numHint=2;
        else if (evt.text.includes("[studentName]")) numHint=1;
        const res = formatTextWithStudentNames(evt.text, numHint);
        eventTextElem.innerHTML = res.formattedText;
        evt.options.forEach(opt=>{
            const btn=document.createElement('button');
            const optHint = opt.numStudents || (opt.text.includes("[studentName2]")?2:(opt.text.includes("[studentName1]")||opt.text.includes("[studentName]")?1:0));
            const optRes = formatTextWithStudentNames(opt.text,optHint);
            btn.innerHTML=optRes.formattedText;
            btn.className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:	scale-95 text-left";
            if (opt.requiredItem) {
                const reqs=[].concat(opt.requiredItem);
                const ok=reqs.every(k=>inventory[k]);
                if (!ok) {
                    btn.disabled=true; btn.classList.remove('bg-purple-500','hover:bg-purple-600'); btn.classList.add('bg-gray-400','cursor-not-allowed');
                    btn.innerHTML+=`<span class="text-xs italic opacity-80"> (缺少${ITEMS[reqs.find(k=>!inventory[k])].name})</span>`;
                } else {
                    btn.classList.add('bg-blue-500','hover:bg-blue-600');
                }
            }
            btn.onclick=()=>{
                playSound(audioClick);
                handleOption(opt,optRes.namesUsed);
            };
            optionsArea.appendChild(btn);
        });
        updateUI();
    }

    // 處理選項
    function handleOption(opt,namesUsed){
        playSound(audioClick);
        eventTextElem.innerHTML="";
        // 消耗物品
        if (opt.requiredItem && opt.consumeItem) {
            [].concat(opt.requiredItem).forEach(k=>inventory[k]=false);
        }
        // 獲得物品
        if (opt.giveItem) {
            opt.giveItem.forEach(k=>{
                inventory[k]=true;
                if (k==='waterBottle') {
                    let stu = students.find(s=>s.name===namesUsed[0]&&s.active)
                           || students.filter(s=>s.active)[Math.floor(Math.random()*students.filter(s=>s.active).length)];
                    if (stu) {
                        stu.water = Math.min(INITIAL_WATER, stu.water+WATER_BOTTLE_RECOVERY_AMOUNT);
                    }
                }
                const el=document.getElementById(ITEMS[k].id);
                if (el) { el.classList.add('animate-pulse-item'); setTimeout(()=>el.classList.remove('animate-pulse-item'),ITEM_PULSE_ANIMATION_MS); }
            });
        }
        // 計算影響對象及狀態變更...
        let outRes=formatTextWithStudentNames(opt.outcomeText,
            opt.numStudents||(opt.outcomeText.includes("[studentName2]")?2:(opt.outcomeText.includes("[studentName1]")||opt.outcomeText.includes("[studentName]")?1:0))
        );
        let msg=outRes.formattedText;
        // 協作分數
        if (opt.collaborationPointsAwarded) totalCollaborationScore+=opt.collaborationPointsAwarded;
        // 播放音效
        if (opt.staminaChange>0||opt.waterChange>0) { eventTextElem.classList.add('animate-bounce-text'); playSound(audioPositive); }
        else if (opt.staminaChange<0||opt.waterChange<0) { eventTextElem.classList.add('animate-shake-text'); playSound(audioNegative); }
        eventTextElem.innerHTML=msg;
        updateUI();
        Array.from(optionsArea.children).forEach(b=>b.disabled=true);
        if (opt.giveItem&&opt.giveItem.length) playSound(audioItemPickup);
        setTimeout(()=>{
            sequenceIndex++;
            const over=checkGameStatus();
            if (!over) { checkAndUnlockPhotosBasedOnCollaboration(); displayEvent(); }
        }, OUTCOME_DISPLAY_DURATION_MS);
    }

    // 檢查遊戲狀態
    function checkGameStatus(){
        const alive = students.filter(s=>s.active).length;
        if (!alive) {
            playSound(audioGameLose);
            showPopup("挑戰失敗！😭", `所有同學都已精疲力盡或脫水！${teacherName}和同學們無法繼續前進…`);
            return true;
        }
        if (sequenceIndex>=currentEventSequence.length) {
            playSound(audioGameWin);
            showPhotoUnlockNotification(PHOTO_BASE_PATH+"end.jpg","通關紀念！",false);
            closePhotoPopupButton.addEventListener('click',()=>{
                hidePhotoUnlockNotification();
                let survivors = students.filter(s=>s.active).map(s=>s.name).join("、");
                if (students.filter(s=>s.active).length===students.length) survivors="六年四班全體同學";
                showPopup("恭喜過關！🏆", `${teacherName}和 ${survivors} 成功登上山頂！這就是團結、智慧與堅持的力量！🎉`);
            },{once:true});
            return true;
        }
        return false;
    }

    // 顯示結束/勝利彈窗
    function showPopup(title,message){
        const rgx=new RegExp(escapeRegExp(teacherName),'g');
        const fm=message.replace(rgx,`<span class="text-emerald-700 font-bold">${teacherName}</span>`);
        popupTitleElem.textContent=title;
        popupMessageElem.innerHTML=fm;
        gameOverPopup.classList.remove('hidden','opacity-0');
        gameOverPopup.classList.add('opacity-100');
        popupContent.classList.remove('scale-90','opacity-0');
        popupContent.classList.add('scale-100','opacity-100');
    }

    // 重置遊戲
    function resetGame(){
        initializeStudentStats();
        initializeInventory();
        initializeEventSequence();
        totalCollaborationScore=0;
        photosUnlockedThisSession=0;
        unlockedPhotos.clear();
        gameOverPopup.classList.add('hidden','opacity-0');
        popupContent.classList.add('scale-90','opacity-0');
        updateUI();
        displayEvent();
    }

    // 事件監聽
    startButton.addEventListener('click',()=>{
        playSound(audioClick);
        welcomeScreen.classList.add('hidden');
        gamePlayScreen.classList.remove('hidden');
        initializeStudentStats();
        initializeEventSequence();
        updateUI();
        displayEvent();
    });
    restartButtonPopup.addEventListener('click',()=>{
        playSound(audioClick);
        resetGame();
    });
    if (closePhotoPopupButton) closePhotoPopupButton.addEventListener('click',hidePhotoUnlockNotification);

    // 首次 UI 更新
    updateUI();

})(); // IIFE End

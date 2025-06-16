(function() { // IIFE Start
    // 遊戲變數初始化
    const INITIAL_STAMINA = 45; // 全班共享體力值上限及初始值
    const INITIAL_WATER = 30; // 全班共享水分值上限及初始值
    const PER_TURN_STAMINA_COST = 3; // 每回合固定消耗體力
    const PER_TURN_WATER_COST = 2;   // 每回合固定消耗水分 (per active student)

    const teacherName = "賴冠儒老師"; // 老師的名字
    // 六年四班的學生名單
    const studentNames = [
        "蔡宥丞", "蔡羽恩", "陳湘晴", "陳芊錡", "陳楷恩", "江芊妏", "賴玧樂", "廖予謙",
        "林泓佑", "林書玉", "林瑋琦", "李承宥", "劉苪希", "彭唯", "潘祐丞", "許翔淏",
        "徐翊庭", "謝從偉", "吳宥珈", "王懸", "王品勛", "黃宜潔", "黃保慈", "黃馨恩",
        "黃郁晴", "黃志懿", "張辰煥", "周宇桐"
    ];

    let students = [];
    let sequenceIndex = 0; // 當前事件在序列中的索引

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
            filenames.push(`photo_${String(i).padStart(3, '0')}.jpg`);
        }
        return filenames;
    }
    const ALL_PHOTO_FILENAMES = generatePhotoFilenames(204); // 生成 photo_001.jpg 到 photo_204.jpg
    let unlockedPhotos = new Set(); // 用來儲存已解鎖照片的識別碼
    let totalCollaborationScore = 0; // 新增：全班協作總分
    let photosUnlockedThisSession = 0; // 新增：本局遊戲已透過協作解鎖的照片數量
    const POINTS_PER_PHOTO = 10; // 修改：每解鎖一張照片所需的協作點數 (調整為10)

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
    const outcomeTextElem = document.getElementById('outcomeText');
    const optionsArea = document.getElementById('optionsArea');
    const gameOverPopup = document.getElementById('gameOverPopup');
    const popupTitleElem = document.getElementById('popupTitle');
    const popupMessageElem = document.getElementById('popupMessage');
    const restartButtonPopup = document.getElementById('restartButtonPopup');
    // const studentListContainer = document.getElementById('studentListContainer'); // 將由 updateUI 動態管理
    const popupContent = document.getElementById('popupContent');

    // 照片解鎖彈出視窗 UI 元素
    const photoUnlockPopup = document.getElementById('photoUnlockPopup');
    const unlockedPhotoImg = document.getElementById('unlockedPhotoImg');
    const unlockedPhotoName = document.getElementById('unlockedPhotoName');
    const closePhotoPopupButton = document.getElementById('closePhotoPopupButton');

    // 音效元素獲取 (假設這些 ID 存在於 HTML 中)
    const audioClick = document.getElementById('audioClick');
    const audioPositive = document.getElementById('audioPositive');
    const audioNegative = document.getElementById('audioNegative');
    const audioItemPickup = document.getElementById('audioItemPickup');
    const audioGameWin = document.getElementById('audioGameWin');
    const audioGameLose = document.getElementById('audioGameLose');

    // 物品欄顯示元素 (動態獲取或預先存儲)
    const itemDisplayElements = {};
    for (const key in ITEMS) {
        itemDisplayElements[key] = document.getElementById(ITEMS[key].id);
    }

    // 遊戲事件資料庫，按階段分類
    // (事件資料庫內容與之前相同，此處省略以節省篇幅，實際應包含所有事件)
    const eventsByStage = {
        "intro": [
            {
                stage: "山腳下的迷霧森林 🌳",
                text: `各位六年四班的勇士們，我是你們的導師 ${teacherName}，準備好了嗎？前方就是傳說中的『智慧之山』！💪`,
                options: [{ text: "開始我們的旅程！🚀", staminaChange: 0, waterChange: 0, outcomeText: `${teacherName}：「同學們，我們的目標是山頂！記住，團結就是力量！」😊` }]
            }
        ],
        "forest": [
            // 迷路類事件
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "突然，前方小徑被濃霧籠罩，出現了兩條岔路。該走哪條呢？🌫️",
                options: [
                    { text: `跟隨 ${teacherName}，走看起來比較穩重的那條路。😎`, staminaChange: -5, waterChange: -3, outcomeText: `${teacherName} 帶大家沉著應對，成功走出迷霧。👏 但每個人都走了些冤枉路。`, effectScope: 'all_active' },
                    { text: "讓 [studentName] 帶頭走那條看起來有蝴蝶🦋的路！", staminaChange: -20, waterChange: -8, outcomeText: `哎呀！[studentName] 帶大家繞了一大圈，還差點踩到泥坑！💦 [studentName] 的體力水分都下降了！[studentName]：「我肚子好餓喔…」` },
                    { text: "拿出地圖🗺️，仔細比對路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示這條路是捷徑！大家輕鬆通過，體力小幅恢復。`, requiredItem: 'map', consumeItem: 'map' }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "周圍的樹木長得一模一樣，大家感覺迷失了方向！🔄",
                options: [
                    { text: "原地等待，或許能找到線索。", staminaChange: -10, waterChange: -5, outcomeText: `原地等待耗費了大家的時間和體力，每個人都感到更加焦慮。`, effectScope: 'all_active' },
                    { text: "拿出地圖🗺️，嘗試辨別方向。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰地顯示了正確的路線！大家重新找到方向，精神一振！`, requiredItem: 'map', consumeItem: 'map', effectScope: 'all_active' }
                ]
            },
            // 食物/資源類事件
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "路邊發現一棵結滿紅色果實的樹，看起來很誘人。要吃嗎？🍎",
                options: [
                    { text: "雖然看起來好吃，但野外的東西還是別亂吃比較好。🙅‍♀️", staminaChange: 0, waterChange: 0, outcomeText: `${teacherName}：「做得好同學們，野外求生知識很重要！」👍` },
                    { text: "哇！看起來好美味！讓 [studentName1] 和 [studentName2] 快去摘來吃！😋", numStudents: 2, staminaChange: -25, waterChange: -10, outcomeText: `[studentName1] 和 [studentName2] 開心地吃了起來，結果肚子痛得哇哇叫！😫 他們的體力水分大減！(附帶搞笑音效：噗嚕噗嚕) [studentName1]：「我好想回家上廁所喔…」` },
                    { text: "使用急救包🩹，分析果實是否有毒！", staminaChange: 5, waterChange: 0, outcomeText: `急救包中的檢測工具顯示果實有毒！幸好沒有吃，使用急救包的同學還因此恢復了一些精神！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' } // Assuming the one using the kit gets a small boost
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "灌木叢中隱約看見一個閃閃發光的寶箱！要打開嗎？📦✨",
                options: [
                    { text: "小心翼翼地打開寶箱，看看裡面有什麼。", staminaChange: 10, waterChange: 5, outcomeText: `寶箱裡裝滿了能量棒🍫和一瓶清涼的山泉水💧！真是意外之喜！發現寶箱的同學精神一振！${teacherName}：「看來冒險還是有回報的！」`, giveItem: ['energyBar', 'waterBottle'], collaborationPointsAwarded: 5, effectScope: 'all_active' }, // 獎勵協作分數
                    { text: "寶箱可能有陷阱！還是別碰比較好。", staminaChange: -5, waterChange: 0, outcomeText: `寶箱消失了。什麼都沒發生，但大家有點失望。😶` }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "走著走著，發現路邊有一個遺落的背包🎒！裡面似乎有東西。",
                options: [
                    { text: "打開背包，看看裡面是什麼。", staminaChange: 8, waterChange: 5, outcomeText: `背包裡有零食🍪和一張舊地圖🗺️！發現的同學感到很幸運！`, giveItem: ['snack', 'map'] },
                    { text: "不拿別人的東西，繼續趕路。", staminaChange: -2, waterChange: 0, outcomeText: `大家繼續前進，沒有理會遺落的背包。`, effectScope: 'all_active'}
                ]
            },
            // 動物/自然類事件
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "一群調皮的猴子🐒突然跳出來，對著大家吱吱叫，還想搶走 [studentName] 的背包！",
                options: [
                    { text: "趕快大聲驅趕猴子！🗣️", staminaChange: -12, waterChange: -5, outcomeText: `猴子嚇了一跳跑掉了，但 [studentName] 和幫忙驅趕的同學也因此耗費了點力氣。💦`, collaborationPointsAwarded: 2 }, // 獎勵協作分數
                    { text: "拿出零食🍪丟給猴子，分散牠們的注意力。", staminaChange: 8, waterChange: 0, outcomeText: `猴子們開心地吃著零食，大家趁機溜走了！😇 使用零食的 [studentName] 感到輕鬆不少，全班同學也鬆了一口氣！`, requiredItem: 'snack', consumeItem: 'snack', collaborationPointsAwarded: 5, effectScope: 'all_active' } // 獎勵協作分數
                ],
                needsStudent: true
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "森林深處傳來一陣奇特的聲音，好像有什麼在呼喚…會是寶藏還是危險？🤔",
                options: [
                    { text: "跟隨聲音，一探究竟！🕵️‍♀️", staminaChange: 12, waterChange: 8, outcomeText: `原來是一處清澈的隱藏山泉💧，大家喝了口泉水，精神為之一振！每個人的體力水分都增加了！`, effectScope: 'all_active' },
                    { text: "安全為上，不要理會，繼續前進。🚶‍♂️", staminaChange: -3, waterChange: -2, outcomeText: `聲音漸漸消失了，大家繼續前進。沒有任何變化，但每個人都有點口渴。`, effectScope: 'all_active' }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "一條毒蛇🐍突然從草叢中竄出，擋住了去路！",
                options: [
                    { text: "大聲叫喊，試圖嚇跑牠。", staminaChange: -12, waterChange: -5, outcomeText: `毒蛇只是縮了一下，然後更加 агрессивно。在場的同學嚇得體力下降。` }, // Affects those nearby or who shouted
                    { text: "使用驅蟲劑🧴，嘗試驅趕牠。", staminaChange: 8, waterChange: 0, outcomeText: `驅蟲劑的特殊氣味讓毒蛇感到不適，牠迅速溜走了！使用驅蟲劑的同學鬆了一口氣。`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "一隻小動物被捕獸夾困住了，發出痛苦的哀嚎。救還是不救？🥺",
                options: [
                    { text: "小心地解救小動物。❤️", staminaChange: -15, waterChange: -8, outcomeText: `雖然耗費了體力，但成功解救了小動物，參與救援的同學感到非常欣慰。`, collaborationPointsAwarded: 3 },
                    { text: "使用急救包🩹，為小動物處理傷口後放生。", staminaChange: 10, waterChange: 0, outcomeText: `小動物感激地離開，你們的善舉讓參與的同學士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit', collaborationPointsAwarded: 8 }
                ]
            },
            // 環境/地形類事件
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "一棵巨大的古樹🌳被茂密的藤蔓纏繞，似乎擋住了某些東西。藤蔓縫隙間隱約閃爍著光芒！",
                options: [
                    { text: "合力撥開藤蔓，看看裡面有什麼！", staminaChange: -15, waterChange: -5, outcomeText: `參與的同學費力地撥開藤蔓，找到了一瓶驅蟲劑🧴！但他們也累壞了。`, giveItem: ['insectRepellent'] },
                    { text: "使用求生繩索🎗️，試圖拉開藤蔓。", staminaChange: 8, waterChange: 0, outcomeText: `用繩索巧妙地拉開藤蔓，發現裡面藏著一個急救包🩹！使用繩索的同學感到很得意。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', giveItem: ['firstAidKit'] }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "前方出現一片茂密的荊棘林，寸步難行。尖銳的刺讓人望而卻步！🌵",
                options: [
                    { text: "小心翼翼地穿過，避免被刺傷。", staminaChange: -15, waterChange: -7, outcomeText: `大家小心通過，雖然沒受傷，但每個人的體力水分都消耗不少。`, effectScope: 'all_active' },
                    { text: "使用求生繩索🎗️，試圖綁開一條路。", staminaChange: 5, waterChange: 0, outcomeText: `用繩索巧妙地撥開荊棘，開闢了安全通道！使用繩索的同學體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
                ]
            },
            // 天氣/搞笑類事件
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "天空突然烏雲密布，一陣雷陣雨⛈️傾盆而下！",
                options: [
                    { text: "趕快找地方避雨！☔", staminaChange: -10, waterChange: -10, outcomeText: `大家躲在樹下，雖然沒被淋濕，但每個人的時間和體力都消耗了。`, effectScope: 'all_active' },
                    { text: "穿上雨衣，繼續冒險！🏃‍♀️", staminaChange: -15, waterChange: -8, outcomeText: `雖然有雨衣，但在雨中行進非常耗費每個人的體力！`, effectScope: 'all_active' }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: "突然，一隻頑皮的松鼠🐿️跳出來，搶走了[studentName]的零食🍪！",
                options: [
                    { text: "算了，讓牠吃吧！大家看著松鼠搞笑的樣子，都笑了。😂", staminaChange: 2, waterChange: 0, outcomeText: `大家哄堂大笑！😂 全班同學精神愉悅，體力+2！[studentName]表示：「我的零食啦！🍪」`, needsStudent: true, effectScope: 'all_active' }
                ]
            },
            {
                stage: "山腳下的迷霧森林 🌳",
                text: `${teacherName}突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
                options: [
                    { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班同學體力小幅增加！`, effectScope: 'all_active' }
                ]
            },
            // 教育任務
            {
                stage: "山腳下的迷霧森林 🌳",
                text: `${teacherName}：「同學們，如果我們沒有地圖，在森林裡該如何辨識方向呢？」🤔`,
                options: [
                    { text: "看太陽的方向。☀️", staminaChange: 8, waterChange: 0, outcomeText: `正確！${teacherName}點頭稱讚，大家學到了一課，精神為之一振！`, effectScope: 'all_active' },
                    { text: "看哪邊樹比較多。", staminaChange: -5, waterChange: -3, outcomeText: `嗯…這個方法不太可靠喔！${teacherName}搖了搖頭，大家的體力微減。`, effectScope: 'all_active' }
                ]
            },
             {
                stage: "山腳下的迷霧森林 🌳",
                text: `${teacherName}：「在野外看到不認識的植物，我們應該怎麼做？」🌿`,
                options: [
                    { text: "不隨意觸摸或採摘。🙅‍♀️", staminaChange: 5, waterChange: 0, outcomeText: `正確！${teacherName}稱讚你們謹慎的態度！`, effectScope: 'all_active' },
                    { text: "先聞聞看有沒有毒。", staminaChange: -8, waterChange: -3, outcomeText: `這個方法很危險！${teacherName}提醒大家不要輕易嘗試。`, effectScope: 'all_active' }
                ]
            }
        ],
        "path": [
            // 路線/地形類事件
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "前方小徑變得濕滑，有一段狹窄的碎石路。怎麼辦？⚠️",
                options: [
                    { text: "大家小心翼翼地走，互相扶持。", staminaChange: -8, waterChange: -5, outcomeText: `大家互相幫助，成功通過濕滑路段。🤝 但每個人的體力水分都消耗不小。`, effectScope: 'all_active' },
                    { text: "讓 [studentName] 先衝過去探路！", staminaChange: -18, waterChange: -10, outcomeText: `[studentName] 雖然很勇敢，但不小心滑了一跤，膝蓋擦傷了！😩 [studentName] 的體力水分下降了！` },
                    { text: "使用急救包🩹處理 [studentName] 的擦傷，並協助通過！", staminaChange: 10, waterChange: 0, outcomeText: `[studentName] 的傷口得到及時處理，使用急救包的同學和 [studentName] 士氣大振，順利通過！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' } // Affects student using kit and the injured
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "前方突然出現一棵倒塌的大樹🪵，擋住了整條路！怎麼辦？",
                options: [
                    { text: "全班一起合作，試著把樹枝推開！💪", staminaChange: -10, waterChange: -7, outcomeText: `大家齊心協力，雖然每個人都費了些力氣，但成功清開了道路！🤝`, collaborationPointsAwarded: 10, effectScope: 'all_active' },
                    { text: "找找看有沒有繞道的小路。迂迴而行。", staminaChange: -12, waterChange: -8, outcomeText: `雖然繞過了倒樹，但多走了不少冤枉路，每個人的體力水分都消耗不少。😅`, effectScope: 'all_active' },
                    { text: "使用求生繩索🎗️，嘗試固定大樹，開闢安全通道。", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索巧妙地固定住大樹，大家安全通過！使用繩索的同學省下了不少力氣。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "一條湍急的河流擋住了去路！河水看起來很深，沒有橋。🌊",
                options: [
                    { text: "尋找淺水處，小心涉水過河。", staminaChange: -20, waterChange: -15, outcomeText: `大家小心翼翼地過河，雖然沒有危險，但被冰冷的河水凍得每個人的體力水分大減。🥶`, effectScope: 'all_active' },
                    { text: "使用求生繩索🎗️，搭建臨時的過河通道！", staminaChange: 12, waterChange: 0, outcomeText: `利用繩索成功搭建了安全通道，大家輕鬆過河！使用繩索的同學體力甚至有所恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', collaborationPointsAwarded: 8 }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "前方是萬丈深淵的斷崖！唯一的路徑是一條搖搖欲墜的吊橋。🌉",
                options: [
                    { text: "小心通過吊橋。", staminaChange: -22, waterChange: -12, outcomeText: `大家膽戰心驚地通過了吊橋，每個人的體力水分都消耗巨大。`, effectScope: 'all_active' },
                    { text: "使用求生繩索🎗️，加固吊橋後再通過！", staminaChange: 15, waterChange: 0, outcomeText: `用繩索加固了吊橋，大家安全且快速地通過了斷崖！使用繩索的同學感到很自豪。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "前方出現一條岔路，一邊通往平靜的湖泊🏞️，另一邊則是沿著陡峭山脊的山路⛰️。",
                options: [
                    { text: "選擇湖泊路線，或許能找到水源。", staminaChange: -5, waterChange: 10, outcomeText: `湖泊風光秀麗，大家補充了水瓶，但路徑稍微遠了一點。每個人的體力略降，水分增加。`, giveItem: ['waterBottle'], effectScope: 'all_active' },
                    { text: "選擇山脊路線，路程較短但崎嶇。", staminaChange: -10, waterChange: -5, outcomeText: `山脊路線雖然崎嶇，但確實縮短了路程，只是消耗了每個人的更多體力。`, effectScope: 'all_active' }
                ]
            },
            // 動物/威脅類事件
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "突然，一隻大野豬🐗衝了出來，擋住去路！",
                options: [
                    { text: "大家手牽手，小聲地繞過去，不要驚動牠。🤫", staminaChange: 5, waterChange: -2, outcomeText: `成功的避開了野豬，全員安全通過。😊 但每個人都費了點時間和水分。`, effectScope: 'all_active' },
                    { text: "讓 [studentName]，你是班上跑最快的！快衝過去嚇跑牠！💨", staminaChange: -25, waterChange: -12, outcomeText: `[studentName] 雖然跑得快，但野豬也不是省油的燈！追得 [studentName] 和附近的同學氣喘吁吁！🥵 他們的體力水分大減！[studentName]：「我快喘不過氣了！」` },
                    { text: "丟出能量棒🍫引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野豬被能量棒吸引，大家趁機溜走！丟能量棒的同學感到機智。`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "一股巨大的嗡嗡聲傳來，一大群惱人的蚊蟲🐝正朝著大家飛來！",
                options: [
                    { text: "拿出驅蟲劑🧴噴灑，快速驅散牠們！", staminaChange: 5, waterChange: 0, outcomeText: `防蚊液有效！蚊蟲被驅散，大家鬆了口氣，使用驅蟲劑的同學體力小幅恢復。😌`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' },
                    { text: "瘋狂揮舞雙手，試圖趕走牠們！👋", staminaChange: -18, waterChange: -8, outcomeText: `蚊蟲還是叮了不少包，揮手的同學又癢又累，體力水分下降。😩 [studentName]：「我的手好痠啊！」` }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "一聲低沉的咆哮聲傳來，一隻飢餓的野獸🐻出現在前方！",
                options: [
                    { text: "迅速躲藏，避免衝突。", staminaChange: -18, waterChange: -10, outcomeText: `大家躲過了野獸，但每個人的精神都很緊張，體力水分下降。`, effectScope: 'all_active' },
                    { text: "丟出零食🍪引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野獸被零食吸引，大家趁機溜走！丟零食的同學鬆了口氣。`, requiredItem: 'snack', consumeItem: 'snack' }
                ]
            },
            // 資源/環境類事件
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "太陽高掛，烈日炎炎☀️！大家感到口乾舌燥，體力消耗加快。",
                options: [
                    { text: "趕快找陰涼處休息，補充水分。", staminaChange: -8, waterChange: 10, outcomeText: `大家找到一片陰涼，補充了水分，精神恢復不少，但耽誤了時間。每個人的體力略降，水分增加。`, giveItem: ['waterBottle'], effectScope: 'all_active' },
                    { text: "忍著口渴繼續趕路！", staminaChange: -15, waterChange: -15, outcomeText: `硬撐著趕路讓每個人的體力水分都快速流失。😩`, effectScope: 'all_active' },
                    { text: "使用水瓶💧補充水分。", staminaChange: 5, waterChange: 15, outcomeText: `喝了水瓶裡的水，使用水瓶的同學瞬間感到清涼舒暢，體力水分都有恢復！`, requiredItem: 'waterBottle', consumeItem: 'waterBottle' }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: "走進一個幽靜的山谷，突然聽到奇怪的迴音，似乎有什麼東西在附近。🏞️",
                options: [
                    { text: "小心探索，看是否能發現什麼。", staminaChange: 5, waterChange: 8, outcomeText: `發現了一處隱蔽的泉眼，補充了水瓶！探索的同學體力也小幅恢復。`, giveItem: ['waterBottle'] },
                    { text: "快速通過，避免不必要的麻煩。", staminaChange: -5, waterChange: -2, outcomeText: `大家加快腳步，快速通過山谷。沒有發生特別的事情。`, effectScope: 'all_active' }
                ]
            },
            // 教育任務
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: `一位老山神📚現身，祂說：「想通過此路，需回答我的問題！」${teacherName}：「同學們，這是考驗我們智慧的時候！」`,
                options: [
                    { text: `${teacherName}：「請問六年四班總共有幾位同學？」(答28)`, staminaChange: 15, waterChange: 5, outcomeText: `答案是28位同學！山神點頭稱讚，並贈予清涼山泉！✨ 全班同學體力水分增加！`, collaborationPointsAwarded: 10, effectScope: 'all_active' },
                    { text: `${teacherName}：「在野外食物中毒，第一時間該怎麼辦？」(答催吐/求助)`, staminaChange: 15, waterChange: 5, outcomeText: `正確答案是催吐並尋求幫助！山神滿意點頭，贈予補給品！✨ 全班同學體力水分增加！`, effectScope: 'all_active' },
                    { text: `${teacherName}：「野外迷路時，看到什麼不該碰？」(答毒菇/奇怪的果實)`, staminaChange: 15, waterChange: 5, outcomeText: `正確！遠離不明動植物是野外求生基本原則！山神贈予補給！✨ 全班同學體力水分增加！`, effectScope: 'all_active' },
                    { text: "隨便猜一個！", staminaChange: -20, waterChange: -10, outcomeText: `答錯了…山神嘆了口氣，給了大家一個小小的懲罰。😔 全班同學體力水分下降！某同學：「下次要好好讀書了！」`, effectScope: 'all_active' }
                ]
            },
            {
                stage: "蜿蜒的山腰小徑 🚶‍♀️",
                text: `${teacherName}：「同學們，在野外如何最有效地節約水資源呢？」🤔`,
                options: [
                    { text: "避免劇烈運動，減少出汗。", staminaChange: 5, waterChange: 0, outcomeText: `正確！${teacherName}點頭，大家學到寶貴一課，體力小幅恢復！`, effectScope: 'all_active' },
                    { text: "少量多次飲用。", staminaChange: 5, waterChange: 0, outcomeText: `正確！這有助於身體吸收水分！`, effectScope: 'all_active' },
                    { text: "直接喝池塘水。", staminaChange: -15, waterChange: -10, outcomeText: `錯！池塘水可能有寄生蟲或細菌，非常危險！大家的體力水分下降！`, effectScope: 'all_active' }
                ]
            }
        ],
        "slope": [
            // 路線/地形類事件
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "攀爬時，一段老舊的繩索⛓️突然出現裂痕！該怎麼辦？",
                options: [
                    { text: `不要慌！讓 ${teacherName} 指導，大家小心地一步一步通過。`, staminaChange: -10, waterChange: -5, outcomeText: `${teacherName} 冷靜指揮，大家互相扶持，成功克服難關。💪 但每個人的精力都耗費不少。`, effectScope: 'all_active' },
                    { text: "別怕！[studentName] 你力氣最大，抓緊繩子，我們一起衝過去！", staminaChange: -35, waterChange: -18, outcomeText: `繩索不堪重負，斷裂了！雖然沒人受傷，但大家嚇出了一身冷汗，並花費更多時間繞道。😱 [studentName] 和附近的同學體力水分大減！[studentName]：「我的心臟快跳出來了！」` }, // Affects involved
                    { text: "使用求生繩索🎗️加固，確保安全！", staminaChange: 15, waterChange: 0, outcomeText: `利用結實的求生繩索加固了老舊的繩子，大家安全無虞地攀爬，使用繩索的同學體力大幅恢復！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "前方出現了一段幾乎垂直的岩壁，看起來非常難以攀爬！😨",
                options: [
                    { text: `仔細規劃路線，利用 ${teacherName} 教的攀爬技巧。`, staminaChange: -20, waterChange: -10, outcomeText: `大家憑藉著毅力和聰明才智，一步步克服了岩壁！🙌 但每個人的體力水分都消耗不小！`, effectScope: 'all_active' },
                    { text: "試圖強行突破，看看能不能爬上去！", staminaChange: -30, waterChange: -15, outcomeText: `嘗試強攻岩壁失敗，反而耗費了大量體力水分，還差點有人受傷！😬 參與強攻的同學尤其疲憊。` },
                    { text: "吃下能量棒🍫，補充體力再攀爬！", staminaChange: 12, waterChange: 0, outcomeText: `能量棒讓吃下的同學精神大振！攀爬變得輕鬆許多，體力大幅恢復。`, requiredItem: 'energyBar', consumeItem: 'energyBar' },
                    { text: "使用求生繩索🎗️，搭建臨時攀爬點！", staminaChange: 15, waterChange: 0, outcomeText: `利用繩索，大家迅速建立了安全攀爬點，輕鬆通過！使用繩索的同學感到非常有用。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', collaborationPointsAwarded: 8 }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "前方一處看似穩固的峭壁突然開始崩塌！腳下碎石滾落，情況危急！🚧",
                options: [
                    { text: "迅速判斷，找到最安全的跳躍點！🏃‍♀️", staminaChange: -25, waterChange: -12, outcomeText: `大家驚險地跳了過去，雖然成功但每個人的體力水分都耗費不少，心跳加速！`, effectScope: 'all_active' },
                    { text: "拿出求生繩索🎗️，快速固定並滑下！", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索，大家有條不紊地通過了崩塌區，安全又省力！使用繩索的同學體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' },
                    { text: "打開地圖🗺️，尋找是否有其他安全通道。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰標示了一條隱蔽的山路，成功避開了崩塌區！查看地圖的同學感到欣慰。`, requiredItem: 'map', consumeItem: 'map' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "聽到前方傳來隆隆聲，似乎有滑坡的跡象！必須立刻做出反應！",
                options: [
                    { text: "快速尋找掩蔽物躲藏！", staminaChange: -18, waterChange: -8, outcomeText: `大家雖然躲開了滑坡，但過程驚險，每個人的體力水分都耗費了大量。`, effectScope: 'all_active' },
                    { text: "利用地圖🗺️，尋找安全繞行路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示了一條隱蔽且安全的繞行小路，大家順利避開了危險！查看地圖的同學鬆了口氣。`, requiredItem: 'map', consumeItem: 'map' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "路旁出現一個深不見底的漆黑洞穴，裡面傳來陣陣陰冷的風。🦇",
                options: [
                    { text: "好奇心驅使，進去看看！🔦", staminaChange: -15, waterChange: -8, outcomeText: `洞穴深處什麼都沒有，只讓進去的同學感到一陣陰森，並消耗了體力水分。` },
                    { text: "使用求生繩索🎗️，探索洞穴深處，或許有寶藏？", staminaChange: 10, waterChange: 5, outcomeText: `利用繩索探索，意外發現了一處寶藏，裡面有額外的能量棒和水！探索的同學精神大振。`, requiredItem: 'survivalRope', giveItem: ['energyBar', 'waterBottle'] },
                    { text: "使用急救包🩹，測試洞穴內的空氣是否安全！", staminaChange: 5, waterChange: 0, outcomeText: `急救包的儀器顯示洞穴空氣無毒，但太深了不適合深入。使用急救包的同學發現了一瓶驅蟲劑！`, requiredItem: 'firstAidKit', giveItem: ['insectRepellent'] }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "前方又出現了一條新的岔路，一邊是沿著瀑布的濕滑小徑💦，另一邊是直接穿越懸崖的峭壁⛰️。",
                options: [
                    { text: "選擇瀑布小徑，或許風景不錯。", staminaChange: -10, waterChange: -5, outcomeText: `瀑布小徑濕滑難行，雖然風景優美，但每個人的體力水分都消耗不少。`, effectScope: 'all_active' },
                    { text: "選擇懸崖峭壁，看起來更直接。", staminaChange: -15, waterChange: -8, outcomeText: `懸崖峭壁雖然直接，但非常陡峭，需要耗費每個人的更多體力！`, effectScope: 'all_active' },
                    { text: "使用地圖🗺️，看看哪條路更安全或有隱藏好處。", staminaChange: 5, waterChange: 0, outcomeText: `地圖顯示懸崖峭壁後有一處避風港，大家決定走峭壁！查看地圖的同學感到安心。`, requiredItem: 'map', consumeItem: 'map' }
                ]
            },
            // 動物/威脅類事件
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "一隻巨大的野熊🐻‍❄️攔在路上，看起來非常飢餓且具有攻擊性！",
                options: [
                    { text: "丟出能量棒🍫，吸引牠的注意力並逃跑！", staminaChange: -15, waterChange: -10, outcomeText: `野熊被能量棒吸引，大家趁機迅速逃離！丟能量棒的同學感到緊張，但成功了。`, requiredItem: 'energyBar', consumeItem: 'energyBar' }, // Affects the student who threw it
                    { text: "嘗試繞道，但路徑非常危險。", staminaChange: -25, waterChange: -15, outcomeText: `繞道過程驚險萬分，耗費了每個人的巨大體力水分。`, effectScope: 'all_active' }
                ]
            },
            // 資源/環境類事件
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "天氣驟變！一場突如其來的暴風雪❄️開始席捲山坡，能見度極低，氣溫驟降！",
                options: [
                    { text: "盡快找地方避風雪，等待天氣好轉。", staminaChange: -30, waterChange: -15, outcomeText: `大家躲在岩石後，雖然避開了最猛烈的風雪，但寒冷和恐懼仍讓每個人的體力水分快速流失。🥶`, effectScope: 'all_active' },
                    { text: "打開地圖🗺️，嘗試尋找最近的避難小屋！", staminaChange: 8, waterChange: 0, outcomeText: `地圖上標示著一處隱蔽的避難小屋！大家成功躲進小屋，避免了最糟糕的情況。查看地圖的同學立了大功。`, requiredItem: 'map', consumeItem: 'map' },
                    { text: "吃下能量棒🍫，補充體力抵禦寒冷。", staminaChange: 10, waterChange: 0, outcomeText: `能量棒讓吃下的同學身體發熱，暫時抵禦了嚴寒！`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "遇到一位同樣在爬山，但嚴重脫水的老爺爺！他看起來非常虛弱。👴💧",
                options: [
                    { text: "將水瓶💧裡的水分給老爺爺。", staminaChange: -5, waterChange: -20, outcomeText: `老爺爺恢復了精神，並感謝你們！分享水瓶的同學雖然水分大減，但助人為樂讓其心靈得到慰藉。😊`, requiredItem: 'waterBottle', consumeItem: 'waterBottle', collaborationPointsAwarded: 10 },
                    { text: "很抱歉，我們的水也不多了…", staminaChange: -10, waterChange: 0, outcomeText: `老爺爺無奈地離開，大家感到一陣內疚，每個人的體力都微幅下降。😔`, effectScope: 'all_active' }
                ]
            },
            // 人物/搞笑類事件
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "陡坡旁，一朵從未見過的美麗花朵🌸吸引了大家的目光。",
                options: [
                    { text: "欣賞一下就好，不要採摘，保護自然生態。💖", staminaChange: 3, waterChange: 0, outcomeText: `花朵散發出治癒的光芒，讓欣賞的同學精神一振。😌 體力小幅增加！` },
                    { text: `哇！好漂亮！[studentName]，快摘下來送給 ${teacherName}！🎁`, staminaChange: -12, waterChange: -5, outcomeText: `花朵枯萎了，空氣中瀰漫著一股奇怪的氣味，讓 [studentName] 和 ${teacherName} 感到有點不舒服。🤢 他們的體力水分下降！` },
                    { text: "使用急救包🩹，分析花朵是否可用於恢復！", staminaChange: 5, waterChange: 0, outcomeText: `急救包顯示這朵花有微弱的治癒效果！使用急救包的同學士氣小幅提升。`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
                ],
                needsStudent: true
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "突然，一隻頑皮的松鼠🐿️跳出來，搶走了[studentName]的零食🍪！",
                options: [
                    { text: "算了，讓牠吃吧！大家看著松鼠搞笑的樣子，都笑了。😂", staminaChange: 2, waterChange: 0, outcomeText: `大家哄堂大笑！😂 全班同學體力+2 (精神愉悅)！[studentName]表示：「我的零食啦！🍪」`, needsStudent: true, effectScope: 'all_active' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: `${teacherName}突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
                options: [
                    { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班同學體力小幅增加！`, effectScope: 'all_active' }
                ]
            },
            {
                stage: "陡峭的試煉之坡 🧗",
                text: `[studentName] 同學不小心在濕滑的岩石上扭到了腳，臉色發白！😩`,
                options: [
                    { text: "趕快停下來休息，簡單處理傷口。", staminaChange: -15, waterChange: -8, outcomeText: `大家停下來照顧 [studentName]，雖然處理了傷口，但耽誤了時間，[studentName] 和照顧的同學體力水分都下降了。` },
                    { text: "拿出急救包🩹，進行專業處理！", staminaChange: 10, waterChange: 0, outcomeText: `急救包中的繃帶和藥品迅速緩解了 [studentName] 的疼痛，[studentName] 和使用急救包的同學士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
                ],
                needsStudent: true
            },
            // 教育任務
            {
                stage: "陡峭的試煉之坡 🧗",
                text: "一隻看似睿智的老貓頭鷹🦉停在樹上，牠說：「年輕的登山者啊，若想通過，請回答我的謎題：『身體是黑的，心卻是紅的，是什麼？』」",
                options: [
                    { text: "答案是：西瓜！🍉", staminaChange: 15, waterChange: 8, outcomeText: `答對了！老貓頭鷹滿意地點點頭，一束光芒指引了前進的道路！✨ 全班同學體力水分大幅增加！`, collaborationPointsAwarded: 10, effectScope: 'all_active' },
                    { text: `答案是：黑森林蛋糕！🍰 (${teacherName}：「別鬧了！」)`, staminaChange: -20, waterChange: -10, outcomeText: `老貓頭鷹嘆了口氣，大家因此受到了一點考驗，每個人的體力水分都下降。😔 某同學：「我好想吃蛋糕…」`, effectScope: 'all_active' }
                ]
            }
        ],
        "climax": [
            {
                stage: "風光無限的山頂 ⛰️",
                text: `最後一段路了！大家都感到非常疲憊，但山頂就在眼前！${teacherName}：「堅持住！我們快到了！」`,
                options: [
                    { text: "全員衝刺，向山頂進發！", staminaChange: 15, waterChange: 10, outcomeText: `全班同學互相加油打氣，爆發出最後的能量！💪 成功登頂！`, collaborationPointsAwarded: 15, effectScope: 'all_active' }
                ]
            }
        ]
    };

    let currentEventSequence = []; // 每次遊戲都會重新生成的事件序列

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
        currentEventSequence.push(eventsByStage.intro[0]); // 加入開場事件

        // 從各階段事件池中隨機選取更多事件加入序列
        // 每個階段選取 8 到 15 個事件，確保事件數量大幅增加，總數接近或超過100
        const numForestEvents = 8 + Math.floor(Math.random() * 8); // 8-15
        const numPathEvents = 8 + Math.floor(Math.random() * 8);   // 8-15
        const numSlopeEvents = 8 + Math.floor(Math.random() * 8);   // 8-15

        currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.forest]).slice(0, Math.min(eventsByStage.forest.length, numForestEvents)));
        currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.path]).slice(0, Math.min(eventsByStage.path.length, numPathEvents)));
        currentEventSequence = currentEventSequence.concat(shuffleArray([...eventsByStage.slope]).slice(0, Math.min(eventsByStage.slope.length, numSlopeEvents)));

        currentEventSequence.push(eventsByStage.climax[0]); // 加入結尾事件 (到達山頂前)

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
        const activeStudents = students.filter(s => s.active);
        const avgStamina = activeStudents.length > 0 ? activeStudents.reduce((sum, s) => sum + s.stamina, 0) / activeStudents.length : 0;
        const avgWater = activeStudents.length > 0 ? activeStudents.reduce((sum, s) => sum + s.water, 0) / activeStudents.length : 0;

        staminaValueElem.textContent = Math.round(avgStamina);
        const staminaPercentage = Math.max(0, (avgStamina / INITIAL_STAMINA) * 100);
        staminaBarElem.style.width = `${staminaPercentage}%`;
        staminaBarElem.className = `resource-bar-fill h-full rounded-full ${avgStamina > (INITIAL_STAMINA * 0.7) ? 'bg-green-400' : (avgStamina > (INITIAL_STAMINA * 0.3) ? 'bg-yellow-400' : 'bg-red-400')}`;
        staminaBarElem.parentElement.setAttribute('aria-valuenow', Math.round(staminaPercentage));

        // 水分更新
        waterValueElem.textContent = Math.round(avgWater);
        const waterPercentage = Math.max(0, (avgWater / INITIAL_WATER) * 100);
        waterBarElem.style.width = `${waterPercentage}%`;
        waterBarElem.className = `resource-bar-fill h-full rounded-full ${avgWater > (INITIAL_WATER * 0.7) ? 'bg-blue-400' : (avgWater > (INITIAL_WATER * 0.3) ? 'bg-indigo-400' : 'bg-red-400')}`;
        waterBarElem.parentElement.setAttribute('aria-valuenow', Math.round(waterPercentage));

        // 關卡進度更新
        if (currentEventSequence.length > 0) {
            const totalEvents = currentEventSequence.length;
            const currentProgress = Math.min(sequenceIndex, totalEvents - 1); // 避免超過總事件數
            const progressPercentage = totalEvents > 1 ? (currentProgress / (totalEvents - 1)) * 100 : (totalEvents === 1 ? 100 : 0); // 減1因為起始為0
            stageProgressBarElem.style.width = `${progressPercentage}%`;
            stageProgressTextElem.textContent = `${currentProgress + 1} / ${totalEvents}`; // 顯示當前事件數/總事件數
            stageProgressBarElem.parentElement.setAttribute('aria-valuenow', Math.round(progressPercentage));
            stageProgressBarElem.className = `resource-bar-fill h-full rounded-full ${progressPercentage > 75 ? 'bg-emerald-400' : (progressPercentage > 40 ? 'bg-lime-400' : 'bg-purple-400')}`;

            // Display number of active students
            const activeStudentCount = students.filter(s => s.active).length;
            const totalStudentCount = students.length;
            let studentStatusText = `存活學生: ${activeStudentCount}/${totalStudentCount}`;
            const statusElement = document.getElementById('studentStatusText'); // Assuming you add an element with this ID
            if (statusElement) {
                statusElement.textContent = studentStatusText;
            } else {
                // Create and append if it doesn't exist (simple version)
                const newStatusElement = document.createElement('p');
                newStatusElement.id = 'studentStatusText';
                newStatusElement.className = 'text-sm text-gray-600 dark:text-gray-300 mt-1 text-center';
                newStatusElement.textContent = studentStatusText;
                // Append it somewhere logical, e.g., after progressTextElem or waterBarElem's parent
                progressTextElem.parentNode.insertBefore(newStatusElement, progressTextElem.nextSibling);
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
                staminaDisplay.className = 'flex items-center text-xs w-[70px]'; // 固定寬度以對齊
                const staminaVal = document.createElement('span');
                staminaVal.className = `mr-1 w-5 text-right ${student.stamina > (INITIAL_STAMINA * 0.3) ? 'text-gray-700' : 'text-red-600 font-medium'}`;
                staminaVal.textContent = student.stamina;
                const staminaBarOuter = document.createElement('div');
                staminaBarOuter.className = 'flex-1 h-2 bg-gray-300 rounded-full'; // flex-1 for bar to take rest of space
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
                waterDisplay.className = 'flex items-center text-xs w-[70px]'; // 固定寬度以對齊
                const waterVal = document.createElement('span');
                waterVal.className = `mr-1 w-5 text-right ${student.water > (INITIAL_WATER * 0.3) ? 'text-gray-700' : 'text-red-600 font-medium'}`;
                waterVal.textContent = student.water;
                const waterBarOuter = document.createElement('div');
                waterBarOuter.className = 'flex-1 h-2 bg-gray-300 rounded-full'; // flex-1 for bar
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
                    shuffleArray([...activeStudentsDisplay]).forEach(student => {
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

                inactiveStudentsDisplay.forEach(student => {
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

                shuffleArray([...activeStudentsDisplay]).forEach(student => {
                    container.appendChild(createStudentElement(student));
                });
            }
        }
    }

    // 輔助函數：格式化包含學生姓名的文字
    function formatTextWithStudentNames(text, numStudentsHint = 1) {
        let formattedText = text;

        const hasS1 = text.includes("[studentName1]");
        const hasS2 = text.includes("[studentName2]");
        const hasS = text.includes("[studentName]");

        // Determine the number of unique student names to fetch
        let namesToFetchCount;
        if (hasS2) {
            // If [studentName2] is present, we need at least 2 names for [studentName1] and [studentName2] to be different.
            namesToFetchCount = Math.max(2, numStudentsHint);
        } else if (hasS1 || hasS) {
            // If only [studentName1] or [studentName] is present, we need at least 1 name.
            namesToFetchCount = Math.max(1, numStudentsHint);
        } else {
            // If no student placeholders, rely purely on the hint
            namesToFetchCount = numStudentsHint;
        }
        namesToFetchCount = Math.max(0, namesToFetchCount); // Ensure not negative

        const studentNamesForText = getRandomStudentName(students, namesToFetchCount); // Pass students array
        let actualNamesUsed = [];

        // If there were no placeholders and no names were requested via hint, return original text
        if (!hasS1 && !hasS2 && !hasS && namesToFetchCount === 0) {
            return { formattedText: formattedText, namesUsed: [] };
        }

        const name1 = (studentNamesForText.length > 0) ? studentNamesForText[0] : "某同學";
        const name2 = (studentNamesForText.length > 1) ? studentNamesForText[1] : name1; // Fallback name2 to name1 if only one distinct name fetched

        if (hasS1) {
            formattedText = formattedText.replace(/\[studentName1\]/g, name1);
            if (studentNamesForText.length > 0 && !actualNamesUsed.includes(name1)) actualNamesUsed.push(name1);
        }
        if (hasS2) {
            formattedText = formattedText.replace(/\[studentName2\]/g, name2);
            if (studentNamesForText.length > 1 && !actualNamesUsed.includes(name2)) actualNamesUsed.push(name2);
            else if (studentNamesForText.length > 0 && !actualNamesUsed.includes(name1)) actualNamesUsed.push(name1); // if name2 fell back to name1
        }
        if (hasS) {
            // If [studentName] is present, it usually refers to the first student if not specified otherwise
            formattedText = formattedText.replace(/\[studentName\]/g, name1);
            if (studentNamesForText.length > 0 && !actualNamesUsed.includes(name1)) actualNamesUsed.push(name1);
        }
        // Ensure unique names in actualNamesUsed
        actualNamesUsed = [...new Set(actualNamesUsed)];
        return { formattedText: formattedText, namesUsed: actualNamesUsed };
    }

    // 新增：顯示照片解鎖通知
    function showPhotoUnlockNotification(photoPath, photoFilename) {
        if (unlockedPhotoImg && photoUnlockPopup && unlockedPhotoName) {
            unlockedPhotoImg.src = photoPath;
            unlockedPhotoName.textContent = photoFilename;
            photoUnlockPopup.classList.remove('hidden');
            photoUnlockPopup.classList.add('flex');
            photoUnlockPopup.classList.remove('opacity-0'); // 移除透明
            photoUnlockPopup.classList.add('opacity-100');  // 設置為完全可見 (配合 transition-opacity)
            playSound(audioItemPickup); // 可以重用物品拾取音效或新增專用音效
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
        outcomeTextElem.textContent = ''; // 清除上次的結果文字
        optionsArea.innerHTML = ''; // 清除上次的選項按鈕
        eventTextElem.classList.remove('animate-shake-text', 'animate-bounce-text'); // 移除舊動畫

        const event = currentEventSequence[sequenceIndex];
        if (!event) {
            checkGameStatus();
            return;
        }

        // 應用回合消耗
        let anyStudentFaintedThisTurn = false;
        students.forEach(student => {
            if (student.active) {
                student.stamina = Math.max(0, student.stamina - PER_TURN_STAMINA_COST);
                student.water = Math.max(0, student.water - PER_TURN_WATER_COST);
                console.log(`回合消耗後 - ${student.name}: 體力=${student.stamina}, 水分=${student.water}`); // 新增 log
                if (student.stamina === 0 || student.water === 0) {
                    student.active = false;
                    anyStudentFaintedThisTurn = true;
                    // outcomeTextElem.textContent += `\n${student.name} 因回合消耗而倒下了！`; // Optional immediate feedback
                }
            }
        });

        updateUI(); // 先更新一次UI顯示回合消耗
        console.log(`回合消耗後活躍學生數: ${students.filter(s => s.active).length}`); // 新增 log
        // 如果因為回合消耗導致體力或水分歸零，直接遊戲失敗
        if (students.filter(s => s.active).length === 0) {
             checkGameStatus(); // 這裡會觸發遊戲失敗彈窗
             return; // 阻止事件選項顯示
        }

        // 替換事件文字中的學生名字佔位符
        // Determine numStudentsHint for event text
        let numStudentsHintForEvent = event.needsStudent ? 1 : 0;
        if (event.text.includes("[studentName1]") || event.text.includes("[studentName2]")) numStudentsHintForEvent = 2;
        else if (event.text.includes("[studentName]")) numStudentsHintForEvent = 1;

        const eventTextResult = formatTextWithStudentNames(event.text, numStudentsHintForEvent);
        eventTextElem.innerHTML = eventTextResult.formattedText;

        // 為每個選項創建按鈕
        event.options.forEach((option) => { // Ensure `students` is passed to getRandomStudentName via formatTextWithStudentNames
            const button = document.createElement('button');
            const optionTextResult = formatTextWithStudentNames(option.text, option.numStudents || (option.text.includes("[studentName2]") ? 2 : (option.text.includes("[studentName1]") || option.text.includes("[studentName]") ? 1 : 0)));
            button.textContent = optionTextResult.formattedText;

            button.className = "bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 active:scale-95";

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
                    button.textContent += ` (缺少${missingItemDisplayName})`;
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
        updateUI(); // 再次更新UI以確保最新狀態
    }

    // 獲取物品的中文顯示名稱
    function getItemDisplayName(itemKey) {
        return ITEMS[itemKey] ? ITEMS[itemKey].name : itemKey;
    }

    // 處理選項選擇
    function handleOption(selectedOption, namesInOptionText) {
        let outcomeZusatz = ""; // Additional text for outcome if students faint

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
                const previouslyOwned = inventory[itemKey]; // 檢查是否已擁有
                inventory[itemKey] = true; // 標記為擁有

                // 如果獲得的是水瓶，立即補充一些水分
                if (itemKey === 'waterBottle') {
                    // This should ideally affect the student who "found" or was given the water bottle
                    // For simplicity now, let's assume the first name in option text if any, or a random active student
                    const targetStudent = namesInOptionText.length > 0 ? students.find(s => s.name === namesInOptionText[0] && s.active) : students.find(s => s.active);
                    if (targetStudent) targetStudent.water = Math.min(INITIAL_WATER, targetStudent.water + 10);
                }

                const itemElement = document.getElementById(ITEMS[itemKey].id);
                if (itemElement) {
                    itemElement.classList.add('animate-pulse-item');
                    setTimeout(() => itemElement.classList.remove('animate-pulse-item'), 800); // 縮短一點動畫時間配合音效
                }
            });
        }

        let affectedStudentList = [];
        // Determine scope of effect
        if (selectedOption.effectScope === 'all_active' || selectedOption.outcomeText.includes("全班") || selectedOption.outcomeText.includes("大家")) {
            affectedStudentList = students.filter(s => s.active);
        } else if (namesInOptionText && namesInOptionText.length > 0) {
            affectedStudentList = namesInOptionText
                .map(name => students.find(s => s.name === name && s.active))
                .filter(Boolean); // Filter out undefined if a name wasn't found or student inactive
        } else {
            // If no specific students in option and not class-wide, maybe affect one random active student or no one for stats
            // For now, let's assume if namesInOptionText is empty and not 'all_active', it might be a general outcome with no specific student stat change unless specified.
            // Or, if the event text had a student, use that one. This part needs careful event design.
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
            if (!student.active) return; // Already fainted this turn or previous
            if (student.stamina === 0 || student.water === 0) {
                student.active = false;
                outcomeZusatz += `\n${student.name} 精疲力盡倒下了！`;
            }
        });

        // 替換結果文字中的學生名字佔位符
        const numStudentsHintForOutcome = selectedOption.numStudents || (selectedOption.outcomeText.includes("[studentName2]") ? 2 : (selectedOption.outcomeText.includes("[studentName1]") || selectedOption.outcomeText.includes("[studentName]") ? 1 : 0));
        const outcomeTextResult = formatTextWithStudentNames(selectedOption.outcomeText, numStudentsHintForOutcome);
        outcomeTextElem.textContent = outcomeTextResult.formattedText + outcomeZusatz; // 顯示事件結果

        // 處理協作點數獎勵
        if (selectedOption.collaborationPointsAwarded) {
            totalCollaborationScore += selectedOption.collaborationPointsAwarded;
            console.log(`協作分數增加: ${selectedOption.collaborationPointsAwarded}, 總分: ${totalCollaborationScore}`);
        }

        // 根據體力/水分變化，為事件文本添加動畫效果和音效
        if (selectedOption.staminaChange > 0 || selectedOption.waterChange > 0) {
            eventTextElem.classList.add('animate-bounce-text');
            playSound(audioPositive); // 正面效果音效
        } else if (selectedOption.staminaChange < 0 || selectedOption.waterChange < 0) {
            eventTextElem.classList.add('animate-shake-text');
            playSound(audioNegative); // 負面效果音效
        }

        updateUI(); // 更新 UI 顯示

        // 禁用所有選項按鈕，防止重複點擊
        Array.from(optionsArea.children).forEach(button => button.disabled = true);

        // 物品拾取音效 (如果在 giveItem 後播放，確保它在正面/負面音效之前或之後，避免衝突)
        if (selectedOption.giveItem && selectedOption.giveItem.length > 0) {
            playSound(audioItemPickup);
        }

        // 短暫延遲後，進入下一個事件或檢查遊戲狀態
        setTimeout(() => {
            sequenceIndex++; // 進入下一個事件
            const isGameOver = checkGameStatus(); // 檢查遊戲是否結束或勝利
            if (!isGameOver) checkAndUnlockPhotosBasedOnCollaboration(); // 在顯示下個事件前，檢查是否解鎖照片
            if (!isGameOver) { // 如果遊戲未結束
                displayEvent();
            }
        }, 2000); // 等待 2 秒讓玩家看清結果
    }

    // 檢查遊戲狀態 (勝利或失敗)
    function checkGameStatus() {
        const activeStudentCount = students.filter(s => s.active).length;
        console.log(`檢查遊戲狀態: 活躍學生數=${activeStudentCount}, 當前事件索引=${sequenceIndex}, 總事件數=${currentEventSequence.length}`); // 新增 log
        if (activeStudentCount === 0) {
            console.log("所有學生已倒下，準備顯示失敗彈窗..."); // 新增 log
            playSound(audioGameLose);
            // Message can be more specific, e.g., "所有同學都已精疲力盡..."
            showPopup("挑戰失敗！😭", `所有同學都已精疲力盡或脫水！${teacherName}和同學們無法繼續前進…`);
            return true; // 遊戲結束
        } else if (sequenceIndex >= currentEventSequence.length) {
            playSound(audioGameWin);
            let survivorNames = students.filter(s => s.active).map(s => s.name).join("、");
            if (students.filter(s => s.active).length === students.length) survivorNames = "六年四班全體同學";
            else if (students.filter(s => s.active).length === 0) survivorNames = "沒有人"; // Should be caught by above
            showPopup("恭喜過關！🏆", `${teacherName}和 ${survivorNames} 成功登上山頂！這就是團結、智慧與堅持的力量！🎉`);
            return true; // 遊戲結束
        }
        console.log("遊戲繼續..."); // 新增 log
        return false; // 遊戲未結束
    }

    // 顯示遊戲結束/勝利彈出視窗
    function showPopup(title, message) {
        console.log(`showPopup 被呼叫: title="${title}", message="${message}"`); // 新增 log
        popupTitleElem.textContent = title;
        popupMessageElem.textContent = message;
        gameOverPopup.classList.remove('hidden'); // 移除 hidden 使其不再是 display:none
        gameOverPopup.classList.remove('opacity-0'); // 移除初始的透明狀態
        gameOverPopup.classList.add('opacity-100');  // 設定目標為完全不透明，觸發淡入動畫
        // 添加動畫類別，讓彈出視窗平滑顯示
        popupContent.classList.remove('scale-90', 'opacity-0');
        popupContent.classList.add('scale-100', 'opacity-100');
    }

    // 重置遊戲並隱藏彈出視窗
    function resetGame() {
        initializeStudentStats(); // Resets all students' stamina, water, and active status
        initializeInventory(); // 重置物品欄
        initializeEventSequence(); // 重新初始化事件序列
        totalCollaborationScore = 0; // 重置協作分數
        photosUnlockedThisSession = 0; // 重置本局協作解鎖照片計數
        unlockedPhotos.clear(); // 重設遊戲時清空已解鎖照片
        outcomeTextElem.textContent = ''; // 清除結果文字

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

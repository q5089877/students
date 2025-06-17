window.gameEventsForest = [
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "突然，前方小徑被濃霧籠罩，出現了兩條岔路。該走哪條呢？🌫️",
        options: [
            { text: `跟隨 ${window.teacherName}，走看起來比較穩重的那條路。😎`, staminaChange: -5, waterChange: -3, outcomeText: `${window.teacherName} 帶大家沉著應對，成功走出迷霧。👏 但每個人都走了些冤枉路。`, effectScope: 'all_active' },
            { text: "讓 [studentName] 帶頭走那條看起來有蝴蝶🦋的路！", staminaChange: -20, waterChange: -8, outcomeText: `哎呀！[studentName] 帶大家繞了一大圈，還差點踩到泥坑！💦 [studentName] 的體力水分都下降了！[studentName]：「我肚子好餓喔…」` },
            { text: "拿出地圖🗺️，仔細比對路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示這條路是捷徑！大家輕鬆通過，體力小幅恢復。`, requiredItem: 'map', consumeItem: 'map' }
        ]
    },
    // 例如：
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "周圍的樹木長得一模一樣，大家感覺迷失了方向！🔄",
        options: [
            { text: "原地等待，或許能找到線索。", staminaChange: -8, waterChange: -5, outcomeText: `原地等待耗費了大家的時間和體力，每個人都感到更加焦慮。`, effectScope: 'all_active' },
            { text: "拿出地圖🗺️，嘗試辨別方向。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰地顯示了正確的路線！大家重新找到方向，精神一振！`, requiredItem: 'map', consumeItem: 'map', effectScope: 'all_active' }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: `${window.teacherName}：「在野外看到不認識的植物，我們應該怎麼做？」🌿`,
        options: [
            { text: "不隨意觸摸或採摘。🙅‍♀️", staminaChange: 5, waterChange: 0, outcomeText: `正確！${window.teacherName}稱讚你們謹慎的態度！`, effectScope: 'all_active' },
            { text: "先聞聞看有沒有毒。", staminaChange: -8, waterChange: -3, outcomeText: `這個方法很危險！${window.teacherName}提醒大家不要輕易嘗試。`, effectScope: 'all_active' }
        ]
    }
    ,
    // 食物/資源類事件
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "路邊發現一棵結滿紅色果實的樹，看起來很誘人。要吃嗎？🍎",
        options: [
            { text: "雖然看起來好吃，但野外的東西還是別亂吃比較好。🙅‍♀️", staminaChange: 0, waterChange: 0, outcomeText: `${window.teacherName}：「做得好同學們，野外求生知識很重要！」👍` },
            { text: "哇！看起來好美味！讓 [studentName1] 和 [studentName2] 快去摘來吃！😋", numStudents: 2, staminaChange: -25, waterChange: -8, outcomeText: `[studentName1] 和 [studentName2] 開心地吃了起來，結果肚子痛得哇哇叫！😫 他們的體力水分大減！(附帶搞笑音效：噗嚕噗嚕) [studentName1]：「我好想回家上廁所喔…」` },
            { text: "使用急救包🩹，分析果實是否有毒！", staminaChange: 5, waterChange: 0, outcomeText: `急救包中的檢測工具顯示果實有毒！幸好沒有吃，使用急救包的同學還因此恢復了一些精神！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "灌木叢中隱約看見一個閃閃發光的寶箱！要打開嗎？📦✨",
        options: [
            { text: "小心翼翼地打開寶箱，看看裡面有什麼。", staminaChange: 10, waterChange: 5, outcomeText: `寶箱裡裝滿了能量棒🍫和一瓶清涼的山泉水💧！真是意外之喜！發現寶箱的同學精神一振！${window.teacherName}：「看來冒險還是有回報的！」`, giveItem: ['energyBar', 'waterBottle'], collaborationPointsAwarded: 5, effectScope: 'all_active' },
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
            { text: "趕快大聲驅趕猴子！🗣️", staminaChange: -8, waterChange: -5, outcomeText: `猴子嚇了一跳跑掉了，但 [studentName] 和幫忙驅趕的同學也因此耗費了點力氣。💦`, collaborationPointsAwarded: 2 },
            { text: "拿出零食🍪丟給猴子，分散牠們的注意力。", staminaChange: 8, waterChange: 0, outcomeText: `猴子們開心地吃著零食，大家趁機溜走了！😇 使用零食的 [studentName] 感到輕鬆不少，全班同學也鬆了一口氣！`, requiredItem: 'snack', consumeItem: 'snack', collaborationPointsAwarded: 5, effectScope: 'all_active' }
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
            { text: "大聲叫喊，試圖嚇跑牠。", staminaChange: -8, waterChange: -5, outcomeText: `毒蛇只是縮了一下，然後變得更具攻擊性。在場的同學嚇得體力下降。` },
            { text: "使用驅蟲劑🧴，嘗試驅趕牠。", staminaChange: 8, waterChange: 0, outcomeText: `驅蟲劑的特殊氣味讓毒蛇感到不適，牠迅速溜走了！使用驅蟲劑的同學鬆了一口氣。`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "一隻小動物被捕獸夾困住了，發出痛苦的哀嚎。救還是不救？🥺",
        options: [
            { text: "小心地解救小動物。❤️", staminaChange: -8, waterChange: -8, outcomeText: `雖然耗費了體力，但成功解救了小動物，參與救援的同學感到非常欣慰。`, collaborationPointsAwarded: 3 },
            { text: "使用急救包🩹，為小動物處理傷口後放生。", staminaChange: 10, waterChange: 0, outcomeText: `小動物感激地離開，你們的善舉讓參與的同學士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit', collaborationPointsAwarded: 8 }
        ]
    },
    // 環境/地形類事件
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "一棵巨大的古樹🌳被茂密的藤蔓纏繞，似乎擋住了某些東西。藤蔓縫隙間隱約閃爍著光芒！",
        options: [
            { text: "合力撥開藤蔓，看看裡面有什麼！", staminaChange: -8, waterChange: -5, outcomeText: `參與的同學費力地撥開藤蔓，找到了一瓶驅蟲劑🧴！但他們也累壞了。`, giveItem: ['insectRepellent'] },
            { text: "使用求生繩索🎗️，試圖拉開藤蔓。", staminaChange: 8, waterChange: 0, outcomeText: `用繩索巧妙地拉開藤蔓，發現裡面藏著一個急救包🩹！使用繩索的同學感到很得意。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', giveItem: ['firstAidKit'] }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "前方出現一片茂密的荊棘林，寸步難行。尖銳的刺讓人望而卻步！🌵",
        options: [
            { text: "小心翼翼地穿過，避免被刺傷。", staminaChange: -8, waterChange: -7, outcomeText: `大家小心通過，雖然沒受傷，但每個人的體力水分都消耗不少。`, effectScope: 'all_active' },
            { text: "使用求生繩索🎗️，試圖綁開一條路。", staminaChange: 5, waterChange: 0, outcomeText: `用繩索巧妙地撥開荊棘，開闢了安全通道！使用繩索的同學體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
        ]
    },
    // 天氣/搞笑類事件
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "天空突然烏雲密布，一陣雷陣雨⛈️傾盆而下！",
        options: [
            { text: "趕快找地方避雨！☔", staminaChange: -8, waterChange: -8, outcomeText: `大家躲在樹下，雖然沒被淋濕，但每個人的時間和體力都消耗了。`, effectScope: 'all_active' },
            { text: "穿上雨衣，繼續冒險！🏃‍♀️", staminaChange: -8, waterChange: -8, outcomeText: `雖然有雨衣，但在雨中行進非常耗費每個人的體力！`, effectScope: 'all_active' }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: "突然，一隻頑皮的松鼠🐿️跳出來，搶走了[studentName]的零食🍪！",
        options: [
            { text: "算了，讓牠吃吧！大家看著松鼠搞笑的樣子，都笑了。😂", staminaChange: 2, waterChange: 0, outcomeText: `大家哄堂大笑！😂 全班同學精神愉悅，體力+2 (精神愉悅)！[studentName]表示：「我的零食啦！🍪」`, needsStudent: true, effectScope: 'all_active' }
        ]
    },
    {
        stage: "山腳下的迷霧森林 🌳",
        text: `${window.teacherName}突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
        options: [
            { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班同學體力小幅增加！`, effectScope: 'all_active' }
        ]
    },
    // 教育任務
    {
        stage: "山腳下的迷霧森林 🌳",
        text: `${window.teacherName}：「同學們，如果我們沒有地圖，在森林裡該如何辨識方向呢？」🤔`,
        options: [
            { text: "看太陽的方向。☀️", staminaChange: 8, waterChange: 0, outcomeText: `正確！${window.teacherName}點頭稱讚，大家學到了一課，精神為之一振！`, effectScope: 'all_active' },
            { text: "看哪邊樹比較多。", staminaChange: -5, waterChange: -3, outcomeText: `嗯…這個方法不太可靠喔！${window.teacherName}搖了搖頭，大家的體力微減。`, effectScope: 'all_active' }
        ]
    },
     {
        stage: "山腳下的迷霧森林 🌳",
        text: `${window.teacherName}：「在野外看到不認識的植物，我們應該怎麼做？」🌿`,
        options: [
            { text: "不隨意觸摸或採摘。🙅‍♀️", staminaChange: 5, waterChange: 0, outcomeText: `正確！${window.teacherName}稱讚你們謹慎的態度！`, effectScope: 'all_active' },
            { text: "先聞聞看有沒有毒。", staminaChange: -8, waterChange: -3, outcomeText: `這個方法很危險！${window.teacherName}提醒大家不要輕易嘗試。`, effectScope: 'all_active' }
        ]
    }
];

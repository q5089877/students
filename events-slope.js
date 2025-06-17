window.gameEventsSlope = [
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "攀爬時，一段老舊的繩索⛓️突然出現裂痕！該怎麼辦？",
        options: [
            { text: `不要慌！讓 ${window.teacherName} 指導，大家小心地一步一步通過。`, staminaChange: -8, waterChange: -5, outcomeText: `${window.teacherName} 冷靜指揮，大家互相扶持，成功克服難關。💪 但每個人的精力都耗費不少。`, effectScope: 'all_active' },
            { text: "別怕！[studentName] 你力氣最大，抓緊繩子，我們一起衝過去！", staminaChange: -8, waterChange: -8, outcomeText: `繩索不堪重負，斷裂了！雖然沒人受傷，但大家嚇出了一身冷汗，並花費更多時間繞道。😱 [studentName] 和附近的同學體力水分大減！[studentName]：「我的心臟快跳出來了！」` },
            { text: "使用求生繩索🎗️加固，確保安全！", staminaChange: 15, waterChange: 0, outcomeText: `利用結實的求生繩索加固了老舊的繩子，大家安全無虞地攀爬，使用繩索的同學體力大幅恢復！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "一隻看似睿智的老貓頭鷹🦉停在樹上，牠說：「年輕的登山者啊，若想通過，請回答我的謎題：『身體是黑的，心卻是紅的，是什麼？』」",
        options: [
            { text: "答案是：西瓜！🍉", staminaChange: 15, waterChange: 8, outcomeText: `答對了！老貓頭鷹滿意地點點頭，一束光芒指引了前進的道路！✨ 全班同學體力水分大幅增加！`, collaborationPointsAwarded: 10, effectScope: 'all_active' },
            { text: `答案是：黑森林蛋糕！🍰 (${window.teacherName}：「別鬧了！」)`, staminaChange: -8, waterChange: -8, outcomeText: `老貓頭鷹嘆了口氣，大家因此受到了一點考驗，每個人的體力水分都下降。😔 某同學：「我好想吃蛋糕…」`, effectScope: 'all_active' }
        ]
    }
    ,
    // 路線/地形類事件
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "前方出現了一段幾乎垂直的岩壁，看起來非常難以攀爬！😨",
        options: [
            { text: `仔細規劃路線，利用 ${window.teacherName} 教的攀爬技巧。`, staminaChange: -8, waterChange: -8, outcomeText: `大家憑藉著毅力和聰明才智，一步步克服了岩壁！🙌 但每個人的體力水分都消耗不小！`, effectScope: 'all_active' },
            { text: "試圖強行突破，看看能不能爬上去！", staminaChange: -8, waterChange: -8, outcomeText: `嘗試強攻岩壁失敗，反而耗費了大量體力水分，還差點有人受傷！😬 參與強攻的同學尤其疲憊。` },
            { text: "吃下能量棒🍫，補充體力再攀爬！", staminaChange: 12, waterChange: 0, outcomeText: `能量棒讓吃下的同學精神大振！攀爬變得輕鬆許多，體力大幅恢復。`, requiredItem: 'energyBar', consumeItem: 'energyBar' },
            { text: "使用求生繩索🎗️，搭建臨時攀爬點！", staminaChange: 15, waterChange: 0, outcomeText: `利用繩索，大家迅速建立了安全攀爬點，輕鬆通過！使用繩索的同學感到非常有用。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', collaborationPointsAwarded: 8 }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "前方一處看似穩固的峭壁突然開始崩塌！腳下碎石滾落，情況危急！🚧",
        options: [
            { text: "迅速判斷，找到最安全的跳躍點！🏃‍♀️", staminaChange: -8, waterChange: -8, outcomeText: `大家驚險地跳了過去，雖然成功但每個人的體力水分都耗費不少，心跳加速！`, effectScope: 'all_active' },
            { text: "拿出求生繩索🎗️，快速固定並滑下！", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索，大家有條不紊地通過了崩塌區，安全又省力！使用繩索的同學體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' },
            { text: "打開地圖🗺️，尋找是否有其他安全通道。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰標示了一條隱蔽的山路，成功避開了崩塌區！查看地圖的同學感到欣慰。`, requiredItem: 'map', consumeItem: 'map' }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "聽到前方傳來隆隆聲，似乎有滑坡的跡象！必須立刻做出反應！",
        options: [
            { text: "快速尋找掩蔽物躲藏！", staminaChange: -8, waterChange: -8, outcomeText: `大家雖然躲開了滑坡，但過程驚險，每個人的體力水分都耗費了大量。`, effectScope: 'all_active' },
            { text: "利用地圖🗺️，尋找安全繞行路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示了一條隱蔽且安全的繞行小路，大家順利避開了危險！查看地圖的同學鬆了口氣。`, requiredItem: 'map', consumeItem: 'map' }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "路旁出現一個深不見底的漆黑洞穴，裡面傳來陣陣陰冷的風。🦇",
        options: [
            { text: "好奇心驅使，進去看看！🔦", staminaChange: -8, waterChange: -8, outcomeText: `洞穴深處什麼都沒有，只讓進去的同學感到一陣陰森，並消耗了體力水分。` },
            { text: "使用求生繩索🎗️，探索洞穴深處，或許有寶藏？", staminaChange: 10, waterChange: 5, outcomeText: `利用繩索探索，意外發現了一處寶藏，裡面有額外的能量棒和水！探索的同學精神大振。`, requiredItem: 'survivalRope', giveItem: ['energyBar', 'waterBottle'] },
            { text: "使用急救包🩹，測試洞穴內的空氣是否安全！", staminaChange: 5, waterChange: 0, outcomeText: `急救包的儀器顯示洞穴空氣無毒，但太深了不適合深入。使用急救包的同學發現了一瓶驅蟲劑！`, requiredItem: 'firstAidKit', giveItem: ['insectRepellent'] }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "前方又出現了一條新的岔路，一邊是沿著瀑布的濕滑小徑💦，另一邊是直接穿越懸崖的峭壁⛰️。",
        options: [
            { text: "選擇瀑布小徑，或許風景不錯。", staminaChange: -8, waterChange: -5, outcomeText: `瀑布小徑濕滑難行，雖然風景優美，但每個人的體力水分都消耗不少。`, effectScope: 'all_active' },
            { text: "選擇懸崖峭壁，看起來更直接。", staminaChange: -8, waterChange: -8, outcomeText: `懸崖峭壁雖然直接，但非常陡峭，需要耗費每個人的更多體力！`, effectScope: 'all_active' },
            { text: "使用地圖🗺️，看看哪條路更安全或有隱藏好處。", staminaChange: 5, waterChange: 0, outcomeText: `地圖顯示懸崖峭壁後有一處避風港，大家決定走峭壁！查看地圖的同學感到安心。`, requiredItem: 'map', consumeItem: 'map' }
        ]
    },
    // 動物/威脅類事件
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "一隻巨大的野熊🐻‍❄️攔在路上，看起來非常飢餓且具有攻擊性！",
        options: [
            { text: "丟出能量棒🍫，吸引牠的注意力並逃跑！", staminaChange: -8, waterChange: -8, outcomeText: `野熊被能量棒吸引，大家趁機迅速逃離！丟能量棒的同學感到緊張，但成功了。`, requiredItem: 'energyBar', consumeItem: 'energyBar' },
            { text: "嘗試繞道，但路徑非常危險。", staminaChange: -8, waterChange: -8, outcomeText: `繞道過程驚險萬分，耗費了每個人的巨大體力水分。`, effectScope: 'all_active' }
        ]
    },
    // 資源/環境類事件
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "天氣驟變！一場突如其來的暴風雪❄️開始席捲山坡，能見度極低，氣溫驟降！",
        options: [
            { text: "盡快找地方避風雪，等待天氣好轉。", staminaChange: -8, waterChange: -8, outcomeText: `大家躲在岩石後，雖然避開了最猛烈的風雪，但寒冷和恐懼仍讓每個人的體力水分快速流失。🥶`, effectScope: 'all_active' },
            { text: "打開地圖🗺️，嘗試尋找最近的避難小屋！", staminaChange: 8, waterChange: 0, outcomeText: `地圖上標示著一處隱蔽的避難小屋！大家成功躲進小屋，避免了最糟糕的情況。查看地圖的同學立了大功。`, requiredItem: 'map', consumeItem: 'map' },
            { text: "吃下能量棒🍫，補充體力抵禦寒冷。", staminaChange: 10, waterChange: 0, outcomeText: `能量棒讓吃下的同學身體發熱，暫時抵禦了嚴寒！`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "遇到一位同樣在爬山，但嚴重脫水的老爺爺！他看起來非常虛弱。👴💧",
        options: [
            { text: "將水瓶💧裡的水分給老爺爺。", staminaChange: -5, waterChange: -8, outcomeText: `老爺爺恢復了精神，並感謝你們！分享水瓶的同學雖然水分大減，但助人為樂讓其心靈得到慰藉。😊`, requiredItem: 'waterBottle', consumeItem: 'waterBottle', collaborationPointsAwarded: 10 },
            { text: "很抱歉，我們的水也不多了…", staminaChange: -10, waterChange: 0, outcomeText: `老爺爺無奈地離開，大家感到一陣內疚，每個人的體力都微幅下降。😔`, effectScope: 'all_active' }
        ]
    },
    // 人物/搞笑類事件
    {
        stage: "陡峭的試煉之坡 🧗",
        text: "陡坡旁，一朵從未見過的美麗花朵🌸吸引了大家的目光。",
        options: [
            { text: "欣賞一下就好，不要採摘，保護自然生態。💖", staminaChange: 3, waterChange: 0, outcomeText: `花朵散發出治癒的光芒，讓欣賞的同學精神一振。😌 體力小幅增加！` },
            { text: `哇！好漂亮！[studentName]，快摘下來送給 ${window.teacherName}！🎁`, staminaChange: -8, waterChange: -5, outcomeText: `花朵枯萎了，空氣中瀰漫著一股奇怪的氣味，讓 [studentName] 和 ${window.teacherName} 感到有點不舒服。🤢 他們的體力水分下降！` },
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
        text: `${window.teacherName}突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
        options: [
            { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班同學體力小幅增加！`, effectScope: 'all_active' }
        ]
    },
    {
        stage: "陡峭的試煉之坡 🧗",
        text: `[studentName] 同學不小心在濕滑的岩石上扭到了腳，臉色發白！😩`,
        options: [
            { text: "趕快停下來休息，簡單處理傷口。", staminaChange: -8, waterChange: -8, outcomeText: `大家停下來照顧 [studentName]，雖然處理了傷口，但耽誤了時間，[studentName] 和照顧的同學體力水分都下降了。` },
            { text: "拿出急救包🩹，進行專業處理！", staminaChange: 10, waterChange: 0, outcomeText: `急救包中的繃帶和藥品迅速緩解了 [studentName] 的疼痛，[studentName] 和使用急救包的同學士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
        ],
        needsStudent: true
    }
];

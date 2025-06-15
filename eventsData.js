// eventsData.js - Contains all game event definitions

export const eventsByStage = {
    "intro": [
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "各位六年四班的勇士們，準備好了嗎？前方就是傳說中的『智慧之山』！💪",
            options: [{ text: "開始我們的旅程！🚀", staminaChange: 0, waterChange: 0, outcomeText: `賴冠儒老師：「同學們，我們的目標是山頂！記住，團結就是力量！」😊` }]
        }
    ],
    "forest": [
        // 迷路類事件
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "突然，前方小徑被濃霧籠罩，出現了兩條岔路。該走哪條呢？🌫️",
            options: [
                { text: "跟隨賴冠儒老師，走看起來比較穩重的那條路。😎", staminaChange: -5, waterChange: -3, outcomeText: `賴冠儒老師帶大家沉著應對，成功走出迷霧。👏 但走了些冤枉路。` },
                { text: "讓 [studentName] 帶頭走那條看起來有蝴蝶🦋的路！", staminaChange: -20, waterChange: -8, outcomeText: `哎呀！[studentName] 帶大家繞了一大圈，還差點踩到泥坑！💦 體力水分都下降了！某同學：「我肚子好餓喔…」` },
                { text: "拿出地圖🗺️，仔細比對路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示這條路是捷徑！大家輕鬆通過，體力小幅恢復。`, requiredItem: 'map', consumeItem: 'map' }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "周圍的樹木長得一模一樣，大家感覺迷失了方向！🔄",
            options: [
                { text: "原地等待，或許能找到線索。", staminaChange: -10, waterChange: -5, outcomeText: `原地等待耗費了時間和體力，大家感到更加焦慮。` },
                { text: "拿出地圖🗺️，嘗試辨別方向。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰地顯示了正確的路線！大家重新找到方向，精神一振！`, requiredItem: 'map', consumeItem: 'map' }
            ]
        },
        // 食物/資源類事件
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "路邊發現一棵結滿紅色果實的樹，看起來很誘人。要吃嗎？🍎",
            options: [
                { text: "雖然看起來好吃，但野外的東西還是別亂吃比較好。🙅‍♀️", staminaChange: 0, waterChange: 0, outcomeText: `賴冠儒老師：「做得好同學們，野外求生知識很重要！」👍` },
                { text: "哇！看起來好美味！讓 [studentName1] 和 [studentName2] 快去摘來吃！😋", staminaChange: -25, waterChange: -10, outcomeText: `[studentName1] 和 [studentName2] 開心地吃了起來，結果肚子痛得哇哇叫！😫 體力水分大減！(附帶搞笑音效：噗嚕噗嚕) 某同學：「我好想回家上廁所喔…"` },
                { text: "使用急救包🩹，分析果實是否有毒！", staminaChange: 5, waterChange: 0, outcomeText: `急救包中的檢測工具顯示果實有毒！幸好沒有吃，還因此恢復了一些精神！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit', numStudents: 0 } // Example: no students in this option text
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "灌木叢中隱約看見一個閃閃發光的寶箱！要打開嗎？📦✨",
            options: [
                { text: "小心翼翼地打開寶箱，看看裡面有什麼。", staminaChange: 10, waterChange: 5, outcomeText: `寶箱裡裝滿了能量棒🍫和一瓶清涼的山泉水💧！真是意外之喜！賴冠儒老師：「看來冒險還是有回報的！」`, giveItem: ['energyBar', 'waterBottle'] },
                { text: "寶箱可能有陷阱！還是別碰比較好。", staminaChange: -5, waterChange: 0, outcomeText: `寶箱消失了。什麼都沒發生，但大家有點失望。😶` }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "走著走著，發現路邊有一個遺落的背包🎒！裡面似乎有東西。",
            options: [
                { text: "打開背包，看看裡面是什麼。", staminaChange: 8, waterChange: 5, outcomeText: `背包裡有零食🍪和一張舊地圖🗺️！真是意外的收穫！`, giveItem: ['snack', 'map'] },
                { text: "不拿別人的東西，繼續趕路。", staminaChange: -2, waterChange: 0, outcomeText: `大家繼續前進，沒有理會遺落的背包。` }
            ]
        },
        // 動物/自然類事件
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "一群調皮的猴子🐒突然跳出來，對著大家吱吱叫，還想搶走 [studentName] 的背包！",
            options: [
                { text: "趕快大聲驅趕猴子！🗣️", staminaChange: -12, waterChange: -5, outcomeText: `猴子嚇了一跳跑掉了，但大家也因此耗費了點力氣。💦` },
                { text: "拿出零食🍪丟給猴子，分散牠們的注意力。", staminaChange: 8, waterChange: 0, outcomeText: `猴子們開心地吃著零食，大家趁機溜走了！😇 全班體力小幅增加！`, requiredItem: 'snack', consumeItem: 'snack' }
            ],
            needsStudent: true
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "森林深處傳來一陣奇特的聲音，好像有什麼在呼喚…會是寶藏還是危險？🤔",
            options: [
                { text: "跟隨聲音，一探究竟！🕵️‍♀️", staminaChange: 12, waterChange: 8, outcomeText: `原來是一處清澈的隱藏山泉💧，大家喝了口泉水，精神為之一振！全班體力水分增加！` },
                { text: "安全為上，不要理會，繼續前進。🚶‍♂️", staminaChange: -3, waterChange: -2, outcomeText: `聲音漸漸消失了，大家繼續前進。沒有任何變化，但有點口渴。` }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "一條毒蛇🐍突然從草叢中竄出，擋住了去路！",
            options: [
                { text: "大聲叫喊，試圖嚇跑牠。", staminaChange: -12, waterChange: -5, outcomeText: `毒蛇只是縮了一下，然後更加 агрессивно。大家嚇得體力下降。` },
                { text: "使用驅蟲劑🧴，嘗試驅趕牠。", staminaChange: 8, waterChange: 0, outcomeText: `驅蟲劑的特殊氣味讓毒蛇感到不適，牠迅速溜走了！`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "一隻小動物被捕獸夾困住了，發出痛苦的哀嚎。救還是不救？🥺",
            options: [
                { text: "小心地解救小動物。❤️", staminaChange: -15, waterChange: -8, outcomeText: `雖然耗費了體力，但成功解救了小動物，大家感到非常欣慰。` },
                { text: "使用急救包🩹，為小動物處理傷口後放生。", staminaChange: 10, waterChange: 0, outcomeText: `小動物感激地離開，你們的善舉讓大家士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
            ]
        },
        // 環境/地形類事件
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "一棵巨大的古樹🌳被茂密的藤蔓纏繞，似乎擋住了某些東西。藤蔓縫隙間隱約閃爍著光芒！",
            options: [
                { text: "合力撥開藤蔓，看看裡面有什麼！", staminaChange: -15, waterChange: -5, outcomeText: `大家費力地撥開藤蔓，找到了一瓶驅蟲劑🧴！但大家也累壞了。`, giveItem: ['insectRepellent'] },
                { text: "使用求生繩索🎗️，試圖拉開藤蔓。", staminaChange: 8, waterChange: 0, outcomeText: `用繩索巧妙地拉開藤蔓，發現裡面藏著一個急救包🩹！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', giveItem: ['firstAidKit'] }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "前方出現一片茂密的荊棘林，寸步難行。尖銳的刺讓人望而卻步！🌵",
            options: [
                { text: "小心翼翼地穿過，避免被刺傷。", staminaChange: -15, waterChange: -7, outcomeText: `大家小心通過，雖然沒受傷，但體力水分消耗不少。` },
                { text: "使用求生繩索🎗️，試圖綁開一條路。", staminaChange: 5, waterChange: 0, outcomeText: `用繩索巧妙地撥開荊棘，開闢了安全通道！體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        // 天氣/搞笑類事件
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "天空突然烏雲密布，一陣雷陣雨⛈️傾盆而下！",
            options: [
                { text: "趕快找地方避雨！☔", staminaChange: -10, waterChange: -10, outcomeText: `大家躲在樹下，雖然沒被淋濕，但時間和體力都消耗了。` },
                { text: "穿上雨衣，繼續冒險！🏃‍♀️", staminaChange: -15, waterChange: -8, outcomeText: `雖然有雨衣，但在雨中行進非常耗費體力！` }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "突然，一隻頑皮的松鼠🐿️跳出來，搶走了[studentName]的零食🍪！",
            options: [
                { text: "算了，讓牠吃吧！大家看著松鼠搞笑的樣子，都笑了。😂", staminaChange: 2, waterChange: 0, outcomeText: `大家哄堂大笑！😂 全班體力+2 (精神愉悅)！[studentName]表示：「我的零食啦！🍪」`, needsStudent: true }
            ]
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: `賴冠儒老師突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
            options: [
                { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班體力小幅增加！` }
            ]
        },
        // 教育任務
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "賴冠儒老師：「同學們，如果我們沒有地圖，在森林裡該如何辨識方向呢？」🤔",
            options: [
                { text: "看太陽的方向。☀️", staminaChange: 8, waterChange: 0, outcomeText: `正確！賴冠儒老師點頭稱讚，大家學到了一課，精神為之一振！` },
                { text: "看哪邊樹比較多。", staminaChange: -5, waterChange: -3, outcomeText: `嗯…這個方法不太可靠喔！賴冠儒老師搖了搖頭，大家體力微減。` }
            ]
        },
         {
            stage: "山腳下的迷霧森林 🌳",
            text: "賴冠儒老師：「在野外看到不認識的植物，我們應該怎麼做？」🌿",
            options: [
                { text: "不隨意觸摸或採摘。🙅‍♀️", staminaChange: 5, waterChange: 0, outcomeText: `正確！賴冠儒老師稱讚你們謹慎的態度！` },
                { text: "先聞聞看有沒有毒。", staminaChange: -8, waterChange: -3, outcomeText: `這個方法很危險！賴冠儒老師提醒大家不要輕易嘗試。` }
            ]
        }
        // 同學互動類事件 (森林)
        ,{
            stage: "山腳下的迷霧森林 🌳",
            text: "[studentName1] 興奮地指著一條隱密的小路說：『老師！我覺得這條是捷徑！』但 [studentName2] 卻皺著眉頭說：『看起來有點危險耶…』",
            options: [
                { text: "相信 [studentName1] 的直覺，走小路！", staminaChange: -15, waterChange: -7, outcomeText: `小路崎嶇難行，還繞了一大圈！[studentName1] 不好意思地搔搔頭。大家體力水分下降。` },
                { text: "聽 [studentName2] 的，還是走原路吧。", staminaChange: -5, waterChange: -3, outcomeText: `大家穩紮穩打，雖然多花了一點時間，但安全無虞。` },
                { text: "賴冠儒老師：「大家先別急，我用地圖🗺️確認一下。」", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示小路確實是陷阱！幸好有地圖，避開了危險。`, requiredItem: 'map', consumeItem: 'map' }
            ],
            needsStudent: true
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "走了好一段路，[studentName1] 看起來有點累，垂頭喪氣的。[studentName2] 見狀，從背包拿出珍藏的糖果。",
            options: [
                { text: "[studentName2]：「[studentName1]，吃顆糖吧！打起精神來！」", numStudents: 2, staminaChange: 8, waterChange: 2, outcomeText: `[studentName1] 感激地接過糖果，甜甜的味道讓他重新振作起來！同學間的友愛真棒！`, unlocksPhoto: true },
                { text: "賴冠儒老師：「[studentName1]，如果真的不舒服，我們可以稍微休息一下。」", staminaChange: 5, waterChange: 5, outcomeText: `大家短暫休息，[studentName1] 感覺好多了。老師也趁機提醒大家注意身體狀況。`},
                { text: "假裝沒看到，繼續趕路。", staminaChange: -5, waterChange: -2, outcomeText: `大家默默趕路，[studentName1] 感到有些失落，隊伍氣氛有點低迷。` }
            ],
            needsStudent: true
        },
        {
            stage: "山腳下的迷霧森林 🌳",
            text: "「啊！我的帽子被風吹到樹上了！」[studentName] 著急地說。帽子掛在不高的樹枝上。",
            options: [
                { text: "[studentName2] 身手矯健，爬上去幫忙拿下來了！", numStudents: 1, staminaChange: 3, waterChange: 0, outcomeText: `[studentName2] 俐落地取回了帽子，[studentName] 非常感謝！大家為 [studentName2] 歡呼！`, unlocksPhoto: true }, // Assuming [studentName2] in outcome refers to the one in option
                { text: "大家一起想辦法用長樹枝把帽子勾下來。", staminaChange: 0, waterChange: -1, outcomeText: `費了一番功夫，總算把帽子弄下來了，雖然有點狼狽但很有趣。` },
                { text: "「只是一頂帽子，別管它了，趕路要緊。」", staminaChange: -3, waterChange: -1, outcomeText: `[studentName] 有點難過，但隊伍還是繼續前進了。` }
            ],
            needsStudent: true
        }
    ],
    "path": [
        // 路線/地形類事件
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "前方小徑變得濕滑，有一段狹窄的碎石路。怎麼辦？⚠️",
            options: [
                { text: "大家小心翼翼地走，互相扶持。", staminaChange: -8, waterChange: -5, outcomeText: `大家互相幫助，成功通過濕滑路段。🤝 但體力水分消耗不小。` },
                { text: "讓 [studentName] 先衝過去探路！", staminaChange: -18, waterChange: -10, outcomeText: `[studentName] 雖然很勇敢，但不小心滑了一跤，膝蓋擦傷了！😩 體力水分下降了！` },
                { text: "使用急救包🩹處理擦傷，並協助通過！", staminaChange: 10, waterChange: 0, outcomeText: `[studentName] 的傷口得到及時處理，全班士氣大振，順利通過！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "前方突然出現一棵倒塌的大樹🪵，擋住了整條路！怎麼辦？",
            options: [
                { text: "全班一起合作，試著把樹枝推開！💪", staminaChange: -10, waterChange: -7, outcomeText: `大家齊心協力，雖然費了些力氣，但成功清開了道路！🤝` },
                { text: "找找看有沒有繞道的小路。迂迴而行。", staminaChange: -12, waterChange: -8, outcomeText: `雖然繞過了倒樹，但多走了不少冤枉路，體力水分消耗不少。😅` },
                { text: "使用求生繩索🎗️，嘗試固定大樹，開闢安全通道。", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索巧妙地固定住大樹，大家安全通過！省下了不少力氣。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "一條湍急的河流擋住了去路！河水看起來很深，沒有橋。🌊",
            options: [
                { text: "尋找淺水處，小心涉水過河。", staminaChange: -20, waterChange: -15, outcomeText: `大家小心翼翼地過河，雖然沒有危險，但被冰冷的河水凍得體力水分大減。🥶` },
                { text: "使用求生繩索🎗️，搭建臨時的過河通道！", staminaChange: 12, waterChange: 0, outcomeText: `利用繩索成功搭建了安全通道，大家輕鬆過河！體力甚至有所恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "前方是萬丈深淵的斷崖！唯一的路徑是一條搖搖欲墜的吊橋。🌉",
            options: [
                { text: "小心通過吊橋。", staminaChange: -22, waterChange: -12, outcomeText: `大家膽戰心驚地通過了吊橋，體力水分消耗巨大。` },
                { text: "使用求生繩索🎗️，加固吊橋後再通過！", staminaChange: 15, waterChange: 0, outcomeText: `用繩索加固了吊橋，大家安全且快速地通過了斷崖！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "前方出現一條岔路，一邊通往平靜的湖泊🏞️，另一邊則是沿著陡峭山脊的山路⛰️。",
            options: [
                { text: "選擇湖泊路線，或許能找到水源。", staminaChange: -5, waterChange: 10, outcomeText: `湖泊風光秀麗，大家補充了水瓶，但路徑稍微遠了一點。`, giveItem: ['waterBottle'] },
                { text: "選擇山脊路線，路程較短但崎嶇。", staminaChange: -10, waterChange: -5, outcomeText: `山脊路線雖然崎嶇，但確實縮短了路程，只是消耗了更多體力。` }
            ]
        },
        // 動物/威脅類事件
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "突然，一隻大野豬🐗衝了出來，擋住去路！",
            options: [
                { text: "大家手牽手，小聲地繞過去，不要驚動牠。🤫", staminaChange: 5, waterChange: -2, outcomeText: `成功的避開了野豬，全員安全通過。😊 但費了點時間。` },
                { text: "讓 [studentName]，你是班上跑最快的！快衝過去嚇跑牠！💨", staminaChange: -25, waterChange: -12, outcomeText: `[studentName] 雖然跑得快，但野豬也不是省油的燈！追得大家氣喘吁吁！🥵 體力水分大減！某同學：「我快喘不過氣了！」` },
                { text: "丟出能量棒🍫引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野豬被能量棒吸引，大家趁機溜走！`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "一股巨大的嗡嗡聲傳來，一大群惱人的蚊蟲🐝正朝著大家飛來！",
            options: [
                { text: "拿出驅蟲劑🧴噴灑，快速驅散牠們！", staminaChange: 5, waterChange: 0, outcomeText: `防蚊液有效！蚊蟲被驅散，大家鬆了口氣，體力小幅恢復。😌`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' },
                { text: "瘋狂揮舞雙手，試圖趕走牠們！👋", staminaChange: -18, waterChange: -8, outcomeText: `蚊蟲還是叮了不少包，大家又癢又累，體力水分下降。😩 某同學：「我的手好痠啊！」` }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "一聲低沉的咆哮聲傳來，一隻飢餓的野獸🐻出現在前方！",
            options: [
                { text: "迅速躲藏，避免衝突。", staminaChange: -18, waterChange: -10, outcomeText: `大家躲過了野獸，但精神緊張，體力水分下降。` },
                { text: "丟出零食🍪引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野獸被零食吸引，大家趁機溜走！`, requiredItem: 'snack', consumeItem: 'snack' }
            ]
        },
        // 資源/環境類事件
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "太陽高掛，烈日炎炎☀️！大家感到口乾舌燥，體力消耗加快。",
            options: [
                { text: "趕快找陰涼處休息，補充水分。", staminaChange: -8, waterChange: 10, outcomeText: `大家找到一片陰涼，補充了水分，精神恢復不少，但耽誤了時間。`, giveItem: ['waterBottle'] },
                { text: "忍著口渴繼續趕路！", staminaChange: -15, waterChange: -15, outcomeText: `硬撐著趕路讓大家體力水分都快速流失。😩` },
                { text: "使用水瓶💧補充水分。", staminaChange: 5, waterChange: 15, outcomeText: `喝了水瓶裡的水，瞬間感到清涼舒暢，體力水分都有恢復！`, requiredItem: 'waterBottle', consumeItem: 'waterBottle' }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "走進一個幽靜的山谷，突然聽到奇怪的迴音，似乎有什麼東西在附近。🏞️",
            options: [
                { text: "小心探索，看是否能發現什麼。", staminaChange: 5, waterChange: 8, outcomeText: `發現了一處隱蔽的泉眼，補充了水瓶！體力也小幅恢復。`, giveItem: ['waterBottle'] },
                { text: "快速通過，避免不必要的麻煩。", staminaChange: -5, waterChange: -2, outcomeText: `大家加快腳步，快速通過山谷。沒有發生特別的事情。` }
            ]
        },
        // 教育任務
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "一位老山神📚現身，祂說：「想通過此路，需回答我的問題！」賴冠儒老師：「同學們，這是考驗我們智慧的時候！」",
            options: [
                { text: "賴冠儒老師：「請問六年四班總共有幾位同學？」(答28)", staminaChange: 15, waterChange: 5, outcomeText: `答案是28位同學！山神點頭稱讚，並贈予清涼山泉！✨ 全班體力水分增加！` },
                { text: "賴冠儒老師：「在野外食物中毒，第一時間該怎麼辦？」(答催吐/求助)", staminaChange: 15, waterChange: 5, outcomeText: `正確答案是催吐並尋求幫助！山神滿意點頭，贈予補給品！✨ 全班體力水分增加！` },
                { text: "賴冠儒老師：「野外迷路時，看到什麼不該碰？」(答毒菇/奇怪的果實)", staminaChange: 15, waterChange: 5, outcomeText: `正確！遠離不明動植物是野外求生基本原則！山神贈予補給！✨ 全班體力水分增加！` },
                { text: "隨便猜一個！", staminaChange: -20, waterChange: -10, outcomeText: `答錯了…山神嘆了口氣，給了大家一個小小的懲罰。😔 全班體力水分下降！某同學：「下次要好好讀書了！」` }
            ]
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "賴冠儒老師：「同學們，在野外如何最有效地節約水資源呢？」🤔",
            options: [
                { text: "避免劇烈運動，減少出汗。", staminaChange: 5, waterChange: 0, outcomeText: `正確！賴冠儒老師點頭，大家學到寶貴一課，體力小幅恢復！` },
                { text: "少量多次飲用。", staminaChange: 5, waterChange: 0, outcomeText: `正確！這有助於身體吸收水分！` },
                { text: "直接喝池塘水。", staminaChange: -15, waterChange: -10, outcomeText: `錯！池塘水可能有寄生蟲或細菌，非常危險！體力水分下降！` }
            ]
        },
        // 同學互動類事件 (山徑)
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "[studentName1] 和 [studentName2] 為了「午餐要吃什麼口味的能量棒」而鬥嘴，氣氛有點緊張。",
            options: [
                { text: "賴冠儒老師：「好了好了，口味不重要，能補充體力就好。不如我們來玩個詞語接龍轉移注意力？」", numStudents: 0, staminaChange: 5, waterChange: 1, outcomeText: `老師巧妙地化解了爭執，詞語接龍讓大家心情愉快起來。`, unlocksPhoto: true },
                { text: "[studentName3] 加入：「我覺得巧克力口味最棒！」", staminaChange: -8, waterChange: -4, outcomeText: `爭論變得更激烈了！老師無奈地搖搖頭，大家覺得更累了。` },
                { text: "不理他們，讓他們自己吵完。", staminaChange: -5, waterChange: -2, outcomeText: `爭吵聲讓隊伍的氣氛不太好。` }
            ],
            needsStudent: true
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "[studentName] 發現地上有一枚奇特的徽章，上面刻著看不懂的符號。",
            options: [
                { text: "撿起來給大家看，一起研究研究。", staminaChange: 2, waterChange: 0, outcomeText: `大家圍觀著徽章，七嘴八舌地猜測它的來歷，雖然沒什麼結論，但也增添了旅途的趣味。` },
                { text: "提醒 [studentName]：「路邊的東西別亂撿，可能有細菌或不吉利。」", staminaChange: 3, waterChange: 1, outcomeText: `[studentName] 點點頭，把徽章放回原處。謹慎的態度讓大家感到安心。` },
                { text: "偷偷藏起來，說不定是寶物！", staminaChange: -2, waterChange: -1, outcomeText: `[studentName] 把徽章藏了起來，但心裡總覺得有點不安。` }
            ],
            needsStudent: true
        },
        {
            stage: "蜿蜒的山腰小徑 🚶‍♀️",
            text: "走到一處風景優美的地方，[studentName1] 提議：「我們在這裡拍張大合照吧！」",
            options: [
                { text: "好主意！大家一起擺出最帥最美的姿勢！", numStudents: 0, staminaChange: 7, waterChange: 3, outcomeText: `「喀擦！」一張充滿活力的合照誕生了！大家心情愉悅，疲勞感也減輕不少。`, unlocksPhoto: true },
                { text: "「快點拍啦，我好累喔…」[studentName2] 不耐煩地說。", staminaChange: -3, waterChange: -2, outcomeText: `雖然還是拍了照，但有些同學看起來興致不高。` },
                { text: "「趕路要緊，等攻頂再拍吧！」", staminaChange: 0, waterChange: -1, outcomeText: `大家同意了，繼續埋頭趕路。` }
            ],
            needsStudent: true
        }
    ],
    "slope": [
        // 路線/地形類事件
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "攀爬時，一段老舊的繩索⛓️突然出現裂痕！該怎麼辦？",
            options: [
                { text: "不要慌！讓賴冠儒老師指導，大家小心地一步一步通過。", staminaChange: -10, waterChange: -5, outcomeText: `賴冠儒老師冷靜指揮，大家互相扶持，成功克服難關。💪 但耗費不少精力。` },
                { text: "別怕！[studentName] 你力氣最大，抓緊繩子，我們一起衝過去！", staminaChange: -35, waterChange: -18, outcomeText: `繩索不堪重負，斷裂了！雖然沒人受傷，但大家嚇出了一身冷汗，並花費更多時間繞道。😱 全班體力水分大減！某同學：「我的心臟快跳出來了！」` },
                { text: "使用求生繩索🎗️加固，確保安全！", staminaChange: 15, waterChange: 0, outcomeText: `利用結實的求生繩索加固了老舊的繩子，大家安全無虞地攀爬，體力大幅恢復！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "前方出現了一段幾乎垂直的岩壁，看起來非常難以攀爬！😨",
            options: [
                { text: "仔細規劃路線，利用老師教的攀爬技巧。", staminaChange: -20, waterChange: -10, outcomeText: `大家憑藉著毅力和聰明才智，一步步克服了岩壁！🙌 但體力水分消耗不小！` },
                { text: "試圖強行突破，看看能不能爬上去！", staminaChange: -30, waterChange: -15, outcomeText: `嘗試強攻岩壁失敗，反而耗費了大量體力水分，還差點有人受傷！😬` },
                { text: "吃下能量棒🍫，補充體力再攀爬！", staminaChange: 12, waterChange: 0, outcomeText: `能量棒讓大家精神大振！攀爬變得輕鬆許多，體力大幅恢復。`, requiredItem: 'energyBar', consumeItem: 'energyBar' },
                { text: "使用求生繩索🎗️，搭建臨時攀爬點！", staminaChange: 15, waterChange: 0, outcomeText: `利用繩索，大家迅速建立了安全攀爬點，輕鬆通過！`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "前方一處看似穩固的峭壁突然開始崩塌！腳下碎石滾落，情況危急！🚧",
            options: [
                { text: "迅速判斷，找到最安全的跳躍點！🏃‍♀️", staminaChange: -25, waterChange: -12, outcomeText: `大家驚險地跳了過去，雖然成功但體力水分耗費不少，心跳加速！` },
                { text: "拿出求生繩索🎗️，快速固定並滑下！", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索，大家有條不紊地通過了崩塌區，安全又省力！體力小幅恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' },
                { text: "打開地圖🗺️，尋找是否有其他安全通道。", staminaChange: 12, waterChange: 0, outcomeText: `地圖清晰標示了一條隱蔽的山路，成功避開了崩塌區！`, requiredItem: 'map', consumeItem: 'map' }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "聽到前方傳來隆隆聲，似乎有滑坡的跡象！必須立刻做出反應！",
            options: [
                { text: "快速尋找掩蔽物躲藏！", staminaChange: -18, waterChange: -8, outcomeText: `大家雖然躲開了滑坡，但過程驚險，耗費了大量體力水分。` },
                { text: "利用地圖🗺️，尋找安全繞行路線！", staminaChange: 10, waterChange: 0, outcomeText: `地圖顯示了一條隱蔽且安全的繞行小路，大家順利避開了危險！`, requiredItem: 'map', consumeItem: 'map' }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "路旁出現一個深不見底的漆黑洞穴，裡面傳來陣陣陰冷的風。🦇",
            options: [
                { text: "好奇心驅使，進去看看！🔦", staminaChange: -15, waterChange: -8, outcomeText: `洞穴深處什麼都沒有，只讓大家感到一陣陰森，並消耗了體力水分。` },
                { text: "使用求生繩索🎗️，探索洞穴深處，或許有寶藏？", staminaChange: 10, waterChange: 5, outcomeText: `利用繩索探索，意外發現了一處寶藏，裡面有額外的能量棒和水！`, requiredItem: 'survivalRope', giveItem: ['energyBar', 'waterBottle'] },
                { text: "使用急救包🩹，測試洞穴內的空氣是否安全！", staminaChange: 5, waterChange: 0, outcomeText: `急救包的儀器顯示洞穴空氣無毒，但太深了不適合深入。發現了一瓶驅蟲劑！`, requiredItem: 'firstAidKit', giveItem: ['insectRepellent'] }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "前方又出現了一條新的岔路，一邊是沿著瀑布的濕滑小徑💦，另一邊是直接穿越懸崖的峭壁⛰️。",
            options: [
                { text: "選擇瀑布小徑，或許風景不錯。", staminaChange: -10, waterChange: -5, outcomeText: `瀑布小徑濕滑難行，雖然風景優美，但體力水分消耗不少。` },
                { text: "選擇懸崖峭壁，看起來更直接。", staminaChange: -15, waterChange: -8, outcomeText: `懸崖峭壁雖然直接，但非常陡峭，需要耗費更多體力！` },
                { text: "使用地圖🗺️，看看哪條路更安全或有隱藏好處。", staminaChange: 5, waterChange: 0, outcomeText: `地圖顯示懸崖峭壁後有一處避風港，大家決定走峭壁！`, requiredItem: 'map', consumeItem: 'map' }
            ]
        },
        // 動物/威脅類事件
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "一隻巨大的野熊🐻‍❄️攔在路上，看起來非常飢餓且具有攻擊性！",
            options: [
                { text: "丟出能量棒🍫，吸引牠的注意力並逃跑！", staminaChange: -15, waterChange: -10, outcomeText: `野熊被能量棒吸引，大家趁機迅速逃離！`, requiredItem: 'energyBar', consumeItem: 'energyBar' },
                { text: "嘗試繞道，但路徑非常危險。", staminaChange: -25, waterChange: -15, outcomeText: `繞道過程驚險萬分，耗費了巨大的體力水分。` }
            ]
        },
        // 資源/環境類事件
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "天氣驟變！一場突如其來的暴風雪❄️開始席捲山坡，能見度極低，氣溫驟降！",
            options: [
                { text: "盡快找地方避風雪，等待天氣好轉。", staminaChange: -30, waterChange: -15, outcomeText: `大家躲在岩石後，雖然避開了最猛烈的風雪，但寒冷和恐懼仍讓體力水分快速流失。🥶` },
                { text: "打開地圖🗺️，嘗試尋找最近的避難小屋！", staminaChange: 8, waterChange: 0, outcomeText: `地圖上標示著一處隱蔽的避難小屋！大家成功躲進小屋，避免了最糟糕的情況。`, requiredItem: 'map', consumeItem: 'map' },
                { text: "吃下能量棒🍫，補充體力抵禦寒冷。", staminaChange: 10, waterChange: 0, outcomeText: `能量棒讓大家身體發熱，暫時抵禦了嚴寒！`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "遇到一位同樣在爬山，但嚴重脫水的老爺爺！他看起來非常虛弱。👴💧",
            options: [
                { text: "將水瓶💧裡的水分給老爺爺。", staminaChange: -5, waterChange: -20, outcomeText: `老爺爺恢復了精神，並感謝你們！雖然水分大減，但助人為樂讓大家心靈得到慰藉。😊`, requiredItem: 'waterBottle', consumeItem: 'waterBottle' },
                { text: "很抱歉，我們的水也不多了…", staminaChange: -10, waterChange: 0, outcomeText: `老爺爺無奈地離開，大家感到一陣內疚，體力微幅下降。😔` }
            ]
        },
        // 人物/搞笑類事件
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "陡坡旁，一朵從未見過的美麗花朵🌸吸引了大家的目光。",
            options: [
                { text: "欣賞一下就好，不要採摘，保護自然生態。💖", staminaChange: 3, waterChange: 0, outcomeText: `花朵散發出治癒的光芒，讓大家精神一振。😌 全班體力小幅增加！` },
                { text: "哇！好漂亮！[studentName]，快摘下來送給賴冠儒老師！🎁", staminaChange: -12, waterChange: -5, outcomeText: `花朵枯萎了，空氣中瀰漫著一股奇怪的氣味，讓大家感到有點不舒服。🤢 全班體力水分下降！` },
                { text: "使用急救包🩹，分析花朵是否可用於恢復！", staminaChange: 5, waterChange: 0, outcomeText: `急救包顯示這朵花有微弱的治癒效果！士氣小幅提升。`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
            ],
            needsStudent: true
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "突然，一隻頑皮的松鼠🐿️跳出來，搶走了[studentName]的零食🍪！",
            options: [
                { text: "算了，讓牠吃吧！大家看著松鼠搞笑的樣子，都笑了。😂", staminaChange: 2, waterChange: 0, outcomeText: `大家哄堂大笑！😂 全班體力+2 (精神愉悅)！[studentName]表示：「我的零食啦！🍪」`, needsStudent: true }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: `賴冠儒老師突然講了一個超級冷的笑話…🥶 「有一隻豬牠很熱，就…中暑了！」`,
            options: [
                { text: "哈哈哈…好冷喔…🤣", staminaChange: 1, waterChange: 0, outcomeText: `同學們集體黑線…但笑一笑還是好的。😅 全班體力小幅增加！` }
            ]
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: `[studentName] 同學不小心在濕滑的岩石上扭到了腳，臉色發白！😩`,
            options: [
                { text: "趕快停下來休息，簡單處理傷口。", staminaChange: -15, waterChange: -8, outcomeText: `大家停下來照顧 [studentName]，雖然處理了傷口，但耽誤了時間，體力水分都下降了。` },
                { text: "拿出急救包🩹，進行專業處理！", staminaChange: 10, waterChange: 0, outcomeText: `急救包中的繃帶和藥品迅速緩解了 [studentName] 的疼痛，大家得以繼續前進！士氣大振！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
            ],
            needsStudent: true
        },
        // 教育任務
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "一隻看似睿智的老貓頭鷹🦉停在樹上，牠說：「年輕的登山者啊，若想通過，請回答我的謎題：『身體是黑的，心卻是紅的，是什麼？』」",
            options: [
                { text: "答案是：西瓜！🍉", staminaChange: 15, waterChange: 8, outcomeText: `答對了！老貓頭鷹滿意地點點頭，一束光芒指引了前進的道路！✨ 全班體力水分大幅增加！` },
                { text: "答案是：黑森林蛋糕！🍰 (賴冠儒老師：「別鬧了！」)", staminaChange: -20, waterChange: -10, outcomeText: `老貓頭鷹嘆了口氣，大家因此受到了一點考驗，體力水分下降。😔 某同學：「我好想吃蛋糕…」` }
            ]
        },
        // 同學互動類事件 (山坡)
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "攀爬時，[studentName1] 的背包拉鍊開了，裡面的地圖🗺️掉了出來，眼看就要滑落山谷！[studentName2] 眼明手快，一把抓住了地圖！",
            options: [
                { text: "太驚險了！[studentName2] 你是我們的英雄！", numStudents: 1, staminaChange: 8, waterChange: 3, outcomeText: `[studentName1] 鬆了一口氣，感激地向 [studentName2] 道謝。保住了重要的地圖，大家士氣大振！`, requiredItem: 'map', unlocksPhoto: true },
                { text: "責備 [studentName1]：「下次背包要拉好！」", staminaChange: -5, waterChange: -2, outcomeText: `氣氛有點尷尬，[studentName1] 感到有些委屈。` },
                { text: "幸好地圖沒掉，趕快收好繼續前進。", staminaChange: 0, waterChange: -1, outcomeText: `大家虛驚一場，繼續小心攀爬。`}
            ],
            needsStudent: true
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "[studentName] 突然大喊：「我看到山頂的旗子了！就在前面！」大家精神為之一振！",
            options: [
                { text: "太棒了！跟著 [studentName] 加快腳步！", staminaChange: 10, waterChange: 5, outcomeText: `雖然山頂還有點距離，但 [studentName] 的鼓勵讓大家充滿動力！` },
                { text: "賴冠儒老師：「很好！但還是要注意安全，不要衝太快。」", staminaChange: 5, waterChange: 2, outcomeText: `大家保持著高昂的士氣，穩健地繼續前進。` },
                { text: "「真的假的？我怎麼沒看到？」[studentName2] 懷疑地說。", staminaChange: -2, waterChange: -1, outcomeText: `一點小小的質疑讓剛提起的士氣又降了些。`}
            ],
            needsStudent: true
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "大家輪流分享冷笑話比賽，[studentName] 講了一個全場最冷的，連賴冠儒老師都忍不住笑了。",
            options: [
                { text: "哈哈哈…真的有夠冷…但好好笑！", numStudents: 0, staminaChange: 7, waterChange: 0, outcomeText: `歡樂的氣氛沖淡了疲憊，大家感覺輕鬆了不少！體力小幅恢復。`, unlocksPhoto: true },
                { text: "「呃…這個笑話我聽過了。」", staminaChange: -1, waterChange: 0, outcomeText: `氣氛瞬間冷了下來，但不是因為笑話。`}
            ],
            needsStudent: true
        },
        {
            stage: "陡峭的試煉之坡 🧗",
            text: "一小段路特別難走，[studentName1] 主動伸出手拉了 [studentName2] 一把，幫助他/她通過。",
            options: [
                { text: "「謝謝你！」[studentName2] 感激地說。", numStudents: 1, staminaChange: 6, waterChange: 2, outcomeText: `同學間的互助合作讓團隊更有凝聚力，大家覺得溫暖。`, unlocksPhoto: true},
                { text: "「哼，我才不需要幫忙呢！」[studentName2] 逞強地說。", staminaChange: -4, waterChange: -2, outcomeText: `[studentName2] 的嘴硬讓氣氛有點僵，[studentName1] 默默收回了手。`}
            ],
            needsStudent: true
        }
    ],
    "climax": [
        {
            stage: "風光無限的山頂 ⛰️",
            text: `最後一段路了！大家都感到非常疲憊，但山頂就在眼前！賴冠儒老師：「堅持住！我們快到了！」`,
            options: [
                { text: "全員衝刺，向山頂進發！", staminaChange: 15, waterChange: 10, outcomeText: `全班同學互相加油打氣，爆發出最後的能量！💪 成功登頂！` }
            ]
        }
    ]
};

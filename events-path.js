window.gameEventsPath = [
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "前方小徑變得濕滑，有一段狹窄的碎石路。怎麼辦？⚠️",
        options: [
            { text: "大家小心翼翼地走，互相扶持。", staminaChange: -8, waterChange: -5, outcomeText: `大家互相幫助，成功通過濕滑路段。🤝 但每個人的體力水分都消耗不小。`, effectScope: 'all_active' },
            { text: "讓 [studentName] 先衝過去探路！", staminaChange: -8, waterChange: -8, outcomeText: `[studentName] 雖然很勇敢，但不小心滑了一跤，膝蓋擦傷了！😩 [studentName] 的體力水分下降了！` },
            { text: "使用急救包🩹處理 [studentName] 的擦傷，並協助通過！", staminaChange: 10, waterChange: 0, outcomeText: `[studentName] 的傷口得到及時處理，使用急救包的同學和 [studentName] 士氣大振，順利通過！`, requiredItem: 'firstAidKit', consumeItem: 'firstAidKit' }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: `${window.teacherName}：「同學們，在野外如何最有效地節約水資源呢？」🤔`,
        options: [
            { text: "避免劇烈運動，減少出汗。", staminaChange: 5, waterChange: 0, outcomeText: `正確！${window.teacherName}點頭，大家學到寶貴一課，體力小幅恢復！`, effectScope: 'all_active' },
            { text: "少量多次飲用。", staminaChange: 5, waterChange: 0, outcomeText: `正確！這有助於身體吸收水分！`, effectScope: 'all_active' },
            { text: "直接喝池塘水。", staminaChange: -8, waterChange: -8, outcomeText: `錯！池塘水可能有寄生蟲或細菌，非常危險！大家的體力水分下降！`, effectScope: 'all_active' }
        ]
    }
    ,
    // 路線/地形類事件
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "前方突然出現一棵倒塌的大樹🪵，擋住了整條路！怎麼辦？",
        options: [
            { text: "全班一起合作，試著把樹枝推開！💪", staminaChange: -8, waterChange: -7, outcomeText: `大家齊心協力，雖然每個人都費了些力氣，但成功清開了道路！🤝`, collaborationPointsAwarded: 10, effectScope: 'all_active' },
            { text: "找找看有沒有繞道的小路。迂迴而行。", staminaChange: -8, waterChange: -8, outcomeText: `雖然繞過了倒樹，但多走了不少冤枉路，每個人的體力水分都消耗不少。😅`, effectScope: 'all_active' },
            { text: "使用求生繩索🎗️，嘗試固定大樹，開闢安全通道。", staminaChange: 10, waterChange: 0, outcomeText: `利用求生繩索巧妙地固定住大樹，大家安全通過！使用繩索的同學省下了不少力氣。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "一條湍急的河流擋住了去路！河水看起來很深，沒有橋。🌊",
        options: [
            { text: "尋找淺水處，小心涉水過河。", staminaChange: -8, waterChange: -8, outcomeText: `大家小心翼翼地過河，雖然沒有危險，但被冰冷的河水凍得每個人的體力水分大減。🥶`, effectScope: 'all_active' },
            { text: "使用求生繩索🎗️，搭建臨時的過河通道！", staminaChange: 12, waterChange: 0, outcomeText: `利用繩索成功搭建了安全通道，大家輕鬆過河！使用繩索的同學體力甚至有所恢復。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope', collaborationPointsAwarded: 8 }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "前方是萬丈深淵的斷崖！唯一的路徑是一條搖搖欲墜的吊橋。🌉",
        options: [
            { text: "小心通過吊橋。", staminaChange: -8, waterChange: -8, outcomeText: `大家膽戰心驚地通過了吊橋，每個人的體力水分都消耗巨大。`, effectScope: 'all_active' },
            { text: "使用求生繩索🎗️，加固吊橋後再通過！", staminaChange: 15, waterChange: 0, outcomeText: `用繩索加固了吊橋，大家安全且快速地通過了斷崖！使用繩索的同學感到很自豪。`, requiredItem: 'survivalRope', consumeItem: 'survivalRope' }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "前方出現一條岔路，一邊通往平靜的湖泊🏞️，另一邊則是沿著陡峭山脊的山路⛰️。",
        options: [
            { text: "選擇湖泊路線，或許能找到水源。", staminaChange: -5, waterChange: 10, outcomeText: `湖泊風光秀麗，大家補充了水瓶，但路徑稍微遠了一點。每個人的體力略降，水分增加。`, giveItem: ['waterBottle'], effectScope: 'all_active' },
            { text: "選擇山脊路線，路程較短但崎嶇。", staminaChange: -8, waterChange: -5, outcomeText: `山脊路線雖然崎嶇，但確實縮短了路程，只是消耗了每個人的更多體力！`, effectScope: 'all_active' }
        ]
    },
    // 動物/威脅類事件
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "突然，一隻大野豬🐗衝了出來，擋住去路！",
        options: [
            { text: "大家手牽手，小聲地繞過去，不要驚動牠。🤫", staminaChange: 5, waterChange: -2, outcomeText: `成功的避開了野豬，全員安全通過。😊 但每個人都費了點時間和水分。`, effectScope: 'all_active' },
            { text: "讓 [studentName]，你是班上跑最快的！快衝過去嚇跑牠！💨", staminaChange: -8, waterChange: -8, outcomeText: `[studentName] 雖然跑得快，但野豬也不是省油的燈！追得 [studentName] 和附近的同學氣喘吁吁！🥵 他們的體力水分大減！[studentName]：「我快喘不過氣了！」` },
            { text: "丟出能量棒🍫引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野豬被能量棒吸引，大家趁機溜走！丟能量棒的同學感到機智。`, requiredItem: 'energyBar', consumeItem: 'energyBar' }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "一股巨大的嗡嗡聲傳來，一大群惱人的蚊蟲🐝正朝著大家飛來！",
        options: [
            { text: "拿出驅蟲劑🧴噴灑，快速驅散牠們！", staminaChange: 5, waterChange: 0, outcomeText: `防蚊液有效！蚊蟲被驅散，大家鬆了口氣，使用驅蟲劑的同學體力小幅恢復。😌`, requiredItem: 'insectRepellent', consumeItem: 'insectRepellent' },
            { text: "瘋狂揮舞雙手，試圖趕走牠們！👋", staminaChange: -18, waterChange: -8, outcomeText: `蚊蟲還是叮了不少包，揮手的同學又癢又累，體力水分下降。😩 [studentName]：「我的手好痠啊！」` },
            { text: "瘋狂揮舞雙手，試圖趕走牠們！👋", staminaChange: -8, waterChange: -8, outcomeText: `蚊蟲還是叮了不少包，揮手的同學又癢又累，體力水分下降。😩 [studentName]：「我的手好痠啊！」` }
        ]
    },
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "一聲低沉的咆哮聲傳來，一隻飢餓的野獸🐻出現在前方！",
        options: [
            { text: "迅速躲藏，避免衝突。", staminaChange: -18, waterChange: -8, outcomeText: `大家躲過了野獸，但每個人的精神都很緊張，體力水分下降。`, effectScope: 'all_active' },
            { text: "丟出零食🍪引開牠的注意。", staminaChange: 10, waterChange: 0, outcomeText: `野獸被零食吸引，大家趁機溜走！丟零食的同學鬆了口氣。`, requiredItem: 'snack', consumeItem: 'snack' }
        ]
    },
    // 資源/環境類事件
    {
        stage: "蜿蜒的山腰小徑 🚶‍♀️",
        text: "太陽高掛，烈日炎炎☀️！大家感到口乾舌燥，體力消耗加快。",
        options: [
            { text: "趕快找陰涼處休息，補充水分。", staminaChange: -8, waterChange: 10, outcomeText: `大家找到一片陰涼，補充了水分，精神恢復不少，但耽誤了時間。每個人的體力略降，水分增加。`, giveItem: ['waterBottle'], effectScope: 'all_active' },
            { text: "忍著口渴繼續趕路！", staminaChange: -8, waterChange: -8, outcomeText: `硬撐著趕路讓每個人的體力水分都快速流失。😩`, effectScope: 'all_active' },
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
        text: `一位老山神📚現身，祂說：「想通過此路，需回答我的問題！」`,
        options: [
            { text: `${window.teacherName}：「在野外食物中毒，第一時間該怎麼辦？」(答催吐/求助)`, staminaChange: 15, waterChange: 5, outcomeText: `正確答案是催吐並尋求幫助！山神滿意點頭，贈予補給品！✨ 全班同學體力水分增加！`, effectScope: 'all_active' },
            { text: `${window.teacherName}：「野外迷路時，看到什麼不該碰？」(答毒菇/奇怪的果實)`, staminaChange: 15, waterChange: 5, outcomeText: `正確！遠離不明動植物是野外求生基本原則！山神贈予補給！✨ 全班同學體力水分增加！`, effectScope: 'all_active' },
            { text: "隨便猜一個！", staminaChange: -20, waterChange: -8, outcomeText: `答錯了…山神嘆了口氣，給了大家一個小小的懲罰。😔 全班同學體力水分下降！某同學：「下次要好好讀書了！」`, effectScope: 'all_active' }
        ]
    }
];

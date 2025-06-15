// config.js - Game configuration and static data

export const INITIAL_STAMINA = 45; // 全班共享體力值上限及初始值
export const INITIAL_WATER = 30; // 全班共享水分值上限及初始值
export const PER_TURN_STAMINA_COST = 3; // 每回合固定消耗體力
export const PER_TURN_WATER_COST = 2;   // 每回合固定消耗水分

export const teacherName = "賴冠儒老師"; // 老師的名字

// 六年四班的學生名單
export const studentNames = [
    "蔡宥丞", "蔡羽恩", "陳湘晴", "陳芊錡", "陳楷恩", "江芊妏", "賴玧樂", "廖予謙",
    "林泓佑", "林書玉", "林瑋琦", "李承宥", "劉苪希", "彭唯", "潘祐丞", "許翔淏",
    "徐翊庭", "謝從偉", "吳宥珈", "王懸", "王品勛", "黃宜潔", "黃保慈", "黃馨恩",
    "黃郁晴", "黃志懿", "張辰煥", "周宇桐"
];

// Maximum number of events to pick from each stage (can be adjusted for game length)
export const MAX_EVENTS_PER_STAGE = { forest: 15, path: 15, slope: 15 };
export const MIN_EVENTS_PER_STAGE = { forest: 8, path: 8, slope: 8 };

// 照片相關設定
export const PHOTO_BASE_PATH = "images/life_photos/";
export const ALL_PHOTO_FILENAMES = [
    // 假設檔名是 photo_001.jpg 到 photo_204.jpg
    // 為了簡潔，這裡只列出部分，你需要補全所有檔名
    "photo_001.jpg", "photo_002.jpg", "photo_003.jpg", "photo_004.jpg", "photo_005.jpg",
    "photo_006.jpg", "photo_007.jpg", "photo_008.jpg", "photo_009.jpg", "photo_010.jpg",
    // ... 請繼續添加到 "photo_204.jpg"
];

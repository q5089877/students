// 全域變數 teacherName 需要在此檔案或 script.js 中提前定義，或者作為參數傳入
// 為了簡單起見，我們假設 script.js 中的 teacherName 會先被瀏覽器解析
// 或者，你也可以在每個事件檔案的頂部重新定義 const teacherName = "賴冠儒老師";

window.gameEventsIntro = [
    {
        stage: "山腳下的迷霧森林 🌳",
        text: `各位六年四班的勇士們，我是你們的導師 ${window.teacherName}，準備好了嗎？前方就是傳說中的『智慧之山』！💪`,
        options: [{ text: "開始我們的旅程！🚀", staminaChange: 0, waterChange: 0, outcomeText: `${window.teacherName}：「同學們，我們的目標是山頂！記住，團結就是力量！」😊` }]
    }
];

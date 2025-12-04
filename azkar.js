// ملف script.js: إنشاء البطاقات وإضافة التفاعلية (نسخ/تشغيل)
// بناء البطاقات ديناميكيًا بناءً على azkar[]
const container = document.querySelector(".cards-container");
azkar.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    // فقرة النص
    const textEl = document.createElement("p");
    textEl.className = "zekr-text";
    textEl.innerHTML = item.text.replace(/\n/g, "<br>");
    card.appendChild(textEl);
    // فقرة المرجع (إن وجدت)
    if (item.ref) {
        const refEl = document.createElement("p");
        refEl.className = "zekr-ref";
        refEl.textContent = item.ref;
        card.appendChild(refEl);
    }
    // أزرار النسخ والتشغيل
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "نسخ";
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(item.text).then(() => {
            alert("تم نسخ الذكر إلى الحافظة");
        });
    });
    actions.appendChild(copyBtn);
    const playBtn = document.createElement("button");
    playBtn.className = "play-btn";
    playBtn.textContent = "▶️";
    playBtn.addEventListener("click", () => {
        const utter = new SpeechSynthesisUtterance(item.text);
        utter.lang = "ar-SA"; // إعداد اللغة العربية8
        speechSynthesis.speak(utter);
    });
    actions.appendChild(playBtn);
    card.appendChild(actions);

    container.appendChild(card);
});

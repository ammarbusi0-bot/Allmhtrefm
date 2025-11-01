// ----------------------------------------------------
// متغيرات اللعبة
// ----------------------------------------------------
let currentQuestionIndex = 0;
let currentQuestions = [];
let gameLevel = ''; 
let gameType = '';
let history = [];
let timer;
let timeLeft = 15; 
const POINTS_CORRECT_ANSWER = 10;
const COST_REMOVE_OPTION = 20;
const COST_CHANGE_QUESTION = 30;
const COST_ADD_TIME = 25; 
const SUCCESS_THRESHOLD = 7; 
const REPLAY_POINTS_CORRECT = 5; 

// متغيرات حالة اللعب
let isCurrentGameReplay = false; 
let correctAnswersInCurrentRound = 0; 

// بيانات المستخدم (تم التعديل لدعم التقدم لفتح المستويات)
let userStats = {
    name: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    points: 200, 
    unlockedLevel: 'normal', 
    answeredQuestions: { 
        normal: { tf: [], mc: [] }, 
        medium: { tf: [], mc: [] }, 
        hard: { tf: [], mc: [] } 
    }, 
    unlockedProgress: { 
        normal: { tf: [], mc: [] }, 
        medium: { tf: [], mc: [] }, 
        hard: { tf: [] } 
    },
};

// ----------------------------------------------------
// وظائف المؤثرات الصوتية (إصلاح مشكلة عدم عمل الصوت)
// ----------------------------------------------------
function playSound(type) {
    let audio;
    if (type === 'correct') {
        audio = document.getElementById('correct-sound');
    } else if (type === 'wrong') {
        audio = document.getElementById('wrong-sound');
    }
    if (audio) {
        audio.currentTime = 0; 
        audio.play().catch(e => console.error("Error playing sound:", e));
    }
}

// ----------------------------------------------------
// تحميل وحفظ البيانات
// ----------------------------------------------------
function loadInitialData(){
    const storedName = localStorage.getItem('userName');
    const storedStats = localStorage.getItem('userStats');

    if(storedName){ 
        userStats.name=storedName; 
        document.getElementById('display-user-name').textContent=storedName; 
        showScreen('main-menu',true);
    } else { 
        showScreen('splash-screen',true);
    }

    if(storedStats){
        const loadedStats=JSON.parse(storedStats);
        userStats = {
            ...userStats,
            ...loadedStats,
            points: loadedStats.points || 200, 
            unlockedLevel: loadedStats.unlockedLevel || 'normal',
            answeredQuestions: loadedStats.answeredQuestions || { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [], mc: [] } },
            unlockedProgress: loadedStats.unlockedProgress || { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [] } }
        };
        
        document.getElementById('user-points').textContent = userStats.points;
    }
}

function saveUserStats(){
    localStorage.setItem('userName',userStats.name);
    localStorage.setItem('userStats',JSON.stringify(userStats));
    updateProfileDisplay();
    document.getElementById('user-points').textContent = userStats.points; 
}

// ----------------------------------------------------
// التنقل بين الشاشات
// ----------------------------------------------------
function showScreen(screenId,isInitialLoad=false){
    clearTimer();
    closeContactModal();
    const currentActiveScreen=document.querySelector('.screen.active');
    if(currentActiveScreen && !isInitialLoad && currentActiveScreen.id!==screenId){ history.push(currentActiveScreen.id); }
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
    
    if(screenId==='profile-screen'){ updateProfileDisplay(); }
    else if(screenId==='level-select'){ updateLevelButtons(); } 

    document.getElementById('bottom-nav').style.display=(screenId==='splash-screen')?'none':'flex';
    if(screenId === 'main-menu') { history = []; }
}

function goBack(){
    clearTimer();
    if(history.length>0){
        const prev=history.pop();
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        document.getElementById(prev).classList.add('active');
        document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
    }
}

// ----------------------------------------------------
// شاشة الدخول والتواصل
// ----------------------------------------------------
function saveAndEnter(){
    const name=document.getElementById('user-name').value.trim();
    if(name){ userStats.name=name; document.getElementById('display-user-name').textContent=name; saveUserStats(); showScreen('main-menu'); }
    else alert("الرجاء إدخال اسمك أولاً!");
}

function openContactModal() { 
    document.getElementById('contact-modal').style.display = 'flex'; 
}

function closeContactModal() { 
    document.getElementById('contact-modal').style.display = 'none'; 
}


// ----------------------------------------------------
// الإحصائيات وتحديث النقاط
// ----------------------------------------------------
function updateStats(isCorrect){
    userStats.totalAnswered++; 
    if(isCorrect){ 
        userStats.totalCorrect++; 
    }
    else{ 
        userStats.totalWrong++; 
    }
    saveUserStats();
}

function updateProfileDisplay(){
    document.getElementById('profile-name').textContent=userStats.name;
    document.getElementById('total-answered').textContent=userStats.totalAnswered; 
    document.getElementById('total-correct').textContent=userStats.totalCorrect;
    document.getElementById('total-wrong').textContent=userStats.totalWrong;
    document.getElementById('profile-points').textContent = userStats.points; 
}


// ----------------------------------------------------
// وظائف المؤقت (Timer Logic)
// ----------------------------------------------------
function startTimer() {
    clearTimer();
    timeLeft = 15;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-circle').style.borderColor = '#FFC107'; 

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;

        if (timeLeft <= 5) {
            document.getElementById('timer-circle').style.borderColor = '#D32F2F'; 
        }

        if (timeLeft <= 0) {
            clearTimer();
            checkAnswer(null, null, true); // إجابة خاطئة بسبب انتهاء الوقت
        }
    }, 1000);
}

function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// ----------------------------------------------------
// وظائف أدوات المساعدة 
// ----------------------------------------------------
function useRemoveOption() {
    if (gameType !== 'mc') {
        alert("هذه الميزة متاحة فقط في أسئلة الاختيار من متعدد.");
        return;
    }
    if (userStats.points < COST_REMOVE_OPTION) {
        alert(`نقاطك (${userStats.points}) لا تكفي. تحتاج لـ ${COST_REMOVE_OPTION} نقطة لاستخدام هذه الميزة.`);
        return;
    }
    
    if (!confirm(`هل أنت متأكد من خصم ${COST_REMOVE_OPTION} نقطة مقابل إزالة خيار خاطئ؟`)) {
        return;
    }

    userStats.points -= COST_REMOVE_OPTION;
    saveUserStats();

    const q = currentQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('#answers-container button:not([disabled])');
    
    if (buttons.length <= 2) {
        alert("لا يمكن إزالة المزيد من الخيارات.");
        return;
    }

    let removedCount = 0;
    const incorrectOptions = Array.from(buttons).filter(btn => btn.textContent !== q.correct);
    
    for (let i = 0; i < Math.min(2, incorrectOptions.length); i++) {
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        const btnToRemove = incorrectOptions.splice(randomIndex, 1)[0];
        if (btnToRemove) {
            btnToRemove.style.display = 'none';
            btnToRemove.disabled = true;
            removedCount++;
        }
    }
    
    document.querySelectorAll('.help-buttons button')[0].disabled = true; 
    alert(`تم خصم ${COST_REMOVE_OPTION} نقطة. تم إزالة ${removedCount} خيار خاطئ.`);
}

function useChangeQuestion() {
    if (userStats.points < COST_CHANGE_QUESTION) {
        alert(`نقاطك (${userStats.points}) لا تكفي. تحتاج لـ ${COST_CHANGE_QUESTION} نقطة لاستخدام هذه الميزة.`);
        return;
    }
    
    if (!confirm(`هل أنت متأكد من خصم ${COST_CHANGE_QUESTION} نقطة مقابل تغيير السؤال؟`)) {
        return;
    }

    userStats.points -= COST_CHANGE_QUESTION;
    saveUserStats();

    currentQuestionIndex++; 
    
    document.querySelectorAll('.help-buttons button')[1].disabled = true; 

    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        checkLevelUnlockCondition();
        showEndGameMessage(true);
    }
    
    alert(`تم خصم ${COST_CHANGE_QUESTION} نقطة. تم تغيير السؤال.`);
}

function useAddTime() {
    if (userStats.points < COST_ADD_TIME) {
        alert(`نقاطك (${userStats.points}) لا تكفي. تحتاج لـ ${COST_ADD_TIME} نقطة لشراء وقت إضافي.`);
        return;
    }
    
    if (!confirm(`هل أنت متأكد من خصم ${COST_ADD_TIME} نقطة مقابل 10 ثوانٍ إضافية؟`)) {
        return;
    }

    userStats.points -= COST_ADD_TIME;
    saveUserStats();
    
    timeLeft += 10;
    
    document.getElementById('timer-text').textContent = timeLeft;
    
    document.querySelectorAll('.help-buttons button')[2].disabled = true; 

    alert(`تم خصم ${COST_ADD_TIME} نقطة. تمت إضافة 10 ثوانٍ.`);
}


// ----------------------------------------------------
// وظائف اللعب الرئيسية (إصلاح مشكلة عدم عمل اللعبة)
// ----------------------------------------------------

function startGame(level, type, isReplay = false) {
    gameLevel = level;
    gameType = type;
    isCurrentGameReplay = isReplay; 
    
    // 💡 التأكد من أن 'allQuestions' معرفة في ملف 'questions.js'
    if (typeof allQuestions === 'undefined' || !allQuestions[level] || !allQuestions[level][type]) {
        alert("خطأ: لا يمكن العثور على أسئلة لهذا المستوى والنوع (تأكد من ملف questions.js).");
        showScreen('level-select');
        return;
    }

    const allQ = allQuestions[gameLevel][gameType];
    const answeredIds = userStats.answeredQuestions[gameLevel][gameType];
    
    let availableQuestions = [];

    if (isReplay) {
        availableQuestions = allQ;
    } else {
        availableQuestions = allQ.filter(q => !answeredIds.includes(q.question));
    }

    currentQuestions = availableQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    
    if (currentQuestions.length === 0 && !isReplay) {
        showLevelCompletedMessage();
        return;
    } else if (currentQuestions.length === 0 && isReplay) {
        alert("لا يوجد أسئلة متاحة لإعادة اللعب حاليًا.");
        showScreen('main-menu');
        return;
    }
    
    currentQuestionIndex = 0;
    correctAnswersInCurrentRound = 0; 
    
    showScreen('game-screen');
    loadQuestion();
}

// دالة لمعالجة انتهاء الأسئلة في نوع معين من الأسئلة في المستوى
function showLevelCompletedMessage() {
    const qText = document.getElementById('question-text');
    const container = document.getElementById('answers-container');
    
    qText.textContent = `تهانينا! لقد استنفذت جميع أسئلة (${gameLevel.toUpperCase()} - ${gameType.toUpperCase()}) في اللعب العادي. يمكنك الآن إعادة اللعب لجمع نقاط إضافية.`;
    container.innerHTML = `
        <button onclick="showScreen('level-select')">العودة لاختيار مستوى</button>
        <button onclick="startGame(gameLevel, gameType, true)">🔄 إعادة لعب لجمع نقاط إضافية</button>
    `;
    document.getElementById('question-counter').textContent = "";
    history = [];
}

// دالة جديدة لعرض شاشة نهاية الجولة وإعادة اللعب
function showEndGameMessage(isNormalEnd = false) {
    const qText = document.getElementById('question-text');
    const container = document.getElementById('answers-container');
    
    let message = isNormalEnd ? 
        `انتهت جولة الأسئلة (${currentQuestions.length} سؤال)! لديك الآن ${userStats.points} نقطة.` :
        `انتهت جولة الأسئلة! لديك الآن ${userStats.points} نقطة.`;
    
    qText.textContent = message;
    
    container.innerHTML = `
        <button onclick="showScreen('main-menu')">العودة للقائمة الرئيسية</button>
        <button onclick="startGame(gameLevel, gameType, true)">🔄 إعادة لعب لجمع نقاط إضافية</button>
    `;
    
    document.getElementById('question-counter').textContent = "";
    history = [];
}

// دالة تحديث أزرار المستويات (إخفاء الأزرار المغلقة)
function updateLevelButtons(){
    const levels = ['normal', 'medium', 'hard'];
    let currentUnlocked = userStats.unlockedLevel;

    levels.forEach(level => {
        const isLocked = levels.indexOf(level) > levels.indexOf(currentUnlocked);
        
        // 💡 إخفاء الأزرار
        document.querySelectorAll(`.level-selection button[onclick*="'${level}'"]`).forEach(btn => {
            btn.classList.toggle('locked-btn', isLocked);
        });

        // 💡 إخفاء عنوان المستوى أيضاً إذا كان مغلقاً
        const levelContainer = document.querySelector('.level-selection');
        const levelIndex = levels.indexOf(level);
        if (levelContainer) {
            // يتم الوصول إلى H2 بناءً على ترتيبه
            const h2 = levelContainer.querySelector(`h2:nth-of-type(${levelIndex + 1})`);
            if (h2) h2.style.display = isLocked ? 'none' : 'block';
        }
    });
}

function loadQuestion() {
    const container = document.getElementById('answers-container');
    const qText = document.getElementById('question-text');
    const counter = document.getElementById('question-counter');

    clearTimer();
    
    if (currentQuestionIndex < currentQuestions.length) {
        const q = currentQuestions[currentQuestionIndex];
        qText.textContent = q.question;
        container.innerHTML = '';
        
        document.querySelectorAll('.help-buttons button').forEach(btn => btn.disabled = false);
        if (gameType === 'tf') {
            document.querySelectorAll('.help-buttons button')[0].disabled = true;
        }

        counter.textContent = `السؤال ${currentQuestionIndex + 1} من ${currentQuestions.length} (${gameLevel.toUpperCase()} - ${gameType.toUpperCase()})`;

        if (gameType === 'tf') {
            container.innerHTML = `
                <button onclick="checkAnswer(true, this)" class="tf-btn true-btn">صح</button>
                <button onclick="checkAnswer(false, this)" class="tf-btn false-btn">خطأ</button>
            `;
        } else if (gameType === 'mc') {
            const shuffledOptions = q.options.sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.onclick = () => checkAnswer(option, btn);
                container.appendChild(btn);
            });
        }
        startTimer();
    } else {
        checkLevelUnlockCondition(); 
        showEndGameMessage(true);
    }
}

function checkAnswer(selectedAnswer, button, timedOut = false) {
    clearTimer();
    const q = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    document.querySelectorAll('.help-buttons button').forEach(btn => btn.disabled = true);

    if (timedOut) {
        isCorrect = false;
    } else {
        // 💡 منطق التحقق من الإجابة الصحيحة
        if (gameType === 'tf') {
            isCorrect = (selectedAnswer === q.answer);
        } else if (gameType === 'mc') {
            isCorrect = (selectedAnswer === q.correct);
        }
    }
    
    // 💡 تطبيق الأصوات والتأثيرات
    if (isCorrect) {
        playSound('correct');
        if (button) { button.classList.add('correct-answer'); }
        correctAnswersInCurrentRound++;
    } else {
        playSound('wrong');
        if (button) { button.classList.add('wrong-answer'); }
    }
    
    // 💡 منطق احتساب النقاط وتتبع التقدم
    if (isCorrect) {
        let pointsToAdd = POINTS_CORRECT_ANSWER;
        const questionId = q.question;
        
        let isNewProgress = !userStats.unlockedProgress[gameLevel][gameType].includes(questionId);
        
        if (isCurrentGameReplay) {
            pointsToAdd = REPLAY_POINTS_CORRECT; 
        } else if (!isNewProgress) {
            pointsToAdd = REPLAY_POINTS_CORRECT; 
        } else if (isNewProgress && !isCurrentGameReplay) {
            userStats.unlockedProgress[gameLevel][gameType].push(questionId);
        }

        userStats.points += pointsToAdd; 
    }
    
    // تحديث الإحصائيات العامة وحفظ السؤال
    updateStats(isCorrect);
    
    const questionId = q.question;
    if (!userStats.answeredQuestions[gameLevel][gameType].includes(questionId)) {
        userStats.answeredQuestions[gameLevel][gameType].push(questionId);
    }
    
    saveUserStats(); 

    // 💡 تمييز الإجابة الصحيحة (إصلاح مشكلة الألوان)
    document.querySelectorAll('#answers-container button').forEach(btn => {
        let isCorrectButton = (gameType === 'tf') 
            ? (q.answer ? (btn.textContent === 'صح') : (btn.textContent === 'خطأ')) 
            : (btn.textContent === q.correct);
        
        // إذا لم يتم النقر على الزر الصحيح، وظهور اللون الأحمر على الإجابة المختارة
        if (isCorrectButton && !btn.classList.contains('correct-answer')) {
            btn.classList.add('correct-answer');
        }
        btn.disabled = true; // تعطيل جميع الأزرار بعد الإجابة
    });

    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        checkLevelUnlockCondition();
    }
    
    // تأخير الانتقال للسؤال التالي لإظهار اللون
    setTimeout(loadQuestion, 2000); 
}

function checkLevelUnlockCondition() {
    if (isCurrentGameReplay) return; 

    const levels = ['normal', 'medium', 'hard'];
    const nextLevelIndex = levels.indexOf(gameLevel) + 1;
    
    const questionsForUnlock = userStats.unlockedProgress[gameLevel][gameType];
    const allQ = allQuestions[gameLevel][gameType];
    
    const allAnsweredForUnlock = (questionsForUnlock.length === allQ.length);
    const passedThreshold = (correctAnswersInCurrentRound >= SUCCESS_THRESHOLD);

    if (nextLevelIndex < levels.length && passedThreshold && allAnsweredForUnlock && levels.indexOf(userStats.unlockedLevel) < nextLevelIndex) {
        const nextLevel = levels[nextLevelIndex];
        userStats.unlockedLevel = nextLevel;
        saveUserStats();
        alert(`🎉 تهانينا! لقد تجاوزت شرط النجاح في مستوى ${gameLevel.toUpperCase()} وتم فتح المستوى ${nextLevel.toUpperCase()}!`);
    }
    
    correctAnswersInCurrentRound = 0; 
}

window.onload = loadInitialData;

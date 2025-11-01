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

let isCurrentGameReplay = false; 
let correctAnswersInCurrentRound = 0; 

// بيانات المستخدم (كما كانت سابقاً)
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
// وظائف المؤثرات الصوتية (إصلاح تفعيل الصوت)
// ----------------------------------------------------
function playSound(type) {
    let audio;
    if (type === 'correct') {
        audio = document.getElementById('correct-sound');
    } else if (type === 'wrong') {
        audio = document.getElementById('wrong-sound');
    }
    if (audio) {
        // 💡 محاولة تحميل وتشغيل الصوت لضمان جاهزية المتصفح
        audio.load();
        audio.currentTime = 0; 
        audio.play().catch(e => {
            // console.error("Error playing sound:", e);
            // قد يفشل التشغيل التلقائي. سيتم تفعيله بعد أول تفاعل من المستخدم.
        });
    }
}

// ----------------------------------------------------
// تحميل وحفظ البيانات (لم تتغير)
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
    else if(screenId==='level-select'){ updateLevelButtons(); } // 💡 تحديث الأزرار عند الذهاب لقائمة المستويات

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
// وظائف اللعب الرئيسية (تم التأكيد على عمل لعبة الصح/الخطأ)
// ----------------------------------------------------

function startGame(level, type, isReplay = false) {
    gameLevel = level;
    gameType = type;
    isCurrentGameReplay = isReplay; 
    
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

// دالة تحديث أزرار المستويات (إصلاح الإخفاء)
function updateLevelButtons(){
    const levels = ['normal', 'medium', 'hard'];
    let currentUnlocked = userStats.unlockedLevel;
    let unlockedIndex = levels.indexOf(currentUnlocked);

    levels.forEach((level, index) => {
        const isLocked = index > unlockedIndex;
        
        // إخفاء/إظهار الأزرار
        document.querySelectorAll(`.level-selection button[onclick*="'${level}'"]`).forEach(btn => {
            btn.classList.toggle('locked-btn', isLocked);
        });

        // إخفاء/إظهار عنوان المستوى (H2)
        const levelContainer = document.querySelector('.level-selection');
        if (levelContainer) {
            const h2 = levelContainer.querySelector(`h2:nth-of-type(${index + 1})`);
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
            // 💡 ملاحظة: 'true' و 'false' هنا قيم منطقية يتم تمريرها للدالة
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
            // مقارنة القيمة المنطقية (true/false) مع إجابة السؤال المخزنة
            isCorrect = (selectedAnswer === q.answer); 
        } else if (gameType === 'mc') {
            isCorrect = (selectedAnswer === q.correct);
        }
    }
    
    // 💡 تطبيق الأصوات
    if (isCorrect) {
        playSound('correct');
    } else {
        playSound('wrong');
    }
    
    // منطق النقاط والتقدم (لم يتغير)
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
    
    updateStats(isCorrect);
    const questionId = q.question;
    if (!userStats.answeredQuestions[gameLevel][gameType].includes(questionId)) {
        userStats.answeredQuestions[gameLevel][gameType].push(questionId);
    }
    saveUserStats(); 

    // 💡 إصلاح تمييز الإجابة الصحيحة (لضمان ظهور الألوان)
    document.querySelectorAll('#answers-container button').forEach(btn => {
        let isCorrectButton = false;
        
        if (gameType === 'tf') {
            // التأكد من أن النص على الزر (صح/خطأ) يطابق الإجابة المخزنة (true/false)
            if (q.answer === true && btn.textContent === 'صح') isCorrectButton = true;
            if (q.answer === false && btn.textContent === 'خطأ') isCorrectButton = true;
        } else if (gameType === 'mc') {
            isCorrectButton = (btn.textContent === q.correct);
        }
        
        if (isCorrectButton) {
            btn.classList.add('correct-answer');
        } else if (btn === button && !isCorrect) { 
            // إذا كان الزر هو الذي تم النقر عليه (button) والإجابة خاطئة
            btn.classList.add('wrong-answer');
        } else if (timedOut) {
            // في حالة انتهاء الوقت، تظهر الإجابة الصحيحة فقط
            if (isCorrectButton) btn.classList.add('correct-answer');
        }
        
        btn.disabled = true; // تعطيل جميع الأزرار بعد الإجابة
    });

    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        checkLevelUnlockCondition();
    }
    
    setTimeout(loadQuestion, 2000); 
}

// ... (بقية الدوال لم تتغير) ...

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
// ----------------------------------------------------

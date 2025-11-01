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

// بيانات المستخدم الافتراضية
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
// وظائف المؤثرات الصوتية
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
        audio.play().catch(e => {
             // قد يفشل التشغيل التلقائي إذا لم يتم التفاعل مع الصفحة
        });
    }
}

// ----------------------------------------------------
// تحميل وحفظ البيانات (تم التعديل لضمان الانتقال السليم)
// ----------------------------------------------------
function loadInitialData(){
    const storedName = localStorage.getItem('userName');
    const storedStats = localStorage.getItem('userStats');

    if(storedStats){
        try {
            const loadedStats = JSON.parse(storedStats);
            userStats = {
                ...userStats,
                ...loadedStats,
                // التأكد من أن الحقول الجديدة موجودة في حال كان التخزين قديماً
                points: loadedStats.points || 200, 
                unlockedLevel: loadedStats.unlockedLevel || 'normal',
                answeredQuestions: loadedStats.answeredQuestions || { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [] } },
                unlockedProgress: loadedStats.unlockedProgress || { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [] } }
            };
        } catch (e) {
            // في حال فشل التحليل، نبدأ من نقطة الصفر
            console.error("Failed to parse userStats, starting fresh.", e);
            localStorage.clear();
        }
    }
    
    // الانتقال بعد تحميل البيانات
    if (storedName && userStats.name) {
        document.getElementById('display-user-name').textContent = userStats.name; 
        document.getElementById('user-points').textContent = userStats.points;
        showScreen('main-menu', true);
    } else { 
        showScreen('splash-screen', true);
    }
}

function saveUserStats(){
    localStorage.setItem('userName', userStats.name);
    localStorage.setItem('userStats', JSON.stringify(userStats));
    updateProfileDisplay();
    document.getElementById('user-points').textContent = userStats.points; 
}

function saveAndEnter(){
    const name = document.getElementById('user-name').value.trim();
    if (name) {
        userStats.name = name;
        document.getElementById('display-user-name').textContent = name; 
        saveUserStats(); 
        showScreen('main-menu'); 
    } else {
        alert("الرجاء إدخال اسمك أولاً!");
    }
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
// وظائف اللعب الرئيسية والمستويات
// ----------------------------------------------------
function startGame(level, type, isReplay = false) {
    gameLevel = level;
    gameType = type;
    isCurrentGameReplay = isReplay; 
    
    if (typeof allQuestions === 'undefined' || !allQuestions[level] || !allQuestions[level][type]) {
        alert("خطأ: لا يمكن العثور على أسئلة لهذا المستوى والنوع.");
        showScreen('level-select');
        return;
    }

    const allQ = allQuestions[gameLevel][gameType];
    const answeredIds = userStats.answeredQuestions[gameLevel][gameType];
    
    let availableQuestions = [];

    if (isReplay) {
        availableQuestions = allQ;
    } else {
        // فلترة الأسئلة التي لم يجب عليها المستخدم بعد
        availableQuestions = allQ.filter(q => !userStats.unlockedProgress[gameLevel][gameType].includes(q.question));
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

function updateLevelButtons(){
    const levels = ['normal', 'medium', 'hard'];
    let currentUnlocked = userStats.unlockedLevel;
    let unlockedIndex = levels.indexOf(currentUnlocked);

    levels.forEach((level, index) => {
        const isLocked = index > unlockedIndex;
        
        // إخفاء/إظهار الأزرار
        document.querySelectorAll(`.level-selection button[onclick*="'${level}'"]`).forEach(btn => {
            btn.classList.toggle('locked-btn', isLocked);
            btn.disabled = isLocked; // تعطيل الزر المغلق
        });

        // إخفاء/إظهار عنوان المستوى (H2)
        const levelContainer = document.querySelector('.level-selection');
        if (levelContainer) {
            // نستخدم رقم ترتيب العنوان لضمان استهدافه
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
            document.querySelectorAll('.help-buttons button')[0].disabled = true; // تعطيل إزالة الخيار في الصح/خطأ
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
        // 💡 إصلاح منطق التحقق من الإجابة الصحيحة لـ (صح/خطأ)
        if (gameType === 'tf') {
            isCorrect = (selectedAnswer === q.answer); 
        } else if (gameType === 'mc') {
            isCorrect = (selectedAnswer === q.correct);
        }
    }
    
    if (isCorrect) {
        playSound('correct');
        correctAnswersInCurrentRound++;
    } else {
        playSound('wrong');
    }

    // 💡 تمييز الإجابة الصحيحة والخطأ (إصلاح الألوان)
    document.querySelectorAll('#answers-container button').forEach(btn => {
        let isCorrectButton = false;
        
        if (gameType === 'tf') {
            // التحقق من النص والنوع المخزن
            if (q.answer === true && btn.textContent === 'صح') isCorrectButton = true;
            else if (q.answer === false && btn.textContent === 'خطأ') isCorrectButton = true;
        } else if (gameType === 'mc') {
            isCorrectButton = (btn.textContent === q.correct);
        }
        
        if (isCorrectButton) {
            btn.classList.add('correct-answer');
        } else if (btn === button && !isCorrect) { 
            btn.classList.add('wrong-answer');
        } else if (timedOut && isCorrectButton) {
            btn.classList.add('correct-answer');
        }
        
        btn.disabled = true; // تعطيل جميع الأزرار بعد الإجابة
    });
    
    // منطق النقاط والتقدم
    if (isCorrect) {
        let pointsToAdd = POINTS_CORRECT_ANSWER;
        const questionId = q.question;
        
        let isNewProgress = !userStats.unlockedProgress[gameLevel][gameType].includes(questionId);
        
        if (isCurrentGameReplay || !isNewProgress) {
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
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        checkLevelUnlockCondition();
    }
    
    // تأخير الانتقال للسؤال التالي
    setTimeout(loadQuestion, 2000); 
}

// ... (بقية الدوال: Timer, Help Buttons, End Game, Profile) ...
// لن تحتاج لتغييرها إذا كنت تستخدم الكود السابق الذي أرسلته.

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
            checkAnswer(null, null, true); 
        }
    }, 1000);
}

function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}
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

function checkLevelUnlockCondition() {
    if (isCurrentGameReplay) return; 

    const levels = ['normal', 'medium', 'hard'];
    const nextLevelIndex = levels.indexOf(gameLevel) + 1;
    
    // عند فتح المستوى، يجب أن يكون قد تم الإجابة على جميع الأسئلة في هذا النوع من الأسئلة
    const allQCount = allQuestions[gameLevel].tf.length + allQuestions[gameLevel].mc.length;
    const answeredQCount = userStats.unlockedProgress[gameLevel].tf.length + userStats.unlockedProgress[gameLevel].mc.length;

    const allAnsweredForUnlock = (answeredQCount >= allQCount);
    const passedThreshold = (correctAnswersInCurrentRound >= SUCCESS_THRESHOLD);

    if (nextLevelIndex < levels.length && passedThreshold && allAnsweredForUnlock && levels.indexOf(userStats.unlockedLevel) < nextLevelIndex) {
        const nextLevel = levels[nextLevelIndex];
        userStats.unlockedLevel = nextLevel;
        saveUserStats();
        alert(`🎉 تهانينا! لقد تجاوزت شرط النجاح في مستوى ${gameLevel.toUpperCase()} وتم فتح المستوى ${nextLevel.toUpperCase()}!`);
    }
    
    correctAnswersInCurrentRound = 0; 
}
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
function openContactModal() { 
    document.getElementById('contact-modal').style.display = 'flex'; 
}

function closeContactModal() { 
    document.getElementById('contact-modal').style.display = 'none'; 
}

window.onload = loadInitialData;

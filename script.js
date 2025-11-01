// ----------------------------------------------------
// متغيرات اللعبة (تم التعديل)
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
const MIN_POINTS_TO_SHOW_ON_LEADERBOARD = 200; 
const SUCCESS_THRESHOLD = 7; 

// ****************************************************
// *** مفتاح التعديل هنا ***
// رابط خادم Google Apps Script API الخاص بك (تم التحديث بالرابط الجديد)
const GOOGLE_API_URL = 'https://script.google.com/macros/s/AKfycby-1EYO6DioH6YBkjLi1Cmun284ochbn4exXSwHgHndDBzz7v3Up3Osu2R9I4EWAJsL5Q/exec'; 
// ****************************************************

// بيانات المستخدم (تم التعديل)
let userStats = {
    name: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    points: 200, 
    unlockedLevel: 'normal', 
    answeredQuestions: { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [], mc: [] } }, 
    weeklyStats:{answered:0,correct:0,wrong:0,lastWeekReset:new Date().getTime()}
};

// بيانات لوحة الصدارة الوهمية (تم إلغاؤها الآن)
// const BASE_LEADERS = [...]; 

// ----------------------------------------------------
// تحميل البيانات (تم التعديل)
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
        // دمج الإحصائيات المحملة مع القيم الافتراضية الجديدة (للميزات الجديدة)
        userStats = {
            ...userStats,
            ...loadedStats,
            points: loadedStats.points || 200, 
            unlockedLevel: loadedStats.unlockedLevel || 'normal',
            answeredQuestions: loadedStats.answeredQuestions || { normal: { tf: [], mc: [] }, medium: { tf: [], mc: [] }, hard: { tf: [], mc: [] } }
        };
        
        document.getElementById('user-points').textContent = userStats.points;
        
        const now=new Date().getTime(),oneWeek=7*24*60*60*1000;
        if(now-userStats.weeklyStats.lastWeekReset>=oneWeek){
            userStats.weeklyStats={answered:0,correct:0,wrong:0,lastWeekReset:now};
            saveUserStats();
        }
    }
}

// ----------------------------------------------------
// حفظ البيانات
// ----------------------------------------------------
function saveUserStats(){
    localStorage.setItem('userName',userStats.name);
    localStorage.setItem('userStats',JSON.stringify(userStats));
    updateProfileDisplay();
    document.getElementById('user-points').textContent = userStats.points; 
    
    // إرسال النقاط للخادم بعد كل تحديث مهم (لكي يظهر المستخدم في لوحة الصدارة بآخر نقاط)
    sendScoreToServer(); 
}

// ----------------------------------------------------
// التنقل بين الشاشات (تم التعديل)
// ----------------------------------------------------
function showScreen(screenId,isInitialLoad=false){
    clearTimer();
    const currentActiveScreen=document.querySelector('.screen.active');
    if(currentActiveScreen && !isInitialLoad && currentActiveScreen.id!==screenId){ history.push(currentActiveScreen.id); }
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
    
    if(screenId==='profile-screen'){ updateProfileDisplay(); }
    else if(screenId==='leaderboard-screen'){ updateLeaderboardDisplay(); } // تم تعديل استدعاء دالة الصدارة
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

function openContactModal() { document.getElementById('contact-modal').style.display = 'block'; }
function closeContactModal() { document.getElementById('contact-modal').style.display = 'none'; }


// ----------------------------------------------------
// الإحصائيات وتحديث النقاط
// ----------------------------------------------------
function updateStats(isCorrect){
    userStats.totalAnswered++; userStats.weeklyStats.answered++;
    if(isCorrect){ 
        userStats.totalCorrect++; 
        userStats.weeklyStats.correct++;
        userStats.points += POINTS_CORRECT_ANSWER; 
    }
    else{ 
        userStats.totalWrong++; 
        userStats.weeklyStats.wrong++; 
    }
    saveUserStats();
}

function updateProfileDisplay(){
    document.getElementById('profile-name').textContent=userStats.name;
    document.getElementById('total-answered').textContent=userStats.weeklyStats.answered;
    document.getElementById('total-correct').textContent=userStats.weeklyStats.correct;
    document.getElementById('total-wrong').textContent=userStats.weeklyStats.wrong;
    document.getElementById('profile-points').textContent = userStats.points; 
}


// ----------------------------------------------------
// وظائف المؤقت (Timer Logic)
// ----------------------------------------------------
function startTimer() {
    clearTimer();
    timeLeft = 15;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-circle').style.borderColor = '#D4AF37'; 

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;

        if (timeLeft <= 5) {
            document.getElementById('timer-circle').style.borderColor = '#F44336'; 
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

// ----------------------------------------------------
// وظائف أدوات المساعدة 
// ----------------------------------------------------

// مساعدة: إزالة خيارين خاطئين (متعدد فقط)
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

// مساعدة: تغيير السؤال الحالي
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
        showEndGameMessage();
    }
    
    alert(`تم خصم ${COST_CHANGE_QUESTION} نقطة. تم تغيير السؤال.`);
}

// مساعدة: إضافة وقت (10 ثواني إضافية)
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
    
    // إضافة 10 ثوانٍ للوقت المتبقي
    timeLeft += 10;
    
    // تحديث الواجهة فوراً
    document.getElementById('timer-text').textContent = timeLeft;
    
    // تعطيل زر الوقت الإضافي لهذه الجولة
    document.querySelectorAll('.help-buttons button')[2].disabled = true; 

    alert(`تم خصم ${COST_ADD_TIME} نقطة. تمت إضافة 10 ثوانٍ.`);
}


// ----------------------------------------------------
// وظائف اللعب الرئيسية (تم التعديل لعدم تكرار الأسئلة وفتح المستويات)
// ----------------------------------------------------

function startGame(level, type) {
    gameLevel = level;
    gameType = type;

    // الحصول على الأسئلة التي لم يتم الإجابة عليها سابقاً في هذا المستوى/النوع
    const allQ = allQuestions[gameLevel][gameType];
    const answeredIds = userStats.answeredQuestions[gameLevel][gameType];
    
    const availableQuestions = allQ.filter(q => !answeredIds.includes(q.question));

    // خلط الأسئلة واختيار العشرة الأوائل (أو أقل إذا لم تتوفر 10)
    currentQuestions = availableQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    
    if (currentQuestions.length === 0) {
        showLevelCompletedMessage();
        return;
    }
    
    currentQuestionIndex = 0;
    showScreen('game-screen');
    loadQuestion();
}

// دالة لمعالجة انتهاء الأسئلة في نوع معين من الأسئلة في المستوى
function showLevelCompletedMessage() {
    const qText = document.getElementById('question-text');
    const container = document.getElementById('answers-container');
    
    qText.textContent = `تهانينا! لقد استنفذت جميع أسئلة (${gameLevel.toUpperCase()} - ${gameType.toUpperCase()}).`;
    container.innerHTML = '<button onclick="showScreen(\'level-select\')">العودة لاختيار مستوى أو نوع آخر</button>';
    document.getElementById('question-counter').textContent = "";
    history = [];
}

// دالة جديدة لتحديث حالة أزرار المستويات بناءً على المستوى المفتوح
function updateLevelButtons(){
    const levels = ['normal', 'medium', 'hard'];
    let currentUnlocked = userStats.unlockedLevel;

    levels.forEach(level => {
        const isLocked = levels.indexOf(level) > levels.indexOf(currentUnlocked);
        document.querySelectorAll(`.level-selection button[onclick*="'${level}'"]`).forEach(btn => {
            btn.disabled = isLocked;
            btn.classList.toggle('locked-btn', isLocked);
            btn.textContent = btn.textContent.split('(')[0].trim();
            if(isLocked) {
                 btn.textContent += " (مغلق)";
            }
        });
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
        
        // تفعيل أزرار المساعدة للجولة الجديدة
        document.querySelectorAll('.help-buttons button').forEach(btn => btn.disabled = false);
        // تعطيل زر الإزالة في أسئلة الصح والخطأ
        if (gameType === 'tf') {
            document.querySelectorAll('.help-buttons button')[0].disabled = true;
        }

        counter.textContent = `السؤال ${currentQuestionIndex + 1} من ${currentQuestions.length} (${gameLevel.toUpperCase()} - ${gameType.toUpperCase()})`;

        if (gameType === 'tf') {
            container.innerHTML = `
                <button onclick="checkAnswer(true, this)">صح</button>
                <button onclick="checkAnswer(false, this)">خطأ</button>
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
        // انتهت الأسئلة المتاحة في هذه الجولة
        showEndGameMessage(true);
    }
}

function showEndGameMessage(isNormalEnd = false) {
    const qText = document.getElementById('question-text');
    const container = document.getElementById('answers-container');
    
    if (isNormalEnd) {
        qText.textContent = `انتهت جولة الأسئلة (${currentQuestions.length} سؤال)! لديك الآن ${userStats.points} نقطة.`;
    } else {
         qText.textContent = `انتهت جولة الأسئلة! لديك الآن ${userStats.points} نقطة.`;
    }
    
    container.innerHTML = '<button onclick="showScreen(\'main-menu\')">العودة للقائمة الرئيسية</button>';
    document.getElementById('question-counter').textContent = "";
    history = [];
}

let correctAnswersInCurrentRound = 0; 

function checkAnswer(selectedAnswer, button, timedOut = false) {
    clearTimer();
    const q = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    document.querySelectorAll('.help-buttons button').forEach(btn => btn.disabled = true);

    if (timedOut) {
        isCorrect = false;
        alert("انتهى وقت الإجابة! تم اعتبار الإجابة خاطئة.");
    } else {
        if (gameType === 'tf') {
            isCorrect = (selectedAnswer === q.answer);
        } else if (gameType === 'mc') {
            isCorrect = (selectedAnswer === q.correct);
        }

        if (isCorrect && button) {
            button.classList.add('correct-answer');
        } else if (button) {
            button.classList.add('wrong-answer');
        }
    }
    
    if (isCorrect) {
        correctAnswersInCurrentRound++;
    }

    // تحديث الإحصائيات (وإضافة النقاط)
    updateStats(isCorrect);
    
    // حفظ السؤال الذي تم الإجابة عليه لتجنب التكرار
    if (q && q.question) {
        userStats.answeredQuestions[gameLevel][gameType].push(q.question);
    }
    
    // تمييز الإجابة الصحيحة
    document.querySelectorAll('#answers-container button').forEach(btn => {
        let isCorrectButton = false;
        if (gameType === 'tf') {
            isCorrectButton = (q.answer ? (btn.textContent === 'صح') : (btn.textContent === 'خطأ'));
        } else if (gameType === 'mc') {
            isCorrectButton = (btn.textContent === q.correct);
        }
        
        if (isCorrectButton) {
            btn.classList.add('correct-answer');
        }
        btn.disabled = true;
    });

    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuestions.length) {
        checkLevelUnlockCondition();
    }
    
    setTimeout(loadQuestion, 2000); 
}

// دالة للتحقق من شرط فتح المستوى بعد انتهاء الجولة
function checkLevelUnlockCondition() {
    const levels = ['normal', 'medium', 'hard'];
    const nextLevelIndex = levels.indexOf(gameLevel) + 1;
    
    const allQ = allQuestions[gameLevel][gameType];
    const answeredIds = userStats.answeredQuestions[gameLevel][gameType];

    const allAnswered = (answeredIds.length === allQ.length);
    const passedThreshold = (correctAnswersInCurrentRound >= SUCCESS_THRESHOLD);

    // التحقق من أن المستوى التالي موجود والمستوى الحالي هو المستوى الأقصى المفتوح حالياً
    if (nextLevelIndex < levels.length && passedThreshold && allAnswered && levels.indexOf(userStats.unlockedLevel) < nextLevelIndex) {
        const nextLevel = levels[nextLevelIndex];
        userStats.unlockedLevel = nextLevel;
        saveUserStats();
        alert(`🎉 تهانينا! لقد تجاوزت شرط النجاح في مستوى ${gameLevel.toUpperCase()} وتم فتح المستوى ${nextLevel.toUpperCase()}!`);
    }
    
    correctAnswersInCurrentRound = 0; // إعادة تعيين لعد الجولة التالية
}

// ----------------------------------------------------
// وظائف لوحة الصدارة (التواصل مع خادم جوجل) 
// ----------------------------------------------------

/**
 * دالة جديدة لإرسال نقاط المستخدم إلى خادم Google Apps Script.
 */
function sendScoreToServer() {
    // نتأكد من أن المستخدم قد سجل اسمه ولديه الحد الأدنى من النقاط
    if (!userStats.name || userStats.points < MIN_POINTS_TO_SHOW_ON_LEADERBOARD) {
        return; 
    }
    
    const url = `${GOOGLE_API_URL}?action=saveScore&name=${encodeURIComponent(userStats.name)}&points=${userStats.points}`;

    // نستخدم Fetch API لضمان الإرسال الفوري بعد كل تحديث مهم للنقاط
    fetch(url, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            // يمكن تجاهل الاستجابة هنا، المهم هو إرسال البيانات
            // console.log('Score send result:', data);
        })
        .catch(error => {
            // console.error('Error sending score:', error);
        });
}


/**
 * دالة جديدة لجلب لوحة الصدارة من خادم Google Apps Script.
 */
async function getLeaderboardFromServer() {
    const url = `${GOOGLE_API_URL}?action=getLeaderboard`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.leaderboard) {
            return data.leaderboard;
        } else {
            console.error('API Error:', data.message || 'Failed to fetch leaderboard.');
            return [];
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}


/**
 * دالة لتحديث عرض لوحة الصدارة (تم تعديلها لاستخدام API).
 */
async function updateLeaderboardDisplay() {
    const container = document.getElementById('leaderboard-list');
    container.innerHTML = '<li>جاري تحميل لوحة الصدارة...</li>'; 

    const leaderboard = await getLeaderboardFromServer();
    container.innerHTML = '';
    
    if (leaderboard.length === 0) {
        container.innerHTML = '<li>لا توجد بيانات متاحة حالياً.</li>';
        return;
    }

    // إضافة المستخدم الحالي يدوياً إذا لم يكن ضمن العشرة الأوائل (لضمان ظهوره)
    let finalLeaderboard = [...leaderboard];
    const userIsInList = leaderboard.some(leader => leader.name === userStats.name);
    
    if (!userIsInList && userStats.points >= MIN_POINTS_TO_SHOW_ON_LEADERBOARD) {
        finalLeaderboard.push({ name: userStats.name, points: userStats.points, isCurrentUser: true });
        // فرز القائمة النهائية مرة أخرى وضمان بقائها ضمن حدود معقولة
        finalLeaderboard.sort((a, b) => b.points - a.points);
    }
    
    // عرض القائمة النهائية
    finalLeaderboard.slice(0, 10).forEach((leader, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="name">${leader.name}</span>
            <span class="points">${leader.points} ⭐</span>
        `;
        // تمييز المستخدم الحالي
        if (leader.name === userStats.name || leader.isCurrentUser) {
            listItem.classList.add('is-user');
        }
        container.appendChild(listItem);
    });
}


// تشغيل وظيفة التحميل عند فتح الصفحة
window.onload = loadInitialData;

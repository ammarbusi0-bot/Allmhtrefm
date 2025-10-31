// ----------------------------------------------------
// متغيرات اللعبة
// ----------------------------------------------------
let currentLevel = 'normal';
let currentQuestionIndex = 0;
let currentQuestions = [];
let gameType = '';
let history = [];
let timer;
let timeLeft = 15; // يبدأ المؤقت بـ 15 ثانية

// بيانات المستخدم
let userStats = {
    name: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    weeklyStats:{answered:0,correct:0,wrong:0,lastWeekReset:new Date().getTime()}
};

// ----------------------------------------------------
// تحميل البيانات
// ----------------------------------------------------
function loadInitialData(){
    const storedName = localStorage.getItem('userName');
    const storedStats = localStorage.getItem('userStats');
    const storedLevel = localStorage.getItem('currentLevel');
    const levelToggle = document.getElementById('level-up-toggle');

    if(storedName){ userStats.name=storedName; document.getElementById('display-user-name').textContent=storedName; showScreen('main-menu',true);}
    else showScreen('splash-screen',true);

    if(storedStats){
        userStats=JSON.parse(storedStats);
        const now=new Date().getTime(),oneWeek=7*24*60*60*1000;
        if(now-userStats.weeklyStats.lastWeekReset>=oneWeek){
            userStats.weeklyStats={answered:0,correct:0,wrong:0,lastWeekReset:now};
            saveUserStats();
        }
    }

    if(storedLevel){ currentLevel=storedLevel; levelToggle.checked=(currentLevel==='hard'); }
}

// ----------------------------------------------------
// حفظ البيانات
// ----------------------------------------------------
function saveUserStats(){
    localStorage.setItem('userName',userStats.name);
    localStorage.setItem('userStats',JSON.stringify(userStats));
    localStorage.setItem('currentLevel',currentLevel);
    updateProfileDisplay();
}

// ----------------------------------------------------
// التنقل بين الشاشات
// ----------------------------------------------------
function showScreen(screenId,isInitialLoad=false){
    clearTimer(); // مسح المؤقت عند مغادرة شاشة اللعب
    const currentActiveScreen=document.querySelector('.screen.active');
    if(currentActiveScreen && !isInitialLoad && currentActiveScreen.id!==screenId){ history.push(currentActiveScreen.id); }
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
    if(screenId==='profile-screen'){ updateProfileDisplay(); }
    document.getElementById('bottom-nav').style.display=(screenId==='splash-screen')?'none':'flex';
    if(screenId === 'main-menu') { history = []; } // مسح السجل عند العودة للقائمة الرئيسية
}

function goBack(){
    clearTimer();
    if(history.length>0){
        const prev=history.pop();
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        document.getElementById(prev).classList.add('active');
        document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
        if(prev==='main-menu'){ history=[]; }
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
// رفع المستوى والإحصائيات
// ----------------------------------------------------
function toggleLevel(){
    const isHard=document.getElementById('level-up-toggle').checked;
    currentLevel=isHard?'hard':'normal';
    saveUserStats();
    alert(`تم تعيين مستوى التحدي إلى: ${isHard?'صعب':'عادي'}`);
}

function updateStats(isCorrect){
    userStats.totalAnswered++; userStats.weeklyStats.answered++;
    if(isCorrect){ userStats.totalCorrect++; userStats.weeklyStats.correct++; }
    else{ userStats.totalWrong++; userStats.weeklyStats.wrong++; }
    saveUserStats();
}

function updateProfileDisplay(){
    document.getElementById('profile-name').textContent=userStats.name;
    document.getElementById('total-answered').textContent=userStats.weeklyStats.answered;
    document.getElementById('total-correct').textContent=userStats.weeklyStats.correct;
    document.getElementById('total-wrong').textContent=userStats.weeklyStats.wrong;
    document.getElementById('current-level-status').textContent = (currentLevel === 'hard') ? 'صعب' : 'عادي';
}

// ----------------------------------------------------
// وظائف المؤقت (Timer Logic)
// ----------------------------------------------------
function startTimer() {
    clearTimer(); // لضمان عدم وجود مؤقتين يعملان
    timeLeft = 15;
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-circle').style.borderColor = '#D4AF37'; // لون ذهبي

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;

        if (timeLeft <= 5) {
            document.getElementById('timer-circle').style.borderColor = '#F44336'; // لون أحمر عند قرب الانتهاء
        }

        if (timeLeft <= 0) {
            clearTimer();
            // معاملة عدم الإجابة كإجابة خاطئة
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
// وظائف اللعب الرئيسية (Game Logic)
// ----------------------------------------------------
function startGame(type) {
    gameType = type;
    currentQuestionIndex = 0;
    // خلط الأسئلة واختيار العشرة الأوائل منها
    const levelQuestions = allQuestions[currentLevel][gameType];
    currentQuestions = levelQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    
    showScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    const container = document.getElementById('answers-container');
    const qText = document.getElementById('question-text');
    const counter = document.getElementById('question-counter');

    clearTimer();
    
    if (currentQuestionIndex < 10) { // شرط العشرة أسئلة
        const q = currentQuestions[currentQuestionIndex];
        qText.textContent = q.question;
        container.innerHTML = ''; // مسح الإجابات القديمة
        
        // تحديث العداد
        counter.textContent = `السؤال ${currentQuestionIndex + 1} من 10`;

        if (gameType === 'tf') {
            // أسئلة صح وخطأ
            container.innerHTML = `
                <button onclick="checkAnswer(true, this)">صح</button>
                <button onclick="checkAnswer(false, this)">خطأ</button>
            `;
        } else if (gameType === 'mc') {
            // أسئلة الاختيار من متعدد
            const shuffledOptions = q.options.sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.onclick = () => checkAnswer(option, btn);
                container.appendChild(btn);
            });
        }
        startTimer(); // بدء المؤقت لكل سؤال
    } else {
        // نهاية الجولة
        qText.textContent = `انتهت جولة الأسئلة العشرة! لقد أجبت على ${userStats.weeklyStats.correct} سؤال صحيح هذا الأسبوع.`;
        container.innerHTML = '<button onclick="showScreen(\'main-menu\')">العودة للقائمة الرئيسية</button>';
        counter.textContent = "";
        history = []; // مسح سجل التنقل بعد نهاية الجولة
    }
}

function checkAnswer(selectedAnswer, button, timedOut = false) {
    clearTimer(); // إيقاف المؤقت فور الإجابة أو انتهاء الوقت
    const q = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    // إذا انتهى الوقت، الإجابة تعتبر خاطئة ولا يوجد زر محدد
    if (timedOut) {
        isCorrect = false;
        alert("انتهى وقت الإجابة!");
    } else {
        // التحقق من الإجابة
        if (gameType === 'tf') {
            isCorrect = (selectedAnswer === q.answer);
        } else if (gameType === 'mc') {
            isCorrect = (selectedAnswer === q.correct);
        }

        // تلوين الأزرار
        if (isCorrect) {
            button.classList.add('correct-answer');
        } else {
            button.classList.add('wrong-answer');
        }
    }
    
    // تحديث الإحصائيات (فقط إذا لم يكن انتهاء وقت، أو كان انتهاء وقت وقررنا تسجيله كخاطئ)
    updateStats(isCorrect);
    
    // تمييز الإجابة الصحيحة إذا كانت الإجابة خاطئة أو انتهى الوقت
    if (!isCorrect || timedOut) {
        document.querySelectorAll('#answers-container button').forEach(btn => {
            let correctAnswerText = (gameType === 'tf') ? (q.answer ? 'صح' : 'خطأ') : q.correct;
            if (btn.textContent === correctAnswerText || (gameType === 'tf' && (q.answer === (btn.textContent === 'صح')))) {
                btn.classList.add('correct-answer');
            }
        });
    }

    // تعطيل جميع الأزرار لمنع الإجابة مرة أخرى
    document.querySelectorAll('#answers-container button').forEach(btn => {
        btn.disabled = true;
    });
    
    // الانتقال للسؤال التالي بعد تأخير
    currentQuestionIndex++;
    setTimeout(loadQuestion, 2000); // تأخير ثانيتين لرؤية النتيجة
}

// تشغيل وظيفة التحميل عند فتح الصفحة
window.onload = loadInitialData;


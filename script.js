// ----------------------------------------------------
// متغيرات اللعبة
// ----------------------------------------------------
let currentQuestionIndex = 0;
let currentQuestions = [];
let gameLevel = ''; // لتخزين المستوى المختار (normal, medium, hard)
let gameType = '';
let history = [];
let timer;
let timeLeft = 15; 
const POINTS_CORRECT_ANSWER = 10;
const COST_REMOVE_OPTION = 20;
const COST_CHANGE_QUESTION = 30;

// بيانات المستخدم
let userStats = {
    name: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    points: 100, // البدء بـ 100 نقطة
    weeklyStats:{answered:0,correct:0,wrong:0,lastWeekReset:new Date().getTime()}
};

// ----------------------------------------------------
// تحميل البيانات
// ----------------------------------------------------
function loadInitialData(){
    const storedName = localStorage.getItem('userName');
    const storedStats = localStorage.getItem('userStats');

    if(storedName){ userStats.name=storedName; document.getElementById('display-user-name').textContent=storedName; showScreen('main-menu',true);}
    else showScreen('splash-screen',true);

    if(storedStats){
        userStats=JSON.parse(storedStats);
        // التحقق من وجود النقاط وإضافة قيمة افتراضية إذا كانت مفقودة
        if (typeof userStats.points === 'undefined' || userStats.points === null) {
            userStats.points = 100;
            saveUserStats();
        }
        
        // تحديث النقاط في الواجهة عند التحميل
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
    // تحديث النقاط في شريط القائمة الرئيسية
    document.getElementById('user-points').textContent = userStats.points; 
}

// ----------------------------------------------------
// التنقل بين الشاشات
// ----------------------------------------------------
function showScreen(screenId,isInitialLoad=false){
    clearTimer();
    const currentActiveScreen=document.querySelector('.screen.active');
    if(currentActiveScreen && !isInitialLoad && currentActiveScreen.id!==screenId){ history.push(currentActiveScreen.id); }
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    document.getElementById('back-btn').style.display=history.length>0?'flex':'none';
    if(screenId==='profile-screen'){ updateProfileDisplay(); }
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
        userStats.points += POINTS_CORRECT_ANSWER; // إضافة نقاط للإجابة الصحيحة
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
    document.getElementById('profile-points').textContent = userStats.points; // عرض النقاط
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
// وظائف أدوات المساعدة (Help Buttons)
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
    
    // تأكيد الخصم
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
    
    // إزالة أول خيارين خاطئين عشوائياً
    for (let i = 0; i < Math.min(2, incorrectOptions.length); i++) {
        // نختار عشوائياً لمنع التوقع (إذا كان هناك أكثر من خيارين)
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        const btnToRemove = incorrectOptions.splice(randomIndex, 1)[0];
        if (btnToRemove) {
            btnToRemove.style.display = 'none';
            btnToRemove.disabled = true;
            removedCount++;
        }
    }
    
    document.querySelectorAll('.help-buttons button')[0].disabled = true; // تعطيل زر الإزالة لهذه الجولة
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

    // نعتبر هذا السؤال غير مجاب عليه وننتقل للتالي
    currentQuestionIndex++; 
    
    // تعطيل زر التغيير لهذه الجولة
    document.querySelectorAll('.help-buttons button')[1].disabled = true; 

    if (currentQuestionIndex < 10) {
        loadQuestion();
    } else {
        // إذا كان السؤال الأخير، ننهي الجولة
        showEndGameMessage();
    }
    
    alert(`تم خصم ${COST_CHANGE_QUESTION} نقطة. تم تغيير السؤال.`);
}


// ----------------------------------------------------
// وظائف اللعب الرئيسية (Game Logic)
// ----------------------------------------------------

function startGame(level, type) {
    gameLevel = level; // حفظ المستوى
    gameType = type;

    // الحصول على الأسئلة من المستوى المحدد فقط
    const availableQuestions = allQuestions[gameLevel][gameType];
    
    // خلط الأسئلة واختيار العشرة الأوائل
    currentQuestions = availableQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    
    if (currentQuestions.length === 0) {
        alert("عذراً، لا توجد أسئلة متوفرة حالياً لهذا المستوى!");
        showScreen('level-select');
        return;
    }
    
    currentQuestionIndex = 0;
    showScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    const container = document.getElementById('answers-container');
    const qText = document.getElementById('question-text');
    const counter = document.getElementById('question-counter');

    clearTimer();
    
    if (currentQuestionIndex < 10) {
        const q = currentQuestions[currentQuestionIndex];
        qText.textContent = q.question;
        container.innerHTML = '';
        
        // تفعيل أزرار المساعدة للجولة الجديدة
        document.querySelectorAll('.help-buttons button').forEach(btn => btn.disabled = false);

        counter.textContent = `السؤال ${currentQuestionIndex + 1} من 10 (${gameLevel.toUpperCase()} - ${gameType.toUpperCase()})`;

        if (gameType === 'tf') {
            // أسئلة صح وخطأ (لا يوجد "إزالة خيار")
            document.querySelectorAll('.help-buttons button')[0].disabled = true;

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
        startTimer();
    } else {
        showEndGameMessage();
    }
}

function showEndGameMessage() {
    const qText = document.getElementById('question-text');
    const container = document.getElementById('answers-container');
    
    qText.textContent = `انتهت جولة الأسئلة العشرة! لديك الآن ${userStats.points} نقطة.`;
    container.innerHTML = '<button onclick="showScreen(\'main-menu\')">العودة للقائمة الرئيسية</button>';
    document.getElementById('question-counter').textContent = "";
    history = [];
}

function checkAnswer(selectedAnswer, button, timedOut = false) {
    clearTimer();
    const q = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    // تعطيل جميع أزرار المساعدة بعد الإجابة/انتهاء الوقت
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
    
    // تحديث الإحصائيات (وإضافة النقاط إذا كانت الإجابة صحيحة)
    updateStats(isCorrect);
    
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
    setTimeout(loadQuestion, 2000); 
}

// تشغيل وظيفة التحميل عند فتح الصفحة
window.onload = loadInitialData;

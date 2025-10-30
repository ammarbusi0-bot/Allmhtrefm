// بيانات الأسئلة - (10 أسئلة لكل مستوى)
const allQuestions = {
    // أسئلة عادية
    normal: {
        tf: [
            { question: "الصلاة هي الركن الثاني من أركان الإسلام.", answer: true },
            { question: "صوم رمضان هو الركن الأول من أركان الإسلام.", answer: false },
            { question: "عدد الأنبياء والرسل المذكورين في القرآن الكريم هو 25.", answer: true },
            { question: "وحي القرآن الكريم نزل على النبي محمد صلى الله عليه وسلم في مكة فقط.", answer: false },
            { question: "أول من أسلم من الرجال هو أبو بكر الصديق.", answer: true },
            { question: "سورة الإخلاص تعدل ثلث القرآن.", answer: true },
            { question: "الزكاة تجب على كل مسلم يملك نصاباً.", answer: true },
            { question: "يوم الجمعة هو أفضل أيام الأسبوع.", answer: true },
            { question: "أول قبلة للمسلمين كانت باتجاه المسجد الأقصى.", answer: true },
            { question: "الإحسان هو أن تعبد الله كأنك تراه، فإن لم تكن تراه فإنه يراك.", answer: true },
        ],
        mc: [
            { question: "من هو خاتم الأنبياء والمرسلين؟", options: ["إبراهيم عليه السلام", "موسى عليه السلام", "محمد صلى الله عليه وسلم"], correct: "محمد صلى الله عليه وسلم" },
            { question: "في أي شهر فرض صيام رمضان؟", options: ["شعبان", "رمضان", "شوال"], correct: "رمضان" },
            { question: "كم عدد ركعات صلاة الفجر؟", options: ["ركعتان", "ثلاث ركعات", "أربع ركعات"], correct: "ركعتان" },
            { question: "ما اسم الغار الذي نزل فيه الوحي لأول مرة؟", options: ["غار ثور", "غار حراء", "غار أحد"], correct: "غار حراء" },
            { question: "أين تقع الكعبة المشرفة؟", options: ["المدينة المنورة", "مكة المكرمة", "القدس"], correct: "مكة المكرمة" },
            { question: "كم عدد أركان الإسلام؟", options: ["خمسة", "أربعة", "ستة"], correct: "خمسة" },
            { question: "ما هو اسم الصحابي الذي أطلق عليه لقب الفاروق؟", options: ["أبو بكر الصديق", "علي بن أبي طالب", "عمر بن الخطاب"], correct: "عمر بن الخطاب" },
            { question: "ما هي أول سورة نزلت كاملة في القرآن الكريم؟", options: ["الفاتحة", "المدثر", "العلق"], correct: "الفاتحة" },
            { question: "في أي عام ميلادي حدثت الهجرة النبوية؟", options: ["622 م", "632 م", "610 م"], correct: "622 م" },
            { question: "أكبر بحر في العالم هو:", options: ["البحر الأحمر", "البحر الأبيض المتوسط", "المحيط الهادئ"], correct: "المحيط الهادئ" }, // سؤال معرفة عامة
        ]
    },
    // أسئلة صعبة
    hard: {
        tf: [
            { question: "يعتبر الإمام البخاري من أئمة المذهب الشافعي.", answer: false },
            { question: "الاسم الحقيقي لأبي هريرة هو عبد الرحمن بن صخر الدوسي.", answer: true },
            { question: "النسخ في القرآن يعني رفع الحكم وبقاء التلاوة أو العكس.", answer: true },
            { question: "عدد أيام التشريق هو يومان.", answer: false },
            { question: "صلاة الكسوف والخسوف هي سنة مؤكدة.", answer: true },
            { question: "أول معركة للمسلمين كانت بدر.", answer: true },
            { question: "العصر العباسي بدأ بعد العصر الأموي مباشرة.", answer: true },
            { question: "الفرق بين النبي والرسول هو أن النبي يوحى إليه بشرع جديد.", answer: false },
            { question: "أصغر أبناء الرسول صلى الله عليه وسلم هو القاسم.", answer: true },
            { question: "المال الذي لا يزكى يسمى كنزاً.", answer: true },
        ],
        mc: [
            { question: "ما اسم زوجة فرعون التي آمنت بموسى عليه السلام؟", options: ["آسيا", "مريم", "هاجر"], correct: "آسيا" },
            { question: "ما هو لقب سيف الله المسلول؟", options: ["أبو عبيدة بن الجراح", "خالد بن الوليد", "سعد بن أبي وقاص"], correct: "خالد بن الوليد" },
            { question: "في أي سنة هجرية وقعت غزوة الخندق؟", options: ["الخامسة", "الثالثة", "السابعة"], correct: "الخامسة" },
            { question: "ما هي السورة التي يطلق عليها 'قلب القرآن'؟", options: ["البقرة", "يس", "الرحمن"], correct: "يس" },
            { question: "كم سنة استمرت الدعوة السرية في مكة المكرمة؟", options: ["3 سنوات", "5 سنوات", "10 سنوات"], correct: "3 سنوات" },
            { question: "ما هو أول علم دُوِّن في الإسلام؟", options: ["علم الحديث", "علم الفقه", "علم التفسير"], correct: "علم الحديث" },
            { question: "في عهد أي خليفة جُمع القرآن في مصحف واحد؟", options: ["عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق"], correct: "عثمان بن عفان" },
            { question: "من هو الصحابي الذي أشار على الرسول بحفر الخندق؟", options: ["سلمان الفارسي", "حمزة بن عبد المطلب", "عمار بن ياسر"], correct: "سلمان الفارسي" },
            { question: "كم عدد التكبيرات في صلاة العيد؟", options: ["سبع تكبيرات في الأولى وخمس في الثانية", "خمس تكبيرات في الأولى وسبع في الثانية", "سبع تكبيرات في كليهما"], correct: "سبع تكبيرات في الأولى وخمس في الثانية" },
            { question: "ما هو الشيء الذي لا يجوز بيعه قبل قبضه باتفاق المذاهب الأربعة؟", options: ["الذهب", "السلع العقارية", "الطعام"], correct: "الطعام" },
        ]
    }
};

// متغيرات حالة اللعبة
let currentLevel = 'normal';
let currentQuestionIndex = 0;
let currentQuestions = [];
let gameType = ''; // 'tf' or 'mc'
let history = []; // لتخزين الشاشات السابقة لزر الرجوع

// هياكل بيانات المستخدم
let userStats = {
    name: '',
    totalAnswered: 0,
    totalCorrect: 0,
    totalWrong: 0,
    weeklyStats: {
        answered: 0,
        correct: 0,
        wrong: 0,
        lastWeekReset: new Date().getTime() // لحساب إحصائيات الأسبوع
    }
};

// ----------------------------------------------------
// وظائف LocalStorage والتحميل
// ----------------------------------------------------

function loadInitialData() {
    // تحميل اسم المستخدم والمستوى والإحصائيات
    const storedName = localStorage.getItem('userName');
    const storedStats = localStorage.getItem('userStats');
    const storedLevel = localStorage.getItem('currentLevel');
    const levelToggle = document.getElementById('level-up-toggle');

    if (storedName) {
        userStats.name = storedName;
        document.getElementById('display-user-name').textContent = storedName;
        // الانتقال مباشرة إلى القائمة الرئيسية إذا كان الاسم محفوظاً
        showScreen('main-menu', true);
    } else {
        showScreen('splash-screen', true);
    }

    if (storedStats) {
        userStats = JSON.parse(storedStats);
        // التحقق من الإحصائيات الأسبوعية وإعادة تعيينها إذا مر أسبوع
        const now = new Date().getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (now - userStats.weeklyStats.lastWeekReset >= oneWeek) {
            userStats.weeklyStats = { answered: 0, correct: 0, wrong: 0, lastWeekReset: now };
            saveUserStats();
        }
    }

    if (storedLevel) {
        currentLevel = storedLevel;
        levelToggle.checked = (currentLevel === 'hard');
    }
}

function saveUserStats() {
    localStorage.setItem('userName', userStats.name);
    localStorage.setItem('userStats', JSON.stringify(userStats));
    localStorage.setItem('currentLevel', currentLevel);
    updateProfileDisplay();
}

// ----------------------------------------------------
// وظائف التنقل بين الشاشات
// ----------------------------------------------------

function showScreen(screenId, isInitialLoad = false) {
    // إضافة الشاشة الحالية إلى سجل التاريخ إذا لم تكن حملاً أولياً
    const currentActiveScreen = document.querySelector('.screen.active');
    if (currentActiveScreen && !isInitialLoad) {
        // لا تضف الشاشات المكررة إلا إذا كانت شاشات لعبة
        if (currentActiveScreen.id !== screenId) {
            history.push(currentActiveScreen.id);
        }
    }

    // إخفاء جميع الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // إظهار الشاشة المطلوبة
    document.getElementById(screenId).classList.add('active');

    // تحديث حالة زر الرجوع
    document.getElementById('back-btn').style.display = history.length > 0 ? 'flex' : 'none';

    // تحديث عرض الملف الشخصي عند الدخول إليه
    if (screenId === 'profile-screen') {
        updateProfileDisplay();
    }

    // إخفاء شريط التنقل السفلي في شاشة الدخول
    document.getElementById('bottom-nav').style.display = (screenId === 'splash-screen') ? 'none' : 'flex';
}

function goBack() {
    if (history.length > 0) {
        const prevScreenId = history.pop();
        // إظهار الشاشة السابقة مباشرة بدون إضافة للتاريخ (لتجنب الحلقات)
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(prevScreenId).classList.add('active');
        document.getElementById('back-btn').style.display = history.length > 0 ? 'flex' : 'none';
        // إذا عدنا إلى القائمة الرئيسية، يتم مسح سجل التاريخ لتجنب الرجوع إلى شاشات اللعب المنتهية
        if (prevScreenId === 'main-menu') {
             history = [];
        }
    }
}

// ----------------------------------------------------
// وظائف شاشة الدخول والتسجيل
// ----------------------------------------------------

function saveAndEnter() {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();

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
// وظائف إعدادات المستوى
// ----------------------------------------------------

function toggleLevel() {
    const isHard = document.getElementById('level-up-toggle').checked;
    currentLevel = isHard ? 'hard' : 'normal';
    saveUserStats();
    alert(`تم تعيين مستوى التحدي إلى: ${isHard ? 'صعب' : 'عادي'}`);
}

// ----------------------------------------------------
// وظائف إحصائيات الملف الشخصي
// ----------------------------------------------------

function updateStats(isCorrect) {
    userStats.totalAnswered++;
    userStats.weeklyStats.answered++;

    if (isCorrect) {
        userStats.totalCorrect++;
        userStats.weeklyStats.correct++;
    } else {
        userStats.totalWrong++;
        userStats.weeklyStats.wrong++;
    }
    saveUserStats();
}

function updateProfileDisplay() {
    document.getElementById('profile-name').textContent = userStats.name;
    document.getElementById('total-answered').textContent = userStats.weeklyStats.answered;
    document.getElementById('total-correct').textContent = userStats.weeklyStats.correct;
    document.getElementById('total-wrong').textContent = userStats.weeklyStats.wrong;
    document.getElementById('current-level-status').textContent = (currentLevel === 'hard') ? 'صعب' : 'عادي';
}

// ----------------------------------------------------
// وظائف اللعب الرئيسية
// ----------------------------------------------------

function startGame(type) {
    gameType = type;
    currentQuestionIndex = 0;
    // الحصول على أسئلة المستوى الحالي
    currentQuestions = allQuestions[currentLevel][gameType];
    
    // خلط الأسئلة
    currentQuestions = currentQuestions.sort(() => Math.random() - 0.5);

    showScreen('game-screen');
    loadQuestion();
}

function loadQuestion() {
    const container = document.getElementById('answers-container');
    const qText = document.getElementById('question-text');
    const counter = document.getElementById('question-counter');

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
            // خلط الخيارات لعرضها بترتيب مختلف في كل مرة
            const shuffledOptions = q.options.sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.textContent = option;
                btn.onclick = () => checkAnswer(option, btn);
                container.appendChild(btn);
            });
        }
    } else {
        // نهاية الجولة
        qText.textContent = "انتهت جولة الأسئلة العشرة! إجاباتك تم تسجيلها في ملفك الشخصي.";
        container.innerHTML = '<button onclick="showScreen(\'main-menu\')">العودة للقائمة الرئيسية</button>';
        counter.textContent = "";
    }
}

function checkAnswer(selectedAnswer, button) {
    const q = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    if (gameType === 'tf') {
        isCorrect = (selectedAnswer === q.answer);
    } else if (gameType === 'mc') {
        isCorrect = (selectedAnswer === q.correct);
    }

    // تلوين الأزرار لإظهار النتيجة
    if (isCorrect) {
        button.classList.add('correct-answer');
    } else {
        button.classList.add('wrong-answer');
        // تمييز الإجابة الصحيحة إذا كانت الإجابة خاطئة
        document.querySelectorAll('#answers-container button').forEach(btn => {
            let correctAnswerText = (gameType === 'tf') ? (q.answer ? 'صح' : 'خطأ') : q.correct;
            if (btn.textContent === correctAnswerText) {
                btn.classList.add('correct-answer');
            }
        });
    }

    // تعطيل جميع الأزرار لمنع الإجابة مرة أخرى
    document.querySelectorAll('#answers-container button').forEach(btn => {
        btn.disabled = true;
    });

    // تحديث الإحصائيات
    updateStats(isCorrect);
    
    // الانتقال للسؤال التالي بعد تأخير
    currentQuestionIndex++;
    setTimeout(loadQuestion, 2000); // تأخير ثانيتين لرؤية النتيجة
}

// ----------------------------------------------------
// وظائف نافذة التواصل
// ----------------------------------------------------

function openContactModal() {
    document.getElementById('contact-modal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contact-modal').style.display = 'none';
}

// تحميل البيانات عند بدء تشغيل الصفحة
window.onload = loadInitialData;


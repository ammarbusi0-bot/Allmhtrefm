// =================================================================
// script.js
// المنطق الأساسي للعبة: الانتقالات، التوقيت، حساب النتيجة، ومعالجة الأزرار
// يتضمن جميع الدوال الضرورية للتشغيل
// =================================================================

// *** 1. المتغيرات والمصفوفات العامة ***
const QUIZ_LENGTH = 10;
const TIME_PER_QUESTION = 15;
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let questionTimer;
let questionCountdown;
let currentQuizType = 'mcq'; 
let bestScoreMCQ = parseInt(localStorage.getItem('bestScoreMCQ') || '0');
let bestScoreTF = parseInt(localStorage.getItem('bestScoreTF') || '0');
let username = '';
let selectedQuestions = []; 

// *** 2. عناصر الواجهة والأصوات ***
const quizContainer = document.getElementById('quiz');
const result = document.getElementById('result');
const nextButton = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.querySelector('.progress-bar');
const timerElement = document.getElementById('timer');
const timerNumber = document.getElementById('timer-number');
const loadingMessage = document.getElementById('loading-message');

const loginScreen = document.getElementById('login-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const profileScreen = document.getElementById('profile-screen'); 
const contactScreen = document.getElementById('contact-screen'); 

const startGameBtn = document.getElementById('start-game-btn'); 
const usernameInput = document.getElementById('username-input');
const welcomeUsername = document.getElementById('welcome-username');
const greetingMessage = document.getElementById('greeting-message');
const profileBtn = document.getElementById('profile-btn'); 

const musicToggleButton = document.getElementById('music-toggle-btn');
const backgroundMusic = document.getElementById('background-music');
const videoWrapper = document.getElementById('video-wrapper'); // حاوية الفيديو

const fixedFooter = document.getElementById('fixed-footer');
const footerHomeBtn = document.getElementById('footer-home-btn');
const footerContactBtn = document.getElementById('footer-contact-btn');

const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');
const soundTimeup = document.getElementById('sound-timeup');


// *** 3. وظائف الإدارة العامة ***

function saveUserData() {
    localStorage.setItem('username', username);
    localStorage.setItem('bestScoreMCQ', bestScoreMCQ);
    localStorage.setItem('bestScoreTF', bestScoreTF);
}

function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.error("Error playing sound:", e));
}

function toggleMusic() {
    const icon = document.getElementById('music-icon');
    const status = document.getElementById('music-status');
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            icon.textContent = '🔊';
            status.textContent = 'إيقاف';
        }).catch(e => {
            console.warn("Music play failed:", e);
            icon.textContent = '🔇';
            status.textContent = 'تشغيل';
        });
    } else {
        backgroundMusic.pause();
        icon.textContent = '🔇';
        status.textContent = 'تشغيل';
    }
}

// *** 4. وظائف إدارة الشاشات والانتقالات ***

function hideAllScreens() {
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
        card.classList.add('hidden');
    });
    
    // إخفاء حاوية الفيديو وشريط الموسيقى (تجنباً للتداخل)
    if (videoWrapper) {
        videoWrapper.classList.add('hidden');
    }
    musicToggleButton.classList.add('hidden');
    
    nextButton.classList.add('hidden');
    timerElement.classList.add('hidden');
    progressBar.classList.add('hidden');
    loadingMessage.classList.add('hidden');
    result.classList.add('hidden');
    quizContainer.innerHTML = ''; 
    
    // إدارة الشريط السفلي
    if(document.body.classList.contains('logged-in')) {
        fixedFooter.classList.remove('hidden');
    } else {
        fixedFooter.classList.add('hidden');
    }
}

function showWelcomeScreen() {
    hideAllScreens();
    
    // إعادة إظهار الفيديو وشريط الموسيقى في شاشة الترحيب
    if (videoWrapper) {
        videoWrapper.classList.remove('hidden');
    }
    musicToggleButton.classList.remove('hidden');

    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active'); 
    welcomeUsername.textContent = username;
    
    // تحديث رسالة الترحيب
    greetingMessage.innerHTML = `مرحباً بك يا **${username}**! <br>أعلى نتيجة: ${Math.max(bestScoreMCQ, bestScoreTF)} من ${QUIZ_LENGTH}`;
    
    document.body.classList.add('logged-in'); 
    fixedFooter.classList.remove('hidden'); 
}

function showProfileScreen() {
    hideAllScreens();
    
    profileScreen.classList.remove('hidden');
    profileScreen.classList.add('active');
    
    profileScreen.innerHTML = `
        <h2 class="text-3xl font-extrabold text-[#66fcf1] mb-6">📊 ملفك الشخصي يا ${username}</h2>
        <div class="space-y-4 text-right">
            <div class="bg-[#0b0c10] p-4 rounded-lg border-r-4 border-yellow-500 shadow-xl">
                <p class="text-lg font-bold text-yellow-300 mb-1">أعلى نتيجة في الاختيار المتعدد (MCQ):</p>
                <p class="text-4xl font-extrabold text-white">${bestScoreMCQ} / ${QUIZ_LENGTH}</p>
            </div>
            
            <div class="bg-[#0b0c10] p-4 rounded-lg border-r-4 border-purple-500 shadow-xl">
                <p class="text-lg font-bold text-purple-300 mb-1">أعلى نتيجة في صح أو خطأ (T/F):</p>
                <p class="text-4xl font-extrabold text-white">${bestScoreTF} / ${QUIZ_LENGTH}</p>
            </div>
        </div>
        <button id="return-from-profile" class="alt-btn mt-8 py-3 px-6 text-xl bg-gray-600 hover:bg-gray-500 text-white">
            العودة إلى اختيار الجولة
        </button>
    `;
    
    document.getElementById('return-from-profile').addEventListener('click', showWelcomeScreen);
}

function showContactScreen() {
    hideAllScreens();

    contactScreen.classList.remove('hidden');
    contactScreen.classList.add('active');
    
    contactScreen.innerHTML = `
        <h2 class="text-3xl font-extrabold text-[#66fcf1] mb-4">💬 تواصل معنا وادعمنا</h2>
        <p class="text-xl text-gray-300 mb-8">نشكر دعمكم وملاحظاتكم! تواصلوا معنا عبر الطرق التالية:</p>

        <div class="space-y-4 text-right">
            <h3 class="text-2xl font-bold text-yellow-500 border-b border-gray-700 pb-2 mb-4">قنوات التواصل:</h3>
            
            <a href="https://t.me/bootcadid" target="_blank" class="contact-link">
                <span class="contact-icon ml-4">✉️</span>
                <div>
                    <p class="text-xl font-bold text-white">قناة التلجرام</p>
                    <p class="text-sm text-gray-400">للانضمام والمتابعة</p>
                </div>
            </a>
            
            <a href="https://wa.me/905510651347" target="_blank" class="contact-link">
                <span class="contact-icon ml-4">📱</span>
                <div>
                    <p class="text-xl font-bold text-white">واتساب مباشر</p>
                    <p class="text-sm text-gray-400">00905510651347</p>
                </div>
            </a>

            <a href="mailto:ammarbusi338@gmail.com" class="contact-link">
                <span class="contact-icon ml-4">📧</span>
                <div>
                    <p class="text-xl font-bold text-white">البريد الإلكتروني</p>
                    <p class="text-sm text-gray-400">ammarbusi338@gmail.com</p>
                </div>
            </a>
            
            <div class="bg-[#1f2833] p-4 rounded-lg mt-6 border-r-4 border-red-500 shadow-xl">
                 <p class="text-xl font-bold text-red-400">❤️ لدعمنا مادياً</p>
                 <p class="text-sm text-gray-400">يمكنك دعم استمرار تطويرنا عبر منصات الدفع المفضلة لديك.</p>
            </div>
            
        </div>
        
        <button id="return-from-contact" class="alt-btn mt-8 py-3 px-6 text-xl bg-gray-600 hover:bg-gray-500 text-white">
            العودة إلى اختيار الجولة
        </button>
    `;
    
    document.getElementById('return-from-contact').addEventListener('click', showWelcomeScreen);
}

// *** 5. وظائف اللعبة الأساسية ***

// اختيار 10 أسئلة عشوائية
function initializeQuestions(type) {
    hideAllScreens();
    loadingMessage.classList.remove('hidden');
    currentQuizType = type;
    currentQuestionIndex = 0;
    score = 0;

    const data = (type === 'mcq') ? ALL_QUESTIONS_DATA : TF_QUESTIONS_DATA;

    // خلط واختيار 10 أسئلة
    const shuffled = data.sort(() => 0.5 - Math.random());
    selectedQuestions = shuffled.slice(0, QUIZ_LENGTH);

    // تأخير بسيط لمحاكاة التحميل
    setTimeout(() => {
        loadingMessage.classList.add('hidden');
        progressBar.classList.remove('hidden');
        timerElement.classList.remove('hidden');
        loadQuestion();
    }, 500);
}

// تحميل وبناء السؤال الحالي
function loadQuestion() {
    clearInterval(questionTimer);
    clearTimeout(questionCountdown);
    
    if (currentQuestionIndex >= QUIZ_LENGTH) {
        showFinalResult();
        return;
    }
    
    answered = false;
    nextButton.classList.add('hidden');
    timerNumber.textContent = TIME_PER_QUESTION;
    
    const currentQ = selectedQuestions[currentQuestionIndex];
    
    // بناء السؤال والإجابات
    let optionsHtml = '';
    currentQ.a.forEach((option, index) => {
        optionsHtml += `
            <button class="answer-btn" data-index="${index}" onclick="checkAnswer(${index}, this)">
                ${option}
            </button>
        `;
    });

    const cardType = currentQuizType === 'mcq' ? 'الاختيار المتعدد' : 'الصح أو الخطأ';

    quizContainer.innerHTML = `
        <div class="question-card mt-6 p-8 active">
            <p class="text-lg text-gray-400 mb-3">السؤال ${currentQuestionIndex + 1} من ${QUIZ_LENGTH} (${cardType})</p>
            <p class="text-3xl font-extrabold text-white mb-8">${currentQ.q}</p>
            <div id="options-container" class="grid gap-4 ${currentQuizType === 'mcq' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-2'}">
                ${optionsHtml}
            </div>
            <div id="feedback" class="mt-4 text-xl font-bold hidden"></div>
        </div>
    `;

    updateProgress();
    startTimer();
}

function startTimer() {
    let timeLeft = TIME_PER_QUESTION;
    timerNumber.textContent = timeLeft;
    
    questionTimer = setInterval(() => {
        timeLeft--;
        timerNumber.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            checkAnswer(-1); // -1 تعني أن الوقت قد انتهى
        }
    }, 1000);
}

function checkAnswer(selectedIndex, button) {
    if (answered) return;
    answered = true;
    clearInterval(questionTimer);
    
    const currentQ = selectedQuestions[currentQuestionIndex];
    const correctIndex = currentQ.correct;
    const allButtons = document.querySelectorAll('.answer-btn');
    const feedback = document.getElementById('feedback');

    allButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('wrong');
        }
        btn.disabled = true; // إيقاف إمكانية النقر على كل الأزرار
    });
    
    // تقييم الإجابة
    if (selectedIndex === correctIndex) {
        score++;
        feedback.textContent = 'إجابة صحيحة! 🟢';
        feedback.classList.remove('hidden');
        feedback.classList.add('text-green-400');
        playSound(soundCorrect);
    } else if (selectedIndex === -1) {
        feedback.textContent = 'انتهى الوقت! الإجابة الصحيحة هي: ' + currentQ.a[correctIndex];
        feedback.classList.remove('hidden');
        feedback.classList.add('text-yellow-400');
        playSound(soundTimeup);
    } else {
        feedback.textContent = 'إجابة خاطئة! الإجابة الصحيحة هي: ' + currentQ.a[correctIndex];
        feedback.classList.remove('hidden');
        feedback.classList.add('text-red-400');
        playSound(soundWrong);
    }

    // عرض زر السؤال التالي بعد تأخير بسيط
    nextButton.classList.remove('hidden');
}

function updateProgress() {
    const percentage = ((currentQuestionIndex + 1) / QUIZ_LENGTH) * 100;
    progressFill.style.width = `${percentage}%`;
    
    // إضافة لون خاص عندما تكون في آخر سؤال
    if (currentQuestionIndex === QUIZ_LENGTH - 1) {
        progressFill.classList.add('bg-red-500');
        progressFill.classList.remove('bg-yellow-500');
    } else {
        progressFill.classList.remove('bg-red-500');
        progressFill.classList.add('bg-yellow-500');
    }
}

function showFinalResult() {
    clearInterval(questionTimer);
    
    hideAllScreens();
    
    progressFill.style.width = '100%';
    quizContainer.innerHTML = '';

    const isMCQ = currentQuizType === 'mcq';
    let bestScore = isMCQ ? bestScoreMCQ : bestScoreTF;
    let quizTypeTitle = isMCQ ? 'الاختيار المتعدد' : 'الصح أو الخطأ';
    
    let isNewRecord = false;
    if (score > bestScore) {
        bestScore = score;
        isNewRecord = true;
        if (isMCQ) bestScoreMCQ = score;
        else bestScoreTF = score;
        saveUserData(); 
    }
    
    const percentage = (score / QUIZ_LENGTH) * 100;
    let message;
    if (percentage >= 90) message = 'تهانينا! أنت متمكن ولديك معلومات ممتازة! 🌟';
    else if (percentage >= 70) message = 'نتيجة جيدة! استمر في التعلم وتحدي نفسك. 💪';
    else message = 'تحتاج إلى بعض المراجعة. لا تيأس، المحاولة القادمة أفضل! 💡';

    quizContainer.innerHTML = `
        <div class="card question-card active mt-6 p-8">
            <p class="text-3xl md:text-4xl mb-4 text-[#66fcf1]">انتهت جولة ${quizTypeTitle}!</p>
            <p class="text-2xl md:text-3xl font-bold mb-4 ${isNewRecord ? 'text-yellow-400' : 'text-gray-200'}">${message}</p>
            <p class="text-2xl font-extrabold text-green-400">أحرزت ${score} من ${QUIZ_LENGTH} أسئلة.</p>
            <p class="text-yellow-300 text-lg font-bold mt-2">أعلى نتيجة لـ ${username} في هذه الجولة: ${bestScore} من ${QUIZ_LENGTH}</p>
            <button id="return-to-welcome" class="main-btn mt-6 py-3 px-6 text-xl">اختر تحدي جديد</button>
        </div>
    `;

    document.getElementById('return-to-welcome').addEventListener('click', showWelcomeScreen);
}

// *** 6. معالجات الأحداث والبدء ***

// معالج زر التسجيل (عند النقر على "دخول وبدء التحدي")
startGameBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        saveUserData(); 
        
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        
        showWelcomeScreen(); 
        
    } else {
        alert('الرجاء إدخال اسم المستخدم.');
    }
});

// معالجات الشريط السفلي وأزرار الشاشات
profileBtn.addEventListener('click', showProfileScreen);
footerHomeBtn.addEventListener('click', showWelcomeScreen);
footerContactBtn.addEventListener('click', showContactScreen);

// معالج زر السؤال التالي
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    result.classList.add('hidden');
    loadQuestion();
});

// تهيئة اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        username = savedUsername;
        usernameInput.value = savedUsername;
        bestScoreMCQ = parseInt(localStorage.getItem('bestScoreMCQ') || '0');
        bestScoreTF = parseInt(localStorage.getItem('bestScoreTF') || '0');
        
        // التخطي التلقائي إلى شاشة الترحيب
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        showWelcomeScreen();
    } else {
        // إظهار شاشة تسجيل الدخول
        loginScreen.classList.add('active');
        loginScreen.classList.remove('hidden');
        fixedFooter.classList.add('hidden'); 
    }
    
    // ربط أزرار بدء التحدي في شاشة الترحيب
    const startMcqBtn = document.getElementById('start-mcq-btn');
    const startTfBtn = document.getElementById('start-tf-btn');
    if (startMcqBtn && startTfBtn) {
        startMcqBtn.addEventListener('click', (e) => initializeQuestions(e.target.dataset.type));
        startTfBtn.addEventListener('click', (e) => initializeQuestions(e.target.dataset.type));
    }
    
    // ربط زر الموسيقى
    musicToggleButton.addEventListener('click', toggleMusic);
});

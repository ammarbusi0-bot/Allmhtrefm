// =================================================================
// script.js
// المنطق الأساسي للعبة: الانتقالات، التوقيت، حساب النتيجة، ومعالجة الأزرار
// يعتمد على questions.js للحصول على بيانات الأسئلة.
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

// *** 2. عناصر الواجهة والأصوات (مجموعة في مكان واحد لضمان التعريف) ***
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

const startGameBtn = document.getElementById('start-game-btn'); // زر الدخول
const usernameInput = document.getElementById('username-input');
const welcomeUsername = document.getElementById('welcome-username');
const greetingMessage = document.getElementById('greeting-message');
const profileBtn = document.getElementById('profile-btn'); 

const musicToggleButton = document.getElementById('music-toggle-btn');
const backgroundMusic = document.getElementById('background-music');
const videoWrapper = document.getElementById('video-wrapper'); // حاوية الفيديو الجديدة

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

// *** 4. وظائف إدارة الشاشات (حل مشكلة الانتقال وتداخل الفيديو) ***

function hideAllScreens() {
    // إخفاء جميع الحاويات الرئيسية للأسئلة والإحصائيات
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
        card.classList.add('hidden');
    });
    
    // إخفاء حاوية الفيديو وشريط الموسيقى (تجنباً للتداخل)
    if (videoWrapper) {
        videoWrapper.classList.add('hidden');
    }
    musicToggleButton.classList.add('hidden');
    
    // إخفاء العناصر غير الضرورية
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

// الوظيفة الأساسية للانتقال إلى الشاشة الرئيسية (Welcome Screen)
function showWelcomeScreen() {
    hideAllScreens();
    
    // إعادة إظهار الفيديو وشريط الموسيقى في شاشة الترحيب
    if (videoWrapper) {
        videoWrapper.classList.remove('hidden');
    }
    musicToggleButton.classList.remove('hidden');

    // إظهار شاشة الترحيب فقط
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
    
    // بناء وعرض محتوى شاشة الإحصائيات
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

// ... (تضمين منطق اللعبة الأصلي - loadQuestion, checkAnswer, initializeQuestions, showFinalResult) ...

// **ملاحظة:** تم حذف دوال اللعبة الرئيسية هنا للاختصار. يجب أن تكون هذه الدوال موجودة في نسختك.
// سنركز على معالجات الأحداث التي تسبب المشكلة.

// *** 5. معالجات الأحداث والبدء (التركيز على زر الدخول) ***

// معالج زر التسجيل (عند النقر على "دخول وبدء التحدي")
startGameBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        saveUserData(); 
        
        // إخفاء شاشة الدخول
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        
        // الانتقال إلى شاشة الترحيب
        showWelcomeScreen(); 
        
    } else {
        alert('الرجاء إدخال اسم المستخدم.');
    }
});

// معالج زر عرض الملف الشخصي
profileBtn.addEventListener('click', showProfileScreen);

// معالج زر الشاشة الرئيسية في الشريط السفلي
footerHomeBtn.addEventListener('click', showWelcomeScreen);

// معالج زر التواصل في الشريط السفلي
footerContactBtn.addEventListener('click', showContactScreen);

// معالج زر السؤال التالي
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    result.classList.add('hidden');
    // loadQuestion(); // يجب استدعاء دالة loadQuestion() الأصلية هنا
});

// التحقق عند تحميل الصفحة لوجود اسم مستخدم محفوظ (للتخطي التلقائي)
document.addEventListener('DOMContentLoaded', () => {
    // محاولة استرداد اسم المستخدم المحفوظ
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

// *****************************************************************
// يجب إضافة بقية دوال اللعبة الرئيسية (مثل initializeQuestions) هنا
// *****************************************************************

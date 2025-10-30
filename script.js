// *** 1. المتغيرات والمصفوفات العامة (نعتمد على questions.js الآن) ***
// يتم استدعاء ALL_QUESTIONS_DATA و TF_QUESTIONS_DATA من ملف questions.js

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
let selectedQuestions = []; // الأسئلة التي يتم اختيارها في كل جولة

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
const profileScreen = document.getElementById('profile-screen'); // شاشة الإحصائيات
const contactScreen = document.getElementById('contact-screen'); // شاشة التواصل

const startGameBtn = document.getElementById('start-game-btn');
const usernameInput = document.getElementById('username-input');
const welcomeUsername = document.getElementById('welcome-username');
const greetingMessage = document.getElementById('greeting-message');
const profileBtn = document.getElementById('profile-btn'); 

const musicToggleButton = document.getElementById('music-toggle-btn');
const backgroundMusic = document.getElementById('background-music');

// عناصر الشريط السفلي
const fixedFooter = document.getElementById('fixed-footer');
const footerHomeBtn = document.getElementById('footer-home-btn');
const footerContactBtn = document.getElementById('footer-contact-btn');


// *** 3. وظائف إدارة الشاشات (حل مشكلة الانتقال) ***

function hideAllScreens() {
    // إخفاء جميع الحاويات الرئيسية للأسئلة والإحصائيات
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
        card.classList.add('hidden');
    });
    // إخفاء العناصر غير المتعلقة بالشاشات الرئيسية
    nextButton.classList.add('hidden');
    timerElement.classList.add('hidden');
    progressBar.classList.add('hidden');
    loadingMessage.classList.add('hidden');
    result.classList.add('hidden');
    quizContainer.innerHTML = ''; // تنظيف حاوية الأسئلة
    
    // إخفاء الشريط السفلي في شاشة تسجيل الدخول فقط
    if(document.body.classList.contains('logged-in')) {
        fixedFooter.classList.remove('hidden');
    } else {
        fixedFooter.classList.add('hidden');
    }
}

// ** الوظيفة الأساسية للعودة للصفحة الرئيسية (تم إصلاحها)**
function showWelcomeScreen() {
    hideAllScreens();
    
    // إظهار شاشة الترحيب فقط
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active'); 
    welcomeUsername.textContent = username;
    
    // تحديث رسالة الترحيب
    greetingMessage.innerHTML = `مرحباً بك يا **${username}**! <br>أعلى نتيجة: ${Math.max(bestScoreMCQ, bestScoreTF)} من ${QUIZ_LENGTH}`;
    
    document.body.classList.add('logged-in'); // تعيين حالة تسجيل الدخول
    fixedFooter.classList.remove('hidden'); // إظهار الشريط السفلي
}

// وظيفة حفظ الاسم وأعلى نتيجة في المتصفح
function saveUserData() {
    localStorage.setItem('username', username);
    localStorage.setItem('bestScoreMCQ', bestScoreMCQ);
    localStorage.setItem('bestScoreTF', bestScoreTF);
}

// ... (باقي وظائف initializeQuestions و loadQuestion و checkAnswer و updateProgress تبقى كما هي) ...

function showFinalResult() {
    // ... (كود النتيجة النهائية) ...
    
    // تهيئة شاشة النتيجة النهائية
    progressFill.style.width = '100%';
    quizContainer.innerHTML = '';
    timerElement.classList.add('hidden');
    progressBar.classList.add('hidden');

    const isMCQ = currentQuizType === 'mcq';
    let bestScore = isMCQ ? bestScoreMCQ : bestScoreTF;
    let storageKey = isMCQ ? 'bestScoreMCQ' : 'bestScoreTF';
    let quizTypeTitle = isMCQ ? 'الاختيار المتعدد' : 'الصح أو الخطأ';
    
    let isNewRecord = false;
    if (score > bestScore) {
        // ... (منطق تحديث الرقم القياسي) ...
    }
    
    // إخفاء جميع الشاشات أولاً
    hideAllScreens();

    const percentage = (score / QUIZ_LENGTH) * 100;
    let message = '...'; // (رسالة النتيجة)
    
    // إنشاء واجهة النتيجة النهائية داخل حاوية QuizContainer
    quizContainer.innerHTML = `
        <div class="card question-card active mt-6 p-8">
            <p class="text-3xl md:text-4xl mb-4 text-[#66fcf1]">انتهت جولة ${quizTypeTitle}!</p>
            <p class="text-2xl md:text-3xl font-bold mb-4 ${isNewRecord ? 'text-yellow-400' : 'text-gray-200'}">${message}</p>
            <p class="text-yellow-300 text-lg font-bold mb-4">أعلى نتيجة لـ ${username} في هذه الجولة: ${bestScore} من ${QUIZ_LENGTH}</p>
            <button id="return-to-welcome" class="main-btn mt-4 py-3 px-6 text-xl">اختر تحدي جديد</button>
        </div>
    `;

    result.classList.add('hidden'); // إخفاء صندوق "إجابة صحيحة/خاطئة"
    document.getElementById('return-to-welcome').addEventListener('click', showWelcomeScreen);
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

// ** وظيفة عرض شاشة التواصل الجديدة **
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

// ... (باقي وظائف اللعبة مثل toggleMusic و initializeQuestions) ...
// ** يجب إعادة كتابة initializeQuestions لتبدأ بالاعتماد على مصفوفات ALL_QUESTIONS_DATA و TF_QUESTIONS_DATA من questions.js

function initializeQuestions(type) {
    // ... (نفس المنطق السابق ولكن مع الاعتماد على المتغيرات العالمية من questions.js) ...
}

// *** 4. معالجات الأحداث والبدء ***

// معالج زر التسجيل (عند النقر لأول مرة)
startGameBtn.addEventListener('click', () => {
    // ... (نفس المنطق السابق) ...
    document.body.classList.add('logged-in'); // إضافة كلاس الدلالة على تسجيل الدخول
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
    loadQuestion();
});

// التحقق عند تحميل الصفحة لوجود اسم مستخدم محفوظ
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        username = savedUsername;
        usernameInput.value = savedUsername;
        bestScoreMCQ = parseInt(localStorage.getItem('bestScoreMCQ') || '0');
        bestScoreTF = parseInt(localStorage.getItem('bestScoreTF') || '0');
        
        // إخفاء شاشة الدخول وإظهار شاشة الترحيب
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        showWelcomeScreen();
    } else {
        // إظهار شاشة تسجيل الدخول
        loginScreen.classList.add('active');
        loginScreen.classList.remove('hidden');
        fixedFooter.classList.add('hidden'); // إخفاء الشريط السفلي قبل التسجيل
    }
    
    // ربط أزرار بدء التحدي
    document.getElementById('start-mcq-btn').addEventListener('click', (e) => initializeQuestions(e.target.dataset.type));
    document.getElementById('start-tf-btn').addEventListener('click', (e) => initializeQuestions(e.target.dataset.type));
    
    // ربط زر الموسيقى
    musicToggleButton.addEventListener('click', toggleMusic);
});

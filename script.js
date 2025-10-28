// تحدي المعرفة الإسلامية - الفقه والثقافة
// الكود النهائي لملف script.js

// 1. الإعدادات والبيانات (يجب تمديد قائمة الأسئلة لاحقاً)
const QUESTIONS = {
    mcq: [
        { question: "من هو أول الخلفاء الراشدين؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"], answer: "أبو بكر الصديق" },
        { question: "ما هي السورة التي تسمى قلب القرآن؟", options: ["الرحمن", "البقرة", "يس", "الكهف"], answer: "يس" },
        { question: "كم عدد أركان الإسلام؟", options: ["أربعة", "خمسة", "ستة", "سبعة"], answer: "خمسة" },
        { question: "في أي عام ميلادي حدثت غزوة بدر الكبرى؟", options: ["622 م", "624 م", "630 م", "632 م"], answer: "624 م" },
        { question: "من هي زوجة النبي صلى الله عليه وسلم التي كانت تعرف بأم المساكين؟", options: ["خديجة بنت خويلد", "عائشة بنت أبي بكر", "زينب بنت خزيمة", "حفصة بنت عمر"], answer: "زينب بنت خزيمة" },
        { question: "ما هي المدينة التي هاجر إليها النبي صلى الله عليه وسلم من مكة؟", options: ["الطائف", "القدس", "يثرب (المدينة المنورة)", "الشام"], answer: "يثرب (المدينة المنورة)" },
        { question: "ما هو اسم المعركة التي فتح فيها المسلمون بلاد فارس؟", options: ["اليرموك", "القادسية", "أحد", "مؤتة"], answer: "القادسية" },
        { question: "أين تقع الكعبة المشرفة؟", options: ["المدينة المنورة", "الرياض", "جدة", "مكة المكرمة"], answer: "مكة المكرمة" },
        { question: "ما هو الشيء الذي كان يأكله النبي صلى الله عليه وسلم كثيراً وكان يحبه؟", options: ["السمك", "اللحم", "التمر والعسل", "الخبز والزيت"], answer: "التمر والعسل" },
        { question: "ما هي أطول سورة في القرآن الكريم؟", options: ["سورة آل عمران", "سورة النساء", "سورة البقرة", "سورة الأعراف"], answer: "سورة البقرة" },
        // ... يرجى إضافة 90 سؤالاً إضافياً هنا
    ],
    tf: [
        { question: "أول صلاة فُرضت على المسلمين هي صلاة العشاء.", answer: false },
        { question: "عقوبة تارك الصلاة هي القتل حداً عند جمهور العلماء.", answer: true },
        { question: "تسمية المسلم بـ 'المرتد' تطلق على من يترك الإسلام ويكفر بعد إسلامه.", answer: true },
        { question: "الاستدلال بالكتاب والسنة والإجماع والقياس هو الأركان الأساسية للمذهب الحنفي فقط.", answer: false },
        { question: "أركان الحج هي الإحرام، الوقوف بعرفة، طواف الإفاضة، والسعي بين الصفا والمروة.", answer: true },
        { question: "زكاة الفطر تجب على كل مسلم يملك قوت يومه وليلته.", answer: true },
        { question: "يُباح للمسلم أن يأكل من لحم الخنزير إذا كان مضطراً لإنقاذ حياته.", answer: true },
        { question: "غسل الجنابة لا يصح إلا إذا تم بماء مغلي.", answer: false },
        { question: "الصلاة لا تجوز في المقبرة أو الحمام أو قارعة الطريق.", answer: true },
        { question: "الفرق بين الركن والواجب هو أن الركن لا يسقط لا عمداً ولا سهواً، أما الواجب فيسقط بالسهو ويُجبر بسجود السهو.", answer: true },
        // ... يرجى إضافة 90 سؤالاً إضافياً هنا
    ]
};

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let quizType = '';
const MAX_QUESTIONS = 10; 

// 2. العناصر الأساسية في DOM
const quizContainer = document.getElementById('quiz');
const loginScreen = document.getElementById('login-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeUsername = document.getElementById('welcome-username');
const loadingMessage = document.getElementById('loading-message');
const resultDiv = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');
const timerDiv = document.getElementById('timer');
const timerNumber = document.getElementById('timer-number');
const usernameInput = document.getElementById('username-input');

// 3. الأصوات
const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');
const soundTimeUp = document.getElementById('sound-timeup');
const backgroundMusic = document.getElementById('background-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicIcon = document.getElementById('music-icon');
const musicStatus = document.getElementById('music-status');

// 4. وظائف التحكم في الشاشات
function showLoginScreen() {
    loginScreen.classList.remove('hidden');
    welcomeScreen.classList.add('hidden');
    quizContainer.innerHTML = '';
    resultDiv.classList.add('hidden');
    nextBtn.classList.add('hidden');
    timerDiv.classList.add('hidden');
}

function showWelcomeScreen(username) {
    welcomeUsername.textContent = username;
    
    // إخفاء شاشة تسجيل الدخول بتأثير
    loginScreen.style.opacity = '0';
    loginScreen.style.transform = 'translateY(-20px)';
    
    // **زيادة وقت التأخير لضمان تحميل جميع العناصر**
    setTimeout(() => {
        loginScreen.classList.add('hidden'); 
        
        // **إظهار شاشة الترحيب وإزالة الكلاس hidden**
        welcomeScreen.classList.remove('hidden'); 
        welcomeScreen.style.opacity = '1';
        welcomeScreen.style.transform = 'translateY(0)';
    }, 700); // زيادة التأخير إلى 700 مللي ثانية
}

// 5. وظيفة بدء الاختبار
function startGame(type) {
    quizType = type;
    score = 0;
    currentQuestionIndex = 0;
    
    // اختيار أسئلة عشوائية
    let allQs = QUESTIONS[type];
    currentQuestions = allQs.sort(() => 0.5 - Math.random()).slice(0, MAX_QUESTIONS);
    
    welcomeScreen.classList.add('hidden');
    loadingMessage.classList.remove('hidden');
    
    // عرض السؤال الأول بعد ثوانٍ (لإظهار رسالة التحميل)
    setTimeout(() => {
        loadingMessage.classList.add('hidden');
        document.querySelector('.progress-bar').classList.remove('hidden');
        displayQuestion();
    }, 1000);
}

// 6. وظيفة عرض السؤال
function displayQuestion() {
    clearInterval(timerInterval);
    resultDiv.classList.add('hidden');
    nextBtn.classList.add('hidden');
    timerDiv.classList.remove('hidden');
    
    if (currentQuestionIndex >= MAX_QUESTIONS) {
        showResultScreen();
        return;
    }

    const q = currentQuestions[currentQuestionIndex];
    quizContainer.innerHTML = ''; // مسح المحتوى القديم

    const questionCard = document.createElement('div');
    questionCard.className = 'card question-card mt-6';
    questionCard.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#66fcf1] border-b-4 border-yellow-500 pb-2 mb-4">
                سؤال رقم ${currentQuestionIndex + 1}
            </h2>
            <p class="text-xl text-yellow-300 font-bold">${quizType === 'mcq' ? 'اختيار متعدد' : 'صح أو خطأ'}</p>
        </div>
        <p class="text-3xl text-gray-200 mb-8">${q.question}</p>
        <div id="options-container" class="grid ${quizType === 'mcq' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'} gap-4">
            </div>
    `;
    quizContainer.appendChild(questionCard);

    const optionsContainer = questionCard.querySelector('#options-container');

    if (quizType === 'mcq') {
        q.options.forEach(option => {
            const btn = createOptionButton(option, () => checkAnswer(option, q.answer));
            optionsContainer.appendChild(btn);
        });
    } else if (quizType === 'tf') {
        // خيارات صح أو خطأ
        const isCorrectTrue = q.answer === true;
        
        // زر "صح"
        const btnTrue = createOptionButton('صح ✅', () => checkAnswer(isCorrectTrue ? 'صح ✅' : 'خطأ ❌', 'صح ✅'));
        optionsContainer.appendChild(btnTrue);
        
        // زر "خطأ"
        const btnFalse = createOptionButton('خطأ ❌', () => checkAnswer(!isCorrectTrue ? 'خطأ ❌' : 'صح ✅', 'خطأ ❌'));
        optionsContainer.appendChild(btnFalse);
    }


    startTimer();
    updateProgressBar();
}

function createOptionButton(text, clickHandler) {
    const btn = document.createElement('button');
    btn.className = 'option-btn bg-[#1f2833] hover:bg-[#45a29e] text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-xl text-lg md:text-xl text-right transform hover:scale-[1.03]';
    btn.textContent = text;
    btn.onclick = clickHandler;
    return btn;
}

// 7. وظيفة التحقق من الإجابة
function checkAnswer(selected, correct) {
    clearInterval(timerInterval);
    const options = document.querySelectorAll('.option-btn');
    let isCorrect = false;

    // تمكين وتحديد الإجابات
    options.forEach(btn => {
        btn.disabled = true; // منع تغيير الإجابة
        const btnText = btn.textContent.trim();
        let correctText;

        if (quizType === 'tf') {
            const correctBool = currentQuestions[currentQuestionIndex].answer;
            correctText = correctBool ? 'صح ✅' : 'خطأ ❌';
        } else {
            correctText = correct;
        }

        // تلوين الأزرار
        if (btnText === correctText) {
            btn.classList.add('bg-green-700', 'border-4', 'border-green-400');
        } else if (btnText === selected) {
            btn.classList.add('bg-red-700', 'border-4', 'border-red-400');
        } else {
            btn.classList.add('bg-gray-500'); // تظليل غير المختار بلون رمادي
        }
    });
    
    // التحقق الفعلي من صحة الإجابة
    let finalCorrectAnswer;
    if (quizType === 'mcq') {
        finalCorrectAnswer = correct;
        isCorrect = (selected === finalCorrectAnswer);
    } else { // tf
        const correctBool = currentQuestions[currentQuestionIndex].answer;
        finalCorrectAnswer = correctBool ? 'صح ✅' : 'خطأ ❌';
        isCorrect = (selected === finalCorrectAnswer);
        if (selected === 'Timeout') isCorrect = false; // إذا كان الوقت قد انتهى
    }


    // حساب النتيجة وتحديد الرسالة
    if (isCorrect) {
        score++;
        resultDiv.className = 'mt-8 text-2xl md:text-3xl font-bold card p-5 mx-auto max-w-4xl bg-green-900 border-4 border-green-500 text-white';
        resultDiv.textContent = 'صحيح! إجابة موفقة. 👍';
        soundCorrect.play();
    } else {
        resultDiv.className = 'mt-8 text-2xl md:text-3xl font-bold card p-5 mx-auto max-w-4xl bg-red-900 border-4 border-red-500 text-white';
        resultDiv.textContent = 'خطأ! الإجابة الصحيحة هي: ' + finalCorrectAnswer + ' ❌';
        soundWrong.play();
    }

    resultDiv.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    timerDiv.classList.add('hidden'); // إخفاء المؤقت
}


// 8. وظيفة المؤقت
function startTimer() {
    let timeLeft = 15;
    timerNumber.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerNumber.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerNumber.classList.add('text-red-700');
        } else {
            timerNumber.classList.remove('text-red-700');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            soundTimeUp.play();
            // في حالة انتهاء الوقت، نرسل قيمة 'Timeout' للتحقق من الإجابة
            checkAnswer('Timeout', currentQuestions[currentQuestionIndex].answer); 
        }
    }, 1000);
}

// 9. وظيفة تحديث شريط التقدم
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const percentage = ((currentQuestionIndex) / MAX_QUESTIONS) * 100;
    progressFill.style.width = `${percentage}%`;
}

// 10. وظيفة شاشة النتائج
function showResultScreen() {
    document.querySelector('.progress-bar').classList.add('hidden');
    quizContainer.innerHTML = '';
    
    // حفظ أعلى نتيجة
    const username = localStorage.getItem('username');
    const storageKey = `${username}_${quizType}_highScore`;
    let currentHighScore = parseInt(localStorage.getItem(storageKey)) || 0;
    let newRecord = false;

    if (score > currentHighScore) {
        currentHighScore = score;
        localStorage.setItem(storageKey, score);
        newRecord = true;
    }
    
    const message = newRecord ? 'تهانينا! لقد سجلت رقماً قياسياً جديداً! 🏆' : 'نتيجة جيدة! استمر في المحاولة لتحطيم الرقم القياسي. 💡';
    
    resultDiv.className = 'mt-8 text-2xl md:text-4xl font-bold card p-8 mx-auto max-w-4xl bg-[#1f2833] border-4 border-[#66fcf1] text-white';
    resultDiv.innerHTML = `
        <h2 class="text-4xl font-extrabold text-yellow-300 mb-4">جولة ${quizType === 'mcq' ? 'الاختيار المتعدد' : 'صح أو خطأ'} انتهت!</h2>
        <p class="text-3xl text-[#66fcf1] mb-2">نتيجتك: ${score} من ${MAX_QUESTIONS}</p>
        <p class="text-2xl text-green-400 mb-6">${message}</p>
        <p class="text-xl text-gray-300">أعلى نتيجة لديك حتى الآن: ${currentHighScore} من ${MAX_QUESTIONS}</p>
        <button id="back-to-welcome-btn" class="main-btn mt-6 py-3 px-6 text-xl">
            العودة لشاشة اختيار التحدي 🔙
        </button>
    `;
    
    document.getElementById('back-to-welcome-btn').addEventListener('click', () => {
        const user = localStorage.getItem('username');
        showWelcomeScreen(user);
        resultDiv.classList.add('hidden');
    });
}

// 11. وظيفة شاشة الملف الشخصي (الإحصائيات)
function showProfileScreen() {
    // إخفاء شاشة الترحيب
    welcomeScreen.classList.add('hidden');
    
    // قراءة البيانات من التخزين المحلي
    const username = localStorage.getItem('username');
    const mcqHighScore = localStorage.getItem(`${username}_mcq_highScore`) || 0;
    const tfHighScore = localStorage.getItem(`${username}_tf_highScore`) || 0;
    
    quizContainer.innerHTML = ''; // مسح المحتوى
    
    const profileCard = document.createElement('div');
    profileCard.className = 'card mt-6 p-8 bg-[#1f2833] border-4 border-yellow-500 text-white shadow-2xl';
    profileCard.innerHTML = `
        <h2 class="text-4xl font-extrabold text-[#66fcf1] mb-6">ملفك الشخصي يا ${username} 👤</h2>
        <div class="space-y-4 text-right text-xl">
            <p class="border-b border-gray-700 pb-2">🌟 **أعلى نتيجة (اختيار متعدد):** <span class="text-yellow-300 font-bold">${mcqHighScore} من ${MAX_QUESTIONS}</span></p>
            <p class="border-b border-gray-700 pb-2">🎯 **أعلى نتيجة (صح أو خطأ):** <span class="text-yellow-300 font-bold">${tfHighScore} من ${MAX_QUESTIONS}</span></p>
        </div>
        
        <button id="profile-back-btn" class="alt-btn mt-8 py-3 px-6 text-xl bg-gray-600 hover:bg-gray-500">
            العودة إلى شاشة التحدي 🔙
        </button>
    `;
    quizContainer.appendChild(profileCard);
    
    document.getElementById('profile-back-btn').addEventListener('click', () => {
        const user = localStorage.getItem('username');
        // التأكد من أن جميع العناصر تم إخفاؤها قبل العرض
        quizContainer.innerHTML = ''; 
        resultDiv.classList.add('hidden');
        showWelcomeScreen(user);
    });
}

// 12. معالجات الأحداث (Event Listeners)
document.addEventListener('DOMContentLoaded', () => {
    // 1. فحص حالة تسجيل الدخول عند تحميل الصفحة
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        showWelcomeScreen(storedUsername);
    } else {
        showLoginScreen();
    }

    // 2. معالج حدث بدء اللعبة (شاشة تسجيل الدخول)
    document.getElementById('start-game-btn').addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            // للتأكد من عدم وجود مسافات إضافية أو مشاكل في الذاكرة المؤقتة
            localStorage.setItem('username', username.replace(/\s/g, '_')); 
            showWelcomeScreen(username.replace(/\s/g, '_'));
        } else {
            alert('الرجاء إدخال اسم المستخدم.');
        }
    });

    // 3. معالجات أحداث أزرار شاشة الترحيب (بدء الاختبار وعرض الملف الشخصي)
    // نستخدم "Event Delegation" لضمان ربط الأحداث مع الأزرار المفقودة
    welcomeScreen.addEventListener('click', (event) => {
        // نستخدم dataset للعثور على الزر سواء كان له ID أو لا
        if (event.target.id === 'start-mcq-btn' || event.target.dataset.type === 'mcq') {
            startGame('mcq');
        } else if (event.target.id === 'start-tf-btn' || event.target.dataset.type === 'tf') {
            startGame('tf');
        } else if (event.target.id === 'profile-btn') {
            showProfileScreen();
        }
    });

    // 4. معالج حدث زر 'السؤال التالي'
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });
    
    // 5. معالج حدث تبديل الموسيقى
    musicToggleBtn.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicIcon.textContent = '🔊';
            musicStatus.textContent = 'إيقاف';
        } else {
            backgroundMusic.pause();
            musicIcon.textContent = '🔇';
            musicStatus.textContent = 'تشغيل';
        }
    });
});

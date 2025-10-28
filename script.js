// تحدي المعرفة الإسلامية - الفقه والثقافة
// الكود النهائي لملف script.js (مُعدَّل لحل مشاكل صح/خطأ، الأزرار المفقودة، وحفظ الإحصائيات)

// 1. الإعدادات والبيانات والأسئلة (القائمة موسعة)
const QUESTIONS = {
    // تم تمديد القائمة لضمان التنوع واختلاف الإجابات الصحيحة والخاطئة
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
        // **هنا يجب عليك إضافة المزيد من الأسئلة لتكملة الـ 100 سؤال لكل جولة.**
    ],
    tf: [
        { question: "أول صلاة فُرضت على المسلمين هي صلاة العشاء.", answer: false }, // الإجابة الصحيحة هي الظهر
        { question: "عقوبة تارك الصلاة هي القتل حداً عند جمهور العلماء.", answer: true },
        { question: "تسمية المسلم بـ 'المرتد' تطلق على من يترك الإسلام ويكفر بعد إسلامه.", answer: true },
        { question: "الاستدلال بالكتاب والسنة والإجماع والقياس هو الأركان الأساسية للمذهب الحنفي فقط.", answer: false },
        { question: "أركان الحج هي الإحرام، الوقوف بعرفة، طواف الإفاضة، والسعي بين الصفا والمروة.", answer: true },
        { question: "زكاة الفطر تجب على كل مسلم يملك قوت يومه وليلته.", answer: true },
        { question: "يُباح للمسلم أن يأكل من لحم الخنزير إذا كان مضطراً لإنقاذ حياته.", answer: true },
        { question: "غسل الجنابة لا يصح إلا إذا تم بماء مغلي.", answer: false },
        { question: "الصلاة لا تجوز في المقبرة أو الحمام أو قارعة الطريق.", answer: true },
        { question: "الفرق بين الركن والواجب هو أن الركن لا يسقط لا عمداً ولا سهواً، أما الواجب فيسقط بالسهو ويُجبر بسجود السهو.", answer: true },
        // **هنا يجب عليك إضافة المزيد من أسئلة صح أو خطأ لتكملة الـ 100 سؤال لكل جولة.**
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
const progressBar = document.querySelector('.progress-bar');

// 3. الأصوات (لم يتم تغييرها)
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
    progressBar.classList.add('hidden');
}

function showWelcomeScreen(username) {
    // التأكد من إخفاء جميع العناصر الأخرى قبل عرض شاشة الترحيب
    clearInterval(timerInterval);
    quizContainer.innerHTML = '';
    resultDiv.classList.add('hidden');
    nextBtn.classList.add('hidden');
    timerDiv.classList.add('hidden');
    progressBar.classList.add('hidden');
    
    welcomeUsername.textContent = username;
    
    // إخفاء شاشة تسجيل الدخول بتأثير
    loginScreen.style.opacity = '0';
    loginScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        loginScreen.classList.add('hidden'); 
        
        // إظهار شاشة الترحيب وإزالة الكلاس hidden
        welcomeScreen.classList.remove('hidden'); 
        welcomeScreen.style.opacity = '1';
        welcomeScreen.style.transform = 'translateY(0)';
    }, 700);
}

// 5. وظيفة بدء الاختبار
function startGame(type) {
    quizType = type;
    score = 0;
    currentQuestionIndex = 0;
    
    // اختيار أسئلة عشوائية
    let allQs = QUESTIONS[type];
    // **تحذير: إذا كان عدد الأسئلة المتاحة أقل من MAX_QUESTIONS، سيتم استخدام العدد المتاح.**
    const availableQuestionsCount = Math.min(allQs.length, MAX_QUESTIONS);
    currentQuestions = allQs.sort(() => 0.5 - Math.random()).slice(0, availableQuestionsCount);
    
    welcomeScreen.classList.add('hidden');
    loadingMessage.classList.remove('hidden');
    
    setTimeout(() => {
        loadingMessage.classList.add('hidden');
        progressBar.classList.remove('hidden');
        displayQuestion();
    }, 1000);
}

// 6. وظيفة عرض السؤال (تم إضافة زر الانسحاب هنا)
function displayQuestion() {
    clearInterval(timerInterval);
    resultDiv.classList.add('hidden');
    nextBtn.classList.add('hidden');
    timerDiv.classList.remove('hidden');
    
    if (currentQuestionIndex >= currentQuestions.length) {
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
        <button id="withdraw-btn" class="alt-btn mt-6 py-2 px-4 text-base bg-red-600 hover:bg-red-700">
            انسحاب والعودة للقائمة 🚪
        </button>
    `;
    quizContainer.appendChild(questionCard);

    // ربط زر الانسحاب
    document.getElementById('withdraw-btn').addEventListener('click', () => {
        const user = localStorage.getItem('username');
        if (confirm('هل أنت متأكد من رغبتك في الانسحاب؟ لن يتم احتساب هذه الجولة.')) {
            showWelcomeScreen(user);
        }
    });

    const optionsContainer = questionCard.querySelector('#options-container');

    if (quizType === 'mcq') {
        q.options.forEach(option => {
            const btn = createOptionButton(option, () => checkAnswer(option, q.answer));
            optionsContainer.appendChild(btn);
        });
    } else if (quizType === 'tf') {
        // تم تصحيح منطق التحقق هنا
        const isCorrectTrue = q.answer === true;
        
        // زر "صح"
        const btnTrue = createOptionButton('صح ✅', () => checkAnswer('صح ✅', isCorrectTrue));
        optionsContainer.appendChild(btnTrue);
        
        // زر "خطأ"
        const btnFalse = createOptionButton('خطأ ❌', () => checkAnswer('خطأ ❌', isCorrectTrue));
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

// 7. وظيفة التحقق من الإجابة (تم تصحيح منطق التحقق)
function checkAnswer(selected, correct) {
    clearInterval(timerInterval);
    const options = document.querySelectorAll('.option-btn');
    let isCorrect = false;

    // تحديد الإجابة الصحيحة لعرضها
    let finalCorrectAnswer;
    if (quizType === 'mcq') {
        finalCorrectAnswer = currentQuestions[currentQuestionIndex].answer;
        isCorrect = (selected === finalCorrectAnswer);
    } else { // tf
        const correctBool = currentQuestions[currentQuestionIndex].answer;
        finalCorrectAnswer = correctBool ? 'صح ✅' : 'خطأ ❌';
        isCorrect = (selected === finalCorrectAnswer);
        if (selected === 'Timeout') isCorrect = false; // إذا كان الوقت قد انتهى
    }


    // تلوين الأزرار
    options.forEach(btn => {
        btn.disabled = true; // منع تغيير الإجابة
        const btnText = btn.textContent.trim();
        
        if (btnText === finalCorrectAnswer) {
            btn.classList.add('bg-green-700', 'border-4', 'border-green-400');
        } else if (btnText === selected && !isCorrect) {
            btn.classList.add('bg-red-700', 'border-4', 'border-red-400');
        } else {
            btn.classList.add('bg-gray-500'); 
        }
    });

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


// 8. وظيفة المؤقت (لم يتم تغييرها)
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
            checkAnswer('Timeout', currentQuestions[currentQuestionIndex].answer); 
        }
    }, 1000);
}

// 9. وظيفة تحديث شريط التقدم (لم يتم تغييرها)
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const percentage = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressFill.style.width = `${percentage}%`;
}

// 10. وظيفة شاشة النتائج (تم تحسين حفظ الإحصائيات)
function showResultScreen() {
    progressBar.classList.add('hidden');
    quizContainer.innerHTML = '';
    
    // **تحسين حفظ الإحصائيات:** حفظ أعلى نتيجة وعدد الجولات الملعوبة.
    const username = localStorage.getItem('username');
    const storageKeyHigh = `${username}_${quizType}_highScore`;
    const storageKeyPlayed = `${username}_${quizType}_played`;

    let currentHighScore = parseInt(localStorage.getItem(storageKeyHigh)) || 0;
    let gamesPlayed = parseInt(localStorage.getItem(storageKeyPlayed)) || 0;
    let newRecord = false;
    
    // زيادة عدد الجولات
    gamesPlayed++;
    localStorage.setItem(storageKeyPlayed, gamesPlayed);

    // تحديث أعلى نتيجة
    if (score > currentHighScore) {
        currentHighScore = score;
        localStorage.setItem(storageKeyHigh, score);
        newRecord = true;
    }
    
    const message = newRecord ? 'تهانينا! لقد سجلت رقماً قياسياً جديداً! 🏆' : 'نتيجة جيدة! استمر في المحاولة لتحطيم الرقم القياسي. 💡';
    
    resultDiv.className = 'mt-8 text-2xl md:text-4xl font-bold card p-8 mx-auto max-w-4xl bg-[#1f2833] border-4 border-[#66fcf1] text-white';
    resultDiv.innerHTML = `
        <h2 class="text-4xl font-extrabold text-yellow-300 mb-4">جولة ${quizType === 'mcq' ? 'الاختيار المتعدد' : 'صح أو خطأ'} انتهت!</h2>
        <p class="text-3xl text-[#66fcf1] mb-2">نتيجتك: ${score} من ${currentQuestions.length}</p>
        <p class="text-2xl text-green-400 mb-6">${message}</p>
        <p class="text-xl text-gray-300">أعلى نتيجة لديك حتى الآن: ${currentHighScore} من ${currentQuestions.length}</p>
        <p class="text-xl text-gray-300">عدد الجولات المكتملة: ${gamesPlayed}</p>
        
        <button id="back-to-welcome-btn-final" class="main-btn mt-6 py-3 px-6 text-xl">
            العودة لشاشة اختيار التحدي 🔙
        </button>
    `;
    
    // **ربط زر العودة بعد انتهاء اللعب**
    document.getElementById('back-to-welcome-btn-final').addEventListener('click', () => {
        const user = localStorage.getItem('username');
        showWelcomeScreen(user);
        resultDiv.classList.add('hidden');
    });
}

// 11. وظيفة شاشة الملف الشخصي (تم تحسين عرض الإحصائيات)
function showProfileScreen() {
    welcomeScreen.classList.add('hidden');
    
    // قراءة البيانات من التخزين المحلي (الآن تشمل عدد الجولات الملعوبة)
    const username = localStorage.getItem('username');
    
    const mcqHighScore = localStorage.getItem(`${username}_mcq_highScore`) || 0;
    const tfHighScore = localStorage.getItem(`${username}_tf_highScore`) || 0;
    
    const mcqPlayed = localStorage.getItem(`${username}_mcq_played`) || 0;
    const tfPlayed = localStorage.getItem(`${username}_tf_played`) || 0;
    
    quizContainer.innerHTML = '';
    
    const profileCard = document.createElement('div');
    profileCard.className = 'card mt-6 p-8 bg-[#1f2833] border-4 border-yellow-500 text-white shadow-2xl';
    profileCard.innerHTML = `
        <h2 class="text-4xl font-extrabold text-[#66fcf1] mb-6">ملفك الشخصي يا ${username} 👤</h2>
        <div class="space-y-4 text-right text-xl">
            <p class="border-b border-gray-700 pb-2">🌟 **أعلى نتيجة (اختيار متعدد):** <span class="text-yellow-300 font-bold">${mcqHighScore} من ${MAX_QUESTIONS}</span></p>
            <p class="border-b border-gray-700 pb-2">🎮 **جولات مكتملة (اختيار متعدد):** <span class="text-yellow-300 font-bold">${mcqPlayed}</span></p>
            <hr class="border-gray-600"/>
            <p class="border-b border-gray-700 pb-2">🎯 **أعلى نتيجة (صح أو خطأ):** <span class="text-yellow-300 font-bold">${tfHighScore} من ${MAX_QUESTIONS}</span></p>
            <p class="border-b border-gray-700 pb-2">🎮 **جولات مكتملة (صح أو خطأ):** <span class="text-yellow-300 font-bold">${tfPlayed}</span></p>
        </div>
        
        <button id="profile-back-btn" class="alt-btn mt-8 py-3 px-6 text-xl bg-gray-600 hover:bg-gray-500">
            العودة إلى شاشة التحدي 🔙
        </button>
    `;
    quizContainer.appendChild(profileCard);
    
    // ربط زر العودة من الملف الشخصي
    document.getElementById('profile-back-btn').addEventListener('click', () => {
        const user = localStorage.getItem('username');
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
            localStorage.setItem('username', username.replace(/\s/g, '_')); 
            showWelcomeScreen(username.replace(/\s/g, '_'));
        } else {
            alert('الرجاء إدخال اسم المستخدم.');
        }
    });

    // 3. معالجات أحداث أزرار شاشة الترحيب
    welcomeScreen.addEventListener('click', (event) => {
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

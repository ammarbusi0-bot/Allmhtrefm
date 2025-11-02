// script.js - منصة إشراق النور (ملف الجافاسكريبت الموحد)
// ** تم تحديث هذا الملف لتنفيذ نظام الجولات (10 أسئلة) وحساب النتائج **

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const quranReader = document.getElementById('quran-reader');
    const quranDisplayDiv = document.getElementById('quran-display');
    const loadingStatusElement = document.getElementById('loading-status');
    const ayahSearchInput = document.getElementById('ayah-search');
    const prayerDisplay = document.getElementById('prayer-display');
    
    // الأذكار والأحاديث
    const hadithListDiv = document.getElementById('hadith-list');
    const newHadithBtn = document.getElementById('new-hadith-btn');
    const azkarDisplayDiv = document.getElementById('azkar-display'); 
    
    // اختبار
    const quizContainer = document.getElementById('quiz-container');
    const scoreDisplay = document.getElementById('score-display');
    const roundNumberDisplay = document.getElementById('round-number');
    const timerDisplay = document.getElementById('timer-display');
    const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn');
    
    // ثوابت التخزين
    const THEME_KEY = 'appTheme';
    const FONT_KEY = 'appFont';
    const FONT_SIZE_KEY = 'appFontSize';
    const BOOKMARK_KEY = 'quranBookmark';
    const SEARCH_HISTORY_KEY = 'searchHistory';
    const QUIZ_STATE_KEY = 'quizState';
    
    // ثوابت API
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    const PRAYER_API_URL = 'https://api.aladhan.com/v1/timings';
    const HADITH_API_URL = 'https://api.hadith.gading.dev/books/muslim/1-300'; 
    const TAFSIR_API_URL = 'https://quranenc.com/api/v1/get?language=ar&surah='; 
    
    const QUESTIONS_PER_ROUND = 10; // **جديد: عدد الأسئلة في الجولة**
    
    let QURAN_FULL_TEXT = null; 
    let CURRENT_SURAH = null;

    // **تحديث هيكل حالة الاختبار**
    let quizState = {
        totalScore: 0,
        round: 0,
        questionIndex: 0, // السؤال الحالي داخل الجولة (من 1 إلى 10)
        correctAnswers: 0,
        incorrectAnswers: 0,
        fiftyFiftyUsed: false,
        timer: null,
        currentQuestion: null,
        roundQuestions: [] // الأسئلة الـ 10 المختارة للجولة الحالية
    };

    // --------------------------------------
    // بيانات الاختبار (تمت زيادة الأسئلة لضمان جولة كاملة)
    // --------------------------------------
    const allQuizQuestions = [
        {
            question: "من هو أول نبي أرسله الله إلى البشرية؟",
            options: ["إبراهيم عليه السلام", "آدم عليه السلام", "نوح عليه السلام", "محمد صلى الله عليه وسلم"],
            answer: "آدم عليه السلام"
        },
        {
            question: "ما هي أطول سورة في القرآن الكريم؟",
            options: ["سورة النساء", "سورة البقرة", "سورة آل عمران", "سورة يوسف"],
            answer: "سورة البقرة"
        },
        {
            question: "كم عدد أركان الإسلام؟",
            options: ["خمسة", "أربعة", "ستة", "سبعة"],
            answer: "خمسة"
        },
        {
            question: "ما اسم الغار الذي نزل فيه الوحي على النبي محمد صلى الله عليه وسلم لأول مرة؟",
            options: ["غار ثور", "غار حراء", "غار أحد", "غار الميزان"],
            answer: "غار حراء"
        },
        {
            question: "في أي شهر هجري يصوم المسلمون؟",
            options: ["شوال", "شعبان", "رمضان", "ذي الحجة"],
            answer: "رمضان"
        },
        {
            question: "ما هو عدد السور المدنية في القرآن الكريم؟",
            options: ["28 سورة", "40 سورة", "56 سورة", "86 سورة"],
            answer: "28 سورة" 
        },
        {
            question: "من هو الصحابي الملقب بذي النورين؟",
            options: ["علي بن أبي طالب", "عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق"],
            answer: "عثمان بن عفان"
        },
        {
            question: "في أي غزوة سميت بـ 'يوم الفرقان'؟",
            options: ["غزوة أحد", "غزوة تبوك", "غزوة الخندق", "غزوة بدر"],
            answer: "غزوة بدر"
        },
        {
            question: "ما هي الصلاة التي ليس لها أذان ولا إقامة؟",
            options: ["صلاة الجمعة", "صلاة الجنازة", "صلاة الوتر", "صلاة العيدين"],
            answer: "صلاة الجنازة"
        },
        {
            question: "كم يوماً دام طوفان نوح عليه السلام حسب بعض التفاسير؟",
            options: ["40 يوماً", "150 يوماً", "سنة كاملة", "6 أشهر"],
            answer: "150 يوماً" // يختلف التفسير، لكن 150 يوم هو الأكثر شيوعًا في سياق الألغاز
        },
        // سؤال إضافي لضمان وجود أكثر من 10 أسئلة
        {
            question: "ما هو الركن الخامس من أركان الإسلام؟",
            options: ["الصلاة", "الزكاة", "الحج لمن استطاع إليه سبيلا", "صيام رمضان"],
            answer: "الحج لمن استطاع إليه سبيلا"
        },
        {
            question: "كم عدد الأنبياء والرسل الذين ذكروا في القرآن الكريم؟",
            options: ["20", "25", "30", "35"],
            answer: "25"
        }
    ];

    // --------------------------------------
    // 2. ميزة: تبديل الوضع الليلي 🌙
    // --------------------------------------
    const loadTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light-mode';
        body.className = savedTheme;
        if (themeToggleBtn) {
            themeToggleBtn.textContent = savedTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        }
    };
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
            body.className = newTheme;
            localStorage.setItem(THEME_KEY, newTheme);
            loadTheme();
        });
    }

    // --------------------------------------
    // 3. ميزة: التحكم بالخط والحجم ✒️
    // --------------------------------------
    const applyFont = (fontName) => {
        if (!quranReader) return;
        quranReader.className = quranReader.className.split(' ').filter(c => !c.startsWith('font-')).join(' ');
        if (fontName) {
             quranReader.classList.add(`font-${fontName.replace(/\s/g, '\\ ')}`); 
             localStorage.setItem(FONT_KEY, fontName);
        }
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-font') === fontName) {
                btn.classList.add('active');
            }
        });
    };

    const applyFontSize = (size) => {
        if (!quranReader) return;
        // ... (منطق حجم الخط كما هو)
        let currentSize = localStorage.getItem(FONT_SIZE_KEY) || 100;
        currentSize = parseInt(currentSize);

        if (size === 'increase') {
            currentSize = Math.min(currentSize + 10, 160); // الحد الأقصى 160%
        } else if (size === 'decrease') {
            currentSize = Math.max(currentSize - 10, 80); // الحد الأدنى 80%
        }
        
        quranReader.style.fontSize = `${currentSize}%`;
        localStorage.setItem(FONT_SIZE_KEY, currentSize);

        const currentSizeSpan = document.getElementById('current-font-size');
        if (currentSizeSpan) {
            currentSizeSpan.textContent = `${currentSize}%`;
        }
    };

    const initFontSelector = () => {
        const fontSelectorDiv = document.getElementById('font-selector');
        const sizeSelectorDiv = document.getElementById('size-selector');

        if (fontSelectorDiv) {
            const initialFont = localStorage.getItem(FONT_KEY) || 'Amiri';
            applyFont(initialFont); 
            fontSelectorDiv.querySelectorAll('.font-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    applyFont(btn.getAttribute('data-font'));
                });
            });
        }
        
        if (sizeSelectorDiv) {
            applyFontSize(null); 
            sizeSelectorDiv.querySelectorAll('.size-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    applyFontSize(btn.getAttribute('data-size'));
                });
            });
        }
    };
    
    // ... (بقية منطق مواقيت الصلاة والقرآن كما هو)

    // --------------------------------------
    // 8. منطق لعبة الاختبار (تم تعديله) 🏆
    // --------------------------------------

    const saveQuizState = () => {
        localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(quizState));
    };

    const loadQuizState = () => {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState) {
            Object.assign(quizState, JSON.parse(savedState));
        }
        updateQuizDisplay();
    };

    const updateQuizDisplay = () => {
        if (!scoreDisplay || !roundNumberDisplay || !fiftyFiftyBtn) return;
        scoreDisplay.textContent = `النقاط: ${quizState.totalScore}`;
        roundNumberDisplay.textContent = quizState.round + 1; // عرض رقم الجولة القادمة
        fiftyFiftyBtn.disabled = quizState.fiftyFiftyUsed;
        fiftyFiftyBtn.style.opacity = quizState.fiftyFiftyUsed ? '0.5' : '1';
    };

    const startNewRound = () => {
        // إعادة تعيين متغيرات الجولة
        quizState.round++;
        quizState.questionIndex = 0;
        quizState.correctAnswers = 0;
        quizState.incorrectAnswers = 0;
        
        // خلط الأسئلة واختيار 10
        let shuffledQuestions = [...allQuizQuestions].sort(() => 0.5 - Math.random());
        quizState.roundQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_ROUND);
        
        // التحقق لضمان وجود 10 أسئلة
        if (quizState.roundQuestions.length < QUESTIONS_PER_ROUND) {
             quizContainer.innerHTML = '<p style="color: red;">⚠️ لا تتوفر أسئلة كافية لبدء جولة الـ 10 أسئلة.</p>';
             return;
        }

        saveQuizState();
        updateQuizDisplay();
        nextQuestion();
    };

    const endRoundAndShowSummary = () => {
        if (window.quizTimer) clearInterval(window.quizTimer);

        quizContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; border: 2px solid var(--accent-color); border-radius: 10px; background-color: rgba(255, 215, 0, 0.1);">
                <h3 style="color: var(--accent-color-light);">✅ انتهت الجولة رقم ${quizState.round}</h3>
                <p style="font-size: 1.2rem; margin: 15px 0;">النتيجة الإجمالية: <strong style="color: #28a745;">${quizState.totalScore} نقطة</strong></p>
                
                <p>الإجابات الصحيحة: <strong style="color: #28a745; font-size: 1.1rem;">${quizState.correctAnswers}</strong> أسئلة</p>
                <p>الإجابات الخاطئة: <strong style="color: #dc3545; font-size: 1.1rem;">${quizState.incorrectAnswers}</strong> أسئلة</p>
                
                <button id="start-new-round-btn" class="main-action-btn" style="margin-top: 20px;">بدء جولة جديدة</button>
            </div>
        `;
        document.getElementById('start-new-round-btn').addEventListener('click', startNewRound);
    };


    const nextQuestion = () => {
        if (!quizContainer) return;
        
        // **التحقق من نهاية الجولة**
        if (quizState.questionIndex >= QUESTIONS_PER_ROUND) {
            endRoundAndShowSummary();
            return;
        }
        
        quizState.questionIndex++;
        const question = quizState.roundQuestions[quizState.questionIndex - 1]; // جلب السؤال الحالي
        quizState.currentQuestion = question;
        saveQuizState();
        updateQuizDisplay();
        
        // عرض السؤال
        quizContainer.innerHTML = `
            <h3 style="color: var(--accent-color-light); margin-bottom: 20px;">
                السؤال رقم ${quizState.questionIndex} من ${QUESTIONS_PER_ROUND}: ${question.question}
            </h3>
            <div id="options-container" style="display: flex; flex-direction: column; gap: 15px;">
                ${question.options.map((option) => 
                    `<button class="main-action-btn quiz-option" data-answer="${option}" style="background-color: var(--card-bg-color); color: var(--text-color); border: 2px solid var(--accent-color); box-shadow: none;">${option}</button>`
                ).join('')}
            </div>
            <p id="feedback-message" style="margin-top: 20px; font-weight: bold;"></p>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', handleAnswer);
        });
        
        startTimer(20);
    };
    
    const startTimer = (duration) => {
        // ... (منطق المؤقت كما هو)
        let time = duration;
        if (window.quizTimer) clearInterval(window.quizTimer);
        
        timerDisplay.textContent = `الوقت: ${time} ثانية`;

        window.quizTimer = setInterval(() => {
            time--;
            timerDisplay.textContent = `الوقت: ${time} ثانية`;

            if (time <= 0) {
                clearInterval(window.quizTimer);
                // معاملة انتهاء الوقت كإجابة خاطئة
                quizState.incorrectAnswers++;
                showFeedback('انتهى الوقت! الإجابة الصحيحة هي: ' + quizState.currentQuestion.answer, '#dc3545');
                saveQuizState();
                setTimeout(nextQuestion, 3000); 
            }
        }, 1000);
    };

    const handleAnswer = (event) => {
        clearInterval(window.quizTimer);
        const selectedAnswer = event.target.getAttribute('data-answer');
        const isCorrect = selectedAnswer === quizState.currentQuestion.answer;
        
        // تعطيل الأزرار بعد الإجابة
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            if (btn.getAttribute('data-answer') === quizState.currentQuestion.answer) {
                btn.style.backgroundColor = '#28a745'; 
                btn.style.color = 'white';
            } else if (btn.getAttribute('data-answer') === selectedAnswer) {
                btn.style.backgroundColor = '#dc3545'; 
                btn.style.color = 'white';
            }
        });

        if (isCorrect) {
            quizState.totalScore += 10;
            quizState.correctAnswers++; // زيادة عداد الصحيح للجولة
            showFeedback('إجابة صحيحة! +10 نقاط.', '#28a745');
        } else {
            quizState.incorrectAnswers++; // زيادة عداد الخاطئ للجولة
            showFeedback('إجابة خاطئة! الإجابة الصحيحة هي: ' + quizState.currentQuestion.answer, '#dc3545');
        }
        
        saveQuizState();
        updateQuizDisplay();
        
        setTimeout(nextQuestion, 3000); // الانتقال للسؤال التالي (أو إنهاء الجولة)
    };

    const useFiftyFifty = () => {
        if (quizState.fiftyFiftyUsed || !quizState.currentQuestion) return;
        // ... (منطق 50/50 كما هو)
        quizState.fiftyFiftyUsed = true;
        saveQuizState();
        updateQuizDisplay();

        const correct = quizState.currentQuestion.answer;
        const incorrectOptions = quizState.currentQuestion.options.filter(opt => opt !== correct);
        
        const incorrectToKeep = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
        
        document.querySelectorAll('.quiz-option').forEach(btn => {
            const answer = btn.getAttribute('data-answer');
            if (answer !== correct && answer !== incorrectToKeep) {
                btn.disabled = true;
                btn.style.opacity = '0.3';
            }
        });
    };

    const showFeedback = (message, color) => {
        const feedback = document.getElementById('feedback-message');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.color = color;
        }
    };

    const initQuizPage = () => {
        loadQuizState();
        if (quizContainer) {
            if (quizState.questionIndex > 0 && quizState.questionIndex < QUESTIONS_PER_ROUND) {
                // استئناف الجولة إذا كانت لم تنتهِ
                nextQuestion(); 
            } else {
                // بدء جولة جديدة أو عرض ملخص
                startNewRound();
            }
        }
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.addEventListener('click', useFiftyFifty);
        }
    };


    // --------------------------------------
    // 9. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    // ... (بقية منطق التهيئة كما هو)
    
    // **تهيئة الصفحات**
    if (document.getElementById('prayer-times')) { 
        // index.html
        loadQuranData();
        getLocationAndPrayers(); 
        initFontSelector(); 
        updateBookmarkStatus(); 
    } else if (document.getElementById('hadith-viewer')) {
        // hadith.html
        initHadithPage();
    } else if (document.getElementById('quiz-game')) {
        // quiz.html
        initQuizPage();
        updateSearchHistoryDisplay(); 
    }
});

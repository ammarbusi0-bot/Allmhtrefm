// script.js - الكود النهائي لربط المصحف ومنطق الاختبار
// ⚠️ يعتمد هذا الملف الآن على ملف questions.js

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'appTheme';
    
    // عناصر صفحة المصحف (index.html)
    const quranDisplayDiv = document.getElementById('quran-display');
    const loadingStatusElement = document.getElementById('loading-status');
    const prayerDisplay = document.getElementById('prayer-display');
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    let QURAN_FULL_TEXT = null; 
    
    // عناصر صفحة الاختبار (quiz.html)
    const quizContainer = document.getElementById('quiz-container');
    const scoreDisplay = document.getElementById('score-display');
    const roundNumberDisplay = document.getElementById('round-number');
    const timerDisplay = document.getElementById('timer-display');
    const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn'); 

    // متغيرات ميزات الاختبار
    const QUESTION_TIME = 20; // 20 ثانية لكل سؤال
    let countdown;
    let helpUsedInRound = false; 

    // متغيرات حالة الاختبار
    let questionsPool = []; 
    let questionsForRound = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let roundNumber = 1;


    // --------------------------------------
    // 2. ميزة: تبديل الوضع الليلي (يعمل في كل الصفحات)
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
    // 3. ميزة: جلب بيانات القرآن (خاص بـ index.html)
    // --------------------------------------
    // ... (منطق تحميل وعرض القرآن كما هو) ...
    const loadQuranData = async () => {
        if (!quranDisplayDiv) return; 
        try {
            loadingStatusElement.textContent = '⚠️ جاري تحميل المصحف الشريف من الإنترنت...';
            const response = await fetch(QURAN_API_URL);
            if (!response.ok) {
                 throw new Error('فشل جلب ملف القرآن من المصدر الخارجي.');
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length === 114) {
                 QURAN_FULL_TEXT = data; 
                 loadingStatusElement.textContent = '✅ تم تحميل المصحف الشريف كاملاً (114 سورة).';
                 displaySurahIndex(); 
            } else {
                 throw new Error('هيكل البيانات المستلمة غير صحيح.');
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات القرآن:', error);
            quranDisplayDiv.innerHTML = `<p style="color: red;">عفواً، فشل تحميل بيانات القرآن: ${error.message}</p>`;
            loadingStatusElement.textContent = '❌ فشل التحميل. يرجى التأكد من اتصالك بالإنترنت.';
        }
    };

    const displaySurahIndex = () => {
        if (!QURAN_FULL_TEXT) return;
        quranDisplayDiv.innerHTML = '';
        loadingStatusElement.textContent = 'اختر سورة للتصفح:';
        QURAN_FULL_TEXT.forEach(surah => {
            const button = document.createElement('button');
            button.className = 'surah-name-button';
            const surahName = surah.name_ar || surah.name || 'سورة غير معروفة';
            button.textContent = `${surahName} (السورة رقم ${surah.id})`;
            button.addEventListener('click', () => { displaySurah(surah); });
            quranDisplayDiv.appendChild(button);
        });
    };

    const displaySurah = (surah) => {
        const surahName = surah.name_ar || surah.name || 'سورة غير معروفة';
        const versesArray = surah.verses || surah.array || []; 
        quranDisplayDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--accent-color);">سورة ${surahName}</h2>
            <button id="back-to-index">العودة لقائمة السور</button>
            <div id="surah-content" style="font-family: 'Amiri', serif; font-size: 1.5rem;">
                ${versesArray.map((ayah, index) => {
                    const ayahText = ayah.text || ayah.ar || ayah; 
                    return `<span class="ayah-line">${ayahText} <sup class="ayah-number">﴿${index + 1}﴾</sup></span>`;
                }).join('')}
            </div>
        `;
        loadingStatusElement.textContent = `جاري تصفح سورة ${surahName}.`;
        document.getElementById('back-to-index').addEventListener('click', displaySurahIndex);
    };
    // ... (بقية منطق مواقيت الصلاة كما هو) ...

    // --------------------------------------
    // 5. ميزة: منطق لعبة الأسئلة الدينية (Quiz) (خاص بـ quiz.html)
    // --------------------------------------

    // دالة خلط المصفوفة
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    if (quizContainer) {
        // تأكد من أن مصفوفة الأسئلة (المحمّلة من questions.js) متاحة
        if (typeof QUIZ_QUESTIONS === 'undefined' || QUIZ_QUESTIONS.length === 0) {
             quizContainer.innerHTML = '<p style="color: red; text-align: center;">خطأ: ملف الأسئلة (questions.js) لم يتم تحميله أو فارغ. تأكد من إضافته قبل هذا الملف في quiz.html.</p>';
        } else {
            questionsPool = [...QUIZ_QUESTIONS];
            shuffleArray(questionsPool);
            startQuiz();
        }
    }

    const startQuiz = () => {
        // إذا كان هناك أقل من 10 أسئلة متبقية، نعيد تعبئة المجموعة ونخلطها
        if (questionsPool.length < 10) {
            questionsPool = [...QUIZ_QUESTIONS];
            shuffleArray(questionsPool);
        }
        
        questionsForRound = questionsPool.splice(0, 10); 
        currentQuestionIndex = 0;
        score = 0;
        
        // إعادة ضبط حالة المساعدة عند بدء جولة جديدة
        helpUsedInRound = false; 
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.disabled = false;
            fiftyFiftyBtn.style.opacity = '1';
        }
        
        roundNumberDisplay.textContent = roundNumber;
        scoreDisplay.textContent = score;
        displayQuestion();
    };

    const startTimer = () => {
        let timeLeft = QUESTION_TIME;
        if (timerDisplay) timerDisplay.textContent = timeLeft;

        countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                handleTimeout();
            }
        }, 1000);
    };
    
    const handleTimeout = () => {
        clearInterval(countdown);
        
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            const qData = questionsForRound[currentQuestionIndex];
            if (parseInt(btn.getAttribute('data-original-index')) === qData.correctIndex) {
                btn.style.backgroundColor = '#28a745'; 
                btn.style.color = 'white';
            }
        });

        quizContainer.insertAdjacentHTML('beforeend', '<p style="color: red; text-align: center; margin-top: 15px;">انتهى الوقت! السؤال لم يحتسب.</p>');

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    };

    const displayQuestion = () => {
        if (currentQuestionIndex >= questionsForRound.length) {
            endRound();
            return;
        }
        
        clearInterval(countdown);
        startTimer();

        const qData = questionsForRound[currentQuestionIndex];
        
        const optionsWithIndices = qData.options.map((text, index) => ({ text, index }));
        shuffleArray(optionsWithIndices);

        let optionsHTML = '';
        optionsWithIndices.forEach(opt => {
            optionsHTML += `<button class="answer-btn" data-original-index="${opt.index}">${opt.text}</button>`;
        });

        // إزالة الرقم التسلسلي للسؤال من النص المخزن ثم إضافة الرقم التسلسلي للجولة
        const questionText = qData.question.split('.').slice(1).join('.');

        quizContainer.innerHTML = `
            <div class="question-box" id="current-question-box">
                <p>${(currentQuestionIndex + 1)}. ${questionText.trim()}</p>
                ${optionsHTML}
            </div>
        `;

        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });

        if (fiftyFiftyBtn && !helpUsedInRound) {
            fiftyFiftyBtn.onclick = useFiftyFifty;
        }
    };

    const useFiftyFifty = () => {
        if (helpUsedInRound) return;

        const qData = questionsForRound[currentQuestionIndex];
        const correctIndex = qData.correctIndex;
        let incorrectButtons = [];

        document.querySelectorAll('.answer-btn').forEach(button => {
            if (parseInt(button.getAttribute('data-original-index')) !== correctIndex) {
                incorrectButtons.push(button);
            }
        });

        shuffleArray(incorrectButtons);
        
        for (let i = 0; i < 2 && i < incorrectButtons.length; i++) {
            incorrectButtons[i].disabled = true;
            incorrectButtons[i].style.opacity = '0.3'; 
            incorrectButtons[i].style.textDecoration = 'line-through';
        }

        helpUsedInRound = true;
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.disabled = true;
            fiftyFiftyBtn.style.opacity = '0.5';
        }
    };

    const handleAnswer = (event) => {
        clearInterval(countdown); 
        
        const selectedButton = event.target;
        const originalIndex = parseInt(selectedButton.getAttribute('data-original-index'));
        const qData = questionsForRound[currentQuestionIndex];
        
        document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
        
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (parseInt(btn.getAttribute('data-original-index')) === qData.correctIndex) {
                btn.style.backgroundColor = '#28a745'; 
                btn.style.color = 'white';
            }
        });

        if (originalIndex === qData.correctIndex) {
            score++;
        } else {
            selectedButton.style.backgroundColor = '#dc3545'; 
            selectedButton.style.color = 'white';
        }
        
        scoreDisplay.textContent = score;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    };

    const endRound = () => {
        roundNumber++;
        clearInterval(countdown); 
        if (timerDisplay) timerDisplay.textContent = QUESTION_TIME; 

        quizContainer.innerHTML = `
            <div style="text-align: center;">
                <h2>🎉 انتهت الجولة ${roundNumber - 1}</h2>
                <p>لقد أحرزت **${score}** من **10** نقاط.</p>
                <p style="font-weight: bold; color: var(--accent-color);">${score >= 7 ? 'نتائج ممتازة! استمر.' : 'يمكنك تحقيق نتيجة أفضل في الجولة القادمة.'}</p>
                <button id="next-round-btn" style="
                    background-color: var(--accent-color); color: white; border: none; 
                    padding: 10px 20px; border-radius: 25px; cursor: pointer; margin-top: 15px; font-weight: bold;
                ">ابدأ الجولة التالية (${roundNumber})</button>
            </div>
        `;
        document.getElementById('next-round-btn').addEventListener('click', startQuiz);
    };


    // --------------------------------------
    // 6. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    if (quranDisplayDiv) { 
        // ⚠️ لا أرسل لك ملف index.html، ولكنه سيعمل إذا كان موجوداً
        // loadQuranData(); 
    }
    // ... (بقية منطق مواقيت الصلاة كما هو) ...
});

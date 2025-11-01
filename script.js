// script.js - الكود النهائي لربط المصحف مباشرة من المصدر الخارجي (API) ومنطق الاختبار

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
    const loadQuranData = async () => {
        if (!quranDisplayDiv) return; // تأكد أنه في الصفحة الصحيحة
        try {
            loadingStatusElement.textContent = '⚠️ جاري تحميل المصحف الشريف من الإنترنت...';
            const response = await fetch(QURAN_API_URL);
            
            if (!response.ok) {
                 throw new Error('فشل جلب ملف القرآن من المصدر الخارجي. تحقق من اتصالك.');
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
            
            button.addEventListener('click', () => {
                displaySurah(surah);
            });
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

    // --------------------------------------
    // 4. ميزة: مواقيت الصلاة (خاص بـ index.html)
    // --------------------------------------
    const getPrayerTimes = (latitude, longitude) => {
        if (!prayerDisplay) return;

        const date = new Date();
        const API_URL = `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`;

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.timings) {
                    const timings = data.data.timings;
                    prayerDisplay.innerHTML = `
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><th style="color: var(--accent-color);">صلاة الفجر</th><td>${timings.Fajr}</td></tr>
                            <tr><th style="color: var(--accent-color);">صلاة الظهر</th><td>${timings.Dhuhr}</td></tr>
                            <tr><th style="color: var(--accent-color);">صلاة العصر</th><td>${timings.Asr}</td></tr>
                            <tr><th style="color: var(--accent-color);">صلاة المغرب</th><td>${timings.Maghrib}</td></tr>
                            <tr><th style="color: var(--accent-color);">صلاة العشاء</th><td>${timings.Isha}</td></tr>
                        </table>
                    `;
                } else {
                    prayerDisplay.innerHTML = `<p>عذراً، لم نتمكن من جلب المواقيت.</p>`;
                }
            })
            .catch(() => {
                prayerDisplay.innerHTML = `<p>خطأ في الاتصال بالإنترنت أو API.</p>`;
            });
    };
    
    if (prayerDisplay) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => { getPrayerTimes(position.coords.latitude, position.coords.longitude); },
                () => { prayerDisplay.innerHTML = `<p>يرجى السماح بالوصول لموقعك الجغرافي.</p>`; }
            );
        } else {
            prayerDisplay.innerHTML = `<p>متصفحك لا يدعم تحديد الموقع الجغرافي.</p>`;
        }
    }


    // --------------------------------------
    // 5. ميزة: منطق لعبة الأسئلة الدينية (Quiz) (خاص بـ quiz.html)
    // --------------------------------------

    const QUIZ_QUESTIONS = [
        { question: "1. كم عدد سور القرآن الكريم؟", options: ["113 سورة", "114 سورة", "120 سورة"], correctIndex: 1 },
        { question: "2. من هو النبي الملقب بـ 'خليل الله'؟", options: ["موسى عليه السلام", "إبراهيم عليه السلام", "عيسى عليه السلام"], correctIndex: 1 },
        { question: "3. ما هي أطول سورة في القرآن الكريم؟", options: ["سورة آل عمران", "سورة البقرة", "سورة النساء"], correctIndex: 1 },
        { question: "4. متى فُرض صيام شهر رمضان؟", options: ["السنة الثانية للهجرة", "السنة الأولى للهجرة", "السنة الثالثة للهجرة"], correctIndex: 0 },
        { question: "5. من هو أول الخلفاء الراشدين؟", options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق"], correctIndex: 2 },
        { question: "6. ما هو عدد أركان الإسلام؟", options: ["أربعة", "خمسة", "ستة"], correctIndex: 1 },
        { question: "7. ما اسم ناقة الرسول صلى الله عليه وسلم؟", options: ["القصواء", "العضباء", "الجدعاء"], correctIndex: 0 },
        { question: "8. في أي عام هجري كانت غزوة بدر الكبرى؟", options: ["الثانية", "الثالثة", "الخامسة"], correctIndex: 0 },
        { question: "9. من هو الصحابي الذي اهتز لموته عرش الرحمن؟", options: ["عمر بن الخطاب", "سعد بن معاذ", "بلال بن رباح"], correctIndex: 1 },
        { question: "10. ما معنى كلمة 'الفرقان'؟", options: ["النور", "الهدى", "الفاصل بين الحق والباطل"], correctIndex: 2 },
        { question: "11. كم عدد الصلوات المفروضة في اليوم؟", options: ["أربعة", "خمسة", "ستة"], correctIndex: 1 },
        { question: "12. كم يوم يبقى الدجال في الأرض؟", options: ["أربعون يوماً", "سبعون يوماً", "عام كامل"], correctIndex: 0 },
        { question: "13. من هي أم المؤمنين التي تزوجها الرسول وهي بكر؟", options: ["عائشة بنت أبي بكر", "خديجة بنت خويلد", "حفصة بنت عمر"], correctIndex: 0 },
        { question: "14. ما هو أول ما يحاسب عليه العبد يوم القيامة؟", options: ["الزكاة", "الصلاة", "الصيام"], correctIndex: 1 },
        { question: "15. في أي شهر يؤدي المسلمون فريضة الحج؟", options: ["شوال", "ذو القعدة", "ذو الحجة"], correctIndex: 2 },
        { question: "16. ما اسم الملك الموكل بالنفخ في الصور؟", options: ["جبريل", "ميكائيل", "إسرافيل"], correctIndex: 2 },
        { question: "17. من الذي أشار على الرسول بحفر الخندق؟", options: ["أبو بكر الصديق", "سلمان الفارسي", "حمزة بن عبد المطلب"], correctIndex: 1 },
        { question: "18. أين تقع الكعبة المشرفة؟", options: ["المدينة المنورة", "القدس", "مكة المكرمة"], correctIndex: 2 },
        { question: "19. كم سنة استمر نزول القرآن الكريم؟", options: ["حوالي 23 سنة", "حوالي 10 سنوات", "حوالي 30 سنة"], correctIndex: 0 },
        { question: "20. ما هي السورة التي لا تبدأ بالبسملة؟", options: ["سورة الفاتحة", "سورة التوبة", "سورة النمل"], correctIndex: 1 },
        // ... يرجى إضافة 30 سؤالاً إضافياً لتغطية حد الـ 50 سؤالاً ...
    ];

    let questionsPool = []; 
    let questionsForRound = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let roundNumber = 1;

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    if (quizContainer) {
        // إعداد مجموعة الأسئلة عند تحميل الصفحة لأول مرة
        questionsPool = [...QUIZ_QUESTIONS];
        shuffleArray(questionsPool);
        startQuiz();
    }

    const startQuiz = () => {
        // إذا كان هناك أقل من 10 أسئلة متبقية، نعيد تعبئة المجموعة ونخلطها لضمان عدم التكرار حتى بعد استنفاذها
        if (questionsPool.length < 10) {
            questionsPool = [...QUIZ_QUESTIONS];
            shuffleArray(questionsPool);
            roundNumber = 1; // إعادة تعيين رقم الجولة عند تكرار الأسئلة
        }
        
        questionsForRound = questionsPool.splice(0, 10); 
        currentQuestionIndex = 0;
        score = 0;
        
        roundNumberDisplay.textContent = roundNumber;
        scoreDisplay.textContent = score;
        displayQuestion();
    };

    const displayQuestion = () => {
        if (currentQuestionIndex >= questionsForRound.length) {
            endRound();
            return;
        }

        const qData = questionsForRound[currentQuestionIndex];
        
        // خلط خيارات الإجابات وعرضها (لضمان تغيير ترتيب الإجابة الصحيحة)
        const optionsWithIndices = qData.options.map((text, index) => ({ text, index }));
        shuffleArray(optionsWithIndices);

        let optionsHTML = '';
        optionsWithIndices.forEach(opt => {
            optionsHTML += `<button class="answer-btn" data-original-index="${opt.index}">${opt.text}</button>`;
        });

        quizContainer.innerHTML = `
            <div class="question-box" id="current-question-box">
                <p>${(currentQuestionIndex + 1)}. ${qData.question.split('.').slice(1).join('.')}</p>
                ${optionsHTML}
            </div>
        `;

        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });
    };

    const handleAnswer = (event) => {
        const selectedButton = event.target;
        const originalIndex = parseInt(selectedButton.getAttribute('data-original-index'));
        const qData = questionsForRound[currentQuestionIndex];
        
        // تعطيل جميع الأزرار ومنع النقر مرة أخرى
        document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
        
        // 1. تحديد الإجابة الصحيحة وتلوينها بالأخضر
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (parseInt(btn.getAttribute('data-original-index')) === qData.correctIndex) {
                btn.style.backgroundColor = '#28a745'; // أخضر
                btn.style.color = 'white';
            }
        });

        // 2. تحديث النتيجة وتلوين الإجابة الخاطئة بالأحمر
        if (originalIndex === qData.correctIndex) {
            score++;
        } else {
            selectedButton.style.backgroundColor = '#dc3545'; // أحمر
            selectedButton.style.color = 'white';
        }
        
        scoreDisplay.textContent = score;

        // الانتقال للسؤال التالي بعد ثانية ونصف
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    };

    const endRound = () => {
        roundNumber++;
        quizContainer.innerHTML = `
            <div style="text-align: center;">
                <h2>🎉 انتهت الجولة ${roundNumber - 1}</h2>
                <p>لقد أحرزت **${score}** من **10** نقاط.</p>
                <p style="font-weight: bold; color: var(--accent-color);">${score >= 7 ? 'نتائج ممتازة! استمر.' : 'يمكنك تحقيق نتيجة أفضل في الجولة القادمة.'}</p>
                <button id="next-round-btn" style="
                    background-color: var(--accent-color); color: white; border: none; 
                    padding: 10px 20px; border-radius: 25px; cursor: pointer; margin-top: 15px; font-weight: bold;
                ">ابدأ الجولة التالية (${roundNumber - 1})</button>
            </div>
        `;
        document.getElementById('next-round-btn').addEventListener('click', startQuiz);
    };


    // --------------------------------------
    // 6. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    if (quranDisplayDiv) { 
        loadQuranData(); 
    }
});

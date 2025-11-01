// script.js - الكود الرئيسي الموحد لجميع الصفحات

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
    const ayahSearchInput = document.getElementById('ayah-search');
    const prayerDisplay = document.getElementById('prayer-display');
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    const PRAYER_API_URL = 'https://api.aladhan.com/v1/timings';
    let QURAN_FULL_TEXT = null; 
    let CURRENT_SURAH = null; // لتتبع السورة المعروضة حالياً

    // عناصر صفحة الأحاديث (hadith.html)
    const hadithListDiv = document.getElementById('hadith-list');
    const hadithSearchInput = document.getElementById('hadith-search');
    
    // عناصر صفحة الاختبار (quiz.html)
    const quizContainer = document.getElementById('quiz-container');
    const scoreDisplay = document.getElementById('score-display');
    const roundNumberDisplay = document.getElementById('round-number');
    const timerDisplay = document.getElementById('timer-display');
    const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn'); 

    // متغيرات حالة الاختبار
    const QUESTION_TIME = 20; 
    let countdown;
    let helpUsedInRound = false; 
    let questionsPool = []; 
    let questionsForRound = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let roundNumber = 1;

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
    // 3. ميزة: مواقيت الصلاة (Geolocation) 📍
    // --------------------------------------
    const fetchPrayerTimes = async (latitude, longitude) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const method = 2; // طريقة حساب معتمدة (مثل ISNA)

        try {
            const response = await fetch(`${PRAYER_API_URL}/${today.getDate()}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
            const data = await response.json();

            if (data.code !== 200 || !data.data || !data.data.timings) {
                prayerDisplay.innerHTML = `<p style="color: red;">عفواً، فشل جلب المواقيت. رمز الخطأ: ${data.code}</p>`;
                return;
            }

            const timings = data.data.timings;
            const formattedTimings = `
                <style>
                    .prayer-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .prayer-table td { padding: 8px 10px; border-bottom: 1px solid var(--accent-color-light); }
                    .prayer-table tr:hover { background-color: var(--accent-color-light); color: var(--card-bg-color); }
                    .prayer-name { font-weight: bold; color: var(--accent-color); }
                </style>
                <table class="prayer-table">
                    <tr><td class="prayer-name">الفجر</td><td>${timings.Fajr}</td></tr>
                    <tr><td class="prayer-name">الشروق</td><td>${timings.Sunrise}</td></tr>
                    <tr><td class="prayer-name">الظهر</td><td>${timings.Dhuhr}</td></tr>
                    <tr><td class="prayer-name">العصر</td><td>${timings.Asr}</td></tr>
                    <tr><td class="prayer-name">المغرب</td><td>${timings.Maghrib}</td></tr>
                    <tr><td class="prayer-name">العشاء</td><td>${timings.Isha}</td></tr>
                </table>
                <p style="font-size: 0.8rem; margin-top: 10px;">الموقع: خط العرض ${latitude.toFixed(2)}، خط الطول ${longitude.toFixed(2)}</p>
            `;
            prayerDisplay.innerHTML = formattedTimings;

        } catch (error) {
            prayerDisplay.innerHTML = `<p style="color: red;">خطأ في الاتصال بخدمة المواقيت.</p>`;
        }
    };

    const getLocationAndPrayers = () => {
        if (!prayerDisplay) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    // رسالة خطأ عند رفض الإذن
                    prayerDisplay.innerHTML = `<p style="color: #dc3545;">❌ تعذر تحديد موقعك. يرجى تفعيل إذن الموقع.</p>`;
                    console.error("Geolocation Error:", error);
                }
            );
        } else {
            prayerDisplay.innerHTML = `<p style="color: #dc3545;">⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.</p>`;
        }
    };

    // --------------------------------------
    // 4. ميزة: جلب وعرض القرآن والبحث فيه 📖
    // --------------------------------------
    const loadQuranData = async () => {
        if (!quranDisplayDiv) return; 
        
        try {
            loadingStatusElement.textContent = '⚠️ جاري تحميل المصحف الشريف من الإنترنت...';
            const response = await fetch(QURAN_API_URL);
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
            quranDisplayDiv.innerHTML = `<p style="color: red;">عفواً، فشل تحميل بيانات القرآن.</p>`;
            loadingStatusElement.textContent = '❌ فشل التحميل. يرجى التأكد من اتصالك بالإنترنت.';
        }
    };

    const displaySurahIndex = () => {
        if (!QURAN_FULL_TEXT) return;
        quranDisplayDiv.innerHTML = '';
        loadingStatusElement.textContent = 'اختر سورة للتصفح:';
        
        if (ayahSearchInput) ayahSearchInput.style.display = 'none'; // إخفاء البحث في قائمة السور

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
        CURRENT_SURAH = surah;
        const surahName = surah.name_ar || surah.name || 'سورة غير معروفة';
        loadingStatusElement.textContent = `جاري تصفح سورة ${surahName}.`;
        
        if (ayahSearchInput) {
            ayahSearchInput.style.display = 'block';
            ayahSearchInput.value = '';
        }

        renderSurahContent(surah.verses || surah.array || []);

        const backButton = document.createElement('button');
        backButton.id = 'back-to-index';
        backButton.textContent = 'العودة لقائمة السور';
        backButton.addEventListener('click', displaySurahIndex);
        quranDisplayDiv.insertAdjacentElement('afterbegin', backButton);
    };

    const renderSurahContent = (verses) => {
        const surahName = CURRENT_SURAH.name_ar || 'السورة';
        const contentHTML = verses.map((ayah, index) => {
            const ayahText = ayah.text || ayah.ar || ayah; 
            return `<span class="ayah-line">${ayahText} <sup class="ayah-number">﴿${index + 1}﴾</sup></span>`;
        }).join('');

        quranDisplayDiv.querySelector('#surah-content')?.remove();
        
        const contentDiv = document.createElement('div');
        contentDiv.id = 'surah-content';
        contentDiv.style.cssText = "font-family: 'Amiri', serif; font-size: 1.5rem;";
        contentDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--accent-color);">سورة ${surahName}</h2>
            ${contentHTML}
        `;
        quranDisplayDiv.appendChild(contentDiv);
    };

    if (ayahSearchInput) {
        ayahSearchInput.addEventListener('input', () => {
            const searchTerm = ayahSearchInput.value.trim().toLowerCase();
            if (!CURRENT_SURAH || !searchTerm) {
                renderSurahContent(CURRENT_SURAH ? (CURRENT_SURAH.verses || CURRENT_SURAH.array || []) : []);
                return;
            }

            const filteredVerses = (CURRENT_SURAH.verses || CURRENT_SURAH.array || []).filter(ayah => {
                const ayahText = (ayah.text || ayah.ar || ayah).toLowerCase();
                return ayahText.includes(searchTerm);
            });
            
            renderSurahContent(filteredVerses);

            if (filteredVerses.length === 0) {
                 quranDisplayDiv.querySelector('#surah-content').innerHTML += `<p style="color: red; text-align: center; margin-top: 15px;">لا توجد آيات مطابقة للبحث.</p>`;
            }
        });
    }

    // --------------------------------------
    // 5. ميزة: عرض الأحاديث والبحث فيها 📚
    // --------------------------------------
    const displayHadiths = (filterTerm = '') => {
        // نستخدم PROPHET_HADITHS المتغير الذي تم تعريفه في hadith-data.js
        if (!hadithListDiv || typeof PROPHET_HADITHS === 'undefined') return;

        hadithListDiv.innerHTML = ''; 
        const lowerCaseFilter = filterTerm.toLowerCase();

        const filteredHadiths = PROPHET_HADITHS.filter(hadith => 
            hadith.text.toLowerCase().includes(lowerCaseFilter)
        );

        if (filteredHadiths.length === 0) {
            hadithListDiv.innerHTML = `<p style="color: red; text-align: center;">لا توجد أحاديث مطابقة لـ: ${filterTerm}</p>`;
            return;
        }

        filteredHadiths.forEach(hadith => {
            const htmlContent = `
                <div class="hadith-container">
                    <p class="hadith-text">${hadith.text}</p>
                    <span class="hadith-source">${hadith.source}</span>
                </div>
            `;
            hadithListDiv.insertAdjacentHTML('beforeend', htmlContent);
        });
    };
    
    if (hadithSearchInput) {
        hadithSearchInput.addEventListener('input', (e) => {
            displayHadiths(e.target.value);
        });
    }


    // --------------------------------------
    // 6. ميزة: منطق لعبة الأسئلة الدينية 🧠
    // --------------------------------------

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    if (quizContainer) {
        // تم تغيير QUIZ_QUESTIONS إلى ALL_QUIZ_QUESTIONS
        if (typeof ALL_QUIZ_QUESTIONS === 'undefined' || ALL_QUIZ_QUESTIONS.length === 0) {
             quizContainer.innerHTML = '<p style="color: red; text-align: center;">خطأ: لم يتم تحميل بيانات الأسئلة بشكل صحيح. (تأكد من وجود questions.js)</p>';
        } else {
            questionsPool = [...ALL_QUIZ_QUESTIONS]; // استخدام المتغير الصحيح
            shuffleArray(questionsPool);
            startQuiz();
        }
    }

    const startQuiz = () => {
        // تم تغيير QUIZ_QUESTIONS إلى ALL_QUIZ_QUESTIONS
        if (questionsPool.length < 10) {
            questionsPool = [...ALL_QUIZ_QUESTIONS]; // استخدام المتغير الصحيح
            shuffleArray(questionsPool);
        }
        
        questionsForRound = questionsPool.splice(0, 10); 
        currentQuestionIndex = 0;
        score = 0;
        
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

        // تم تصحيح طريقة عرض السؤال لتجنب مشاكل الترقيم
        quizContainer.innerHTML = `
            <div class="question-box" id="current-question-box">
                <p>${(currentQuestionIndex + 1)}. ${qData.question}</p>
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
    // 7. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    if (quranDisplayDiv) { 
        loadQuranData();
        getLocationAndPrayers(); // محاولة جلب المواقيت
    }
    if (hadithListDiv) {
        // تأخير بسيط للتأكد من تحميل ملف hadith-data.js
        setTimeout(() => displayHadiths(), 50); 
    }
    // منطق الاختبار يبدأ تلقائيًا عبر الدالة startQuiz إذا كان quizContainer موجودًا
});

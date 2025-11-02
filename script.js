// script.js - منصة إشراق النور (ملف الجافاسكريبت الموحد والكامل)
// ** تم تحديث هذا الملف بالمنطق الكامل لعرض القرآن ومواقيت الصلاة والاختبارات **

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
    const nextPrayerNameElement = document.getElementById('next-prayer-name');
    const timeToNextElement = document.getElementById('time-to-next');
    const currentBookmarkElement = document.getElementById('current-bookmark');
    const clearBookmarkBtn = document.getElementById('clear-bookmark-btn');
    
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
    const historyListDiv = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    
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
    // API لجلب الأحاديث
    const HADITH_API_URL = 'https://api.hadith.gading.dev/books/muslim/1-300'; 
    
    const QUESTIONS_PER_ROUND = 10; 
    
    let QURAN_FULL_TEXT = null; 
    let CURRENT_SURAH = null;
    let PRAYER_TIMINGS_TODAY = null;
    let COUNTDOWN_TIMER = null;
    let NEXT_PRAYER_INDEX = -1;

    let quizState = {
        totalScore: 0,
        round: 0,
        questionIndex: 0, 
        correctAnswers: 0,
        incorrectAnswers: 0,
        fiftyFiftyUsed: false,
        timer: null,
        currentQuestion: null,
        roundQuestions: []
    };

    const PRAYER_NAMES = {
        Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء'
    };

    // بيانات الاختبار
    const allQuizQuestions = [
        { question: "من هو أول نبي أرسله الله إلى البشرية؟", options: ["إبراهيم عليه السلام", "آدم عليه السلام", "نوح عليه السلام", "محمد صلى الله عليه وسلم"], answer: "آدم عليه السلام" },
        { question: "ما هي أطول سورة في القرآن الكريم؟", options: ["سورة النساء", "سورة البقرة", "سورة آل عمران", "سورة يوسف"], answer: "سورة البقرة" },
        { question: "كم عدد أركان الإسلام؟", options: ["خمسة", "أربعة", "ستة", "سبعة"], answer: "خمسة" },
        { question: "ما اسم الغار الذي نزل فيه الوحي على النبي محمد صلى الله عليه وسلم لأول مرة؟", options: ["غار ثور", "غار حراء", "غار أحد", "غار الميزان"], answer: "غار حراء" },
        { question: "في أي شهر هجري يصوم المسلمون؟", options: ["شوال", "شعبان", "رمضان", "ذي الحجة"], answer: "رمضان" },
        { question: "ما هو عدد السور المدنية في القرآن الكريم؟", options: ["28 سورة", "40 سورة", "56 سورة", "86 سورة"], answer: "28 سورة" },
        { question: "من هو الصحابي الملقب بذي النورين؟", options: ["علي بن أبي طالب", "عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق"], answer: "عثمان بن عفان" },
        { question: "في أي غزوة سميت بـ 'يوم الفرقان'؟", options: ["غزوة أحد", "غزوة تبوك", "غزوة الخندق", "غزوة بدر"], answer: "غزوة بدر" },
        { question: "ما هي الصلاة التي ليس لها أذان ولا إقامة؟", options: ["صلاة الجمعة", "صلاة الجنازة", "صلاة الوتر", "صلاة العيدين"], answer: "صلاة الجنازة" },
        { question: "ما هو الركن الخامس من أركان الإسلام؟", options: ["الصلاة", "الزكاة", "الحج لمن استطاع إليه سبيلا", "صيام رمضان"], answer: "الحج لمن استطاع إليه سبيلا" },
        { question: "كم عدد الأنبياء والرسل الذين ذكروا في القرآن الكريم؟", options: ["20", "25", "30", "35"], answer: "25" }
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
        let currentSize = localStorage.getItem(FONT_SIZE_KEY) || 100;
        currentSize = parseInt(currentSize);

        if (size === 'increase') {
            currentSize = Math.min(currentSize + 10, 160); 
        } else if (size === 'decrease') {
            currentSize = Math.max(currentSize - 10, 80); 
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

    // --------------------------------------
    // 4. ميزة: عرض القرآن الكريم 🕋
    // --------------------------------------

    const loadQuranData = async () => {
        if (!quranDisplayDiv || !loadingStatusElement) return;

        loadingStatusElement.textContent = 'جاري تحميل المصحف الشريف...';
        
        try {
            const response = await fetch(QURAN_API_URL);
            if (!response.ok) throw new Error('فشل في جلب بيانات القرآن');
            
            QURAN_FULL_TEXT = await response.json();
            loadingStatusElement.style.display = 'none'; 
            
            renderSurahList(); 
            
            // محاولة الانتقال للآية المحفوظة
            const bookmark = localStorage.getItem(BOOKMARK_KEY);
            if (bookmark) {
                const { surahId } = JSON.parse(bookmark);
                displaySurah(surahId);
            }
            
        } catch (error) {
            console.error('Quran Data Error:', error);
            loadingStatusElement.textContent = '❌ فشل تحميل المصحف. يرجى التحقق من اتصال الإنترنت.';
            loadingStatusElement.style.color = 'red';
        }
    };

    const renderSurahList = () => {
        if (!QURAN_FULL_TEXT) return;

        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; text-align: center;">';
        
        QURAN_FULL_TEXT.forEach((surah) => {
            html += `
                <button class="main-action-btn surah-btn" data-surah-id="${surah.id}" 
                        style="background-color: var(--accent-color); color: #1c1c1c;">
                    <strong style="font-size: 1.1rem;">${surah.name}</strong> <br> 
                    <span style="font-size: 0.9rem;">(${surah.translation} - ${surah.ayahs.length} آية)</span>
                </button>
            `;
        });
        
        html += '</div>';
        quranDisplayDiv.innerHTML = html;
        document.getElementById('ayah-search').style.display = 'none';
        
        document.querySelectorAll('.surah-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const surahId = parseInt(e.currentTarget.getAttribute('data-surah-id'));
                displaySurah(surahId);
            });
        });
    };

    const displaySurah = (surahId) => {
        const surah = QURAN_FULL_TEXT.find(s => s.id === surahId);
        if (!surah) return;

        CURRENT_SURAH = surah;

        let html = `
            <div class="quran-content-wrapper" style="padding: 20px; background-color: rgba(255, 215, 0, 0.05); border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: var(--accent-color-light); text-align: center;">سورة ${surah.name} (${surah.type})</h3>
                <p style="text-align: center; color: var(--accent-color);">عدد آياتها: ${surah.ayahs.length}</p>
                <div style="margin-top: 20px; border-top: 1px solid var(--accent-color);">
        `;

        if (surah.id !== 1 && surah.id !== 9) {
            html += '<p style="font-size: 1.2rem; text-align: center; margin: 15px 0;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>';
        }

        surah.ayahs.forEach((ayah) => {
            html += `
                <p class="ayah-line" data-ayah-number="${ayah.number}" id="ayah-${ayah.number}">
                    ${ayah.text} 
                    <span class="ayah-number">﴿${ayah.number}﴾</span> 
                    <button class="ayah-options-btn save-bookmark-btn" data-surah-id="${surah.id}" data-ayah-number="${ayah.number}" title="حفظ الموضع">📍</button>
                </p>
            `;
        });

        html += '</div></div>';
        
        html += `<button id="back-to-list-btn" class="main-action-btn" style="width: 100%; margin-top: 20px;">العودة لقائمة السور</button>`;

        quranDisplayDiv.innerHTML = html;
        document.getElementById('ayah-search').style.display = 'block';

        // إضافة مستمعي الأحداث لأزرار الحفظ
        document.querySelectorAll('.save-bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sId = parseInt(e.currentTarget.getAttribute('data-surah-id'));
                const aNum = parseInt(e.currentTarget.getAttribute('data-ayah-number'));
                setBookmark(sId, aNum);
            });
        });

        // الانتقال إلى الآية المحفوظة
        const bookmark = localStorage.getItem(BOOKMARK_KEY);
        if (bookmark) {
            const { surahId: bSurahId, ayahNumber: bAyahNum } = JSON.parse(bookmark);
            if (bSurahId === surah.id) {
                const targetAyah = document.getElementById(`ayah-${bAyahNum}`);
                if (targetAyah) {
                    targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetAyah.style.backgroundColor = 'rgba(255, 215, 0, 0.3)'; 
                    setTimeout(() => {
                        targetAyah.style.backgroundColor = 'transparent'; 
                    }, 5000);
                }
            }
        }
        
        document.getElementById('back-to-list-btn').addEventListener('click', () => {
            renderSurahList();
        });

        if (ayahSearchInput) {
             ayahSearchInput.removeEventListener('input', searchAyahInSurah);
             ayahSearchInput.value = '';
             ayahSearchInput.addEventListener('input', searchAyahInSurah);
        }
    };
    
    // --------------------------------------
    // 5. ميزة: حفظ موضع القراءة والبحث
    // --------------------------------------

    const setBookmark = (surahId, ayahNumber) => {
        const surah = QURAN_FULL_TEXT.find(s => s.id === surahId);
        if (!surah) return;

        const bookmarkData = {
            surahId: surahId,
            surahName: surah.name,
            ayahNumber: ayahNumber,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarkData));
        updateBookmarkStatus();
        alert(`تم حفظ موضع القراءة في سورة ${surah.name}، الآية ${ayahNumber}.`);
    };

    const updateBookmarkStatus = () => {
        if (!currentBookmarkElement) return;
        const bookmark = localStorage.getItem(BOOKMARK_KEY);
        
        if (bookmark) {
            const { surahName, ayahNumber, timestamp } = JSON.parse(bookmark);
            const date = new Date(timestamp).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
            currentBookmarkElement.innerHTML = `
                آخر قراءة: <strong style="color: var(--accent-color-light);">سورة ${surahName}، الآية ${ayahNumber}</strong> (بتاريخ ${date}).
                <button id="go-to-bookmark-btn" class="secondary-action-btn" style="margin-right: 10px;">انتقال</button>
            `;
            document.getElementById('go-to-bookmark-btn').addEventListener('click', () => {
                const { surahId } = JSON.parse(bookmark);
                displaySurah(surahId);
            });
            if(clearBookmarkBtn) clearBookmarkBtn.style.display = 'inline-block';
        } else {
            currentBookmarkElement.textContent = 'لا يوجد موضع محفوظ حالياً.';
             if(clearBookmarkBtn) clearBookmarkBtn.style.display = 'none';
        }
    };

    if (clearBookmarkBtn) {
        clearBookmarkBtn.addEventListener('click', () => {
            localStorage.removeItem(BOOKMARK_KEY);
            updateBookmarkStatus();
            alert('تم مسح موضع القراءة المحفوظ.');
        });
    }

    const searchAyahInSurah = (e) => {
        const searchTerm = e.target.value.trim();
        const ayahLines = document.querySelectorAll('.ayah-line');

        ayahLines.forEach(ayah => {
            if (searchTerm === '') {
                ayah.style.display = 'block';
                ayah.style.backgroundColor = 'transparent';
                return;
            }
            if (ayah.textContent.includes(searchTerm)) {
                ayah.style.display = 'block';
                ayah.style.backgroundColor = 'rgba(255, 215, 0, 0.15)'; 
            } else {
                ayah.style.display = 'none';
                ayah.style.backgroundColor = 'transparent';
            }
        });

        if (searchTerm.length >= 3) {
            addSearchToHistory(searchTerm);
        }
    };
    
    // --------------------------------------
    // 6. ميزة: مواقيت الصلاة (Geolocation و API) 🕌
    // --------------------------------------

    const getLocationAndPrayers = () => {
        if (!prayerDisplay) return;
        prayerDisplay.innerHTML = '<p>⚠️ جاري طلب إذن الوصول لموقعك الجغرافي...</p>';
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    prayerDisplay.innerHTML = '<p>✅ تم تحديد الموقع. جاري جلب المواقيت...</p>';
                    getPrayerTimes(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    prayerDisplay.innerHTML = `<p style="color: red;">❌ تعذر تحديد الموقع (${error.message}).</p>`;
                }
            );
        } else {
            prayerDisplay.innerHTML = '<p style="color: red;">❌ متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.</p>';
        }
    };

    const getPrayerTimes = async (latitude, longitude) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        try {
            const response = await fetch(`${PRAYER_API_URL}/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`); // Method 2: ISNA
            if (!response.ok) throw new Error('فشل في جلب المواقيت');
            
            const data = await response.json();
            const todayTimings = data.data.find(day => day.date.gregorian.day === date.getDate().toString());
            
            if (todayTimings) {
                PRAYER_TIMINGS_TODAY = todayTimings.timings;
                renderPrayerTimes(PRAYER_TIMINGS_TODAY);
                startPrayerCountdown(PRAYER_TIMINGS_TODAY);
            } else {
                 prayerDisplay.innerHTML = '<p style="color: red;">❌ لم يتم العثور على مواقيت لهذا اليوم في البيانات المسترجعة.</p>';
            }
            
        } catch (error) {
            console.error('Prayer Times Error:', error);
            prayerDisplay.innerHTML = `<p style="color: red;">❌ فشل جلب المواقيت. يرجى المحاولة لاحقاً.</p>`;
        }
    };

    const renderPrayerTimes = (timings) => {
        let html = '<ul style="list-style: none; padding: 0;">';
        
        const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        mainPrayers.forEach((key) => {
            html += `
                <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--accent-color);">
                    <strong style="color: var(--accent-color-light);">${PRAYER_NAMES[key]}</strong>
                    <span>${timings[key]}</span>
                </li>
            `;
        });
        
        html += '</ul>';
        prayerDisplay.innerHTML = html;
    };
    
    const startPrayerCountdown = (timings) => {
        if (COUNTDOWN_TIMER) clearInterval(COUNTDOWN_TIMER);
        
        const prayerKeys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const now = new Date();
        let nextPrayerTime = null;
        let nextPrayerKey = null;

        // 1. البحث عن الصلاة القادمة اليوم
        for (let i = 0; i < prayerKeys.length; i++) {
            const timeStr = timings[prayerKeys[i]]; // مثال: "04:30"
            const [hours, minutes] = timeStr.split(':').map(Number);
            const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

            if (prayerDate > now) {
                nextPrayerTime = prayerDate;
                nextPrayerKey = prayerKeys[i];
                NEXT_PRAYER_INDEX = i;
                break;
            }
        }

        // 2. إذا انتهت صلوات اليوم، فالصلاة القادمة هي فجر الغد
        if (!nextPrayerTime) {
            nextPrayerKey = 'Fajr';
            NEXT_PRAYER_INDEX = 0;
            const timeStr = timings['Fajr'];
            const [hours, minutes] = timeStr.split(':').map(Number);
            
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1); 
            
            nextPrayerTime = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), hours, minutes, 0);
        }
        
        COUNTDOWN_TIMER = setInterval(() => {
            const currentTime = new Date();
            const timeDiff = nextPrayerTime - currentTime;

            if (timeDiff <= 0) {
                clearInterval(COUNTDOWN_TIMER);
                // إعادة جلب المواقيت لبدء العد التنازلي للصلاة التي تليها
                getLocationAndPrayers(); 
                return;
            }

            const totalSeconds = Math.floor(timeDiff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            // تحديث العرض
            nextPrayerNameElement.textContent = PRAYER_NAMES[nextPrayerKey];
            timeToNextElement.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
        }, 1000);
    };

    // --------------------------------------
    // 7. ميزة: صفحة الأحاديث والأذكار
    // --------------------------------------
    const initHadithPage = () => {
        if (hadithListDiv) {
            fetchRandomHadith();
        }
        
        if (newHadithBtn) {
            newHadithBtn.addEventListener('click', fetchRandomHadith);
        }
    };
    
    const fetchRandomHadith = async () => {
        if (!hadithListDiv || !newHadithBtn) return;

        hadithListDiv.innerHTML = '<p style="text-align: center; color: var(--accent-color);">جاري جلب حديث شريف...</p>';
        newHadithBtn.disabled = true;

        try {
            const response = await fetch(HADITH_API_URL);
            if (!response.ok) throw new Error('فشل في جلب الأحاديث');
            
            const data = await response.json();
            const hadiths = data.data.hadiths;

            if (hadiths && hadiths.length > 0) {
                const randomIndex = Math.floor(Math.random() * hadiths.length);
                const hadith = hadiths[randomIndex];

                hadithListDiv.innerHTML = `
                    <div class="hadith-text">
                        <strong style="color: var(--accent-color-light); font-size: 1.2rem;">حديث رقم ${hadith.number}</strong>
                        <p style="margin-top: 10px;">${hadith.arab}</p>
                        <span style="font-size: 0.9rem; display: block; margin-top: 10px; color: var(--accent-color);">
                            مصدر الحديث: صحيح ${data.data.name} (الباب ${hadith.chapterId}: ${hadith.chapterTitle})
                        </span>
                    </div>
                `;
            } else {
                 hadithListDiv.innerHTML = '<p style="color: red;">❌ لم يتم العثور على أحاديث.</p>';
            }
            
        } catch (error) {
            console.error('Hadith Error:', error);
            hadithListDiv.innerHTML = '<p style="color: red;">❌ فشل جلب الحديث. يرجى التحقق من اتصال الإنترنت.</p>';
        } finally {
            newHadithBtn.disabled = false;
        }
    };
    
    // --------------------------------------
    // 8. منطق لعبة الاختبار
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
        roundNumberDisplay.textContent = quizState.round === 0 ? 1 : quizState.round; 
        fiftyFiftyBtn.disabled = quizState.fiftyFiftyUsed;
        fiftyFiftyBtn.style.opacity = quizState.fiftyFiftyUsed ? '0.5' : '1';
    };

    const startNewRound = () => {
        quizState.round++;
        quizState.questionIndex = 0;
        quizState.correctAnswers = 0;
        quizState.incorrectAnswers = 0;
        quizState.fiftyFiftyUsed = false;
        
        let shuffledQuestions = [...allQuizQuestions].sort(() => 0.5 - Math.random());
        quizState.roundQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_ROUND);
        
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
        
        if (quizState.questionIndex >= QUESTIONS_PER_ROUND) {
            endRoundAndShowSummary();
            return;
        }
        
        quizState.questionIndex++;
        const question = quizState.roundQuestions[quizState.questionIndex - 1]; 
        quizState.currentQuestion = question;
        saveQuizState();
        updateQuizDisplay();
        
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
        let time = duration;
        if (window.quizTimer) clearInterval(window.quizTimer);
        
        timerDisplay.textContent = `الوقت: ${time} ثانية`;

        window.quizTimer = setInterval(() => {
            time--;
            timerDisplay.textContent = `الوقت: ${time} ثانية`;

            if (time <= 0) {
                clearInterval(window.quizTimer);
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
            quizState.correctAnswers++; 
            showFeedback('إجابة صحيحة! +10 نقاط.', '#28a745');
        } else {
            quizState.incorrectAnswers++; 
            showFeedback('إجابة خاطئة! الإجابة الصحيحة هي: ' + quizState.currentQuestion.answer, '#dc3545');
        }
        
        saveQuizState();
        updateQuizDisplay();
        
        setTimeout(nextQuestion, 3000);
    };

    const useFiftyFifty = () => {
        if (quizState.fiftyFiftyUsed || !quizState.currentQuestion) return;
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
        updateSearchHistoryDisplay(); 
        if (quizContainer) {
            if (quizState.questionIndex > 0 && quizState.questionIndex < QUESTIONS_PER_ROUND) {
                nextQuestion(); 
            } else {
                startNewRound();
            }
        }
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.addEventListener('click', useFiftyFifty);
        }
    };
    
    // --------------------------------------
    // 9. سجل البحث في المصحف
    // --------------------------------------

    const getSearchHistory = () => {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    };

    const addSearchToHistory = (searchTerm) => {
        let history = getSearchHistory();
        
        history = history.filter(item => item !== searchTerm);
        
        history.unshift(searchTerm);
        
        history = history.slice(0, 5);
        
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
        updateSearchHistoryDisplay();
    };

    const updateSearchHistoryDisplay = () => {
        if (!historyListDiv) return;
        const history = getSearchHistory();
        
        if (history.length === 0) {
            historyListDiv.innerHTML = '<p style="color: var(--text-color);">لم يتم تسجيل أي عمليات بحث بعد.</p>';
            if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
            return;
        }

        let html = '<ul style="list-style-type: none; padding: 0;">';
        history.forEach(item => {
            html += `<li style="margin-bottom: 5px;">🔍 ${item}</li>`;
        });
        html += '</ul>';
        
        historyListDiv.innerHTML = html;
        if (clearHistoryBtn) clearHistoryBtn.style.display = 'block';
    };
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            localStorage.removeItem(SEARCH_HISTORY_KEY);
            updateSearchHistoryDisplay();
            alert('تم مسح سجل البحث.');
        });
    }

    // --------------------------------------
    // 10. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    
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
    }
});

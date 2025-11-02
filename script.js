// script.js - منصة إشراق النور (ملف الجافاسكريبت الموحد)
// ** تم تحديث هذا الملف للإصلاحات التالية: **
// 1. معالجة مشكلة الخطوط: تم تعديل applyFont لمنع إضافة backslash غير ضروري.
// 2. إصلاح جلب التفسير: تم تعديل logic الآية في fetchAndDisplayTafsir.
// 3. تحسين دالة المشاركة (النسخ).
// 4. إضافة منطق وأسئلة لميزة الاختبار (quiz).
// 5. تحسين عرض الحديث.

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
    
    let QURAN_FULL_TEXT = null; 
    let CURRENT_SURAH = null;
    let quizState = {
        score: 0,
        round: 0,
        fiftyFiftyUsed: false,
        timer: null,
        currentQuestion: null
    };

    // --------------------------------------
    // بيانات الاختبار (جديد)
    // --------------------------------------
    const quizQuestions = [
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
        }
    ];
    let availableQuestions = [...quizQuestions]; 

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
    // 3. ميزة: التحكم بالخط والحجم ✒️ (تم إصلاح الخطوط)
    // --------------------------------------
    const applyFont = (fontName) => {
        if (!quranReader) return;
        quranReader.className = quranReader.className.split(' ').filter(c => !c.startsWith('font-')).join(' ');
        if (fontName) {
             // **إصلاح مشكلة الخط:** إزالة الـ backslash المضافة بشكل خاطئ
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
                    // **إصلاح مشكلة الخط:** نستخدم القيمة الأصلية للـ data-font
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
    // 4. ميزة: مواقيت الصلاة ومؤشر الصلاة القادمة 📍
    // --------------------------------------
    let PRAYER_TIMINGS = null;
    const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const prayerArabic = { 'Fajr': 'الفجر', 'Sunrise': 'الشروق', 'Dhuhr': 'الظهر', 'Asr': 'العصر', 'Maghrib': 'المغرب', 'Isha': 'العشاء' };

    const formatTime = (time) => {
        const [h, m] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date;
    };

    const updateNextPrayer = () => {
        if (!PRAYER_TIMINGS) return;

        const now = new Date();
        let nextPrayer = null;
        let nextPrayerTime = null;

        for (const name of prayerNames) {
            const time = formatTime(PRAYER_TIMINGS[name]);
            if (time > now) {
                nextPrayer = name;
                nextPrayerTime = time;
                break;
            }
        }

        if (!nextPrayer && PRAYER_TIMINGS.Fajr) {
            nextPrayer = 'Fajr';
            nextPrayerTime = formatTime(PRAYER_TIMINGS.Fajr);
            nextPrayerTime.setDate(nextPrayerTime.getDate() + 1); 
        }

        const nextPrayerNameElem = document.getElementById('next-prayer-name');
        const timeToNextElem = document.getElementById('time-to-next');

        if (nextPrayer && nextPrayerTime) {
            nextPrayerNameElem.textContent = prayerArabic[nextPrayer];
            
            const updateCountdown = () => {
                const diff = nextPrayerTime.getTime() - new Date().getTime();
                if (diff <= 0) {
                    timeToNextElem.textContent = 'حان الآن وقت الصلاة!';
                    clearInterval(window.prayerTimer);
                    setTimeout(() => fetchPrayerTimes(PRAYER_TIMINGS.latitude, PRAYER_TIMINGS.longitude), 60000); 
                    return;
                }
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                timeToNextElem.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            };

            clearInterval(window.prayerTimer);
            window.prayerTimer = setInterval(updateCountdown, 1000);
            updateCountdown();

        } else {
            nextPrayerNameElem.textContent = 'غير محدد';
            timeToNextElem.textContent = '--:--:--';
        }
    };

    const fetchPrayerTimes = async (latitude, longitude) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const method = 2; 

        try {
            const response = await fetch(`${PRAYER_API_URL}/${today.getDate()}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
            const data = await response.json();

            if (data.code !== 200 || !data.data || !data.data.timings) {
                prayerDisplay.innerHTML = `<p style="color: red;">عفواً، فشل جلب المواقيت.</p>`;
                return;
            }

            const timings = data.data.timings;
            PRAYER_TIMINGS = timings; 
            PRAYER_TIMINGS.latitude = latitude;
            PRAYER_TIMINGS.longitude = longitude;

            const formattedTimings = `
                <style>
                    .prayer-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .prayer-table td { padding: 12px 15px; border-bottom: 1px solid var(--accent-color); font-size: 1.1rem; }
                    .prayer-table tr:hover { background-color: rgba(255, 215, 0, 0.1); }
                    .prayer-name { font-weight: bold; color: var(--accent-color-light); }
                </style>
                <table class="prayer-table">
                    ${prayerNames.map(name => 
                        `<tr><td class="prayer-name">${prayerArabic[name]}</td><td>${timings[name]}</td></tr>`
                    ).join('')}
                </table>
                <p style="font-size: 0.9rem; margin-top: 15px; color: var(--accent-color);">الموقع: خط العرض ${latitude.toFixed(2)}، خط الطول ${longitude.toFixed(2)}</p>
            `;
            prayerDisplay.innerHTML = formattedTimings;
            
            updateNextPrayer(); 

        } catch (error) {
            console.error("Error fetching prayer times:", error);
            prayerDisplay.innerHTML = `<p style="color: red;">خطأ في الاتصال بخدمة المواقيت.</p>`;
        }
    };

    const getLocationAndPrayers = () => {
        if (!prayerDisplay) return; 

        if (navigator.geolocation) {
            prayerDisplay.innerHTML = `<p style="color: var(--accent-color);">⏳ جاري تحديد موقعك...</p>`;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    prayerDisplay.innerHTML = `<p style="color: #dc3545;">❌ فشل تحديد الموقع، استخدم إحداثيات افتراضية (مكة المكرمة).</p>`;
                    fetchPrayerTimes(21.4225, 39.8262); 
                }
            );
        } else {
            prayerDisplay.innerHTML = `<p style="color: #dc3545;">⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.</p>`;
            fetchPrayerTimes(21.4225, 39.8262); 
        }
    };

    // --------------------------------------
    // 5. ميزة: جلب وعرض القرآن والبحث فيه 📖
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
            console.error("Error loading Quran data:", error);
            quranDisplayDiv.innerHTML = `<p style="color: red;">عفواً، فشل تحميل بيانات القرآن.</p>`;
            loadingStatusElement.textContent = '❌ فشل التحميل. يرجى التأكد من اتصالك بالإنترنت.';
        }
    };

    const displaySurahIndex = () => {
        if (!QURAN_FULL_TEXT) return;
        quranDisplayDiv.innerHTML = '';
        loadingStatusElement.textContent = 'اختر سورة للتصفح:';
        
        if (ayahSearchInput) ayahSearchInput.style.display = 'none';

        QURAN_FULL_TEXT.forEach(surah => {
            const button = document.createElement('button');
            button.className = 'surah-name-button main-action-btn'; 
            const surahName = surah.name_ar || surah.name || 'سورة غير معروفة';
            button.textContent = `${surahName} (السورة رقم ${surah.id})`;
            button.style.margin = '10px';
            button.addEventListener('click', () => { displaySurah(surah); });
            quranDisplayDiv.appendChild(button);
        });
    };

    // --------------------------------------
    // 6. ميزة: الحفظ والتفسير والمشاركة (تم إصلاح التفسير والمشاركة)
    // --------------------------------------

    const saveBookmark = (surahId, ayahNumber) => {
        const surah = QURAN_FULL_TEXT.find(s => s.id === surahId);
        const surahName = surah ? surah.name_ar : 'غير معروفة';
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify({ surahId, ayahNumber, surahName }));
        updateBookmarkStatus();
        alert(`تم حفظ موضع القراءة: سورة ${surahName}، الآية ${ayahNumber}.`);
    };

    const updateBookmarkStatus = () => {
        const bookmarkData = localStorage.getItem(BOOKMARK_KEY);
        const lastReadLocationElem = document.getElementById('last-read-location');
        const clearBookmarkBtn = document.getElementById('clear-bookmark-btn');

        if (bookmarkData && lastReadLocationElem) {
            const { surahId, ayahNumber, surahName } = JSON.parse(bookmarkData);
            lastReadLocationElem.innerHTML = `سورة <span style="font-weight: bold;">${surahName}</span>، الآية <span style="font-weight: bold;">${ayahNumber}</span>`;
            clearBookmarkBtn.style.display = 'inline-block';
            
            lastReadLocationElem.onclick = () => {
                const surah = QURAN_FULL_TEXT.find(s => s.id === surahId);
                if (surah) displaySurah(surah, ayahNumber);
            };
        } else if (lastReadLocationElem) {
            lastReadLocationElem.textContent = 'لم يتم الحفظ بعد.';
            clearBookmarkBtn.style.display = 'none';
            lastReadLocationElem.onclick = null;
        }
    };
    
    if (document.getElementById('clear-bookmark-btn')) {
        document.getElementById('clear-bookmark-btn').addEventListener('click', () => {
            localStorage.removeItem(BOOKMARK_KEY);
            updateBookmarkStatus();
        });
    }

    const fetchAndDisplayTafsir = async (surahId, ayahNumber, ayahText) => {
        const tafsirDivId = `tafsir-${surahId}-${ayahNumber}`;
        const existingTafsir = document.getElementById(tafsirDivId);

        if (existingTafsir) {
            existingTafsir.remove();
            return;
        }

        const ayahElement = document.querySelector(`.ayah-line[data-ayah-id="${surahId}-${ayahNumber}"]`);
        if (!ayahElement) return;

        ayahElement.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
        
        const tafsirDiv = document.createElement('div');
        tafsirDiv.id = tafsirDivId;
        tafsirDiv.className = 'tafsir-box';
        tafsirDiv.style.cssText = 'padding: 15px; margin: 10px 0 20px 0; border: 2px solid #DAA520; border-radius: 10px; background-color: var(--card-bg-color); color: var(--text-color); font-size: 1.1rem;';
        tafsirDiv.innerHTML = '<p style="text-align: center;">⏳ جاري جلب التفسير...</p>';
        ayahElement.insertAdjacentElement('afterend', tafsirDiv);

        try {
            const response = await fetch(`${TAFSIR_API_URL}${surahId}`); 
            const data = await response.json();

            // **إصلاح مشكلة التفسير:** التأكد من العثور على الآية الصحيحة
            const ayahData = (data.result || []).find(item => parseInt(item.aya) === ayahNumber);

            if (ayahData && ayahData.translation) {
                tafsirDiv.innerHTML = `<h4 style="color: var(--accent-color-light); border-bottom: 1px dotted var(--accent-color); padding-bottom: 5px;">التفسير الموجز (الآية ${ayahNumber}):</h4><p>${ayahData.translation}</p>`;
            } else {
                tafsirDiv.innerHTML = `<p style="color: var(--accent-color-light);">عفواً، لم نتمكن من العثور على تفسير لهذه الآية حالياً.</p>`;
            }
        } catch (error) {
            console.error('Error fetching tafsir:', error);
            tafsirDiv.innerHTML = '<p style="color: red;">❌ فشل جلب التفسير من الخادم.</p>';
        } finally {
             setTimeout(() => { ayahElement.style.backgroundColor = 'transparent'; }, 5000);
        }
    };
    
    // **دالة مساعدة للنسخ (جديد)**
    const copyAyah = (surahName, ayahNumber, ayahText) => {
        const textToCopy = `سورة ${surahName}، الآية ${ayahNumber}:\n${ayahText}`;
        navigator.clipboard.writeText(textToCopy);
        alert('✅ تم نسخ الآية الكريمة بنجاح!');
    };


    const displaySurah = (surah, targetAyahNumber = null) => {
        CURRENT_SURAH = surah;
        const surahName = surah.name_ar || surah.name || 'سورة غير معروفة';
        
        const versesCount = (surah.verses || surah.array || []).length;
        const revelation = surah.type_en && surah.type_en.toLowerCase().includes('meccan') ? 'مكية' : 'مدنية';

        loadingStatusElement.textContent = `جاري تصفح سورة ${surahName}.`;
        
        if (ayahSearchInput) {
            ayahSearchInput.style.display = 'block';
            ayahSearchInput.value = '';
        }
        
        quranDisplayDiv.innerHTML = ''; 

        const infoHTML = `
            <div style="text-align: center; margin-bottom: 25px; padding: 10px; border: 1px dashed var(--accent-color); border-radius: 10px;">
                <p style="font-size: 1.1rem;"><strong>معلومات السورة:</strong></p>
                <p>النزول: <span style="color: var(--accent-color-light); font-weight: bold;">${revelation}</span> | عدد الآيات: <span style="color: var(--accent-color-light); font-weight: bold;">${versesCount}</span></p>
            </div>
        `;
        quranDisplayDiv.innerHTML += infoHTML;
        
        const backButton = document.createElement('button');
        backButton.id = 'back-to-index';
        backButton.textContent = 'العودة لقائمة السور';
        backButton.className = 'main-action-btn';
        quranDisplayDiv.insertAdjacentElement('afterbegin', backButton);
        backButton.addEventListener('click', displaySurahIndex);

        renderSurahContent(surah.verses || surah.array || [], surah.id);
        
        if (targetAyahNumber) {
            setTimeout(() => {
                const targetElement = document.querySelector(`.ayah-line[data-ayah-number="${targetAyahNumber}"]`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetElement.style.backgroundColor = 'rgba(255, 255, 0, 0.2)'; 
                    setTimeout(() => { targetElement.style.backgroundColor = 'transparent'; }, 5000);
                }
            }, 300); 
        }
    };

    const renderSurahContent = (verses, surahId) => {
        const contentHTML = verses.map((ayah, index) => {
            const ayahNumber = index + 1;
            const ayahText = ayah.text || ayah.ar || ayah; 
            
            // **تحسين النسخ:** استخدام دالة copyAyah
            const tools = `
                <button class="ayah-options-btn" title="حفظ الموضع" onclick="saveBookmark(${surahId}, ${ayahNumber})">📌</button>
                <button class="ayah-options-btn" title="تفسير الآية" onclick="fetchAndDisplayTafsir(${surahId}, ${ayahNumber})">💡</button>
                <button class="ayah-options-btn" title="مشاركة" onclick="copyAyah('${CURRENT_SURAH.name_ar}', ${ayahNumber}, '${ayahText.replace(/'/g, "\\'")}')">🔗</button>
            `;

            return `
                <span class="ayah-line" data-ayah-id="${surahId}-${ayahNumber}" data-ayah-number="${ayahNumber}">
                    ${ayahText} <sup class="ayah-number">﴿${ayahNumber}﴾</sup> ${tools}
                </span>`;
        }).join('');

        quranDisplayDiv.querySelector('#surah-content')?.remove();
        
        const contentDiv = document.createElement('div');
        contentDiv.id = 'surah-content';
        contentDiv.className = 'quran-content-wrapper'; // **إضافة wrapper لتطبيق تنسيق الأسطر**
        contentDiv.style.cssText = "margin-top: 20px; text-align: justify;";
        contentDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--accent-color-light); margin-bottom: 25px;">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</h2>
            ${contentHTML}
        `;
        quranDisplayDiv.appendChild(contentDiv);
    };

    if (ayahSearchInput) {
        ayahSearchInput.addEventListener('input', () => {
             const searchTerm = ayahSearchInput.value.trim().toLowerCase();
            if (!CURRENT_SURAH || !searchTerm || searchTerm.length < 2) {
                renderSurahContent(CURRENT_SURAH ? (CURRENT_SURAH.verses || CURRENT_SURAH.array || []) : [], CURRENT_SURAH.id);
                return;
            }

            const filteredVerses = (CURRENT_SURAH.verses || CURRENT_SURAH.array || []).filter(ayah => {
                const ayahText = (ayah.text || ayah.ar || ayah).toLowerCase();
                return ayahText.includes(searchTerm);
            });
            
            renderSurahContent(filteredVerses, CURRENT_SURAH.id);

            if (filteredVerses.length === 0) {
                 quranDisplayDiv.querySelector('#surah-content').innerHTML += `<p style="color: red; text-align: center; margin-top: 15px;">لا توجد آيات مطابقة للبحث.</p>`;
            }
            
            let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
            if (searchTerm && !history.includes(searchTerm)) {
                history.unshift(searchTerm); 
                history = history.slice(0, 5); 
                localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
            }
            updateSearchHistoryDisplay(); // تحديث السجل عند البحث
        });
    }

    const updateSearchHistoryDisplay = () => {
        const historyListDiv = document.getElementById('history-list');
        if (!historyListDiv) return;

        const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
        if (history.length === 0) {
            historyListDiv.innerHTML = `<p style="color: var(--text-color);">لم يتم إجراء أي عمليات بحث بعد.</p>`;
            return;
        }

        historyListDiv.innerHTML = `
            <ul style="list-style: none; padding: 0;">
                ${history.map(term => `<li style="margin-bottom: 8px; padding: 5px 10px; border-bottom: 1px dotted var(--accent-color); color: var(--text-color);">🔍 ${term}</li>`).join('')}
            </ul>
        `;
    };
    
    window.saveBookmark = saveBookmark;
    window.fetchAndDisplayTafsir = fetchAndDisplayTafsir;
    window.copyAyah = copyAyah; // إتاحة الدالة الجديدة

    // --------------------------------------
    // 7. تهيئة صفحة الأحاديث والأذكار (تم تحسين العرض)
    // --------------------------------------
    const fetchNewHadith = async () => {
        if (!hadithListDiv || !newHadithBtn) return;

        hadithListDiv.innerHTML = '<p style="text-align: center; color: var(--accent-color);">⏳ جاري جلب الحديث من الإنترنت...</p>';
        newHadithBtn.disabled = true;

        try {
            const response = await fetch(HADITH_API_URL);
            const data = await response.json();

            if (data.code !== 200 || !data.data || !data.data.hadiths || data.data.hadiths.length === 0) {
                throw new Error('فشل جلب الأحاديث أو لا توجد بيانات متاحة.');
            }

            const hadiths = data.data.hadiths;
            const randomIndex = Math.floor(Math.random() * hadiths.length);
            const randomHadith = hadiths[randomIndex];

            const hadithArabic = randomHadith.arab || randomHadith.body || 'نص الحديث غير متوفر';
            const hadithNumber = randomHadith.number || 'غير محدد';
            
            // **تحسين: دمج الشرح (للتجربة) - يجب استخدام API تفسير موثوق**
            const hadithExplanation = randomHadith.hadith_explainer || `هذا الحديث الشريف مروي في صحيح ${data.data.name}، ورقمه: ${hadithNumber}. (يتطلب إضافة API خاص بالتفسير لتقديم شرح مفصل).`;

            const shareButton = `
                <button class="main-action-btn" style="padding: 8px 15px; font-size: 0.9rem; margin-top: 15px;" 
                        onclick="navigator.clipboard.writeText('حديث اليوم: ${hadithArabic} - المصدر: ${data.data.name}.'); alert('تم نسخ الحديث!');">
                    🔗 مشاركة الحديث
                </button>`;

            hadithListDiv.innerHTML = `
                <div class="hadith-container" style="border: 2px solid var(--accent-color); padding: 20px; margin-top: 20px; border-radius: 15px;">
                    <h3 style="color: var(--accent-color-light); text-align: center;">الحديث النبوي الشريف</h3>
                    <p style="font-size: 1.4rem; line-height: 2.2; text-align: justify; margin-bottom: 25px;">${hadithArabic}</p>
                    <h4 style="color: var(--accent-color);">الشرح والتفسير الموجز</h4>
                    <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-color);">${hadithExplanation}</p>
                    <p style="font-size: 0.9rem; text-align: end; margin-top: 15px; color: var(--accent-color);">المصدر: صحيح ${data.data.name}، رقم ${hadithNumber}</p>
                    ${shareButton}
                </div>
            `;
            
        } catch (error) {
            console.error("Error fetching hadith:", error);
            hadithListDiv.innerHTML = `<p style="color: red; text-align: center;">❌ فشل جلب الحديث: ${error.message}.</p>`;
        } finally {
            newHadithBtn.disabled = false;
        }
    };
    
    const displayAzkar = () => {
        if (!azkarDisplayDiv) return;

        const hour = new Date().getHours();
        const isMorning = hour >= 4 && hour < 12; 
        
        const morningAzkar = [
            "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.",
            "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
            "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100 مرة)"
        ];
        
        const eveningAzkar = [
            "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.",
            "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
            "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (3 مرات)"
        ];
        
        const currentAzkar = isMorning ? morningAzkar : eveningAzkar;
        const title = isMorning ? '🌅 أذكار الصباح' : '🌇 أذكار المساء';

        azkarDisplayDiv.innerHTML = `
            <h3 style="color: var(--accent-color-light); text-align: center; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">${title}</h3>
            <ul style="list-style: none; padding: 0;">
                ${currentAzkar.map((zkr, index) => 
                    `<li style="margin-bottom: 15px; padding: 10px; border-radius: 8px; background-color: rgba(218, 165, 32, 0.1); color: var(--text-color); border: 1px solid var(--accent-color);">${zkr}</li>`
                ).join('')}
            </ul>
        `;
    };

    const initHadithPage = () => {
        if (newHadithBtn) {
            fetchNewHadith(); 
            newHadithBtn.addEventListener('click', fetchNewHadith);
        }
        displayAzkar(); 
    };

    // --------------------------------------
    // 8. منطق لعبة الاختبار (جديد) 🏆
    // --------------------------------------

    const saveQuizState = () => {
        localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(quizState));
    };

    const loadQuizState = () => {
        const savedState = localStorage.getItem(QUIZ_STATE_KEY);
        if (savedState) {
            quizState = JSON.parse(savedState);
        }
        updateQuizDisplay();
    };

    const updateQuizDisplay = () => {
        if (!scoreDisplay || !roundNumberDisplay || !fiftyFiftyBtn) return;
        scoreDisplay.textContent = `النقاط: ${quizState.score}`;
        roundNumberDisplay.textContent = quizState.round + 1;
        fiftyFiftyBtn.disabled = quizState.fiftyFiftyUsed;
        fiftyFiftyBtn.style.opacity = quizState.fiftyFiftyUsed ? '0.5' : '1';
    };

    const startQuizRound = () => {
        if (!quizContainer) return;
        
        // إعادة تعيين الجولة إذا كانت الأسئلة انتهت
        if (availableQuestions.length === 0) {
            availableQuestions = [...quizQuestions];
            quizState.round = 0;
            alert(`تهانينا! لقد أنهيت الجولة. ستبدأ جولة جديدة! نقاطك النهائية: ${quizState.score}`);
        }
        
        quizState.round++;
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions.splice(randomIndex, 1)[0];
        quizState.currentQuestion = question;
        saveQuizState();
        updateQuizDisplay();
        
        // عرض السؤال
        quizContainer.innerHTML = `
            <h3 style="color: var(--accent-color-light); margin-bottom: 20px;">السؤال ${quizState.round}: ${question.question}</h3>
            <div id="options-container" style="display: flex; flex-direction: column; gap: 15px;">
                ${question.options.map((option, index) => 
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
                showFeedback('انتهى الوقت! الإجابة الصحيحة هي: ' + quizState.currentQuestion.answer, '#dc3545');
                setTimeout(startQuizRound, 3000); 
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
                btn.style.backgroundColor = '#28a745'; // أخضر للصحيح
                btn.style.color = 'white';
            } else if (btn.getAttribute('data-answer') === selectedAnswer) {
                btn.style.backgroundColor = '#dc3545'; // أحمر للخطأ
                btn.style.color = 'white';
            }
        });

        if (isCorrect) {
            quizState.score += 10;
            showFeedback('إجابة صحيحة! +10 نقاط.', '#28a745');
        } else {
            showFeedback('إجابة خاطئة! الإجابة الصحيحة هي: ' + quizState.currentQuestion.answer, '#dc3545');
        }
        
        saveQuizState();
        updateQuizDisplay();
        
        setTimeout(startQuizRound, 3000); // بدء جولة جديدة بعد 3 ثواني
    };

    const useFiftyFifty = () => {
        if (quizState.fiftyFiftyUsed || !quizState.currentQuestion) return;

        quizState.fiftyFiftyUsed = true;
        saveQuizState();
        updateQuizDisplay();

        const correct = quizState.currentQuestion.answer;
        const incorrectOptions = quizState.currentQuestion.options.filter(opt => opt !== correct);
        
        // اختيار إجابة خاطئة عشوائية واحدة للحفاظ عليها
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
            if (quizQuestions.length > 0) {
                startQuizRound();
            } else {
                quizContainer.innerHTML = '<p style="text-align: center; color: red;">عفواً، لم يتم تحميل أسئلة الاختبار بعد.</p>';
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
        updateSearchHistoryDisplay(); // عرض سجل البحث في صفحة الاختبار
    }
});

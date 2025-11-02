// main.js - الكود الرئيسي والأساسيات والقرآن

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'appTheme';
    
    // عناصر المصحف والمواقيت
    const quranDisplayDiv = document.getElementById('quran-display');
    const loadingStatusElement = document.getElementById('loading-status');
    const ayahSearchInput = document.getElementById('ayah-search');
    const prayerDisplay = document.getElementById('prayer-display');
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    const PRAYER_API_URL = 'https://api.aladhan.com/v1/timings';
    let QURAN_FULL_TEXT = null; 
    let CURRENT_SURAH = null;

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
        const method = 2; 

        try {
            const response = await fetch(`${PRAYER_API_URL}/${today.getDate()}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
            const data = await response.json();

            if (data.code !== 200 || !data.data || !data.data.timings) {
                prayerDisplay.innerHTML = `<p style="color: red;">عفواً، فشل جلب المواقيت.</p>`;
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
                    prayerDisplay.innerHTML = `<p style="color: #dc3545;">❌ تعذر تحديد موقعك.</p>`;
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
        
        quranDisplayDiv.innerHTML = ''; 

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
    // 5. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    if (quranDisplayDiv) { 
        loadQuranData();
        getLocationAndPrayers();
    }
});

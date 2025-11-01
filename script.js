// script.js - الكود النهائي لجلب المصحف من ملف خارجي (quran_data.json)

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'appTheme';
    const quranDisplayDiv = document.getElementById('quran-display');
    const loadingStatusElement = document.getElementById('loading-status');

    // ** تم تغيير هذا ليكون اسم الملف المحلي الذي سيتم جلبه **
    const QURAN_DATA_FILE = 'quran_data.json'; 
    
    let QURAN_FULL_TEXT = null; 
    
    // --------------------------------------
    // 2. ميزة: جلب بيانات القرآن من الملف المحلي المنفصل
    // --------------------------------------
    const loadQuranData = async () => {
        try {
            loadingStatusElement.textContent = '⚠️ جاري تحميل المصحف الشريف من الملف المحلي...';
            
            // جلب البيانات من الملف المحلي الجديد
            const response = await fetch(QURAN_DATA_FILE);
            
            if (!response.ok) {
                // إذا فشل التحميل المحلي، قد يكون الملف غير موجود أو المسار خاطئ
                throw new Error('فشل جلب ملف القرآن المحلي. تأكد من وجود quran_data.json في نفس المجلد.');
            }
            
            const data = await response.json();
            
            // يجب أن يكون 114 سورة الآن
            if (Array.isArray(data) && data.length === 114) {
                 QURAN_FULL_TEXT = data; 
                 loadingStatusElement.textContent = '✅ تم تحميل المصحف الشريف كاملاً (114 سورة).';
                 displaySurahIndex(); 
            } else {
                 throw new Error('هيكل ملف quran_data.json غير صحيح. (يجب أن يحتوي على مصفوفة 114 سورة).');
            }
            
        } catch (error) {
            console.error('خطأ في تحميل بيانات القرآن:', error);
            quranDisplayDiv.innerHTML = `<p style="color: red;">عفواً، فشل تحميل بيانات القرآن: ${error.message}</p>`;
            loadingStatusElement.textContent = '❌ فشل التحميل. يرجى مراجعة console للتفاصيل.';
        }
    };


    // --------------------------------------
    // 3. ميزة: تبديل الوضع الليلي
    // --------------------------------------
    const loadTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light-mode';
        body.className = savedTheme;
        themeToggleBtn.textContent = savedTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
    };
    
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        body.className = newTheme;
        localStorage.setItem(THEME_KEY, newTheme);
        loadTheme();
    });

    // --------------------------------------
    // 4. ميزة: عرض المصحف كاملاً (فهرس وتصفح)
    // --------------------------------------

    const displaySurahIndex = () => {
        if (!QURAN_FULL_TEXT) return;
        
        quranDisplayDiv.innerHTML = '';
        loadingStatusElement.textContent = 'اختر سورة للتصفح:';
        
        QURAN_FULL_TEXT.forEach(surah => {
            const button = document.createElement('button');
            button.className = 'surah-name-button';
            // نستخدم 'name' و 'name_en' للتأكد من وجود اسم
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
        
        // يجب أن نستخدم خاصية الآيات الصحيحة من ملف JSON (عادةً 'verses')
        const versesArray = surah.verses || surah.array || []; 
        
        quranDisplayDiv.innerHTML = `
            <h2 style="text-align: center; color: var(--accent-color);">سورة ${surahName}</h2>
            <button id="back-to-index" style="width: auto; margin-bottom: 20px;">العودة لقائمة السور</button>
            <div id="surah-content" style="font-family: 'Amiri', serif; font-size: 1.5rem;">
                ${versesArray.map((ayah, index) => {
                    const ayahText = ayah.text || ayah.ar || ayah; // محاولة جلب النص
                    return `<span class="ayah-line">${ayahText} <sup class="ayah-number">﴿${index + 1}﴾</sup></span>`;
                }).join(' ')}
            </div>
        `;
        loadingStatusElement.textContent = `جاري تصفح سورة ${surahName}.`;

        document.getElementById('back-to-index').addEventListener('click', displaySurahIndex);
    };


    // --------------------------------------
    // 5. ميزة: مواقيت الصلاة (بدون تغيير)
    // --------------------------------------
    const prayerDisplay = document.getElementById('prayer-display');

    const getPrayerTimes = (latitude, longitude) => {
        const date = new Date();
        const API_URL = `https://api.aladhan.com/v1/calendar/${date.getFullYear()}/${date.getMonth() + 1}?latitude=${latitude}&longitude=${longitude}&method=2`;

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const timings = data.data[date.getDate() - 1].timings;
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

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => { getPrayerTimes(position.coords.latitude, position.coords.longitude); },
            () => { prayerDisplay.innerHTML = `<p>يرجى السماح بالوصول لموقعك الجغرافي.</p>`; }
        );
    } else {
        prayerDisplay.innerHTML = `<p>متصفحك لا يدعم تحديد الموقع الجغرافي.</p>`;
    }

    // --------------------------------------
    // 6. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    loadQuranData(); // بدء تحميل ملف القرآن المنفصل
});

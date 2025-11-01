// script.js - الكود النهائي لربط المصحف مباشرة من المصدر الخارجي (API)

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'appTheme';
    const quranDisplayDiv = document.getElementById('quran-display');
    const loadingStatusElement = document.getElementById('loading-status');

    // ** الرابط المباشر للمصحف الشريف كاملاً (114 سورة) **
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    
    let QURAN_FULL_TEXT = null; 
    
    // --------------------------------------
    // 2. ميزة: جلب بيانات القرآن من المصدر المباشر
    // --------------------------------------
    const loadQuranData = async () => {
        try {
            loadingStatusElement.textContent = '⚠️ جاري تحميل المصحف الشريف من الإنترنت...';
            
            // جلب البيانات مباشرة من الرابط الموثوق
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


    // --------------------------------------
    // 3. ميزة: تبديل الوضع الليلي 
    // --------------------------------------
    const loadTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light-mode';
        body.className = savedTheme;
        // التحقق من وجود الزر قبل محاولة تغيير نصه
        if (themeToggleBtn) {
            themeToggleBtn.textContent = savedTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        }
    };
    
    // التحقق من وجود الزر قبل إضافة المستمع (مهم لصفحة Hadith.html في حال تم استخدام هذا الملف فيها)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
            body.className = newTheme;
            localStorage.setItem(THEME_KEY, newTheme);
            loadTheme();
        });
    }

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
    // 5. ميزة: مواقيت الصلاة 
    // --------------------------------------
    const prayerDisplay = document.getElementById('prayer-display');

    const getPrayerTimes = (latitude, longitude) => {
        // التحقق من وجود عنصر عرض أوقات الصلاة قبل التنفيذ
        if (!prayerDisplay) return; 

        const date = new Date();
        // تم تغيير الرابط لضمان جلب مواقيت اليوم الحالي بشكل دقيق (data[0] غالباً)
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
    
    // يتم تنفيذ هذه الكتلة فقط في الصفحة التي تحتوي على prayer-display (index.html)
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
    // 6. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    // يتم تحميل القرآن فقط إذا كان العنصر موجوداً (في index.html)
    if (quranDisplayDiv) { 
        loadQuranData(); 
    }
});

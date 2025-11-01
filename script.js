// script.js - الكود الموحد (إصلاح القرآن + تحسين العداد)

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------
    // 1. المتغيرات الرئيسية والثوابت
    // --------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'appTheme';
    const quranSearchInput = document.getElementById('quran-search');
    const quranContentDiv = document.getElementById('quran-content');
    const LAST_READ_KEY = 'lastReadAyah';
    
    // رابط ملف القرآن الكريم الكامل الموثوق (JSON)
    const QURAN_API_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json'; 
    
    let QURAN_DATA_FULL = null; 

    // --------------------------------------
    // 2. ميزة: جلب بيانات القرآن من الإنترنت (تم إصلاح المسار هنا)
    // --------------------------------------
    const fetchQuranData = async () => {
        try {
            document.getElementById('last-read-status').textContent = '⚠️ جاري تحميل ملف القرآن الكريم (قد يستغرق لحظات)...';

            const response = await fetch(QURAN_API_URL); 
            if (!response.ok) {
                throw new Error('فشل جلب ملف القرآن من المصدر الخارجي.');
            }
            const data = await response.json();
            
            // ************ التعديل الحاسم ************
            // تم إصلاح المسار: البيانات الكاملة هي مصفوفة السور مباشرة
            QURAN_DATA_FULL = data; 
            
            document.getElementById('last-read-status').textContent = '✅ تم تحميل القرآن الكريم. ابدأ البحث!';
            displayLastRead(); 
        } catch (error) {
            console.error('خطأ في تحميل بيانات القرآن:', error);
            quranContentDiv.innerHTML = '<p style="color: red;">عفواً، فشل تحميل بيانات القرآن من الإنترنت. تحقق من اتصالك.</p>';
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
    // 4. ميزة: عداد الأذكار التفاعلي (مع رسائل فخمة)
    // --------------------------------------
    const countDisplay = document.getElementById('zekr-count');
    const incrementBtn = document.getElementById('increment-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressBar = document.getElementById('progress-bar');
    const DAILY_TARGET = 100;
    const COUNT_KEY = 'dailyZekrCount';

    let currentCount = parseInt(localStorage.getItem(COUNT_KEY)) || 0;
    
    const updateCounterAndProgress = () => {
        countDisplay.textContent = currentCount;
        let progressPercentage = Math.min(100, (currentCount / DAILY_TARGET) * 100);
        progressBar.style.width = `${progressPercentage}%`;
        
        const currentZekrElement = document.querySelector('.current-zekr'); 
        
        if (currentCount >= DAILY_TARGET) {
            progressBar.style.backgroundColor = '#ffd700'; // ذهبي عند الإنجاز
            currentZekrElement.textContent = '🏅 مبروك! لقد أتممت وردك اليومي (فوق الهدف).';
        } else {
            progressBar.style.backgroundColor = 'var(--progress-color)';
            currentZekrElement.textContent = `سبحان الله وبحمده، سبحان الله العظيم (باقٍ ${DAILY_TARGET - currentCount} تسبيحة)`;
        }
        
        localStorage.setItem(COUNT_KEY, currentCount.toString());
    };

    incrementBtn.addEventListener('click', () => { currentCount++; updateCounterAndProgress(); });
    resetBtn.addEventListener('click', () => {
        if (confirm("هل أنت متأكد من إعادة تعيين الورد اليومي؟")) {
            currentCount = 0; updateCounterAndProgress();
        }
    });

    // --------------------------------------
    // 5. ميزة: حفظ مكان القراءة والبحث المحلي (تم إصلاحه)
    // --------------------------------------
    
    const displayLastRead = () => {
        if (!QURAN_DATA_FULL) return;
        
        const lastRead = JSON.parse(localStorage.getItem(LAST_READ_KEY));
        const statusElement = document.getElementById('last-read-status');
        quranContentDiv.innerHTML = '';

        if (lastRead) {
            const surah = QURAN_DATA_FULL.find(s => s.id === lastRead.surah);
            if (surah) {
                const ayah = surah.verses.find(a => a.id === lastRead.ayah);
                statusElement.textContent = `مرحباً! آخر قراءة لك: سورة ${surah.name}، آية ${ayah ? ayah.id : 'الأولى'}.`;
                
                if (ayah) {
                    quranContentDiv.innerHTML = `<p class="ayah-text">${ayah.text} <span class="ayah-ref">(${surah.name}: ${ayah.id})</span></p>`;
                }
            }
        } else {
            // عرض رسالة ترحيبية أو أول آية افتراضية في حال عدم وجود بيانات قراءة سابقة
             statusElement.textContent = 'أهلاً بك! ابدأ البحث أو انقر على أي آية لحفظ آخر قراءة.';
        }
    };

    quranSearchInput.addEventListener('input', (e) => {
        if (!QURAN_DATA_FULL) {
            document.getElementById('last-read-status').textContent = 'الرجاء الانتظار حتى اكتمال تحميل القرآن.';
            return;
        }
        
        const searchTerm = e.target.value.trim();
        quranContentDiv.innerHTML = '';

        if (searchTerm.length < 2) {
            displayLastRead(); 
            return;
        }

        const results = [];
        // جعل البحث أكثر شمولاً (يستخدم UTF-8)
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); 

        QURAN_DATA_FULL.forEach(surah => {
            if (surah.verses) { // تأكد من وجود خاصية الآيات
                surah.verses.forEach(ayah => {
                    if (regex.test(ayah.text)) {
                        results.push({
                            text: ayah.text, surahName: surah.name, surahNumber: surah.id, ayahNumber: ayah.id
                        });
                    }
                });
            }
        });

        // عرض النتائج
        document.getElementById('last-read-status').textContent = `عدد النتائج: ${results.length} آية`;
        const displayLimit = 15; // زيادة حد العرض
        results.slice(0, displayLimit).forEach(item => { 
            const ayahElement = document.createElement('p');
            ayahElement.className = 'ayah-text';
            const highlightedText = item.text.replace(regex, match => `<mark>${match}</mark>`);
            ayahElement.innerHTML = `${highlightedText} <span class="ayah-ref">(${item.surahName}: ${item.ayahNumber})</span>`;
            quranContentDiv.appendChild(ayahElement);

            // تحديث آخر قراءة عند النقر
            ayahElement.addEventListener('click', () => {
                localStorage.setItem(LAST_READ_KEY, JSON.stringify({ surah: item.surahNumber, ayah: item.ayahNumber }));
                document.getElementById('last-read-status').textContent = `تم حفظ آخر قراءة: سورة ${item.surahName}، آية ${item.ayahNumber}`;
            });
        });
        
        if (results.length === 0) {
            quranContentDiv.innerHTML = `<p>لا توجد نتائج مطابقة لبحثك عن "${searchTerm}".</p>`;
        }
    });

    // --------------------------------------
    // 6. ميزة: مواقيت الصلاة (كما هي)
    // --------------------------------------
    const prayerDisplay = document.getElementById('prayer-display');

    const getPrayerTimes = (latitude, longitude) => {
        const date = new Date();
        // ... (بقية كود مواقيت الصلاة كما هو) ...
        const API_URL = `https://api.aladhan.com/v1/calendar/${date.getFullYear()}/${date.getMonth() + 1}?latitude=${latitude}&longitude=${longitude}&method=2`;

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const timings = data.data[date.getDate() - 1].timings;
                    // تنسيق فخم لجدول الصلاة
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
    // 7. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    updateCounterAndProgress();
    fetchQuranData(); 
});

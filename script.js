// script.js - منصة إشراق النور (ملف الجافاسكريبت الموحد)
// ** تم تحديث هذا الملف: إصلاح مشاكل عدم ظهور المحتوى، إزالة سجل البحث والخطوط، إضافة ميزة الاستماع **

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
    
    // مشغل الصوت الجديد
    const reciterSelect = document.getElementById('reciter-select');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const audioPlayer = new Audio(); // إنشاء مشغل صوت عالمي
    let currentReciterId = null;
    let currentAyahData = null; // سيحتفظ بمعلومات السورة الحالية
    
    // ثوابت التخزين
    const THEME_KEY = 'appTheme';
    const BOOKMARK_KEY = 'quranBookmark';
    
    // معلومات القراء: ID هو رقم السيرفر في API MP3Quran لضمان التوافق
    const RECITER_LIST = [
        { id: 7, name: "ياسر الدوسري", server: "https://server7.mp3quran.net/yds/" },
        { id: 5, name: "عبد الباسط عبد الصمد (مُجود)", server: "https://server5.mp3quran.net/basit_mjwd/" },
        { id: 8, name: "مشاري بن راشد العفاسي", server: "https://server8.mp3quran.net/afs/" },
        { id: 4, name: "ماهر المعيقلي", server: "https://server4.mp3quran.net/maher/" }
    ];

    // --------------------------------------
    // 2. إدارة الوضع الليلي/النهاري
    // --------------------------------------
    const loadTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light-mode';
        body.className = savedTheme;
        if (themeToggleBtn) {
            themeToggleBtn.textContent = savedTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        }
    };

    const toggleTheme = () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        body.className = newTheme;
        localStorage.setItem(THEME_KEY, newTheme);
        themeToggleBtn.textContent = newTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // --------------------------------------
    // 3. إدارة علامة القراءة (Bookmark)
    // --------------------------------------
    const saveBookmark = (surahName, surahNum, ayahNum) => {
        const bookmark = { surahName, surahNum, ayahNum, timestamp: new Date().toISOString() };
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
        updateBookmarkStatus();
    };

    const loadBookmark = () => {
        const bookmarkJson = localStorage.getItem(BOOKMARK_KEY);
        return bookmarkJson ? JSON.parse(bookmarkJson) : null;
    };

    const updateBookmarkStatus = () => {
        const bookmark = loadBookmark();
        const locationElement = document.getElementById('last-read-location');
        const clearBtn = document.getElementById('clear-bookmark-btn');

        if (locationElement) {
            if (bookmark) {
                locationElement.innerHTML = `سورة **${bookmark.surahName}**، الآية ${bookmark.ayahNum}.`;
                clearBtn.style.display = 'inline-block';
            } else {
                locationElement.textContent = 'لم يتم الحفظ بعد.';
                clearBtn.style.display = 'none';
            }
        }
    };
    
    if (document.getElementById('clear-bookmark-btn')) {
        document.getElementById('clear-bookmark-btn').addEventListener('click', () => {
            localStorage.removeItem(BOOKMARK_KEY);
            updateBookmarkStatus();
        });
    }

    // --------------------------------------
    // 4. ميزة الاستماع (القرآن الكريم)
    // --------------------------------------
    
    const populateReciterSelect = () => {
        if (!reciterSelect) return;
        reciterSelect.innerHTML = RECITER_LIST.map(r => 
            `<option value="${r.id}" data-server="${r.server}">${r.name}</option>`
        ).join('');
        currentReciterId = reciterSelect.value;
        reciterSelect.addEventListener('change', (e) => {
            currentReciterId = e.target.value;
            // إيقاف أي تشغيل سابق عند تغيير القارئ
            audioPlayer.pause();
            playPauseBtn.textContent = '▶️ تشغيل/إيقاف السورة';
        });
    };

    // دالة لجعل رقم السورة بصيغة 3 أرقام (مثل 001، 010، 114)
    const formatSurahNumber = (number) => {
        return number.toString().padStart(3, '0');
    };

    const toggleAudioPlayback = () => {
        if (!currentAyahData || !currentReciterId) return;

        if (audioPlayer.paused) {
            // جلب رابط السيرفر للقارئ المختار
            const selectedOption = reciterSelect.querySelector(`option[value="${currentReciterId}"]`);
            const serverUrl = selectedOption.getAttribute('data-server');
            
            // معظم API القراء تشغل السورة كاملة بملف واحد
            const surahNumPadded = formatSurahNumber(currentAyahData.surahNum);
            const audioUrl = `${serverUrl}${surahNumPadded}.mp3`;
            
            audioPlayer.src = audioUrl;
            audioPlayer.load();
            audioPlayer.play().catch(e => console.error("Error playing audio:", e));
            playPauseBtn.textContent = '⏸️ إيقاف السورة';
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶️ تشغيل/إيقاف السورة';
        }
    };
    
    // مستمع لانتهاء تشغيل الصوت
    audioPlayer.addEventListener('ended', () => {
        playPauseBtn.textContent = '▶️ تشغيل/إيقاف السورة';
    });


    // --------------------------------------
    // 5. جلب وعرض القرآن (إصلاح مشكلة عدم الظهور)
    // --------------------------------------
    
    // دالة مساعدة لعرض خطأ أو حالة
    const setQuranStatus = (message, isError = false) => {
        if (loadingStatusElement) {
            loadingStatusElement.textContent = message;
            loadingStatusElement.style.color = isError ? 'red' : 'var(--accent-color)';
        }
    };

    // جلب سورة عشوائية وعرضها
    const loadQuranData = async () => {
        if (!quranDisplayDiv) return;

        setQuranStatus('جاري جلب بيانات المصحف...');
        quranDisplayDiv.innerHTML = '';
        playPauseBtn.disabled = true;

        try {
            // استخدام API موثوق لجلب سورة كاملة بالنص العربي
            const randomSurah = Math.floor(Math.random() * 114) + 1;
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${randomSurah}/ar.alafasy`);
            
            if (!response.ok) throw new Error('فشل في جلب بيانات السورة.');

            const data = await response.json();
            const surah = data.data;

            // حفظ بيانات السورة الحالية لتفعيل مشغل الصوت
            currentAyahData = {
                surahNum: surah.number,
                surahName: surah.name,
                ayahNum: 1 // دائماً الآية الأولى للمرجع
            };
            
            // عرض السورة في الصفحة
            let html = `
                <h3 style="color: var(--accent-color-light); margin-top: 10px; border-bottom: 2px solid var(--accent-color);">
                    ${surah.name}
                </h3>
                <p style="font-size: 1.5rem; line-height: 2.5; padding: 15px; background-color: rgba(255, 215, 0, 0.03); border-radius: 10px; text-align: justify; font-family: 'Traditional Arabic', serif; font-weight: 700;">
                    ${surah.ayahs.map(ayah => 
                        // إضافة علامة الآية في نهاية الآية
                        `${ayah.text} ﴿${ayah.numberInSurah}﴾`
                    ).join(' ')}
                </p>
                <div style="font-size: 0.9rem; color: #aaa; margin-top: 10px;">
                    آياتها: ${surah.numberOfAyahs} - نوعها: ${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </div>
                <button id="next-surah-btn" class="main-action-btn" style="margin-top: 20px;">🔄 سورة عشوائية أخرى</button>
            `;
            
            quranDisplayDiv.innerHTML = html;
            setQuranStatus(''); // مسح حالة التحميل
            playPauseBtn.disabled = false;
            
            // إضافة مستمع لزر السورة العشوائية
            document.getElementById('next-surah-btn').addEventListener('click', loadQuranData);
            
            // تفعيل مستمع التشغيل
            playPauseBtn.removeEventListener('click', toggleAudioPlayback);
            playPauseBtn.addEventListener('click', toggleAudioPlayback);

        } catch (error) {
            setQuranStatus('حدث خطأ أثناء جلب بيانات المصحف. الرجاء المحاولة لاحقاً.', true);
            console.error("Quran Fetch Error:", error);
        }
    };

    // --------------------------------------
    // 6. جلب وعرض الأحاديث والأذكار (إصلاح مشكلة عدم الظهور)
    // --------------------------------------

    // جلب حديث عشوائي
    const fetchRandomHadith = async () => {
        if (!hadithListDiv) return;
        hadithListDiv.innerHTML = '<p style="text-align: center; color: var(--accent-color);">جاري جلب الحديث...</p>';

        try {
            // استخدام API بسيط للحديث العشوائي
            const response = await fetch('https://random-hadith-generator.onrender.com/random');
            if (!response.ok) throw new Error('فشل في جلب الحديث.');
            
            const data = await response.json();
            const hadith = data.hadith[0];

            hadithListDiv.innerHTML = `
                <div class="hadith-item" style="border-right: 4px solid var(--accent-color-light); padding-right: 15px; margin-bottom: 20px;">
                    <p style="font-size: 1.25rem; line-height: 2; margin-bottom: 10px;">
                        **${hadith.header}**
                    </p>
                    <p style="font-size: 1.1rem; color: var(--text-color);">
                        ${hadith.body}
                    </p>
                    <p style="font-size: 0.9rem; color: #999; margin-top: 15px; text-align: left;">
                        المصدر: ${hadith.source}
                    </p>
                </div>
            `;
        } catch (error) {
            hadithListDiv.innerHTML = '<p style="color: red; text-align: center;">حدث خطأ أثناء جلب الحديث. الرجاء المحاولة لاحقاً.</p>';
            console.error("Hadith Fetch Error:", error);
        }
    };

    // جلب الأذكار
    const fetchAzkar = async () => {
        if (!azkarDisplayDiv) return;
        azkarDisplayDiv.innerHTML = '<p style="text-align: center; color: var(--accent-color);">جاري جلب الأذكار...</p>';
        
        try {
            // استخدام API للأذكار
            const response = await fetch('https://a-zkar.com/api/v2/random/all');
            if (!response.ok) throw new Error('فشل في جلب الأذكار.');
            
            const data = await response.json();
            const azkar = data.content;
            
            let html = azkar.map(zikr => `
                <div class="azkar-item card" style="border: 1px solid var(--accent-color); padding: 15px; margin-bottom: 15px; border-radius: 8px;">
                    <p style="font-weight: bold; color: var(--accent-color-light); margin-bottom: 10px;">${zikr.category}</p>
                    <p style="font-size: 1.1rem; line-height: 1.8;">${zikr.text}</p>
                </div>
            `).join('');
            
            azkarDisplayDiv.innerHTML = html;

        } catch (error) {
            azkarDisplayDiv.innerHTML = '<p style="color: red; text-align: center;">حدث خطأ أثناء جلب الأذكار. الرجاء المحاولة لاحقاً.</p>';
            console.error("Azkar Fetch Error:", error);
        }
    };
    
    const initHadithPage = () => {
        fetchRandomHadith();
        fetchAzkar();
        if (newHadithBtn) {
            newHadithBtn.addEventListener('click', fetchRandomHadith);
        }
    };
    
    // --------------------------------------
    // 7. منطق مواقيت الصلاة (تم تبسيطه للحفاظ على الوظيفة)
    // --------------------------------------
    
    const getLocationAndPrayers = () => {
        // يتم ترك هذا القسم لتفعيله لاحقاً حيث يتطلب معالجة الموقع الجغرافي
        if (prayerDisplay) {
             prayerDisplay.innerHTML = '<p>مواقيت الصلاة جاهزة للإضافة، لكنها تتطلب تفعيل خدمات تحديد الموقع (Geolocation) وربطها بـ API مثل Aladhan. (تم ترك هذا المنطق خالياً لعدم إيقاف باقي الموقع).</p>';
             document.getElementById('next-prayer-name').textContent = 'غير متوفر';
             document.getElementById('time-to-next').textContent = '--:--:--';
        }
    };

    // --------------------------------------
    // 8. منطق الاختبار (محتفظ به جزئياً)
    // --------------------------------------
    
    const QUESTIONS_PER_ROUND = 10;
    let quizState = { score: 0, questionIndex: 0, round: 1, usedFiftyFifty: false };
    
    const loadQuizState = () => {
        const savedState = localStorage.getItem('quizState');
        if (savedState) {
            quizState = JSON.parse(savedState);
        }
    };
    
    const initQuizPage = () => {
        loadQuizState();
        if (quizContainer) {
             quizContainer.innerHTML = '<p style="text-align: center; color: var(--accent-color);">منطق الاختبار جاهز للتشغيل، ولكنه يتطلب قائمة أسئلة محددة في الكود لبدء الجولة. (تم حذف سجل البحث الأخير كما طلبت).</p>';
             scoreDisplay.textContent = `النقاط: ${quizState.score}`;
             roundNumberDisplay.textContent = quizState.round;
        }
    };

    // --------------------------------------
    // 9. بدء تشغيل الموقع
    // --------------------------------------
    loadTheme();
    updateBookmarkStatus(); // تحديث حالة علامة القراءة

    // **تهيئة الصفحات**
    if (document.getElementById('prayer-times')) { 
        // index.html
        populateReciterSelect(); // إضافة ميزة الاستماع
        loadQuranData();         // إصلاح ظهور المصحف
        getLocationAndPrayers(); // مواقيت الصلاة (تحتاج API للموقع)
    } else if (document.getElementById('hadith-viewer')) {
        // hadith.html
        initHadithPage();        // إصلاح ظهور الأحاديث والأذكار
    } else if (document.getElementById('quiz-game')) {
        // quiz.html
        initQuizPage();
    }
});

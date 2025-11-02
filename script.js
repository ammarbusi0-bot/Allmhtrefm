document.addEventListener('DOMContentLoaded', () => {

    // 🔗 رابط مستودع GitHub الخارجي لبيانات القرآن (تم تعديله للعمل من الرابط)
    const QURAN_DATA_URL = 'https://raw.githubusercontent.com/rn0x/Quran-Json/main/Quran.json';
    const HADITH_COUNT = 50; 
    const DAILY_TARGET_AYAH = 50; // هدف القراءة اليومي (قابل للتعديل)
    
    // العناصر الأساسية
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const quranDisplay = document.getElementById('quran-verses');
    const surahTitleElement = document.getElementById('surah-title');
    const quranAudio = document.getElementById('quran-audio');
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const hadithTextElement = document.getElementById('hadith-text');
    const surahSelector = document.getElementById('surah-selector');
    const tafseerPopup = document.getElementById('tafseer-popup');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const completeDailyBtn = document.getElementById('complete-daily-btn');
    const achievementBadge = document.getElementById('achievement-badge');
    const achievementMessage = document.getElementById('achievement-message');

    // عناصر النافذة المنبثقة للتفسير
    const tafseerContent = tafseerPopup ? tafseerPopup.querySelector('#tafseer-content') : null;
    const tafseerTitle = tafseerPopup ? tafseerPopup.querySelector('#tafseer-title') : null;
    const closePopupBtn = tafseerPopup ? tafseerPopup.querySelector('.close-btn') : null;
    
    let allSurahsData = []; 
    let currentSurahNumber = 1;

    // =========================================================
    // 1. تفعيل الوضع الليلي (Dark Mode)
    // =========================================================
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // =========================================================
    // 2. عرض الحديث النبوي اليومي 
    // =========================================================
    function getDailyHadithIndex() {
        const startDate = new Date('2025-01-01');
        const today = new Date();
        const oneDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.floor((today - startDate) / oneDay);
        return diffDays % HADITH_COUNT;
    }

    async function displayDailyHadith() {
        try {
            const response = await fetch('data/ahadith.json');
            const ahadith = await response.json();
            
            if (ahadith.length >= HADITH_COUNT) {
                const dailyIndex = getDailyHadithIndex();
                hadithTextElement.textContent = ahadith[dailyIndex];
            } else {
                 hadithTextElement.textContent = 'خطأ: عدد الأحاديث غير مكتمل أو غير متوفر.';
            }
        } catch (error) {
            console.error('فشل في جلب الأحاديث:', error);
            hadithTextElement.textContent = 'تعذر تحميل حديث اليوم. (تأكد من مجلد data/ahadith.json)';
        }
    }
    displayDailyHadith();
    
    // =========================================================
    // 3. إدارة القرآن والتفاعل (عرض، تفسير، تلاوة، حفظ الموضع)
    // =========================================================
    
    // دالة حفظ الموضع
    function saveLastRead(surahNumber) {
        localStorage.setItem('lastReadSurah', surahNumber);
    }

    // دالة تحميل الموضع
    function loadLastRead() {
        return parseInt(localStorage.getItem('lastReadSurah')) || 1;
    }

    // دالة بناء قائمة التنقل بين السور
    function buildSurahList(surahs) {
        if (!surahSelector) return; // تأكد من وجود العنصر

        surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. سورة ${surah.name_ar}`;
            surahSelector.appendChild(option);
        });

        // إضافة معالج حدث لتغيير السورة عند الاختيار
        surahSelector.addEventListener('change', (event) => {
            const newSurahNumber = parseInt(event.target.value);
            loadQuran(newSurahNumber);
        });
    }

    // دالة عرض القرآن الرئيسية
    async function loadQuran(surahNumber = null) {
        try {
            if (allSurahsData.length === 0) {
                // جلب بيانات القرآن من الرابط الخارجي
                const response = await fetch(QURAN_DATA_URL);
                allSurahsData = await response.json();
                buildSurahList(allSurahsData);
            }

            const savedSurah = loadLastRead();
            currentSurahNumber = surahNumber || savedSurah || 1; 

            const currentSurah = allSurahsData.find(s => s.number === currentSurahNumber);

            if (!currentSurah) {
                quranDisplay.innerHTML = '<p>تعذر العثور على السورة المطلوبة.</p>';
                return;
            }

            surahSelector.value = currentSurahNumber;
            
            surahTitleElement.innerHTML = `<h2>سورة ${currentSurah.name_ar}</h2><p class="revelation-info">${currentSurah.revelation_type}</p>`;
            
            let versesHTML = '';
            currentSurah.verses.forEach(verse => {
                // نستخدم التفسير الأول الموجود في المصدر كافتراضي
                const verseTafseer = Array.isArray(verse.tafseer) ? verse.tafseer[0].text : (verse.tafseer || 'التفسير غير متوفر في هذا المصدر.');
                const verseAudio = verse.audio_url || '';

                versesHTML += `
                    <p class="verse-text" 
                       data-tafseer="${verseTafseer}" 
                       data-audio="${verseAudio}" 
                       data-surah="${currentSurah.number}"
                       data-id="${verse.id}">
                        ${verse.text} ﴿${verse.id}﴾
                    </p>
                `;
            });
            quranDisplay.innerHTML = versesHTML;
            
            addVerseInteractionListeners(currentSurah.number);
            displayInsightCard(currentSurah); // عرض بطاقة المفاهيم
            
        } catch (error) {
            console.error('فشل في جلب بيانات القرآن من الرابط:', error);
            quranDisplay.innerHTML = '<p style="color:red;">**⚠️ فشل في تحميل المصحف الشريف. تأكد من أن رابط المستودع الخارجي يعمل وهيكل البيانات صحيح. ⚠️**</p>';
        }
    }
    
    // دالة التفاعل: النقر على الآية
    function addVerseInteractionListeners(surahNumber) {
        document.querySelectorAll('.verse-text').forEach(verseElement => {
            verseElement.addEventListener('click', () => {
                const tafseer = verseElement.getAttribute('data-tafseer');
                const audioUrl = verseElement.getAttribute('data-audio');
                const verseId = verseElement.getAttribute('data-id');
                
                // 1. عرض التفسير
                tafseerTitle.textContent = `تفسير الآية رقم ${verseId} من سورة ${allSurahsData.find(s => s.number === surahNumber).name_ar}`;
                tafseerContent.textContent = tafseer;
                tafseerPopup.style.display = 'block';

                // 2. تشغيل التلاوة
                if (audioUrl) {
                    quranAudio.src = audioUrl;
                    quranAudio.play();
                    audioPlayerContainer.style.display = 'block';
                } else {
                    quranAudio.pause();
                    audioPlayerContainer.style.display = 'none';
                }

                // 3. حفظ الموضع الحالي وتسليط الضوء
                saveLastRead(surahNumber);
                document.querySelectorAll('.verse-text').forEach(el => el.classList.remove('active-playing'));
                verseElement.classList.add('active-playing');
                
                // 4. تسجيل قراءة الآية هنا!
                recordAyahRead(); 
            });
        });
    }

    // إغلاق النافذة المنبثقة عند الضغط على زر الإغلاق أو خارج النافذة
    if (tafseerPopup) {
        closePopupBtn.addEventListener('click', () => {
            tafseerPopup.style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target === tafseerPopup) {
                tafseerPopup.style.display = 'none';
            }
        });
    }

    // =========================================================
    // 4. نظام تتبع الإنجازات (الورد اليومي)
    // =========================================================

    function updateProgress(newAyahCount) {
        const readAyahCount = newAyahCount;
        const percentage = Math.min(100, (readAyahCount / DAILY_TARGET_AYAH) * 100);
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `تم قراءة ${readAyahCount} آية (${Math.round(percentage)}%)`;

        if (percentage >= 100) {
            completeDailyBtn.disabled = false;
            completeDailyBtn.textContent = 'أنجزت ورد اليوم! اضغط للتأكيد';
        } else {
            completeDailyBtn.disabled = true;
            completeDailyBtn.textContent = 'إتمام ورد اليوم';
        }
    }
    
    function recordAyahRead() {
        const todayKey = new Date().toDateString();
        let dailyReads = JSON.parse(localStorage.getItem('dailyReads')) || {};

        if (dailyReads.date !== todayKey) {
            dailyReads = { date: todayKey, count: 0, completed: false };
        }

        if (!dailyReads.completed) {
            dailyReads.count++;
            localStorage.setItem('dailyReads', JSON.stringify(dailyReads));
            updateProgress(dailyReads.count);
        }
    }

    // ربط زر "إتمام الورد"
    completeDailyBtn.addEventListener('click', () => {
        let dailyReads = JSON.parse(localStorage.getItem('dailyReads')) || {};
        dailyReads.completed = true;
        localStorage.setItem('dailyReads', JSON.stringify(dailyReads));

        completeDailyBtn.disabled = true;
        completeDailyBtn.textContent = '✅ تم إنجاز ورد اليوم';
        showAchievement('أكملت قراءة وردك اليومي بنجاح! أسأل الله أن يتقبل منك.');
    });

    function showAchievement(message) {
        achievementMessage.textContent = message;
        achievementBadge.style.display = 'block';
        setTimeout(() => {
            achievementBadge.style.display = 'none';
        }, 5000);
    }
    
    // تحميل حالة التقدم عند بدء تشغيل التطبيق
    const todayKey = new Date().toDateString();
    let initialReads = JSON.parse(localStorage.getItem('dailyReads')) || { date: '', count: 0, completed: false };
    if (initialReads.date === todayKey) {
        updateProgress(initialReads.count);
        if (initialReads.completed) {
            completeDailyBtn.disabled = true;
            completeDailyBtn.textContent = '✅ تم إنجاز ورد اليوم';
        }
    } else {
        localStorage.removeItem('dailyReads'); 
        updateProgress(0);
    }
    
    // =========================================================
    // 5. بطاقة المفاهيم (Insight Cards)
    // =========================================================
    
    function displayInsightCard(surah) {
        const insightContainer = document.getElementById('insight-card-container');
        
        // سنفترض وجود حقل 'summary_insight' في بيانات السورة 
        const insightText = surah.summary_insight || `لا يتوفر ملخص مفاهيم لسورة ${surah.name_ar} في هذا المصدر.`;

        insightContainer.innerHTML = `
            <div class="insight-card">
                <h3>💎 دروس مستفادة من سورة ${surah.name_ar}</h3>
                <p>${insightText}</p>
            </div>
        `;
    }

    // تشغيل دالة تحميل القرآن
    loadQuran();
});

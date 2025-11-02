document.addEventListener('DOMContentLoaded', () => {

    // العناصر الأساسية
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const quranDisplay = document.getElementById('quran-verses');
    const surahTitleElement = document.getElementById('surah-title');
    const quranAudio = document.getElementById('quran-audio');
    const audioPlayerContainer = document.getElementById('audio-player-container');
    const hadithTextElement = document.getElementById('hadith-text');
    
    let allSurahsData = []; // لتخزين بيانات القرآن كاملاً
    let currentSurahNumber = 1; // السورة الحالية المعروضة

    // =========================================================
    // 1. تفعيل الوضع الليلي (Dark Mode) وحفظ التفضيل
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
    // 2. عرض الحديث النبوي اليومي (من 50 حديثاً)
    // =========================================================
    const HADITH_COUNT = 50; 
    
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
            hadithTextElement.textContent = 'تعذر تحميل حديث اليوم.';
        }
    }
    displayDailyHadith();
    

    // =========================================================
    // 3. إدارة القرآن والتفاعل (عرض، تفسير، تلاوة)
    // =========================================================

    // دالة عرض القرآن الرئيسية
    async function loadQuran(surahNumber = null) {
        try {
            // جلب بيانات القرآن مرة واحدة
            if (allSurahsData.length === 0) {
                const response = await fetch('data/quran.json');
                allSurahsData = await response.json();
                buildSurahList(allSurahsData); // بناء قائمة التنقل بعد التحميل
            }

            // تحديد السورة المراد عرضها
            const savedSurah = loadLastRead();
            currentSurahNumber = surahNumber || savedSurah || 1; 

            const currentSurah = allSurahsData.find(s => s.number === currentSurahNumber);

            if (!currentSurah) {
                quranDisplay.innerHTML = '<p>تعذر العثور على السورة المطلوبة.</p>';
                return;
            }

            // عرض اسم السورة
            surahTitleElement.innerHTML = `<h2>سورة ${currentSurah.name_ar}</h2><p class="revelation-info">${currentSurah.revelation_type}</p>`;
            
            // بناء الآيات
            let versesHTML = '';
            currentSurah.verses.forEach(verse => {
                versesHTML += `
                    <p class="verse-text" 
                       data-tafseer="${verse.tafseer}" 
                       data-audio="${verse.audio_url}" 
                       data-surah="${currentSurah.number}"
                       data-id="${verse.id}">
                        ${verse.text} ﴿${verse.id}﴾
                    </p>
                `;
            });
            quranDisplay.innerHTML = versesHTML;
            
            addVerseInteractionListeners(currentSurah.number);
            
        } catch (error) {
            console.error('فشل في جلب بيانات القرآن:', error);
            quranDisplay.innerHTML = '<p>تعذر تحميل المصحف الشريف. تأكد من وجود ملف quran.json في مجلد data/.</p>';
        }
    }


    // دالة التفاعل: النقر على الآية
    function addVerseInteractionListeners(surahNumber) {
        document.querySelectorAll('.verse-text').forEach(verseElement => {
            verseElement.addEventListener('click', () => {
                const tafseer = verseElement.getAttribute('data-tafseer');
                const audioUrl = verseElement.getAttribute('data-audio');
                const verseId = verseElement.getAttribute('data-id');
                
                // 1. عرض التفسير (تتطلب إعادة تعريف عناصر النافذة المنبثقة هنا أو جعلها عامة)
                const tafseerPopup = document.getElementById('tafseer-popup');
                const tafseerContent = tafseerPopup.querySelector('#tafseer-content');
                const tafseerTitle = tafseerPopup.querySelector('#tafseer-title');
                
                tafseerTitle.textContent = `تفسير الآية رقم ${verseId} من سورة ${allSurahsData.find(s => s.number === surahNumber).name_ar}`;
                tafseerContent.textContent = tafseer || 'لا يوجد تفسير متوفر لهذه الآية.';
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

                // 3. حفظ الموضع الحالي
                saveLastRead(surahNumber);
                
                // تسليط الضوء
                document.querySelectorAll('.verse-text').forEach(el => el.classList.remove('active-playing'));
                verseElement.classList.add('active-playing');
            });
        });
        
        // إغلاق النافذة المنبثقة (يجب أن يكون في DOMContentLoaded لكن نكرره لضمان الربط)
        const closePopupBtn = document.getElementById('tafseer-popup').querySelector('.close-btn');
        closePopupBtn.addEventListener('click', () => {
            document.getElementById('tafseer-popup').style.display = 'none';
        });
    }


    // =========================================================
    // 4. ميزة حفظ الموضع والقراءة الليلية
    // =========================================================

    function saveLastRead(surahNumber) {
        localStorage.setItem('lastReadSurah', surahNumber);
    }

    function loadLastRead() {
        return parseInt(localStorage.getItem('lastReadSurah')) || 1;
    }


    // =========================================================
    // 5. بناء قائمة التنقل بين السور (يجب إضافة عنصر HTML لها أولاً)
    // =========================================================

    function buildSurahList(surahs) {
        // نستخدم نافذة منبثقة بسيطة لعرض قائمة السور
        const settingsBtn = document.getElementById('settings-btn');
        settingsBtn.addEventListener('click', () => {
            alert('ستظهر قائمة السور هنا في تحديث لاحق...'); //Placeholder
        });
        
        // **ملاحظة:** ستحتاج إلى إضافة عنصر HTML لقائمة السور (مثل <select> أو popup قائمة)
        // في ملف index.html في خطوة لاحقة، حالياً نركز على المنطق.

        // المنطق: عند اختيار سورة من القائمة، يتم استدعاء loadQuran(رقم السورة)
    }

    // تشغيل دالة تحميل القرآن
    loadQuran();
});

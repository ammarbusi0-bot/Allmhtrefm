document.addEventListener('DOMContentLoaded', () => {

    // 🔗 رابط مستودع GitHub الخارجي لبيانات القرآن (تم تعديله بناءً على طلبك)
    const QURAN_DATA_URL = 'https://raw.githubusercontent.com/rn0x/Quran-Json/main/Quran.json';
    const HADITH_COUNT = 50; 
    
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
    // 2. عرض الحديث النبوي اليومي (من 50 حديثاً)
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
            hadithTextElement.textContent = 'تعذر تحميل حديث اليوم.';
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

            // تحديد السورة المراد عرضها
            const savedSurah = loadLastRead();
            currentSurahNumber = surahNumber || savedSurah || 1; 

            const currentSurah = allSurahsData.find(s => s.number === currentSurahNumber);

            if (!currentSurah) {
                quranDisplay.innerHTML = '<p>تعذر العثور على السورة المطلوبة.</p>';
                return;
            }

            // تحديث القيمة المختارة في القائمة
            surahSelector.value = currentSurahNumber;
            
            // عرض اسم السورة
            surahTitleElement.innerHTML = `<h2>سورة ${currentSurah.name_ar}</h2><p class="revelation-info">${currentSurah.revelation_type}</p>`;
            
            // بناء الآيات (نفترض أن الآيات موجودة في مصفوفة verses داخل كل سورة)
            let versesHTML = '';
            currentSurah.verses.forEach(verse => {
                // يجب أن تكون بيانات tafseer و audio_url موجودة في ملف quran.json
                versesHTML += `
                    <p class="verse-text" 
                       data-tafseer="${verse.tafseer || 'التفسير غير متوفر في هذا المصدر.'}" 
                       data-audio="${verse.audio_url || ''}" 
                       data-surah="${currentSurah.number}"
                       data-id="${verse.id}">
                        ${verse.text} ﴿${verse.id}﴾
                    </p>
                `;
            });
            quranDisplay.innerHTML = versesHTML;
            
            addVerseInteractionListeners(currentSurah.number);
            
        } catch (error) {
            console.error('فشل في جلب بيانات القرآن من الرابط:', error);
            quranDisplay.innerHTML = '<p style="color:red;">**⚠️ فشل في تحميل المصحف الشريف من الرابط الخارجي. يرجى التأكد من أن الرابط (QURAN_DATA_URL) صحيح وأن الملف بصيغة JSON موحدة. ⚠️**</p>';
        }
    }

    // دالة التفاعل: النقر على الآية يعرض التفسير ويشغل التلاوة
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
                    alert('عذراً، لا يوجد رابط تلاوة لهذه الآية في ملف البيانات.');
                }

                // 3. حفظ الموضع الحالي وتسليط الضوء
                saveLastRead(surahNumber);
                document.querySelectorAll('.verse-text').forEach(el => el.classList.remove('active-playing'));
                verseElement.classList.add('active-playing');
            });
        });
    }

    // إغلاق النافذة المنبثقة عند الضغط خارجها
    if (tafseerPopup) {
        window.addEventListener('click', (event) => {
            if (event.target === tafseerPopup) {
                tafseerPopup.style.display = 'none';
            }
        });
    }

    // تشغيل دالة تحميل القرآن
    loadQuran();
});

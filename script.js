document.addEventListener('DOMContentLoaded', () => {
    // ... (اختصار للعناصر الأساسية) ...
    const surahsListContainer = document.getElementById('surahs-list');
    const loadingScreen = document.getElementById('loading-screen');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const revelationFilter = document.getElementById('revelation-filter');
    const sortFilter = document.getElementById('sort-filter');
    const totalAyahs = document.getElementById('total-ayahs');
    const surahModal = document.getElementById('surah-modal');
    const closeModal = document.querySelector('.close');
    const bookmarkBtn = document.getElementById('bookmark-btn');
    const goToLastReadBtn = document.getElementById('go-to-last-read');
    const markSurahMemorizedBtn = document.getElementById('mark-surah-memorized-btn');
    const nextPrayerSpan = document.getElementById('next-prayer');
    const calcMethodSpan = document.getElementById('calc-method');
    const autoLocationSpan = document.getElementById('auto-location');
    const locationNameSpan = document.getElementById('location-name');
    const lastReadLocation = document.getElementById('last-read-location');
    const memorizationBar = document.getElementById('memorization-bar');
    const memorizationStatus = document.getElementById('memorization-status');
    const totalMemorizedSurahsSpan = document.getElementById('total-memorized-surahs');
    const meccanRatioSpan = document.getElementById('meccan-ratio');
    const medinanRatioSpan = document.getElementById('medinan-ratio');
    const modalSurahName = document.getElementById('modal-surah-name');
    const modalSurahInfo = document.getElementById('modal-surah-info');
    const ayahsContainer = document.getElementById('ayahs-container');
    const filteredCount = document.getElementById('filtered-count');


    // المتغيرات العامة
    let allSurahs = [];
    let filteredSurahs = [];
    let currentTheme = localStorage.getItem('theme') || 'light';
    let currentSurah = null; 
    let memorizedAyahs = JSON.parse(localStorage.getItem('memorizedAyahs')) || {}; 
    const TOTAL_AYAHS_QURAN = 6236; 

    // روابط الـ API
    // الرابط المُؤمَّن للقرآن
    const QURAN_JSON_URL = 'https://unpkg.com/quran-json@1.0.1/json/quran.json'; 
    
    // تم تغيير الروابط إلى HTTPS لضمان عدم الحظر
    const GEOLOCATION_API_URL = 'https://ip-api.com/json/'; 
    const PRAYER_API_BASE = 'https://api.aladhan.com/v1/timings/today'; 
    const PRAYER_CALC_METHOD = 3; 

    // === وظائف التهيئة ===
    function initApp() {
        applyTheme(currentTheme);
        setupEventListeners();
        fetchQuranData();
    }

    function setupEventListeners() {
        themeToggle.addEventListener('click', toggleTheme);
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', toggleBackToTopButton);
        searchInput.addEventListener('input', handleSearch);
        clearSearchBtn.addEventListener('click', clearSearch);
        revelationFilter.addEventListener('change', filterSurahs);
        sortFilter.addEventListener('change', sortSurahs);
        closeModal.addEventListener('click', () => { surahModal.style.display = 'none'; });
        window.addEventListener('click', (e) => { if (e.target === surahModal) { surahModal.style.display = 'none'; } });
        bookmarkBtn.addEventListener('click', handleBookmark);
        markSurahMemorizedBtn.addEventListener('click', markSurahMemorized);
        goToLastReadBtn.addEventListener('click', goToLastRead);
    }

    // === جلب البيانات وعرضها ===
    async function fetchQuranData() {
        try {
            const response = await fetch(QURAN_JSON_URL);
            if (!response.ok) { throw new Error('فشل في جلب بيانات القرآن (HTTP Status ' + response.status + ')'); }
            
            const data = await response.json();
            allSurahs = data;
            
            filteredSurahs = [...allSurahs];
            
            updateStatistics();
            updateProgressTracking();
            renderSurahs();
            await fetchPrayerTimes(); // انتظار اكتمال جلب أوقات الصلاة قبل إخفاء شاشة التحميل

            // إخفاء شاشة التحميل بعد اكتمال كل شيء
            setTimeout(() => { loadingScreen.classList.add('fade-out'); }, 500);
            
        } catch (error) {
            console.error('حدث خطأ فادح في تحميل البيانات:', error);
            surahsListContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: red; font-size: 1.2em;">❌ فشل تحميل المصحف الأساسي. (Error: ${error.message})<br> قد تكون مشكلة في الإنترنت أو أن رابط البيانات غير متاح مؤقتاً.</p>
                </div>
            `;
            // إخفاء شاشة التحميل للسماح برؤية رسالة الخطأ
            setTimeout(() => { loadingScreen.classList.add('fade-out'); }, 500);
        }
    }
    
    // ... (بقية وظائف renderSurahs, handleSearch, filterSurahs, sortSurahs, applyCurrentSort) ...
    function renderSurahs() {
        surahsListContainer.innerHTML = '';
        if (filteredSurahs.length === 0) {
            surahsListContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p style="font-size: 1.2em;">لم يتم العثور على سور تطابق معايير البحث.</p></div>`;
            filteredCount.textContent = `0 سورة معروضة`;
            return;
        }
        
        filteredSurahs.forEach(surah => {
            const isMemorized = isSurahMemorized(surah.number);
            const card = document.createElement('div');
            card.className = 'surah-card' + (isMemorized ? ' memorized-surah' : '');
            card.innerHTML = `
                <div class="surah-number">${surah.number}</div>
                <h2>${surah.name}</h2>
                <p class="surah-english">${surah.englishName} (${surah.englishNameTranslation})</p>
                <div class="details">
                    <p>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                    <p>${surah.numberOfAyahs} آية</p>
                </div>
            `;
            card.addEventListener('click', () => showSurahDetails(surah));
            surahsListContainer.appendChild(card);
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        filterSurahs(query);
    }
    
    function clearSearch() {
        searchInput.value = '';
        filterSurahs('');
    }

    function filterSurahs(query = searchInput.value.trim().toLowerCase()) {
        const revelation = revelationFilter.value;
        filteredSurahs = allSurahs.filter(surah => {
            const matchesQuery = surah.name.toLowerCase().includes(query) || 
                                 surah.englishName.toLowerCase().includes(query) || 
                                 surah.englishNameTranslation.toLowerCase().includes(query);
            const matchesRevelation = revelation === 'all' || surah.revelationType === revelation;
            return matchesQuery && matchesRevelation;
        });
        applyCurrentSort();
    }

    function sortSurahs() {
        applyCurrentSort();
    }
    
    function applyCurrentSort() {
        const sortBy = sortFilter.value;
        filteredSurahs.sort((a, b) => {
            if (sortBy === 'number') return a.number - b.number;
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
            if (sortBy === 'ayahs') return b.numberOfAyahs - a.numberOfAyahs; 
            return 0;
        });
        renderSurahs();
    }

    // === وظيفة أوقات الصلاة (تم التأمين) ===
    async function fetchPrayerTimes() {
        try {
            autoLocationSpan.textContent = 'جاري تحديد موقع الـ IP...';
            const locationResponse = await fetch(GEOLOCATION_API_URL);
            const locationData = await locationResponse.json();

            if (locationData.status !== 'success') { throw new Error('فشل تحديد الموقع التلقائي.'); }

            const lat = locationData.lat;
            const lon = locationData.lon;
            const city = locationData.city || 'غير محدد';
            const country = locationData.country || '';
            
            autoLocationSpan.textContent = `${city}, ${country}`;
            locationNameSpan.textContent = `في ${city}`;
            calcMethodSpan.textContent = 'رابطة العالم الإسلامي (تلقائي)';
            
            const PRAYER_URL = `${PRAYER_API_BASE}?latitude=${lat}&longitude=${lon}&method=${PRAYER_CALC_METHOD}`;
            
            const prayerResponse = await fetch(PRAYER_URL);
            const prayerData = await prayerResponse.json();
            
            if (prayerData.code !== 200) { throw new Error('فشل جلب أوقات الصلاة من API.'); }

            renderPrayerTimes(prayerData.data.timings);

        } catch (error) {
            console.error('فشل في جلب الموقع أو مواقيت الصلاة (سيتم استخدام مكة):', error);
            autoLocationSpan.textContent = `فشل التحديد. (سيتم استخدام موقع بديل)`;
            fetchPrayerTimesFallback(); 
        }
    }

    async function fetchPrayerTimesFallback() {
         const FALLBACK_URL = `${PRAYER_API_BASE}?city=Makkah&country=Saudi%20Arabia&method=${PRAYER_CALC_METHOD}`;
         const response = await fetch(FALLBACK_URL);
         const data = await response.json();
         if (data.code === 200) {
             renderPrayerTimes(data.data.timings);
             locationNameSpan.textContent = 'في مكة المكرمة (افتراضي)';
             calcMethodSpan.textContent = 'رابطة العالم الإسلامي (افتراضي)';
             autoLocationSpan.textContent = 'تم استخدام موقع بديل';
         }
    }
    
    function renderPrayerTimes(timings) {
        const prayerTimesContainer = document.getElementById('prayer-times-container');
        prayerTimesContainer.innerHTML = '';
        const prayerNames = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
        const now = new Date();
        let nextPrayer = { name: null, time: null, diff: Infinity };
        const cardsData = []; 

        Object.keys(prayerNames).forEach(key => {
            if (key === 'Sunrise') return;

            const timeString = timings[key];
            const [hours, minutes] = timeString.split(':').map(Number);
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);

            let timeDiff = prayerDate.getTime() - now.getTime();
            
            if (timeDiff < 0) {
                timeDiff += 24 * 60 * 60 * 1000;
            }

            cardsData.push({ key, name: prayerNames[key], time: timeString, diff: timeDiff });
        });
        
        nextPrayer = cardsData.reduce((prev, current) => (current.diff < prev.diff ? current : prev), nextPrayer);

        cardsData.forEach(data => {
            const isNext = data.key === nextPrayer.key;
            const card = document.createElement('div');
            card.className = 'prayer-time-card' + (isNext ? ' next-prayer' : '');
            card.innerHTML = `<div class="prayer-name">${data.name}</div><div class="prayer-time">${data.time}</div>`;
            prayerTimesContainer.appendChild(card);
        });
        
        if (nextPrayer.name) {
            nextPrayerSpan.textContent = `الصلاة القادمة: ${nextPrayer.name} في تمام ${nextPrayer.time}`;
        } else {
             nextPrayerSpan.textContent = `لم يتم تحديد الصلاة القادمة بعد.`;
        }
    }

    // ... (بقية وظائف تتبع الحفظ والعمليات) ...
    function updateProgressTracking() {
        const lastRead = JSON.parse(localStorage.getItem('lastRead')) || null;
        let totalMemorized = 0;
        let memorizedMeccan = 0;
        let memorizedMedinan = 0;
        let totalMemorizedSurahs = 0;

        if (allSurahs.length > 0) {
            allSurahs.forEach(surah => {
                const memorizedCount = memorizedAyahs[surah.number] ? memorizedAyahs[surah.number].length : 0;
                totalMemorized += memorizedCount;
                
                const isFull = isSurahMemorized(surah.number);
                if (isFull) {
                    totalMemorizedSurahs++;
                    if (surah.revelationType === 'Meccan') {
                        memorizedMeccan++;
                    } else if (surah.revelationType === 'Medinan') {
                        memorizedMedinan++;
                    }
                }
            });
        }

        if (lastRead) {
            const surah = allSurahs.find(s => s.number === lastRead.surahNumber);
            lastReadLocation.innerHTML = `<strong>سورة ${surah ? surah.name : lastRead.surahNumber}، الآية ${lastRead.ayahNumber}</strong>`;
            goToLastReadBtn.style.display = 'inline-flex';
        } else {
            lastReadLocation.textContent = 'لم تبدأ القراءة بعد.';
            goToLastReadBtn.style.display = 'none';
        }

        const percentage = TOTAL_AYAHS_QURAN > 0 ? ((totalMemorized / TOTAL_AYAHS_QURAN) * 100).toFixed(2) : 0;
        memorizationBar.style.width = `${percentage}%`;
        memorizationStatus.textContent = `${percentage}% من المصحف محفوظ (${totalMemorized.toLocaleString()} آية)`;

        totalMemorizedSurahsSpan.textContent = totalMemorizedSurahs;
        
        const totalMemorizedRev = memorizedMeccan + memorizedMedinan;
        if (totalMemorizedRev > 0) {
            const meccanPercentage = ((memorizedMeccan / totalMemorizedRev) * 100).toFixed(0);
            const medinanPercentage = ((memorizedMedinan / totalMemorizedRev) * 100).toFixed(0);
            meccanRatioSpan.textContent = `${meccanPercentage}% (${memorizedMeccan})`;
            medinanRatioSpan.textContent = `${medinanPercentage}% (${memorizedMedinan})`;
        } else {
             meccanRatioSpan.textContent = '0%';
             medinanRatioSpan.textContent = '0%';
        }
    }
    
    function goToLastRead() {
        const lastRead = JSON.parse(localStorage.getItem('lastRead'));
        if (lastRead) {
            const surah = allSurahs.find(s => s.number === lastRead.surahNumber);
            if (surah) {
                showSurahDetails(surah);
                setTimeout(() => {
                    const ayahElement = document.getElementById(`ayah-${lastRead.ayahNumber}`);
                    if (ayahElement) {
                        ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        ayahElement.style.border = '4px dashed var(--gold-color)';
                        setTimeout(() => ayahElement.style.border = '4px solid var(--accent-color)', 3000);
                    }
                }, 350);
            }
        }
    }

    function showSurahDetails(surah) {
        currentSurah = surah;
        modalSurahName.textContent = `${surah.number}. ${surah.name}`;
        modalSurahInfo.innerHTML = `<p>${surah.englishName} - ${surah.englishNameTranslation}</p><p>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surah.numberOfAyahs} آية</p>`;
        
        ayahsContainer.innerHTML = '';
        surah.ayahs.forEach(ayah => {
            const isMemorized = isAyahMemorized(surah.number, ayah.numberInSurah);
            const ayahElement = document.createElement('div');
            ayahElement.className = 'ayah';
            ayahElement.id = `ayah-${ayah.numberInSurah}`;

            const ayahText = document.createElement('p');
            ayahText.className = 'ayah-text';
            ayahText.innerHTML = `<span class="ayah-number">${ayah.numberInSurah}</span> ${ayah.text}`;
            ayahElement.appendChild(ayahText);

            const memorizeBtn = document.createElement('button');
            memorizeBtn.className = 'memorize-btn';
            memorizeBtn.textContent = isMemorized ? '✔ محفوظ' : 'حفظ';
            memorizeBtn.classList.toggle('memorized', isMemorized);
            memorizeBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleAyahMemorization(surah.number, ayah.numberInSurah, memorizeBtn); });
            ayahElement.appendChild(memorizeBtn);

            ayahElement.addEventListener('click', () => saveLastRead(surah.number, ayah.numberInSurah));

            ayahsContainer.appendChild(ayahElement);
        });
        
        updateSurahMemorizedBtn(surah.number);
        surahModal.style.display = 'block';
    }

    function saveLastRead(surahNumber, ayahNumber) {
        const lastRead = { surahNumber, ayahNumber };
        localStorage.setItem('lastRead', JSON.stringify(lastRead));
        updateProgressTracking();
    }
    
    function isAyahMemorized(surahNumber, ayahNumber) {
        return memorizedAyahs[surahNumber] && memorizedAyahs[surahNumber].includes(ayahNumber);
    }

    function isSurahMemorized(surahNumber) {
        const surah = allSurahs.find(s => s.number === surahNumber);
        if (!surah) return false;
        const totalAyahs = surah.numberOfAyahs;
        const memorizedCount = memorizedAyahs[surahNumber] ? memorizedAyahs[surahNumber].length : 0;
        return totalAyahs > 0 && totalAyahs === memorizedCount;
    }
    
    function toggleAyahMemorization(surahNumber, ayahNumber, button) {
        if (!memorizedAyahs[surahNumber]) { memorizedAyahs[surahNumber] = []; }

        const index = memorizedAyahs[surahNumber].indexOf(ayahNumber);
        if (index > -1) {
            memorizedAyahs[surahNumber].splice(index, 1);
            button.textContent = 'حفظ';
            button.classList.remove('memorized');
        } else {
            memorizedAyahs[surahNumber].push(ayahNumber);
            button.textContent = '✔ محفوظ';
            button.classList.add('memorized');
        }
        
        localStorage.setItem('memorizedAyahs', JSON.stringify(memorizedAyahs));
        updateProgressTracking();
        updateSurahMemorizedBtn(surahNumber);
    }
    
    function updateSurahMemorizedBtn(surahNumber) {
        const isFull = isSurahMemorized(surahNumber);
        if (isFull) {
            markSurahMemorizedBtn.textContent = '✅ السورة محفوظة بالكامل';
            markSurahMemorizedBtn.style.backgroundColor = 'var(--gold-color)';
        } else {
            markSurahMemorizedBtn.textContent = '✅ تم حفظ السورة كاملة';
            markSurahMemorizedBtn.style.backgroundColor = 'var(--primary-color)';
        }
    }

    function markSurahMemorized() {
        if (!currentSurah) return;
        const surahNumber = currentSurah.number;
        const isFull = isSurahMemorized(surahNumber);
        
        if (isFull) {
            delete memorizedAyahs[surahNumber];
        } else {
            memorizedAyahs[surahNumber] = currentSurah.ayahs.map(a => a.numberInSurah);
        }
        
        localStorage.setItem('memorizedAyahs', JSON.stringify(memorizedAyahs));
        showSurahDetails(currentSurah);
        updateProgressTracking();
        renderSurahs();
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    function handleBookmark() { 
        alert(`تم وضع إشارة على سورة ${modalSurahName.textContent.split('. ')[1]}`); 
    }
    function updateStatistics() {
        let total = 0;
        allSurahs.forEach(surah => { total += surah.numberOfAyahs; });
        if (totalAyahs) totalAyahs.textContent = total.toLocaleString();
    }

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) { backToTopBtn.classList.add('show'); } else { backToTopBtn.classList.remove('show'); }
    }

    function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    
    // تشغيل التطبيق
    initApp();
});

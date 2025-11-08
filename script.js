document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
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
    const modalSurahName = document.getElementById('modal-surah-name');
    const modalSurahInfo = document.getElementById('modal-surah-info');
    const ayahsContainer = document.getElementById('ayahs-container');
    const filteredCount = document.getElementById('filtered-count');

    // المتغيرات العامة
    let allSurahs = [];
    let filteredSurahs = [];
    let currentTheme = localStorage.getItem('theme') || 'light';

    // روابط الـ API
    const QURAN_API_URL = 'https://api.alquran.cloud/v1/meta';
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
        window.addEventListener('click', (e) => { 
            if (e.target === surahModal) { 
                surahModal.style.display = 'none'; 
            } 
        });
    }

    // === جلب البيانات وعرضها ===
    async function fetchQuranData() {
        try {
            const response = await fetch(QURAN_API_URL);
            if (!response.ok) { 
                throw new Error('فشل في جلب بيانات القرآن'); 
            }
            
            const data = await response.json();
            allSurahs = data.data.surahs.references.map(s => ({
                number: s.number,
                name: s.name,
                englishName: s.englishName,
                englishNameTranslation: s.englishNameTranslation,
                revelationType: s.revelationType,
                numberOfAyahs: s.numberOfAyahs
            }));
            
            filteredSurahs = [...allSurahs];
            
            updateStatistics();
            renderSurahs();
            await requestUserLocationAndPrayerTimes();

            setTimeout(() => { 
                loadingScreen.classList.add('fade-out'); 
            }, 500);
            
        } catch (error) {
            console.error('حدث خطأ في تحميل البيانات:', error);
            surahsListContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: red; font-size: 1.2em;">
                        ❌ فشل تحميل المصحف الأساسي.<br> 
                        يرجى التحقق من الاتصال بالإنترنت.
                    </p>
                </div>
            `;
            setTimeout(() => { 
                loadingScreen.classList.add('fade-out'); 
            }, 500);
        }
    }

    function renderSurahs() {
        surahsListContainer.innerHTML = '';
        
        if (filteredSurahs.length === 0) {
            surahsListContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="font-size: 1.2em;">لم يتم العثور على سور تطابق معايير البحث.</p>
                </div>
            `;
            filteredCount.textContent = `0 سورة معروضة`;
            return;
        }
        
        filteredSurahs.forEach((surah, index) => {
            const card = document.createElement('div');
            card.className = 'surah-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="surah-number">${surah.number}</div>
                <h2>${surah.name}</h2>
                <p class="surah-english">${surah.englishName}</p>
                <div class="details">
                    <p>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                    <p>${surah.numberOfAyahs} آية</p>
                </div>
            `;
            
            card.addEventListener('click', () => showSurahDetails(surah));
            surahsListContainer.appendChild(card);
        });
        
        filteredCount.textContent = `${filteredSurahs.length} سورة معروضة`;
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

    // === ميزة: طلب الموقع وأوقات الصلاة ===
    async function requestUserLocationAndPrayerTimes() {
        const autoLocationSpan = document.getElementById('auto-location');
        const locationNameSpan = document.getElementById('location-name');
        
        autoLocationSpan.textContent = 'يُرجى السماح بتحديد الموقع...';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    autoLocationSpan.textContent = `تم تحديد الموقع`;
                    fetchPrayerTimes(lat, lon);
                },
                (error) => {
                    console.error('فشل طلب تحديد الموقع:', error);
                    autoLocationSpan.textContent = `تم رفض تحديد الموقع`;
                    fetchPrayerTimesFallback();
                },
                { timeout: 10000 }
            );
        } else {
            autoLocationSpan.textContent = `المتصفح لا يدعم تحديد الموقع`;
            fetchPrayerTimesFallback();
        }
    }
    
    async function fetchPrayerTimes(lat, lon) {
        try {
            const PRAYER_URL = `${PRAYER_API_BASE}?latitude=${lat}&longitude=${lon}&method=${PRAYER_CALC_METHOD}`;
            const prayerResponse = await fetch(PRAYER_URL);
            const prayerData = await prayerResponse.json();
            
            if (prayerData.code !== 200) { 
                throw new Error('فشل جلب أوقات الصلاة'); 
            }
            
            const city = prayerData.data.meta.timezone.split('/')[1] || 'موقعك';
            document.getElementById('location-name').textContent = `في ${city.replace('_', ' ')}`;

            renderPrayerTimes(prayerData.data.timings);

        } catch (error) {
            console.error('فشل في جلب مواقيت الصلاة:', error);
            document.getElementById('auto-location').textContent = `حدث خطأ في جلب الأوقات`;
            fetchPrayerTimesFallback();
        }
    }

    async function fetchPrayerTimesFallback() {
        const FALLBACK_URL = `${PRAYER_API_BASE}?city=Makkah&country=Saudi%20Arabia&method=${PRAYER_CALC_METHOD}`;
        const response = await fetch(FALLBACK_URL);
        const data = await response.json();
        
        if (data.code === 200) {
            renderPrayerTimes(data.data.timings);
            document.getElementById('location-name').textContent = 'في مكة المكرمة';
        }
    }
    
    function renderPrayerTimes(timings) {
        const prayerTimesContainer = document.getElementById('prayer-times-container');
        const nextPrayerSpan = document.getElementById('next-prayer');
        
        prayerTimesContainer.innerHTML = '';
        const prayerNames = { 
            Fajr: 'الفجر', 
            Dhuhr: 'الظهر', 
            Asr: 'العصر', 
            Maghrib: 'المغرب', 
            Isha: 'العشاء' 
        };
        
        const now = new Date();
        let nextPrayer = { name: null, time: null, diff: Infinity };
        const cardsData = [];

        Object.keys(prayerNames).forEach((key, index) => {
            const timeString = timings[key];
            const [hours, minutes] = timeString.split(':').map(Number);
            const prayerDate = new Date();
            prayerDate.setHours(hours, minutes, 0, 0);

            let timeDiff = prayerDate.getTime() - now.getTime();
            
            if (timeDiff < 0) {
                timeDiff += 24 * 60 * 60 * 1000;
            }

            cardsData.push({ 
                key, 
                name: prayerNames[key], 
                time: timeString, 
                diff: timeDiff,
                index 
            });
        });
        
        nextPrayer = cardsData.reduce((prev, current) => 
            (current.diff < prev.diff ? current : prev), nextPrayer
        );

        cardsData.forEach(data => {
            const isNext = data.key === nextPrayer.key;
            const card = document.createElement('div');
            card.className = 'prayer-time-card' + (isNext ? ' next-prayer' : '');
            card.style.animationDelay = `${data.index * 0.2}s`;
            
            card.innerHTML = `
                <div class="prayer-name">${data.name}</div>
                <div class="prayer-time">${data.time}</div>
            `;
            
            prayerTimesContainer.appendChild(card);
        });
        
        if (nextPrayer.name) {
            nextPrayerSpan.textContent = `الصلاة القادمة: ${nextPrayer.name} في ${nextPrayer.time}`;
        }
    }

    // === عرض تفاصيل السورة ===
    async function showSurahDetails(surah) {
        modalSurahName.textContent = `${surah.number}. ${surah.name}`;
        modalSurahInfo.innerHTML = `
            <p>${surah.englishName} - ${surah.englishNameTranslation}</p>
            <p>${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - ${surah.numberOfAyahs} آية</p>
        `;
        
        ayahsContainer.innerHTML = '<p style="text-align: center; padding: 20px; font-size: 1.2em;">جارٍ تحميل الآيات...</p>';

        try {
            const AYAH_API_URL = `https://api.alquran.cloud/v1/surah/${surah.number}/ar.uthmani`;
            const response = await fetch(AYAH_API_URL);
            const data = await response.json();
            const ayahs = data.data.ayahs;
            
            ayahsContainer.innerHTML = '';
            
            ayahs.forEach((ayah, index) => {
                const ayahElement = document.createElement('div');
                ayahElement.className = 'ayah';
                ayahElement.id = `ayah-${ayah.numberInSurah}`;
                ayahElement.style.animationDelay = `${index * 0.05}s`;
                
                ayahElement.innerHTML = `
                    <div class="ayah-text">
                        <span class="ayah-number">${ayah.numberInSurah}</span>
                        ${ayah.text}
                    </div>
                `;
                
                ayahsContainer.appendChild(ayahElement);
            });
            
        } catch (error) {
            ayahsContainer.innerHTML = `
                <p style="color: red; text-align: center; padding: 20px;">
                    ❌ فشل تحميل الآيات: ${error.message}
                </p>
            `;
        }
        
        surahModal.style.display = 'block';
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
    
    function updateStatistics() {
        let total = 0;
        allSurahs.forEach(surah => { 
            total += surah.numberOfAyahs; 
        });
        
        if (totalAyahs) {
            totalAyahs.textContent = total.toLocaleString();
        }
    }

    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) { 
            backToTopBtn.classList.add('show'); 
        } else { 
            backToTopBtn.classList.remove('show'); 
        }
    }

    function scrollToTop() { 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    
    // تشغيل التطبيق
    initApp();
});

// ====== ١. قاعدة بيانات الأذكار الموسعة (تم إضافة الصباح، النوم، بعد الصلاة، ومتفرقة) ======

const ALL_AZKAR_DATA = {
    // أذكار المساء (Azkar Al-Masaa): تم الإبقاء على ما تم استخلاصه مسبقاً من الموقع الأصلي
    masa: [
        // هنا يتم وضع أذكار المساء الـ 28 السابقة... (تم حذفها من العرض لتجنب التكرار وطول الإجابة، لكنها موجودة في ملفك)
        { id: 1, text: 'أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ. اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...', fadil: 'من قالها حين يمسى أجير من الجن حتى يصبح.', count: 1 },
        // ... إلى الذكر رقم 28 ...
        { id: 28, text: 'سُبْحـانَ اللهِ وَبِحَمْـدِهِ.', fadil: 'حُطَّتْ خَطَايَاهُ ...', count: 100 }
    ],

    // أذكار الصباح (Azkar As-Sabah):
    sabah: [
        { id: 1, text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...', fadil: 'ذكر الصباح الجامع.', count: 1 },
        { id: 2, text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.', fadil: 'ذكر الصباح.', count: 1 },
        { id: 3, text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ... (سيّد الاستغفار)', fadil: 'من قَالَهَا مِنَ النَّهَارِ مُوقِناً بِهَا ، فَمَاتَ مِنْ يَوْمِهِ قَبْلَ أَنْ يُمْسِيَ ، فَهُوَ مِنْ أَهْلِ الْجَنَّةِ.', count: 1 },
        { id: 4, text: 'رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالإِسْلَامِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.', fadil: 'من قالها حين يصبح كان حقاً على الله أن يرضيه يوم القيامة.', count: 3 },
        { id: 5, text: 'اللّهُـمَّ إِنِّـي أَصْبَحْـتُ أُشْـهِدُك... (حتى آخر الذكر)', fadil: 'من قالها أربع مرات أعتقه الله من النار.', count: 4 },
        { id: 6, text: 'اللّهُـمَّ ما أَصْبَـحَ بي مِـنْ نِعْـمَةٍ أَو بِأَحَـدٍ مِـنْ خَلْـقِك...', fadil: 'من قالها حين يصبح أدى شكر يومه.', count: 1 },
        { id: 7, text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ... (والمعوذتين)', fadil: 'كفت من كل شيء.', count: 3 },
        { id: 8, text: 'بِسـمِ اللهِ الذي لا يَضُـرُّ مَعَ اسمِـهِ شَيءٌ في الأرْضِ وَلا في السّمـاءِ...', fadil: 'لم يضره شيء.', count: 3 },
        { id: 9, text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ...', fadil: 'دعاء إصلاح الشأن.', count: 3 },
        { id: 10, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.', fadil: 'من قالها مائة مرة لم يأتِ أحد يوم القيامة بأفضل مما جاء به.', count: 100 },
    ],
    
    // أذكار النوم (Azkar An-Nawm):
    nawm: [
        { id: 1, text: 'يجمع كفيه ثم ينفث فيهما فيقرأ: قُلْ هُوَ اللَّهُ أَحَدٌ و قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ و قُلْ أَعُوذُ بِرَبِّ النَّاسِ. ثم يمسح بهما ما استطاع من جسده. (ثلاث مرات).', fadil: 'كان النبي صلى الله عليه وسلم يفعل ذلك عند النوم.', count: 3 },
        { id: 2, text: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ... (آخر البقرة).', fadil: 'من قرأهما في ليلة كفتاه.', count: 1 },
        { id: 3, text: 'بِاسْمِكَ رَبِّـي وَضَعْـتُ جَنْـبي، وَبِكَ أَرْفَعُـه... (حتى آخر الذكر).', fadil: 'ذكر النوم.', count: 1 },
        { id: 4, text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.', fadil: 'من قالها عند النوم ثلاث مرات.', count: 3 },
        { id: 5, text: 'الحَمْـدُ للهِ الذي أَطْعَمَنا وَسَقانا، وَكَفانا وَآوانا...', fadil: 'دعاء الحمد عند النوم.', count: 1 }
    ],

    // أذكار بعد الصلاة (Azkar Ba'da As-Salat):
    salat: [
        { id: 1, text: 'أَسْـتَغْفِرُ الله. (ثلاثاً)', fadil: 'بعد السلام من الصلاة.', count: 3 },
        { id: 2, text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.', fadil: 'ذِكر بعد التسليم.', count: 1 },
        { id: 3, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ... (إلى آخر الذكر).', fadil: 'ذِكر توحيد.', count: 1 },
        { id: 4, text: 'سُبْحَانَ اللَّهِ (33)، وَالْحَمْدُ لِلَّهِ (33)، وَاللَّهُ أَكْبَرُ (33)...', fadil: 'من قالها غُفرت خطاياه ولو كانت مثل زبد البحر.', count: 1 } // هنا العدد الإجمالي للثلاثة معاً 1 مرة
    ],
    
    // أذكار أخرى (متفرقة تشمل أذكار الآذان، دخول المنزل، إلخ)
    mutafarriqa: [
        { id: 1, text: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ.', fadil: 'دعاء بعد الأذان: تحل له شفاعة النبي ﷺ يوم القيامة.', count: 1 },
        { id: 2, text: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.', fadil: 'عند الخروج من المنزل: يُقال لك: هُدِيتَ، وكُفِيتَ، ووُقِيتَ.', count: 1 },
        { id: 3, text: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا.', fadil: 'عند دخول المنزل.', count: 1 },
        { id: 4, text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ.', fadil: 'دعاء الانتهاء من الطعام: غُفر له ما تقدم من ذنبه.', count: 1 }
    ]
};

// ================= ٢. الدوال البرمجية (مع التعديلات) ===================

const azkarContainer = document.getElementById('azkar-container');
const navButtons = document.querySelectorAll('.nav-button');
const body = document.body;
// تغيير مفتاح التخزين ليصبح شاملاً لجميع الأذكار
const AZKAR_STORAGE_KEY = 'azkar_counts_all'; 
const FONT_SIZE_KEY = 'font_size';
const THEME_KEY = 'theme_mode';
let currentCategory = 'masa'; // الفئة الافتراضية هي المساء

// ------------------------------------
// دالة عرض الأذكار (تم تعديلها لاستقبال الفئة)
// ------------------------------------
function loadAzkar(category) {
    azkarContainer.innerHTML = '';
    const storedCounts = JSON.parse(localStorage.getItem(AZKAR_STORAGE_KEY)) || {};
    const azkarList = ALL_AZKAR_DATA[category] || [];
    
    if (azkarList.length === 0) {
        azkarContainer.innerHTML = `<p class="loading-message">لا توجد أذكار في هذا القسم حالياً.</p>`;
        return;
    }

    azkarList.forEach(azkar => {
        // مفتاح التخزين أصبح مركباً (مثال: masa-1, sabah-2)
        const storageKey = `${category}-${azkar.id}`;
        const currentCount = storedCounts[storageKey] || 0;
        const isCompleted = currentCount >= azkar.count;

        const card = document.createElement('div');
        card.className = `azkar-card ${isCompleted ? 'completed' : ''}`;
        card.dataset.id = azkar.id;
        card.dataset.category = category;

        card.innerHTML = `
            <div class="azkar-number">${azkar.id}</div>
            <div class="azkar-text">${azkar.text}</div>
            ${azkar.fadil ? `<div class="azkar-fadil">**الـفـضـل**: ${azkar.fadil}</div>` : ''}
            
            <div class="count-section">
                <span class="required-count">العدد المطلوب: ${azkar.count}</span>
                <span class="current-count">تم التكرار: ${currentCount}</span>
                <button class="count-button" data-id="${azkar.id}" data-category="${category}" ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? 'تم الإكمال ✅' : 'احتساب تكرار'}
                </button>
            </div>
        `;
        azkarContainer.appendChild(card);
    });
}

// ------------------------------------
// دالة تحديث العداد (تم تعديلها لاستقبال الفئة)
// ------------------------------------
function updateCount(azkarId, category) {
    let storedCounts = JSON.parse(localStorage.getItem(AZKAR_STORAGE_KEY)) || {};
    const azkarList = ALL_AZKAR_DATA[category];
    const azkar = azkarList.find(a => a.id == azkarId);
    
    if (!azkar) return;

    const storageKey = `${category}-${azkarId}`;
    let currentCount = storedCounts[storageKey] || 0;

    if (currentCount < azkar.count) {
        currentCount++;
        storedCounts[storageKey] = currentCount;
        localStorage.setItem(AZKAR_STORAGE_KEY, JSON.stringify(storedCounts));
        
        // تحديث الواجهة مباشرة
        const card = document.querySelector(`.azkar-card[data-id="${azkarId}"][data-category="${category}"]`);
        const currentCountSpan = card.querySelector('.current-count');
        const countButton = card.querySelector('.count-button');

        currentCountSpan.textContent = `تم التكرار: ${currentCount}`;

        if (currentCount >= azkar.count) {
            card.classList.add('completed');
            countButton.textContent = 'تم الإكمال ✅';
            countButton.disabled = true;
        }
    }
}

// ------------------------------------
// وظيفة التبديل بين فئات الأذكار
// ------------------------------------
function handleCategoryChange(event) {
    if (event.target.classList.contains('nav-button')) {
        const newCategory = event.target.dataset.category;
        
        // إزالة "active" من الزر القديم وإضافتها للجديد
        navButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        currentCategory = newCategory;
        loadAzkar(currentCategory);
    }
}

// ------------------------------------
// ٥. بدء تشغيل التطبيق (مع إضافة مستمعين التنقل)
// ------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ... (تطبيق الخط والنمط كما كان سابقاً) ...
    // (applySavedTheme و applySavedFontSize)

    // تحميل الفئة الافتراضية
    loadAzkar(currentCategory);

    // إضافة المستمعين للأحداث
    azkarContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('count-button')) {
            const id = event.target.dataset.id;
            const category = event.target.dataset.category;
            updateCount(id, category);
        }
    });

    // إضافة مستمع لتبديل الفئات
    document.querySelector('.azkar-nav').addEventListener('click', handleCategoryChange);
    
    // ... (بقية مستمعي الأحداث كما كانوا: themeToggle, increaseFontButton, decreaseFontButton) ...
});

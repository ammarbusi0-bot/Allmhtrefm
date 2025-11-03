// 🔑 التهيئة الرئيسية وتنفيذ منطق تشغيل الموسيقى وإظهار المحتوى
document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton'); 
    
    // الأقسام المخفية بناءً على CSS
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .faq-section, .footer');
    
    // ----------------------------------------------------
    // 1. منطق تشغيل الموسيقى بمجرد أي تفاعل (نقرة أو ضغطة مفتاح)
    // ----------------------------------------------------
    const playAudioOnFirstInteraction = () => {
        // نضبط الخاصية muted على false ونحاول التشغيل
        audio.muted = false; 
        audio.play().catch(error => {
            console.warn("Audio play failed initially (likely due to browser policy), error:", error);
        });

        // إزالة المستمع بعد التشغيل لضمان تفاعل واحد
        document.removeEventListener('click', playAudioOnFirstInteraction);
        document.removeEventListener('keydown', playAudioOnFirstInteraction);
        console.log("Audio started playing after first user interaction.");
    };

    // ربط وظيفة تشغيل الموسيقى بأول نقرة أو ضغطة مفتاح في أي مكان في المستند
    document.addEventListener('click', playAudioOnFirstInteraction);
    document.addEventListener('keydown', playAudioOnFirstInteraction);

    // ----------------------------------------------------
    // 2. منطق إظهار المحتوى عند النقر على زر CTA
    // ----------------------------------------------------
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault(); 
            
            // إظهار الأقسام المخفية
            hiddenSections.forEach(section => {
                section.style.opacity = '1';
                section.style.pointerEvents = 'auto'; // السماح بالتفاعل
            });
            console.log("All hidden sections revealed.");

            // تنفيذ التنقل السلس إلى قسم الخدمات (بما أن التنقل الافتراضي تم منعه)
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            ctaButton.removeEventListener('click', arguments.callee);
        });
    }

    // ----------------------------------------------------
    // 3. تهيئة الأقسام الأخرى عند تحميل الصفحة
    // ----------------------------------------------------
    displayRandomComments();
    createFAQ();
    
    // تحديث التعليقات كل 30 دقيقة
    setInterval(displayRandomComments, 30 * 60 * 1000); 

    // ربط وظيفة الشراء بجميع أزرار الشراء
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', buyService);
    });

    // إعادة حجم الكانفاس عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
});


// ----------------------------------------------------
// 🟢 تأثير المصفوفة المتحرك (الخلفية الملونة المتحركة)
// ----------------------------------------------------
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// التحقق من وجود الكانفاس قبل الرسم
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01010101شظثصضذطكمنتالبيسشظثصضذطكمنتالبيس';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88'; 
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
}


// ----------------------------------------------------
// 💬 قاعدة بيانات التعليقات الجديدة (أسماء عربية + توثيق)
// ----------------------------------------------------
const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24) + 1; // 1 to 24 hours
    if (hours < 10) return `منذ ${hours} ساعات`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return "منذ 1 يوم";
};

const names = ["نور السوري", "أحمد العراقي", "ملاك الأردن", "ماجد الكويتي", "فادي اللبناني", "سارة مصر", "عمار الحلبي", "ياسر الشامي", "ريم القحطاني", "خالد الهاشمي", "جمال المغربي", "ليلى الجزائرية"];

const commentsTexts = [
    "شغلكم نخب أول! الهاك تبع ببجي مو طبيعي أبداً. ما في أي بان، وأفضل من كل المواقع اللي جربتها. يستاهلون الثقة.",
    "يا عمي إذا بدك شغل مظبوط، ما في غير هالمنصة. طلبت اختراق فيسبوك وضبطوها بأقل من ساعة. الدقة مو طبيعية.",
    "أفضل خدمة اختراق هواتف استخدمتها بحياتي. السرعة والدعم لا يعلى عليه. شكراً جزيلاً لفريق ShadowHack PRO.",
    "كنت مترددة بالبداية، لكن خدمة فري فاير شغالة بشكل ممتاز ومستقر. جودة مقابل سعر. أنصح الكل.",
    "جربت اختراق البنوك وكانت النتيجة مذهلة. شغل احترافي ومضمون. ما رح تندموا على التعامل معهم.",
    "شي بيجنن! اختراق الكاميرات تم بأقل من 30 دقيقة. يا بلاش! برافو عليكم، عنجد أساطير المجال.",
    "والله يا شباب الهاك الآمن تبع ببجي موبايل تفوق على كل التحديثات الجديدة. ما حسيت بأي خطر للحظر.",
    "خدمة العملاء ممتازة ومتجاوبة جداً. كانوا معي خطوة بخطوة حتى تم تفعيل الهاك بنجاح.",
    "استعادة حسابي المفقود تمت بنجاح وبسرعة قياسية. ناس محترفين وعند كلمتهم.",
    "ما في أي مقارنة مع باقي المواقع. هذا هو الأصل. تعامل سريع وموثوقية عالية جداً.",
    "دفعت واستلمت الخدمة خلال دقائق. السرعة لا تُصدق وهذا هو الأهم في عالم الهاكرز.",
    "أكثر من رائعين، خدمة VIP حقيقية. خمس نجوم قليلة بحقكم.",
    "الهاك يعمل بسلاسة دون أي تعليق أو بطء. مستوى احترافي عالي في البرمجة.",
    "ثقة تامة في التعامل. هذا هو موقعي المفضل للخدمات السرية.",
    "تجربة فريدة ومختلفة عن أي موقع آخر. عمل جبار ومتقن.",
    "تم اختراق الحساب المطلوب في وقت قياسي جداً. فعلاً إمبراطورية الاختراق السوداء.",
];

const fakeComments = [];
for(let i = 0; i < 50; i++) {
    fakeComments.push({
        name: names[Math.floor(Math.random() * names.length)],
        text: commentsTexts[Math.floor(Math.random() * commentsTexts.length)],
        timeAgo: generateRandomTime()
    });
}


// عرض التعليقات العشوائية
function displayRandomComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return; // تأكد من وجود العنصر

    container.innerHTML = '';
    
    // خلط التعليقات عشوائياً قبل العرض
    const shuffledComments = [...fakeComments].sort(() => 0.5 - Math.random());
    const selected = shuffledComments.slice(0, 6); // عرض 6 تعليقات فقط

    selected.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-badge"><i class="fas fa-check-circle"></i> مشترٍ موثوق</div>
                <div class="comment-name">${comment.name}</div>
            </div>
            <div class="comment-text">"${comment.text}"</div>
            <div class="comment-stars">⭐⭐⭐⭐⭐</div>
            <div class="comment-time">${comment.timeAgo}</div>
        `;
        container.appendChild(commentDiv);
    });
}

// الأسئلة الشائعة
const faqData = [
    {q: "ما هو ShadowHack PRO؟", a: "منصة متقدمة ومتخصصة في تقديم خدمات القرصنة والاختراق بأدوات متطورة وغير قابلة للكشف."},
    {q: "هل أدواتكم آمنة للاستخدام؟", a: "نعم، أدواتنا آمنة تماماً ومصممة بتقنيات متقدمة تضمن التخفي وعدم الكشف."},
    {q: "كيف أشتري الخدمات؟", a: "اضغط على أي زر شراء وسيتم توجيهك مباشرة إلى تليجرام للتواصل مع فريق المبيعات."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."},
    {q: "ما هي طريقة الدفع المتاحة؟", a: "نقبل العملات المشفرة (Bitcoin, USDT) لضمان خصوصيتك التامة."},
    {q: "هل يمكنني طلب خدمة اختراق غير مذكورة؟", a: "تواصل معنا على تليجرام لطلب خدمات مخصصة، وسنناقش إمكانية تنفيذها."},
];

// إنشاء الأسئلة الشائعة (والتي تكون مخفية افتراضياً)
function createFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return; 

    faqData.forEach((item) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <div class="faq-question">
                ${item.q}
                <i class="fas fa-chevron-down faq-toggle"></i>
            </div>
            <div class="faq-answer">${item.a}</div>
        `;
        // إضافة مستمع الحدث (event listener) للنقر لتبديل الحالة
        faqItem.querySelector('.faq-question').addEventListener('click', function() {
            faqItem.classList.toggle('active');
        });

        container.appendChild(faqItem);
    });
}

// وظيفة الشراء المباشر - تحديث رابط التلغرام
function buyService(event) {
    const serviceCard = event.target.closest('.service-card');
    const serviceName = serviceCard.getAttribute('data-name');
    const price = serviceCard.getAttribute('data-price');
    
    // 📢 تم تحديث اسم المستخدم للتلغرام
    const telegramUsername = "Talaa_almalika"; 
    const message = `أريد شراء ${serviceName} بسعر $${price} من ShadowHack PRO`;
    const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    
    // تأثير على الزر
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '🚀 جاري التوجيه...';
    button.style.background = 'linear-gradient(45deg, #0088cc, #ff0088)';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        // استعادة التنسيق الأصلي للزر من CSS
        button.style.background = '';
        button.disabled = false;
    }, 3000);
}

// تفاصيل المميزات (إبقاءها كما هي)
function showFeatureDetails(title, details) {
    alert(`🛡️ ${title}\n\n${details}`);
}

// التنقل السلس (لروابط التنقل الأخرى غير CTA)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // نتجنب زر CTA لأنه مرتبط بوظيفة الإظهار والتشغيل
    if (anchor.id !== 'ctaButton') {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// 🔑 التهيئة الرئيسية ومنطق تشغيل الموسيقى وإظهار المحتوى
document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton'); 
    
    // الأقسام المخفية بناءً على CSS
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .faq-section, .footer, .about-us-summary');
    
    // ----------------------------------------------------
    // 1. منطق تشغيل الموسيقى عند أي تفاعل
    // ----------------------------------------------------
    const playAudioOnFirstInteraction = () => {
        audio.muted = false; 
        audio.play().catch(error => {
            console.warn("Audio play failed initially (likely due to browser policy), error:", error);
        });

        document.removeEventListener('click', playAudioOnFirstInteraction);
        document.removeEventListener('keydown', playAudioOnFirstInteraction);
        console.log("Audio started playing after first user interaction.");
    };

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

            // تنفيذ التنقل السلس إلى قسم الخدمات
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            ctaButton.removeEventListener('click', arguments.callee);
        });
    }

    // ----------------------------------------------------
    // 3. تهيئة الأقسام الأخرى
    // ----------------------------------------------------
    displayRandomComments();
    createFAQ();
    
    // تحديث التعليقات كل 30 دقيقة
    setInterval(displayRandomComments, 30 * 60 * 1000); 

    // ربط وظيفة الشراء بجميع أزرار الشراء
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', handleBuyClick); 
    });

    const verifyButton = document.getElementById('verifyCodeButton');
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyCode);
    }
    
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
// 💬 قاعدة بيانات التعليقات الجديدة 
// ----------------------------------------------------
const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24) + 1; 
    if (hours < 10) return `منذ ${hours} ساعات`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return "منذ 1 يوم";
};

const names = ["نور السوري", "أحمد العراقي", "ملاك الأردن", "ماجد الكويتي", "فادي اللبناني", "سارة مصر", "عمار الحلبي", "ياسر الشامي", "ريم القحطاني", "خالد الهاشمي", "جمال المغربي", "ليلى الجزائرية"];

const commentsTexts = [
    "شغلكم نخب أول! الهاك تبع ببجي مو طبيعي أبداً. ما في أي بان، وأفضل من كل المواقع اللي جربتها. يستاهلون الثقة.",
    "يا عمي إذا بدك شغل مظبوط، ما في غير هالمنصة. طلبت اختراق فيسبوك وضبطوها بأقل من ساعة. الدقة مو طبيعية.",
    "أفضل خدمة اختراق هواتف استخدمتها بحياتي. السرعة والدعم لا يعلى عليه. شكراً جزيلاً لفريق ShadowHack PRO.",
    "خدمة الأرقام الوهمية شغالة فوراً وعلى مدار الساعة. أفضل من أي موقع آخر.",
    "جربت اختراق البنوك وكانت النتيجة مذهلة. شغل احترافي ومضمون. ما رح تندموا على التعامل معهم.",
    "شي بيجنن! اختراق الكاميرات تم بأقل من 30 دقيقة. يا بلاش! برافو عليكم، عنجد أساطير المجال.",
    "والله يا شباب الهاك الآمن تبع Free Fire تفوق على كل التحديثات الجديدة. ما حسيت بأي خطر للحظر.",
    "خدمة العملاء ممتازة ومتجاوبة جداً. كانوا معي خطوة بخطوة حتى تم تفعيل الهاك بنجاح.",
    "استعادة حسابي المفقود تمت بنجاح وبسرعة قياسية. ناس محترفين وعند كلمتهم.",
    "ما في أي مقارنة مع باقي المواقع. هذا هو الأصل. تعامل سريع وموثوقية عالية جداً.",
    "دفعت واستلمت الخدمة خلال دقائق. السرعة لا تُصدق وهذا هو الأهم في عالم الهاكرز.",
    "أكثر من رائعين، خدمة VIP حقيقية. خمس نجوم قليلة بحقكم.",
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
    if (!container) return; 

    container.innerHTML = '';
    
    const shuffledComments = [...fakeComments].sort(() => 0.5 - Math.random());
    const selected = shuffledComments.slice(0, 6); 

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
    {q: "كيف أشتري الخدمات؟", a: "اضغط على زر الشراء، وقم بالتحقق من الأمان، ثم ابدأ الدردشة الفورية مع المشرفين لتأكيد الدفع والتفعيل."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع مع المشرف."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."},
    {q: "ما هي طريقة الدفع المتاحة؟", a: "نقبل العملات المشفرة (Bitcoin, USDT) لضمان خصوصيتك التامة."},
    {q: "هل يمكنني طلب خدمة اختراق غير مذكورة؟", a: "تواصل معنا في الدردشة الفورية لطلب خدمات مخصصة، وسنناقش إمكانية تنفيذها."},
];

// إنشاء الأسئلة الشائعة
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
        faqItem.querySelector('.faq-question').addEventListener('click', function() {
            faqItem.classList.toggle('active');
        });

        container.appendChild(faqItem);
    });
}

// ----------------------------------------------------
// 🔑 منطق الكود السري والتوجيه لصفحة الدردشة (chat.html)
// ----------------------------------------------------

const securityModal = document.getElementById('securityModal');
const closeButton = securityModal ? securityModal.querySelector('.close-button') : null;
const secretCodeDisplay = document.getElementById('secretCodeDisplay');
const userInputCode = document.getElementById('userInputCode');
const verificationMessage = document.getElementById('verificationMessage');
const serviceNamePlaceholder = securityModal ? securityModal.querySelector('.service-name-placeholder') : null;

let currentSecretCode = '';
let serviceToBuy = {};

// دالة لإنشاء كود سري عشوائي (4 أرقام فقط)
function generateNumericSecretCode() {
    return Math.floor(1000 + Math.random() * 9000).toString(); 
}

// دالة تفتح النافذة المنبثقة
function handleBuyClick(event) {
    const serviceCard = event.target.closest('.service-card');
    
    serviceToBuy = {
        name: serviceCard.getAttribute('data-name'),
        price: serviceCard.getAttribute('data-price')
    };

    if (securityModal) {
        currentSecretCode = generateNumericSecretCode();
        secretCodeDisplay.innerHTML = currentSecretCode;
        serviceNamePlaceholder.innerHTML = `الخدمة: ${serviceToBuy.name} ($${serviceToBuy.price})`;
        userInputCode.value = '';
        verificationMessage.innerHTML = '';
        
        securityModal.style.display = 'block';

        if (closeButton) {
            closeButton.onclick = () => {
                securityModal.style.display = 'none';
            };
        }
        window.onclick = (event) => {
            if (event.target === securityModal) {
                securityModal.style.display = 'none';
            }
        };
    }
}

// دالة تتحقق من الكود وتوجه لصفحة الدردشة (chat.html)
function verifyCode() {
    const enteredCode = userInputCode.value.trim();
    
    if (enteredCode === currentSecretCode) {
        // التوجيه لصفحة الدردشة
        const queryParams = new URLSearchParams({
            service: serviceToBuy.name,
            price: serviceToBuy.price,
            code: currentSecretCode 
        }).toString();
        
        window.location.href = `chat.html?${queryParams}`;
        
    } else {
        // إذا كان الكود خاطئاً
        verificationMessage.innerHTML = '⚠️ رمز سري خاطئ. حاول مجدداً.';
        verificationMessage.style.color = 'var(--secondary)';
        userInputCode.value = '';
    }
}

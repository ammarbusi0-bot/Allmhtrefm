// 🔑 التهيئة الرئيسية وتنفيذ منطق تشغيل الموسيقى وإظهار المحتوى
document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton'); 
    
    // الأقسام المخفية بناءً على CSS
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .faq-section, .footer');
    
    // ----------------------------------------------------
    // 1. منطق تشغيل الموسيقى عند أي تفاعل (نقرة أو ضغطة مفتاح)
    // ----------------------------------------------------
    const playAudioOnFirstInteraction = () => {
        // نستخدم audio.play() لضمان تشغيلها عند النقرة
        audio.play().catch(error => {
            console.log("Audio play failed initially, error:", error);
        });

        // إزالة المستمع بعد التشغيل لتجنب تكرار محاولة التشغيل
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
            // نمنع التنقل السلس الافتراضي أولاً لتنفيذ الإظهار
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

            // إزالة المستمع من زر CTA بعد النقر عليه لضمان التنفيذ مرة واحدة
            ctaButton.removeEventListener('click', arguments.callee);
        });
    }

    // ----------------------------------------------------
    // 3. تهيئة الأقسام الأخرى عند تحميل الصفحة
    // ----------------------------------------------------
    displayRandomComments();
    createFAQ();
    
    // تحديث التعليقات كل 30 دقيقة (30 * 60 * 1000 ميلي ثانية)
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

// ====================================================
// 🛠️ نظام الدعم الفني - Termux Bridge
// ====================================================

// فتح نافذة الدعم الفني
function openSupport() {
    const name = prompt("👤 ما هو اسمك؟") || "مجهول";
    const message = prompt("💬 اكتب رسالتك:") || "لا توجد رسالة";
    
    if (name && message !== "لا توجد رسالة") {
        // إرسال إلى Termux
        fetch('http://192.168.1.101:5000/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, message})
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
            } else {
                alert("❌ حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("❌ تأكد من تشغيل خادم الدعم (Termux)");
        });
    }
}

// ====================================================
// 🔐 نظام التحقق الأمني
// ====================================================

// التحقق من أن المستخدم إنسان عند الشراء
function verifyHumanOnPurchase() {
    const today = new Date().toDateString();
    const lastVerification = localStorage.getItem('lastVerificationDate');
    
    if (lastVerification === today) {
        return true; // تم التحقق اليوم
    }
    
    const code = Math.floor(10000 + Math.random() * 90000); // 5 أرقام
    const userCode = prompt(`🔐 تحقق أمني\nلضمان أمان عملية الشراء، الرجاء إدخال الرمز التالي:\n\n${code}\n\nهذا التحقق مطلوب مرة واحدة يومياً`);
    
    if (userCode == code) {
        localStorage.setItem('lastVerificationDate', today);
        return true;
    } else {
        alert('❌ رمز التحقق غير صحيح! يُرجى المحاولة مرة أخرى.');
        return false;
    }
}

// وظيفة الشراء - توجيه لتليجرام مع التحقق
function buyService(event) {
    // التحقق من أن المستخدم إنسان
    if (!verifyHumanOnPurchase()) {
        return;
    }
    
    const serviceCard = event.target.closest('.service-card');
    const serviceName = serviceCard.getAttribute('data-name');
    const price = serviceCard.getAttribute('data-price');
    
    const telegramUsername = "Armanex";
    const message = `أريد شراء ${serviceName} بسعر $${price} من ShadowHack PRO v2`;
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
        button.style.background = 'linear-gradient(45deg, var(--accent), var(--secondary))';
        button.disabled = false;
    }, 3000);
}

// ====================================================
// ⚠️ نظام إخلاء المسؤولية
// ====================================================

// إظهار/إخفاء نافذة إخلاء المسؤولية
function showDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'flex';
}

function closeDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'none';
    // بدء تشغيل الموسيقى بعد الموافقة
    document.getElementById('background-audio').play().catch(console.error);
}

// ====================================================
// 🟢 تأثير المصفوفة المتحرك
// ====================================================

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

// ====================================================
// 💬 نظام التعليقات
// ====================================================

const commentsData = [
    {name: "سارة", text: "أسعار معقولة وجودة ممتازة 👍", time: "منذ يوم", verified: true},
    {name: "أحمد", text: "الخدمة سريعة والنتائج مذهلة! شكراً لفريق الدعم 🚀", time: "منذ ساعتين", verified: true},
    {name: "محمد", text: "لقد استخدمت العديد من المواقع ولكن هذا الموقع يتميز بالجودة العالية والأسعار المنافسة.", time: "منذ 5 ساعات", verified: true},
    {name: "فاطمة", text: "تجربة رائعة! الخدمة تعمل بشكل ممتاز دون أي مشاكل.", time: "منذ يوم", verified: false},
    {name: "خالد", text: "أنصح الجميع بهذه الخدمات، احترافية وسريعة!", time: "منذ 3 أيام", verified: true},
    {name: "علي", text: "الهاك يعمل بسلاسة تامة، لم أواجه أي حظر في اللعبة.", time: "منذ أسبوع", verified: true}
];

// عرض التعليقات العشوائية
function displayRandomComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    container.innerHTML = '';
    
    // ترتيب التعليقات حسب الوقت (الأحدث أولاً)
    const sortedComments = [...commentsData].sort((a, b) => {
        const timeOrder = {"منذ ساعتين": 1, "منذ 5 ساعات": 2, "منذ يوم": 3, "منذ 3 أيام": 4, "منذ أسبوع": 5};
        return timeOrder[a.time] - timeOrder[b.time];
    });

    sortedComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                ${comment.verified ? '<div class="comment-badge">مشترٍ موثوق</div>' : ''}
                <div class="comment-name">${comment.name}</div>
            </div>
            <div class="comment-text">"${comment.text}"</div>
            <div class="comment-stars">⭐⭐⭐⭐⭐</div>
            <div class="comment-time">${comment.time}</div>
        `;
        container.appendChild(commentDiv);
    });
}

// ====================================================
// ❓ نظام الأسئلة الشائعة
// ====================================================

const faqData = [
    {q: "ما هو ShadowHack PRO؟", a: "منصة متقدمة ومتخصصة في تقديم خدمات القرصنة والاختراق بأدوات متطورة وغير قابلة للكشف."},
    {q: "هل أدواتكم آمنة للاستخدام؟", a: "نعم، أدواتنا آمنة تماماً ومصممة بتقنيات متقدمة تضمن التخفي وعدم الكشف."},
    {q: "كيف أشتري الخدمات؟", a: "اضغط على أي زر شراء وسيتم توجيهك مباشرة إلى تليجرام للتواصل مع فريق المبيعات."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."},
    {q: "ما هي طريقة الدفع المتاحة؟", a: "نقبل العملات المشفرة (Bitcoin, USDT) لضمان خصوصيتك التامة."},
    {q: "هل يمكنني طلب خدمة اختراق غير مذكورة؟", a: "تواصل معنا على تليجرام لطلب خدمات مخصصة، وسنناقش إمكانية تنفيذها."},
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

// ====================================================
// 🎯 وظائف مساعدة
// ====================================================

// تفاصيل المميزات
function showFeatureDetails(title, details) {
    alert(`🛡️ ${title}\n\n${details}`);
}

// التنقل السلس (لروابط التنقل الأخرى غير CTA)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// إظهار نافذة إخلاء المسؤولية عند التحميل
window.onload = function() {
    showDisclaimer();
};

// ====================================================
// 🚀 نهاية الملف - أضف المميزات الجديدة هنا
// ====================================================

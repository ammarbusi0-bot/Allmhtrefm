// 🎧 منطق تشغيل الموسيقى التلقائي بـ "خدعة أول تفاعل" (مثل تيك توك)
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-audio');
    
    // 1. محاولة التشغيل التلقائي الصامت (يعمل غالباً بسبب وجود muted في HTML)
    audio.play().catch(e => console.log('Silent auto-play attempted.'));

    // 2. إزالة الصمت (Unmute) عند أول تفاعل للمستخدم مع أي مكان في الصفحة
    const unmuteOnFirstInteraction = () => {
        if (audio && audio.muted) {
            audio.muted = false; // هنا يتم تشغيل الصوت
            console.log("Audio unmuted successfully upon user interaction.");
        }
        // إزالة مستمع الحدث بعد أول مرة حتى لا يتكرر
        document.removeEventListener('click', unmuteOnFirstInteraction);
        document.removeEventListener('keydown', unmuteOnFirstInteraction);
    };

    // إضافة مستمعات تتحسس أول نقرة أو ضغطة مفتاح
    document.addEventListener('click', unmuteOnFirstInteraction);
    document.addEventListener('keydown', unmuteOnFirstInteraction);
});

// 🟢 تأثير المصفوفة المتحرك (الخلفية الملونة المتحركة) - كود المصفوفة لم يتغير
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

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
    
    // لون المصفوفة يتناسب مع الثيم الجديد (#00ff88)
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

// 🟢 قاعدة بيانات التعليقات بأسماء وأوقات عشوائية (بين ساعة و يوم) - لم تتغير
const fakeComments = [
    { name: "أبو جود", text: "والله يا زلمي شغلكم نخب أول! الهاك تبع ببجي مو طبيعي أبداً. يسلمو إيديكن على هالشغل النظيف، صارلي شي 5 ساعات بلعب.", timeAgo: "منذ 6 ساعات" },
    { name: "أمير الظلام", text: "يا عمي إذا بدك شغل مظبوط، ما في غير هالصفحة. طلبت اختراق تليفون رفيقي وظبطوها بلمحة البصر.", timeAgo: "منذ 1 يوم" },
    { name: "ريم الحلبية", text: "أنا كتير كنت خايفة من شغل الهاكات، بس هالشباب مطمئنين كتير. طلبت هاك فري فاير وضبطوه من أول مرة.", timeAgo: "منذ 4 ساعات" },
    { name: "ملك السايبر", text: "جربت كتير مواقع، بس كلها كذب. جربت خدمات اختراق البنوك عندكم وهي اللي عملتلي نقلة نوعية. شغلكم ذهب صافي.", timeAgo: "منذ 1 ساعة" },
    { name: "سالم المافيا", text: "يا لطيف، شي بيجنن! اختراق حساب فيسبوك تم بأقل من نص ساعة. برافو عليكم، عنجد أساطير.", timeAgo: "منذ 12 ساعة" },
    { name: "فادي أبو عذاب", text: "كل التقدير والاحترام لفريقكم. جربت اختراق الهاتف وما توقعت هالسرعة والدقة! عم بيشتغل كأنه تليفوني أنا.", timeAgo: "منذ 3 ساعات" }
];

// عرض التعليقات العشوائية - لم يتغير
function displayRandomComments() {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = '';
    
    // خلط التعليقات عشوائياً قبل العرض
    const shuffledComments = [...fakeComments].sort(() => 0.5 - Math.random());
    const selected = shuffledComments.slice(0, 6); // عرض 6 تعليقات

    selected.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-badge">مشترٍ موثوق</div>
                <div class="comment-name">${comment.name}</div>
            </div>
            <div class="comment-text">"${comment.text}"</div>
            <div class="comment-stars">⭐⭐⭐⭐⭐</div>
            <div class="comment-time">${comment.timeAgo}</div>
        `;
        container.appendChild(commentDiv);
    });
}

// الأسئلة الشائعة - لم تتغير
const faqData = [
    {q: "ما هو ShadowHack PRO؟", a: "منصة متقدمة ومتخصصة في تقديم خدمات القرصنة والاختراق بأدوات متطورة وغير قابلة للكشف."},
    {q: "هل أدواتكم آمنة للاستخدام؟", a: "نعم، أدواتنا آمنة تماماً ومصممة بتقنيات متقدمة تضمن التخفي وعدم الكشف."},
    {q: "كيف أشتري الخدمات؟", a: "اضغط على أي زر شراء وسيتم توجيهك مباشرة إلى تليجرام للتواصل مع فريق المبيعات."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."}
];

// إنشاء الأسئلة الشائعة (والتي تكون مخفية افتراضياً) - لم يتغير
function createFAQ() {
    const container = document.getElementById('faqContainer');
    container.innerHTML = '';
    
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

// وظيفة الشراء - توجيه لتليجرام - لم تتغير
function buyService(event) {
    const serviceCard = event.target.closest('.service-card');
    const serviceName = serviceCard.getAttribute('data-name');
    const price = serviceCard.getAttribute('data-price');
    
    const telegramUsername = "Armanex";
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
        button.style.background = 'linear-gradient(45deg, var(--accent), var(--secondary))';
        button.disabled = false;
    }, 3000);
}

// تفاصيل المميزات - لم تتغير
function showFeatureDetails(title, details) {
    alert(`🛡️ ${title}\n\n${details}`);
}

// 🟢 التهيئة الشاملة - تم التأكد من عدم وجود أي منطق قديم لزر الصوت هنا
window.addEventListener('load', function() {
    displayRandomComments();
    createFAQ();
    
    // 🟢 تجديد التعليقات كل 30 دقيقة
    setInterval(displayRandomComments, 30 * 60 * 1000); 

    // ربط وظيفة الشراء بجميع أزرار الشراء
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', buyService);
    });
    
    // إعادة حجم الكانفاس عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // جعل الدوال متاحة عالمياً لـ onclick في HTML
    window.showFeatureDetails = showFeatureDetails;
});

// التنقل السلس - لم يتغير
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

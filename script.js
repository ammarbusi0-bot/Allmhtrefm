// 🔑 التهيئة الرئيسية وتنفيذ منطق تشغيل الموسيقى وإظهار المحتوى
document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton'); 
    
    // الأقسام المخفية بناءً على CSS
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .faq-section, .footer');
    
    // عناصر إخلاء المسؤولية
    const disclaimerOverlay = document.getElementById('disclaimerOverlay');
    const agreeDisclaimerButton = document.getElementById('agreeDisclaimer');
    const rejectDisclaimerButton = document.getElementById('rejectDisclaimer');
    const body = document.body;

    // حالة الموافقة
    let isDisclaimerAccepted = localStorage.getItem('disclaimerAccepted') === 'true';
    
    // ----------------------------------------------------
    // 0. منطق إخلاء المسؤولية (Disclaimer)
    // ----------------------------------------------------
    if (!isDisclaimerAccepted) {
        disclaimerOverlay.style.display = 'flex';
        body.classList.add('disclaimer-hidden');
    } else {
        disclaimerOverlay.style.display = 'none';
        body.classList.remove('disclaimer-hidden');
        // يتم السماح بتشغيل الصوت وإظهار المحتوى بعد الموافقة في الجلسات اللاحقة
        document.addEventListener('click', playAudioOnFirstInteraction);
        document.addEventListener('keydown', playAudioOnFirstInteraction);
        
        // نضمن ظهور الأقسام المخفية عند التحميل إذا تم قبول الشروط
        hiddenSections.forEach(section => {
            section.style.opacity = '1';
            section.style.pointerEvents = 'auto';
        });
    }

    agreeDisclaimerButton.addEventListener('click', () => {
        localStorage.setItem('disclaimerAccepted', 'true');
        disclaimerOverlay.style.display = 'none';
        body.classList.remove('disclaimer-hidden');
        
        // إظهار الأقسام المخفية فوراً بعد الموافقة
        hiddenSections.forEach(section => {
            section.style.opacity = '1';
            section.style.pointerEvents = 'auto';
        });

        // يتم السماح بتشغيل الصوت بعد الموافقة
        if (ctaButton) {
            document.addEventListener('click', playAudioOnFirstInteraction);
            document.addEventListener('keydown', playAudioOnFirstInteraction);
        }
    });

    // عند الرفض، نعطي رسالة ونبقي النافذة ظاهرة
    rejectDisclaimerButton.addEventListener('click', () => {
        alert("يجب الموافقة على الشروط لاستخدام الموقع. لن تتمكن من رؤية المحتوى.");
        // يبقى الموقع في وضع الإخفاء (disclaimer-hidden) ولن يحدث خطأ 4404
    });
    
    // ----------------------------------------------------
    // 1. منطق تشغيل الموسيقى عند أي تفاعل
    // ----------------------------------------------------
    const playAudioOnFirstInteraction = () => {
        // نستخدم audio.play() لضمان تشغيلها عند النقرة
        audio.play().catch(error => {
            console.log("Audio play failed initially, error:", error);
        });

        // إزالة المستمع بعد التشغيل لتجنب تكرار محاولة التشغيل
        document.removeEventListener('click', playAudioOnFirstInteraction);
        document.removeEventListener('keydown', playAudioOnFirstInteraction);
    };
    
    // ربط وظيفة تشغيل الموسيقى بأول نقرة أو ضغطة مفتاح (يتم تفعيلها فقط بعد الموافقة على إخلاء المسؤولية)
    if (isDisclaimerAccepted) {
        document.addEventListener('click', playAudioOnFirstInteraction);
        document.addEventListener('keydown', playAudioOnFirstInteraction);
    }
    

    // ----------------------------------------------------
    // 2. منطق إظهار المحتوى عند النقر على زر CTA
    // ----------------------------------------------------
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault(); 
            
            // إظهار الأقسام المخفية (للتأكد فقط في حال لم تظهر عبر الـ Disclaimer)
            hiddenSections.forEach(section => {
                section.style.opacity = '1';
                section.style.pointerEvents = 'auto'; // السماح بالتفاعل
            });

            // تنفيذ التنقل السلس إلى قسم الخدمات (بما أن التنقل الافتراضي تم منعه)
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

        });
    }

    // ----------------------------------------------------
    // 3. تهيئة الأقسام الأخرى عند تحميل الصفحة وتحديث التواريخ
    // ----------------------------------------------------
    const updateLastUpdateDates = () => {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const servicesDate = document.getElementById('servicesLastUpdate');
        const featuresDate = document.getElementById('featuresLastUpdate');
        const commentsDate = document.getElementById('commentsLastUpdate');
        const faqDate = document.getElementById('faqLastUpdate');

        if(servicesDate) servicesDate.textContent = `آخر تحديث للخدمات: ${today}`;
        if(featuresDate) featuresDate.textContent = `آخر تحديث للمميزات: ${today}`;
        if(commentsDate) commentsDate.textContent = `آخر تحديث للتعليقات: ${today}`;
        if(faqDate) faqDate.textContent = `آخر تحديث للأسئلة: ${today}`;
    };

    updateLastUpdateDates();
    displayRandomComments();
    createFAQ();
    
    // تحديث التعليقات كل 30 دقيقة (30 * 60 * 1000 ميلي ثانية)
    setInterval(displayRandomComments, 30 * 60 * 1000); 

    // ربط وظيفة الشراء بجميع أزرار الشراء (تم تحديثها لفتح الكابتشا)
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', triggerCaptcha);
    });

    // إعادة حجم الكانفاس عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });


// ----------------------------------------------------
// 🟢 تأثير المصفوفة المتحرك (الخلفية الملونة المتحركة)
// ----------------------------------------------------
    const canvas = document.getElementById('matrixCanvas');
    if (canvas) { // التأكد من وجود الكانفاس
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
});


// ----------------------------------------------------
// 💬 قاعدة بيانات التعليقات
// ----------------------------------------------------
const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24) + 1; // 1 to 24 hours
    if (hours < 10) return `منذ ${hours} ساعات`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(Math.random() * 7) + 1;
    return `منذ ${days} يوم`;
};

const names = ["أبو جود", "أمير الظلام", "ريم الحلبية", "ملك السايبر", "سالم المافيا", "فادي أبو عذاب", "ليث الهاكر", "نجمة السوشيال", "عزوز الرقمي", "سيد الاختراق", "خالد الكاشف", "نور الويب", "سامي المبرمج", "فرح الهاشمي", "ناصر الجريء"];

const commentsTexts = [
    "والله يا زلمي شغلكم نخب أول! الهاك تبع ببجي مو طبيعي أبداً. يسلمو إيديكن على هالشغل النظيف. كنت متردد بالبداية لكن الدعم الفني طمني وشرحلي كل شي خطوة بخطوة. أنصح وبشدة التعامل معهم.", // طويل
    "يا عمي إذا بدك شغل مظبوط، ما في غير هالصفحة. طلبت اختراق تليفوني وضبطوها بلمحة البصر. السرعة والدقة هي اللي بتميزهم.", // متوسط
    "تجربة فريدة ومختلفة عن أي موقع آخر. بفضلهم، قدرت استرجع حسابي اللي انسرق، والخدمة كانت أكثر من ممتازة.", // طويل
    "أنا كتير كنت خايفة من شغل الهاكات، بس هالشباب مطمئنين كتير. طلبت هاك فري فاير وضبطوه من أول مرة.", // قصير
    "جربت كتير مواقع، بس كلها كذب. شغلكم ذهب صافي. لا تضيعوا وقتكم مع غيرهم.", // قصير
    "يا لطيف، شي بيجنن! اختراق حساب فيسبوك تم بأقل من نص ساعة. برافو عليكم، عنجد أساطير.", // قصير
    "كل التقدير والاحترام لفريقكم. جربت اختراق الهاتف وما توقعت هالسرعة والدقة! عم بيشتغل كأنه تليفوني أنا. خدمة احترافية بمعنى الكلمة.", // طويل
    "أفضل خدمة اختراق كاميرات استخدمتها على الإطلاق. موثوقية عالية جداً وضمان كامل.", // متوسط
    "استعادة حسابي المفقود تمت بنجاح وبسرعة قياسية. شكراً ShadowHack PRO.", // قصير
    "موقع احترافي وفريق عمل متجاوب، خدمة الـ Aimbot في ببجي خرافي، وما في أي مواشوف من الباند.", // متوسط
    "تحديثاتهم المستمرة تخليهم دايمًا متفوقين. أنصح بالتعامل معهم. السعر معقول جداً مقارنة بالجودة والضمان.", // طويل
    "الحمد لله لقيت الموقع الصح. شغل مرتب ومضمون 100%. التزام بالمواعيد ممتاز.", // متوسط
    "اشتريت هاك فيفا موبايل وجبت كل اللعيبة اللي بدي ياهم بدون مشاكل تذكر، عملية سهلة وسريعة جداً.", // متوسط
    "رهيبين! الفريق متعاون ويشرح كل شي بالتفصيل. برافو.", // قصير
    "بصراحة، كنت متردد، لكن التجربة كانت فوق التوقعات.", // قصير
    "دفعت واستلمت الخدمة خلال دقائق. السرعة لا تُصدق.", // قصير
    "أكثر من رائعين، خدمة VIP حقيقية.", // قصير
    "خمس نجوم قليلة بحقكم. مستوى احترافي عالي جداً.", // قصير
    "ثقة تامة في التعامل. هذا هو موقعي المفضل للخدمات الرقمية. شكراً جزيلاً للفريق.", // متوسط
    "تم اختراق الحساب المطلوب في وقت قياسي جداً. لم أتوقع هذه الكفاءة.", // متوسط
    "فعلاً إمبراطورية الاختراق السوداء. عمل جبار ومتقن.", // قصير
    "التحكم بالهاتف الكامل صار أسهل مما تخيلت. الخدمة تعمل بكفاءة عالية جداً.", // متوسط
    "ما توقعت أبدًا هالسرعة في إنجاز المهمة الصعبة، تفوقوا على كل المواقع اللي جربتها قبلهم.", // طويل
    "أفضل استثمار قمت به مؤخراً. خدمات قيمة وموثوقة.", // قصير
    "الموقع آمن وموثوق، والنتائج مذهلة.", // قصير
    "محتوى غير قابل للكشف، هذا هو الأهم بالنسبة لي. أنصح الجميع بتجربتهم.", // متوسط
    "ببساطة: الأفضل في المجال، لا جدال. سرعة، دقة، احترافية.", // قصير
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

// الأسئلة الشائعة
const faqData = [
    {q: "ما هو ShadowHack PRO v2؟", a: "منصة متقدمة ومتخصصة في تقديم خدمات القرصنة والاختراق بأدوات متطورة وغير قابلة للكشف."},
    {q: "هل أدواتكم آمنة للاستخدام؟", a: "نعم، أدواتنا آمنة تماماً ومصممة بتقنيات متقدمة تضمن التخفي وعدم الكشف."},
    {q: "كيف أشتري الخدمات؟", a: "اضغط على أي زر شراء وستظهر لك نافذة للتحقق (Captcha)، وبعدها سيتم توجيهك مباشرة إلى تليجرام للتواصل مع فريق المبيعات."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."},
    {q: "ما هي طريقة الدفع المتاحة؟", a: "نقبل العملات المشفرة (Bitcoin, USDT) لضمان خصوصيتك التامة."},
    {q: "هل يمكنني طلب خدمة اختراق غير مذكورة؟", a: "تواصل معنا عبر رابط التليجرام مباشرة لطلب خدمات مخصصة، وسنناقش إمكانية تنفيذها."},
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

// ----------------------------------------------------
// 🔐 منطق كود التحقق (Captcha)
// ----------------------------------------------------
let currentCaptchaCode = '';
let currentServiceDetails = {};

function generateCaptcha() {
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += Math.floor(Math.random() * 10);
    }
    currentCaptchaCode = code;
    document.getElementById('captchaCode').textContent = code;
    document.getElementById('captchaInput').value = '';
    document.getElementById('captchaMessage').textContent = '';
    return code;
}

function triggerCaptcha(event) {
    const serviceCard = event.target.closest('.service-card');
    currentServiceDetails = {
        name: serviceCard.getAttribute('data-name'),
        price: serviceCard.getAttribute('data-price')
    };
    
    generateCaptcha();
    document.getElementById('captchaModal').style.display = 'flex';
    document.getElementById('captchaInput').focus();
}

document.getElementById('verifyCaptcha').addEventListener('click', () => {
    const input = document.getElementById('captchaInput').value.trim();
    const messageElement = document.getElementById('captchaMessage');
    
    if (input === currentCaptchaCode) {
        messageElement.style.color = 'var(--primary)';
        messageElement.textContent = '✅ تم التحقق بنجاح!';
        setTimeout(() => {
            document.getElementById('captchaModal').style.display = 'none';
            buyServiceConfirmed(); // الانتقال إلى دالة الشراء الفعلية
        }, 1000);
    } else {
        messageElement.style.color = 'var(--secondary)';
        messageElement.textContent = '❌ كود التحقق غير صحيح. حاول مجدداً.';
        generateCaptcha(); // إعادة توليد كود جديد
    }
});


// وظيفة الشراء الفعلية - توجيه لتليجرام
function buyServiceConfirmed() {
    const { name: serviceName, price } = currentServiceDetails;
    
    const telegramUsername = "Armanex";
    const message = `أريد شراء ${serviceName} بسعر $${price} من ShadowHack PRO v2`;
    const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    
    console.log(`User confirmed and is being redirected to Telegram for ${serviceName}`);
}

// تفاصيل المميزات
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

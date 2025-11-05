// 🔑 التهيئة الرئيسية المحسنة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CyberShield PRO v2 - Initializing...');
    
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton');
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .faq-section, .footer');
    
    // 🔧 إصلاح تشغيل الصوت
    function initializeAudio() {
        if (!audio) {
            console.warn('⚠️ Audio element not found');
            return;
        }
        
        // إعدادات الصوت
        audio.volume = 0.3;
        audio.preload = 'auto';
        
        // تشغيل الصوت عند أول تفاعل
        const playAudio = function() {
            audio.play().then(() => {
                console.log('🎵 Background audio started');
            }).catch(error => {
                console.log('🔇 Audio play prevented by browser:', error);
            });
            
            // إزالة المستمعين بعد المحاولة الأولى
            document.removeEventListener('click', playAudio);
            document.removeEventListener('keydown', playAudio);
        };
        
        document.addEventListener('click', playAudio);
        document.addEventListener('keydown', playAudio);
    }

    // 🎯 نظام إظهار المحتوى المحسن
    function initializeCTA() {
        if (!ctaButton) return;
        
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('🎪 Revealing hidden sections...');
            
            // إظهار الأقسام المخفية بتأثير متتالي
            hiddenSections.forEach((section, index) => {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.pointerEvents = 'auto';
                    section.style.transform = 'translateY(0)';
                }, index * 200);
            });
            
            // التنقل السلس إلى الخدمات
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    }

    // 🚀 تهيئة جميع المكونات
    function initializeAll() {
        initializeAudio();
        initializeCTA();
        initializeMatrix();
        displayRandomComments();
        createFAQ();
        initializeBuyButtons();
        initializeChat();
        
        console.log('✅ All systems initialized successfully');
    }

    // 🔄 تحديث التعليقات تلقائياً
    setInterval(displayRandomComments, 30 * 60 * 1000);
    
    // بدء التهيئة
    initializeAll();
});

// ====================================================
// 💬 نظام الدردشة الداخلية
// ====================================================

let chatMessages = [];
let isAdminOnline = true;

// تهيئة الدردشة
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    loadChatHistory();
}

// فتح نافذة الدردشة
function openChat() {
    document.getElementById('chatModal').style.display = 'flex';
    document.getElementById('chatInput').focus();
    loadChatHistory();
}

// إغلاق نافذة الدردشة
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
}

// إرسال رسالة
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessageToChat('user', message);
    input.value = '';
    
    // محاكاة رد المشرف (بعد 1-3 ثواني)
    setTimeout(() => {
        const adminResponse = generateAdminResponse(message);
        addMessageToChat('admin', adminResponse);
    }, 1000 + Math.random() * 2000);
}

// إضافة رسالة للدردشة
function addMessageToChat(sender, text) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<strong>${sender === 'user' ? '👤 أنت' : '👑 المشرف'}:</strong> ${text}`;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // حفظ في السجل
    chatMessages.push({ sender, text, time: new Date().toLocaleTimeString() });
    saveChatHistory();
}

// توليد ردود المشرف الذكية
function generateAdminResponse(userMessage) {
    const responses = {
        greeting: [
            "أهلاً وسهلاً بك! 😊 كيف يمكنني مساعدتك اليوم؟",
            "مرحباً بك في CyberShield PRO! كيف أساعدك؟",
            "أهلاً بك! أنا هنا لمساعدتك في أي استفسار"
        ],
        price: [
            "الأسعار مذكورة في صفحة الخدمات. هل تريد خدمة محددة؟",
            "يمكنك رؤية جميع الأسعار في قسم الخدمات. أي خدمة تهتم بها؟",
            "أسعارنا تنافسية وجودتنا مضمونة. أي خدمة تريد معرفة سعرها؟"
        ],
        service: [
            "جميع خدماتنا مذكورة مع تفاصيل كاملة. أي خدمة تريد الاستفسار عنها؟",
            "يمكنني شرح أي خدمة تريدها بالتفصيل. ما هي الخدمة التي تهمك؟",
            "لدينا خدمات متعددة تناسب احتياجاتك. أخبرني بما تبحث عنه"
        ],
        protection: [
            "نقدم حلول حماية متقدمة لجميع احتياجاتك الأمنية",
            "يمكننا حماية أجهزتك وحساباتك من الاختراقات",
            "نحن متخصصون في الحماية الأمنية والوقاية من الهجمات"
        ],
        technical: [
            "فريقنا الفني متاح 24/7 لحل أي مشكلة تواجهك",
            "يمكننا مساعدتك في أي مشكلة تقنية. صف لي المشكلة بالتفصيل",
            "لدينا دعم فني متكامل. ما هي المشكلة التي تواجهك؟"
        ],
        default: [
            "شكراً على رسالتك! سيتم الرد عليك قريباً بتفاصيل أكثر",
            "فهمت استفسارك. دعني أتأكد وأعود إليك بالمعلومات الدقيقة",
            "سأحول سؤالك للفريق المختص وسنعود إليك بالرد قريباً"
        ]
    };

    const message = userMessage.toLowerCase();
    
    if (message.includes('مرحبا') || message.includes('اهلا') || message.includes('السلام')) {
        return getRandomResponse(responses.greeting);
    } else if (message.includes('سعر') || message.includes('كم') || message.includes('ثمن')) {
        return getRandomResponse(responses.price);
    } else if (message.includes('خدمة') || message.includes('حماية') || message.includes('أمان')) {
        return getRandomResponse(responses.service);
    } else if (message.includes('حماية') || message.includes('اختراق') || message.includes('أمن')) {
        return getRandomResponse(responses.protection);
    } else if (message.includes('مشكلة') || message.includes('خطأ') || message.includes('لا يعمل')) {
        return getRandomResponse(responses.technical);
    } else {
        return getRandomResponse(responses.default);
    }
}

// اختيار رد عشوائي
function getRandomResponse(responsesArray) {
    return responsesArray[Math.floor(Math.random() * responsesArray.length)];
}

// حفظ سجل الدردشة
function saveChatHistory() {
    if (chatMessages.length > 50) {
        chatMessages = chatMessages.slice(-50);
    }
    localStorage.setItem('cybershield_chat', JSON.stringify(chatMessages));
}

// تحميل سجل الدردشة
function loadChatHistory() {
    const saved = localStorage.getItem('cybershield_chat');
    if (saved) {
        chatMessages = JSON.parse(saved);
        const chatContainer = document.getElementById('chatMessages');
        chatContainer.innerHTML = '';
        
        chatMessages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}-message`;
            messageDiv.innerHTML = `<strong>${msg.sender === 'user' ? '👤 أنت' : '👑 المشرف'}:</strong> ${msg.text}`;
            chatContainer.appendChild(messageDiv);
        });
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
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
        return true;
    }
    
    const code = Math.floor(10000 + Math.random() * 90000);
    const userCode = prompt(`🔐 تحقق أمني مطلوب\n\nلضمان أمان عملية الشراء، الرجاء إدخال الرمز التالي:\n\n📱 ${code}\n\nهذا التحقق مطلوب مرة واحدة يومياً للحماية`);
    
    if (parseInt(userCode) === code) {
        localStorage.setItem('lastVerificationDate', today);
        localStorage.setItem('userVerified', 'true');
        return true;
    } else {
        alert('❌ رمز التحقق غير صحيح! يُرجى المحاولة مرة أخرى.');
        return false;
    }
}

// 🛒 نظام الشراء المحسن
function initializeBuyButtons() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            buyService(e);
        });
    });
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
    const message = `🛒 طلب خدمة حماية جديدة\n\nالخدمة: ${serviceName}\nالسعر: $${price}\nالعميل: من موقع CyberShield PRO v2\n\nأرغب في شراء هذه الخدمة`;
    const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    
    // تأثير على الزر
    const button = event.target;
    const originalText = button.innerHTML;
    const originalBg = button.style.background;
    
    button.innerHTML = '🚀 جاري التوجيه...';
    button.style.background = 'linear-gradient(45deg, #0088cc, #00ff88)';
    button.disabled = true;
    
    // فتح التليجرام بعد تأثير مرئي
    setTimeout(() => {
        window.open(url, '_blank');
        
        // إعادة الزر إلى وضعه الطبيعي
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg;
            button.disabled = false;
        }, 2000);
    }, 1000);
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
// 🟢 تأثير المصفوفة المتحرك المحسن
// ====================================================

function initializeMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01010101شظثصضذطكمنتالبيسشظثصضذطكمنتالبيس';
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
        // خلفية شبه شفافة للتأثير المتدرج
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // إعداد النص
        ctx.fillStyle = '#00ff88';
        ctx.font = `bold ${fontSize}px 'Courier New', monospace, 'Segoe UI'`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            // تأثير تدرج اللون
            const opacity = Math.random() * 0.5 + 0.5;
            ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            
            ctx.fillText(char, x, y);
            
            // إعادة التعليقات إلى الأعلى بشكل عشوائي
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // تحسين الأداء باستخدام requestAnimationFrame
    let animationId;
    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // إعادة الحجم عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        cancelAnimationFrame(animationId);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        animate();
    });
}

// ====================================================
// 💬 نظام التعليقات
// ====================================================

const commentsData = [
    {name: "سارة", text: "خدمات حماية ممتازة وأسعار معقولة 👍", time: "منذ يوم", verified: true},
    {name: "أحمد", text: "الخدمة سريعة والنتائج مذهلة! شكراً لفريق الدعم 🚀", time: "منذ ساعتين", verified: true},
    {name: "محمد", text: "لقد استخدمت العديد من خدمات الحماية ولكن هذه المنصة تتميز بالجودة العالية.", time: "منذ 5 ساعات", verified: true},
    {name: "فاطمة", text: "تجربة رائعة! الخدمة تعمل بشكل ممتاز وحساباتي الآن آمنة.", time: "منذ يوم", verified: false},
    {name: "خالد", text: "أنصح الجميع بهذه الخدمات، احترافية وسريعة!", time: "منذ 3 أيام", verified: true},
    {name: "علي", text: "حماية ممتازة لألعابي، لم أواجه أي محاولات اختراق.", time: "منذ أسبوع", verified: true}
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
                ${comment.verified ? '<div class="comment-badge">عميل موثوق</div>' : ''}
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
    {q: "ما هو CyberShield PRO؟", a: "منصة متقدمة ومتخصصة في تقديم خدمات الحماية والأمن السيبراني بأدوات متطورة."},
    {q: "هل أدواتكم قانونية وآمنة؟", a: "نعم، جميع أدواتنا قانونية 100% ومصممة للحماية والوقاية من الاختراقات."},
    {q: "كيف أشتري الخدمات؟", a: "اضغط على أي زر طلب الخدمة وسيتم توجيهك مباشرة إلى تليجرام للتواصل مع فريق المبيعات."},
    {q: "ما مدة التفعيل؟", a: "يتم تفعيل معظم الخدمات خلال دقائق بعد تأكيد الدفع."},
    {q: "هل يوجد ضمان؟", a: "نعم، نقدم ضمان استبدال أو استرجاع في حال عدم عمل الخدمة."},
    {q: "ما هي طريقة الدفع المتاحة؟", a: "نقبل العملات المشفرة (Bitcoin, USDT) لضمان خصوصيتك التامة."},
    {q: "هل يمكنني طلب خدمة حماية مخصصة؟", a: "تواصل معنا على تليجرام لطلب خدمات مخصصة، وسنناقش إمكانية تنفيذها."},
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
// 📊 نظام الإحصائيات
// ====================================================

let pageStats = {
    visits: 0,
    buttonClicks: 0,
    servicesViewed: 0
};

// تحميل الإحصائيات من localStorage
if (localStorage.getItem('pageStats')) {
    pageStats = JSON.parse(localStorage.getItem('pageStats'));
}

pageStats.visits++;
localStorage.setItem('pageStats', JSON.stringify(pageStats));

// تتبع نقرات الأزرار
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('buy-btn') || e.target.classList.contains('cta-button')) {
        pageStats.buttonClicks++;
        localStorage.setItem('pageStats', JSON.stringify(pageStats));
    }
});

console.log('📊 Page Statistics:', pageStats);

// ====================================================
// 🚀 نهاية الملف - نظام كامل ومتكامل
// ====================================================

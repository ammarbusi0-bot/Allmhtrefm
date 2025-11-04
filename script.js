// 🔑 التهيئة الرئيسية وتنفيذ منطق تشغيل الموسيقى وإظهار المحتوى
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من أن المستخدم إنسان
    verifyHuman();
    
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
    updatePricesAndDates(); // تحديث الأسعار والتواريخ
    
    // تحديث التعليقات كل 30 دقيقة (30 * 60 * 1000 ميلي ثانية)
    setInterval(displayRandomComments, 30 * 60 * 1000); 
    
    // تحديث الأسعار كل 5 دقائق
    setInterval(updatePricesAndDates, 5 * 60 * 1000);

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

// التحقق من أن المستخدم إنسان
function verifyHuman() {
    const code = Math.floor(100000 + Math.random() * 900000);
    sessionStorage.setItem('verificationCode', code);
    
    const userCode = prompt(`🔐 الرجاء إدخال رمز التحقق: ${code}\nهذا التأكيد يضمن أنك لست روبوت:`);
    
    if (userCode != code) {
        alert('❌ رمز التحقق غير صحيح! سيتم إغلاق الصفحة.');
        window.location.href = 'about:blank';
        return false;
    }
    return true;
}

// إظهار/إخفاء نافذة إخلاء المسؤولية
function showDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'flex';
}

function closeDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'none';
    // بدء تشغيل الموسيقى بعد الموافقة
    document.getElementById('background-audio').play().catch(console.error);
}

// فتح نافذة الدعم
function openSupport() {
    const supportWindow = window.open('', '_blank', 'width=600,height=700,scrollbars=yes');
    supportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>الدعم الفني - ShadowHack PRO v2</title>
            <style>
                body {
                    background: #0a0a0a;
                    color: white;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .chat-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: #1a1a1a;
                    border-radius: 10px;
                    padding: 20px;
                }
                .messages {
                    height: 400px;
                    overflow-y: auto;
                    border: 1px solid #333;
                    padding: 15px;
                    margin-bottom: 20px;
                    background: #0f0f0f;
                }
                .message {
                    margin: 10px 0;
                    padding: 10px;
                    border-radius: 5px;
                }
                .user-message {
                    background: #0088ff;
                    text-align: left;
                }
                .admin-message {
                    background: #00aa44;
                    text-align: right;
                }
                .input-area {
                    display: flex;
                    gap: 10px;
                }
                input, textarea, button {
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                }
                input, textarea {
                    flex: 1;
                    background: #2a2a2a;
                    color: white;
                }
                button {
                    background: #00ff88;
                    color: black;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <h1>💬 الدعم الفني المباشر</h1>
                <p>مرحباً! فريق الدعم جاهز لمساعدتك. اكتب رسالتك وسنرد عليك قريباً.</p>
                
                <div class="messages" id="messages">
                    <div class="message admin-message">
                        <strong>المشرف:</strong> مرحباً! كيف يمكنني مساعدتك؟
                    </div>
                </div>
                
                <div class="input-area">
                    <textarea id="messageInput" placeholder="اكتب رسالتك هنا..." rows="3"></textarea>
                    <button onclick="sendMessage()">إرسال</button>
                </div>
                
                <button onclick="window.close()" style="margin-top: 20px; background: #ff4444;">← إغلاق</button>
            </div>

            <script>
                function sendMessage() {
                    const input = document.getElementById('messageInput');
                    const messages = document.getElementById('messages');
                    
                    if (input.value.trim()) {
                        // رسالة المستخدم
                        const userMsg = document.createElement('div');
                        userMsg.className = 'message user-message';
                        userMsg.innerHTML = '<strong>أنت:</strong> ' + input.value;
                        messages.appendChild(userMsg);
                        
                        // رد المشرف (محاكاة)
                        setTimeout(() => {
                            const adminMsg = document.createElement('div');
                            adminMsg.className = 'message admin-message';
                            adminMsg.innerHTML = '<strong>المشرف:</strong> شكراً على رسالتك. سنرد عليك خلال دقائق.';
                            messages.appendChild(adminMsg);
                            messages.scrollTop = messages.scrollHeight;
                        }, 2000);
                        
                        input.value = '';
                        messages.scrollTop = messages.scrollHeight;
                    }
                }
                
                // إرسال بالزر Enter
                document.getElementById('messageInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
            </script>
        </body>
        </html>
    `);
    supportWindow.document.close();
}

// تحديث الأسعار والتواريخ تلقائياً
function updatePricesAndDates() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formattedDate = now.toLocaleDateString('ar-AR', options);
    
    // تحديث تواريخ الكروت
    document.querySelectorAll('.update-date').forEach(element => {
        element.textContent = formattedDate;
    });
    
    // تحديث الأكثر مبيعاً عشوائياً
    const bestSellerBadges = document.querySelectorAll('.best-seller-badge');
    bestSellerBadges.forEach(badge => {
        if (Math.random() > 0.7) { // 30% فرصة للتغيير
            badge.textContent = Math.random() > 0.5 ? "🔥 الأكثر مبيعاً" : "🎮 الأكثر طلباً";
        }
    });
}

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
// 💬 قاعدة بيانات التعليقات (50 تعليق)
// ----------------------------------------------------
const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24) + 1; // 1 to 24 hours
    if (hours < 10) return `منذ ${hours} ساعات`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return "منذ 1 يوم";
};

const names = ["أبو جود", "أمير الظلام", "ريم الحلبية", "ملك السايبر", "سالم المافيا", "فادي أبو عذاب", "ليث الهاكر", "نجمة السوشيال", "عزوز الرقمي", "سيد الاختراق", "خالد الكاشف", "نور الويب"];

const commentsTexts = [
    "والله يا زلمي شغلكم نخب أول! الهاك تبع ببجي مو طبيعي أبداً. يسلمو إيديكن على هالشغل النظيف.",
    "يا عمي إذا بدك شغل مظبوط، ما في غير هالصفحة. طلبت اختراق تليفوني وضبطوها بلمحة البصر.",
    "أنا كتير كنت خايفة من شغل الهاكات، بس هالشباب مطمئنين كتير. طلبت هاك فري فاير وضبطوه من أول مرة.",
    "جربت كتير مواقع، بس كلها كذب. جربت خدمات اختراق البنوك عندكم وهي اللي عملتلي نقلة نوعية. شغلكم ذهب صافي.",
    "يا لطيف، شي بيجنن! اختراق حساب فيسبوك تم بأقل من نص ساعة. برافو عليكم، عنجد أساطير.",
    "كل التقدير والاحترام لفريقكم. جربت اختراق الهاتف وما توقعت هالسرعة والدقة! عم بيشتغل كأنه تليفوني أنا.",
    "أفضل خدمة اختراق كاميرات استخدمتها على الإطلاق. موثوقية عالية جداً.",
    "استعادة حسابي المفقود تمت بنجاح وبسرعة قياسية. شكراً ShadowHack PRO.",
    "موقع احترافي وفريق عمل متجاوب، خدمة الـ Aimbot في ببجي خرافي.",
    "تحديثاتهم المستمرة تخليهم دايمًا متفوقين. أنصح بالتعامل معهم.",
    "السعر معقول جداً مقارنة بالجودة والضمان اللي يقدموه.",
    "الحمد لله لقيت الموقع الصح. شغل مرتب ومضمون 100%.",
    "اشتريت هاك فيفا موبايل وجبت كل اللعيبة اللي بدي ياهم بدون مشاكل.",
    "خدمة اختراق انستغرام نجحت تماماً كما وُعِدْت.",
    "رهيبين! الفريق متعاون ويشرح كل شي بالتفصيل. برافو.",
    "بصراحة، كنت متردد، لكن التجربة كانت فوق التوقعات.",
    "ما في أي بان (حظر) من اللعبة بفضل تقنية الهاك الآمنة.",
    "دفعت واستلمت الخدمة خلال دقائق. السرعة لا تُصدق.",
    "أكثر من رائعين، خدمة VIP حقيقية.",
    "خمس نجوم قليلة بحقكم. مستوى احترافي عالي.",
    "الهاك يعمل بسلاسة دون أي تعليق أو بطء.",
    "فريق دعم فني ممتاز، ردوا على جميع استفساراتي بسرعة.",
    "ثقة تامة في التعامل. هذا هو موقعي المفضل للخدمات الرقمية.",
    "شغل متقن، والأهم هو الضمان اللي يقدموه.",
    "يا جماعة، لا تضيعوا وقتكم مع غيرهم. هذول هم الأصل.",
    "تجربة فريدة ومختلفة عن أي موقع آخر.",
    "كل التوفيق للفريق، خدماتهم ساعدتني كثيراً.",
    "تم اختراق الحساب المطلوب في وقت قياسي جداً.",
    "فعلاً إمبراطورية الاختراق السوداء. عمل جبار.",
    "التحكم بالهاتف الكامل صار أسهل مما تخيلت.",
    "خدمة ممتازة وسعر مناسب، شكرًا لكم.",
    "ما توقعت أبدًا هالسرعة في إنجاز المهمة.",
    "أفضل استثمار قمت به مؤخراً. خدمات قيمة.",
    "من الآن فصاعداً، لن أتعامل إلا مع هذا الموقع.",
    "الخدمة شغالة بكفاءة عالية جداً.",
    "تفوقوا على كل المواقع اللي جربتها قبلهم.",
    "الموقع آمن وموثوق، والنتائج مذهلة.",
    "محتوى غير قابل للكشف، هذا هو الأهم بالنسبة لي.",
    "الخدمات متطورة وتستحق كل دولار.",
    "ببساطة: الأفضل في المجال، لا جدال.",
    "تجربة خمس نجوم بكل المقاييس.",
    "أعادوا لي الثقة في الخدمات المدفوعة.",
    "سرعة، دقة، احترافية. هذا ما يميزهم.",
    "طلبي كان صعباً جداً، لكنهم أنجزوه بسهولة.",
    "شغل نظيف ونتائج مضمونة.",
    "أنصح بشدة بخدمة اختراق الحسابات الشخصية.",
    "فخور بالتعامل مع فريق بهذه الجودة.",
    "الهاك يعمل بشكل مستقر ولم أتلق أي حظر.",
    "كانوا عند حسن الظن وأكثر.",
    "منصة لا تُقارن، خدماتها فريدة.",
    // تعليقات جديدة قصيرة
    "ممتاز! ⭐⭐⭐⭐⭐",
    "شكراً للدعم السريع",
    "أسعار مناسبة جداً",
    "جودة عالية",
    "أنصح الجميع",
    // تعليقات جديدة طويلة
    "لقد قمت بشراء خدمة اختراق الهاتف وكانت النتيجة مذهلة. الفريق محترف جداً ويشرح كل شيء بالتفصيل. الدعم الفني متواجد 24/7 ويحل أي مشكلة تواجهك. أنصح كل من يبحث عن خدمات موثوقة أن يتعامل مع هذا الموقع الرائع.",
    "تجربتي مع الموقع كانت أكثر من رائعة. من حيث السرعة في التوصيل والدقة في التنفيذ والجودة في الخدمة. فريق العمل محترف ويقدم دعماً فنياً ممتازاً. الأسعار معقولة جداً مقارنة بالجودة المقدمة.",
    "استخدمت العديد من المواقع المشابهة ولكن هذا الموقع يتميز عن الجميع. الخدمات محدثة دائماً والأسعار منافسة. الدعم الفني سريع الاستجابة ويحل جميع المشاكل باحترافية. أنصح الجميع بتجربة خدماتهم."
];

const fakeComments = [];
for(let i = 0; i < 55; i++) {
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

// وظيفة الشراء - توجيه لتليجرام
function buyService(event) {
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

// إظهار نافذة إخلاء المسؤولية عند التحميل
window.onload = function() {
    showDisclaimer();
};

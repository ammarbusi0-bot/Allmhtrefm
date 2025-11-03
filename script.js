// تأثيرات الموقع المتقدمة
document.addEventListener('DOMContentLoaded', function() {
    
    // تأثير المصفوفة في الخلفية
    function createMatrixEffect() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.className = 'bg-effects';
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01010101شظثصضذطكمنتالبيسشظثصضذطكمنتالبيس';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * canvas.height;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff88';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 35);
    }

    // التنقل السلس بين الأقسام
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // تأثير الظهور عند التمرير
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // تطبيق التأثير على العناصر
        document.querySelectorAll('.service-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // وظيفة الشراء (تم تحديثها لتستخدم تليجرام كما في آخر طلب)
    window.buyService = function(serviceName, price) {
        const telegramUsername = "Talaa_almalika";
        
        // رابط تليجرام مباشر
        const url = `https://t.me/${telegramUsername}`;

        // تأثير بصري على الزر (يجب أن يكون 'event' معرفاً)
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'جاري التوجيه... 🚀';
        button.style.background = 'linear-gradient(45deg, #ff0088, #8800ff)';
        
        // فتح التليجرام في نافذة جديدة
        window.open(url, '_blank');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(45deg, var(--accent), var(--secondary))';
            
            alert(`✅ تم توجيهك إلى تليجرام\n\nراسل @${telegramUsername} لشراء ${serviceName}`);
        }, 1500);
    }
    
    // إعادة حجم العناصر عند تغيير حجم النافذة
    function handleResize() {
        const canvas = document.querySelector('.bg-effects');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // تهيئة جميع الوظائف
    function initAll() {
        createMatrixEffect();
        initSmoothScroll();
        initScrollAnimations();
        
        window.addEventListener('resize', handleResize);
        
        console.log('🌑 ShadowHack PRO v5.0 - تم التحميل بنجاح!');
    }

    // بدء التشغيل
    initAll();
});

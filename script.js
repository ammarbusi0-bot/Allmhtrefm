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

    // وظيفة الشراء المحسنة
    function initBuyButtons() {
        window.buyService = function(serviceName, price) {
            // تأثير صوتي لو كان متاح
            if (typeof Audio !== 'undefined') {
                const clickSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
                clickSound.volume = 0.1;
                clickSound.play().catch(() => {});
            }

            // تأثير بصري على الزر
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'جاري التوجيه... 🚀';
            button.style.background = 'linear-gradient(45deg, #ffff00, #ff0000)';
            
            // رقم واتساب افتراضي
            const phone = "+201234567890";
            const message = `أريد شراء ${serviceName} بسعر $${price} من ShadowHack PRO`;
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                window.open(url, '_blank');
                
                // إعادة الزر لحالته الأصلية بعد ثانية
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(45deg, var(--accent), var(--secondary))';
                }, 1000);
                
            }, 500);
        }
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
        initBuyButtons();
        
        window.addEventListener('resize', handleResize);
        
        // إضافة رسالة ترحيب في الكونسول (للمطورين)
        console.log('🌑 ShadowHack PRO v5.0 - تم التحميل بنجاح!');
        console.log('🚀 الموقع جاهز للعمل');
    }

    // بدء التشغيل
    initAll();
});

// وظائف إضافية للتحكم بالموقع
const ShadowHack = {
    // تغيير السمة (Theme)
    toggleTheme: function() {
        document.body.classList.toggle('light-mode');
    },
    
    // إظهار/إخفاء القائمة
    toggleMenu: function() {
        const nav = document.querySelector('.nav-links');
        if (nav) {
            nav.classList.toggle('active');
        }
    },
    
    // إرسال إشعار
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff0000' : '#00ff88'};
            color: #000;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

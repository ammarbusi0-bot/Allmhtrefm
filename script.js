// 🔑 التهيئة الرئيسية المحسنة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ShadowHack PRO v2 - Initializing Fake System...');
    
    // العناصر الأساسية
    const audio = document.getElementById('background-audio');
    const ctaButton = document.getElementById('ctaButton');
    const hiddenSections = document.querySelectorAll('.services, .features-section, .comments-section, .community-section, .footer');
    
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
                fakeDataGenerator.playSoundEffect('background');
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
            fakeDataGenerator.playSoundEffect('click');
            
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
        initializeFakeSystems();
        initializeBuyButtons();
        
        console.log('✅ All fake systems initialized successfully');
    }

    // بدء التهيئة
    initializeAll();
});

// ====================================================
// 🎭 الأنظمة الوهمية
// ====================================================

function initializeFakeSystems() {
    // عرض التعليقات الوهمية
    displayFakeComments();
    
    // عرض محادثات المجتمع
    displayCommunityPreview();
    
    // بدء محاكاة الدردشة الحية
    startChatSimulation();
    
    // تحديث تلقائي للبيانات
    setInterval(updateFakeData, 30000); // كل 30 ثانية
}

// عرض التعليقات الوهمية
function displayFakeComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    container.innerHTML = '';
    
    // عرض 6 تعليقات عشوائية
    for (let i = 0; i < 6; i++) {
        const comment = fakeDataGenerator.generateRandomComment();
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-badge">مشترٍ موثوق</div>
                <div class="comment-name">${comment.name}</div>
            </div>
            <div class="comment-text">"${comment.text}"</div>
            <div class="comment-stars">${'⭐'.repeat(comment.rating)}</div>
            <div class="comment-time">${comment.time}</div>
        `;
        container.appendChild(commentDiv);
    }
}

// عرض معاينة المجتمع
function displayCommunityPreview() {
    const container = document.getElementById('communityPreview');
    if (!container) return;

    container.innerHTML = '';
    
    // عرض 3 مناقشات عشوائية
    for (let i = 0; i < 3; i++) {
        const post = fakeForumPosts[Math.floor(Math.random() * fakeForumPosts.length)];
        const postDiv = document.createElement('div');
        postDiv.className = 'forum-preview';
        postDiv.style.cssText = 'background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-bottom: 1rem; border: 1px solid #333;';
        postDiv.innerHTML = `
            <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${post.title}</h4>
            <p style="color: #ccc; margin-bottom: 0.5rem; font-size: 0.9rem;">${post.content}</p>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #888;">
                <span>👤 ${post.user}</span>
                <span>💬 ${post.comments} رد</span>
            </div>
        `;
        container.appendChild(postDiv);
    }
}

// محاكاة الدردشة الحية
function startChatSimulation() {
    const chatContainer = document.getElementById('groupChatMessages');
    if (!chatContainer) return;

    // عرض الرسائل الأولية
    fakeChatMessages.forEach(msg => {
        addChatMessage(msg.user, msg.message, msg.time);
    });

    // إضافة رسائل جديدة بشكل عشوائي
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% فرصة لإضافة رسالة جديدة
            const newMessage = fakeDataGenerator.generateRandomChatMessage();
            addChatMessage(newMessage.user, newMessage.message, newMessage.time);
        }
    }, 10000); // كل 10 ثواني
}

// إضافة رسالة للدردشة
function addChatMessage(user, message, time) {
    const chatContainer = document.getElementById('groupChatMessages');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.style.cssText = 'margin-bottom: 1rem; padding: 0.8rem; background: rgba(0,255,136,0.1); border-radius: 10px; border-right: 3px solid var(--primary);';
    messageDiv.innerHTML = `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="color: var(--primary);">${user}</strong>
            <small style="color: #888; margin-right: auto; margin-left: 1rem;">${time}</small>
        </div>
        <div style="color: #ccc;">${message}</div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// تحديث البيانات الوهمية
function updateFakeData() {
    // تحديث التعليقات بشكل عشوائي
    if (Math.random() > 0.8) {
        displayFakeComments();
    }
    
    // تحديث معاينة المجتمع بشكل عشوائي
    if (Math.random() > 0.8) {
        displayCommunityPreview();
    }
}

// ====================================================
// 💰 نظام الخصم الوهمي
// ====================================================

function applyDiscount(code) {
    fakeDataGenerator.playSoundEffect('click');
    
    const result = fakeDataGenerator.validateDiscountCode(code);
    
    if (result.valid) {
        // تأثير بصري للخصم
        showDiscountEffect(result.discount);
        alert(`🎉 تم تطبيق خصم ${result.discount}% بنجاح!`);
    } else {
        alert('❌ كود الخصم غير صالح أو منتهي الصلاحية');
    }
}

function showDiscountEffect(discount) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: var(--primary);
        z-index: 10000;
        animation: discountPop 1s ease-out;
    `;
    effect.innerHTML = `🎁 ${discount}% خصم`;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// ====================================================
// 🎪 إدارة النوافذ
// ====================================================

function openGroupChat() {
    fakeDataGenerator.playSoundEffect('notification');
    document.getElementById('groupChatModal').style.display = 'flex';
}

function closeGroupChat() {
    document.getElementById('groupChatModal').style.display = 'none';
}

// ====================================================
// 🛒 نظام الشراء
// ====================================================

function initializeBuyButtons() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            fakeDataGenerator.playSoundEffect('purchase');
            simulatePurchase(e);
        });
    });
}

function simulatePurchase(event) {
    const serviceCard = event.target.closest('.service-card');
    const serviceName = serviceCard.getAttribute('data-name');
    const price = serviceCard.getAttribute('data-price');
    
    // تأثير الشراء
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '🚀 جاري المعالجة...';
    button.disabled = true;
    
    setTimeout(() => {
        alert(`🎊 تم شراء ${serviceName} بنجاح!\nسيتم التواصل معك على التليجرام قريباً.`);
        button.innerHTML = originalText;
        button.disabled = false;
        
        // إضافة تعليق وهمي جديد
        setTimeout(() => {
            displayFakeComments();
        }, 2000);
        
    }, 2000);
}

// ====================================================
// 🟢 تأثير المصفوفة
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
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            const opacity = Math.random() * 0.5 + 0.5;
            ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            
            ctx.fillText(char, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let animationId;
    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', function() {
        cancelAnimationFrame(animationId);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        animate();
    });
}

// ====================================================
// ⚠️ نظام إخلاء المسؤولية
// ====================================================

function showDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'flex';
}

function closeDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'none';
    document.getElementById('background-audio').play().catch(console.error);
}

// ====================================================
// 🎯 وظائف مساعدة
// ====================================================

function showFeatureDetails(title, details) {
    fakeDataGenerator.playSoundEffect('click');
    alert(`🛡️ ${title}\n\n${details}`);
}

// التنقل السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.id !== 'ctaButton') {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            fakeDataGenerator.playSoundEffect('click');
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

// إضافة أنيميشن الخصم
const style = document.createElement('style');
style.textContent = `
    @keyframes discountPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    .discount-code {
        display: inline-block;
        background: linear-gradient(45deg, var(--primary), var(--accent));
        color: black;
        padding: 0.5rem 1rem;
        margin: 0.5rem;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .discount-code:hover {
        transform: scale(1.1);
        box-shadow: 0 0 15px var(--primary);
    }
`;
document.head.appendChild(style);

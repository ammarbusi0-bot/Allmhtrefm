// بيانات المستخدم والنظام
let userData = JSON.parse(localStorage.getItem('userData')) || null;
let featuresActivated = localStorage.getItem('featuresActivated') === 'true';
let chatInterval;
let usedNames = new Set();
let messageCount = 0;
let currentConversation = [];

// صور أفترارية
const avatars = {
    boy1: "👦",
    boy2: "👨", 
    boy3: "🧔",
    girl1: "👧",
    girl2: "👩",
    girl3: "🧕"
};

// تحديث معاينة الصورة
function updateAvatarPreview() {
    const avatarSelect = document.getElementById('avatar');
    const preview = document.getElementById('avatarPreview');
    if (avatarSelect.value && avatars[avatarSelect.value]) {
        preview.textContent = avatars[avatarSelect.value];
        preview.style.fontSize = '80px';
        preview.style.display = 'flex';
        preview.style.alignItems = 'center';
        preview.style.justifyContent = 'center';
    }
}

// فحص إذا كان المستخدم مسجل الدخول
function checkUserLogin() {
    if (!userData) {
        showNotification('يرجى إنشاء حساب أولاً للوصول إلى هذه الميزة', 'error');
        document.getElementById('signupModal').style.display = 'flex';
        return false;
    }
    return true;
}

// عند تحميل الصفحة
window.onload = function() {
    if (userData) {
        updateProfileData();
    } else {
        // فتح نافذة التسجيل بعد ثانية إذا لم يكن المستخدم مسجلاً
        setTimeout(() => {
            document.getElementById('signupModal').style.display = 'flex';
        }, 1000);
    }
    
    // تأثيرات عند التحميل
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // تأثير العداد
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/,/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
};

// إظهار الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// إرسال نموذج إنشاء الحساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const avatar = document.getElementById('avatar').value;
    const gender = document.getElementById('gender').value;
    const interest = document.getElementById('interest').value;
    
    if (!name || !birthdate || !avatar || !gender || !interest) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // حساب العمر
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
        showNotification('يجب أن يكون عمرك 18 سنة أو أكثر', 'error');
        return;
    }
    
    userData = {
        name: name,
        birthdate: birthdate,
        age: age,
        avatar: avatar,
        gender: gender,
        interest: interest,
        id: Math.floor(10000 + Math.random() * 90000),
        joinDate: new Date().toLocaleDateString('ar-EG'),
        isPremium: false,
        messageCount: 0,
        lastActive: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('signupModal').style.display = 'none';
    
    // تحديث بيانات المستخدم
    updateProfileData();
    
    // إظهار رسالة ترحيب
    setTimeout(() => {
        showNotification(`مرحباً ${name}! 😊 تم إنشاء حسابك بنجاح. استمتع بتجربتك في قُلوب 💖`);
    }, 500);
});

// تحديث بيانات الملف الشخصي
function updateProfileData() {
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userId').textContent = `ID: ${userData.id}`;
        document.getElementById('userGender').textContent = `الجنس: ${userData.gender === 'male' ? 'ذكر' : 'أنثى'}`;
        document.getElementById('userAge').textContent = `العمر: ${userData.age} سنة`;
        
        let interestText = '';
        switch(userData.interest) {
            case 'friendship': interestText = 'صداقة'; break;
            case 'relationship': interestText = 'علاقة'; break;
            case 'marriage': interestText = 'زواج'; break;
            default: interestText = userData.interest;
        }
        document.getElementById('userInterest').textContent = `المهتم بـ: ${interestText}`;
        
        // تحديث الصورة الشخصية
        const avatarPreview = document.querySelector('#profileModal .avatar-preview');
        if (avatarPreview && avatars[userData.avatar]) {
            avatarPreview.textContent = avatars[userData.avatar];
            avatarPreview.style.fontSize = '80px';
            avatarPreview.style.display = 'flex';
            avatarPreview.style.alignItems = 'center';
            avatarPreview.style.justifyContent = 'center';
        }
        
        // تحديث حالة العضوية
        const membershipElement = document.querySelector('.membership-status');
        if (userData.isPremium) {
            membershipElement.innerHTML = '<span class="premium-badge">👑 عضو مميز</span>';
        } else {
            membershipElement.innerHTML = '<span class="free-badge">🆓 حساب مجاني</span>';
        }
    }
}

// إعادة التوجيه إلى تلجرام مع نوع الخدمة
function redirectToTelegram(serviceType) {
    const serviceNames = {
        'diamond_chat': 'الدردشة الماسية',
        'premium_match': 'التعارف المميز', 
        'elite_consult': 'استشارات النخبة',
        'support': 'الدعم الفني',
        'terms': 'الشروط والأحكام',
        'privacy': 'الخصوصية'
    };
    
    const serviceName = serviceNames[serviceType] || 'الخدمة';
    
    showNotification(`جاري توجيهك إلى ${serviceName}... 🚀`, 'success');
    
    setTimeout(() => {
        window.location.href = "https://t.me/Mariyemqp";
    }, 2000);
}

// تفعيل المميزات والأكواد
function activateFeatures() {
    const codeInput = document.getElementById('featureCode');
    const code = codeInput.value.trim();
    
    const validCodes = {
        'حب': 'خصم 10% على جميع الباقات! 💖',
        'رومانسية': 'خصم 15% حصري! 🌹',
        'عشق': 'خصم 20% لمدة محدودة! 🔥',
        'غرام': 'خصم 25% واحصل على جلسة استشارية مجانية! 💫',
        'قمر': 'خصم 30% مع عضوية مجانية لشهر! 🌙'
    };
    
    if (validCodes[code]) {
        featuresActivated = true;
        localStorage.setItem('featuresActivated', 'true');
        
        showNotification(`🎉 ${validCodes[code]}`, 'success');
        
        // تأثير خاص للتفعيل
        document.querySelectorAll('.card').forEach(card => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => card.style.transform = '', 1000);
        });
        
        codeInput.value = '';
    } else {
        showNotification('❌ الكود غير صحيح. جرب أحد الأكواد التالية: حب, رومانسية, عشق, غرام, قمر', 'error');
        codeInput.value = '';
        codeInput.focus();
    }
}

// تأثيرات التمرير
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card');
    const scrolled = window.pageYOffset;
    
    cards.forEach((card, index) => {
        const rate = scrolled * -0.5;
        card.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
    });
});

// إضافة تفاعل مع الأكواد عند الضغط على Enter
document.getElementById('featureCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        activateFeatures();
    }
});

// تأثيرات hover إضافية
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// فتح نافذة الدردشة العامة
function openChat() {
    if (!checkUserLogin()) return;
    
    document.getElementById('chatModal').style.display = 'flex';
    usedNames.clear();
    messageCount = 0;
    currentConversation = [];
    startChatSimulation();
}

// إغلاق نافذة الدردشة العامة
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
    clearInterval(chatInterval);
    
    // إزالة مؤشر الكتابة إذا كان موجوداً
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// الحصول على اسم عشوائي لم يستخدم من قبل
function getRandomName() {
    const allUsers = [...chatData.boys, ...chatData.girls];
    const availableNames = allUsers.filter(user => !usedNames.has(user.name));
    
    if (availableNames.length === 0) {
        usedNames.clear();
        return allUsers[Math.floor(Math.random() * allUsers.length)];
    }
    
    const randomUser = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(randomUser.name);
    return randomUser;
}

// إنشاء محادثة عشوائية
function generateRandomConversation() {
    const conversation = [];
    const numMessages = Math.floor(Math.random() * 6) + 5; // 5-10 رسائل
    
    let lastUser = null;
    let replyChain = null;
    
    for (let i = 0; i < numMessages; i++) {
        const user = getRandomName();
        const isBoy = chatData.boys.some(boy => boy.name === user.name);
        
        let message;
        let replyTo = null;
        
        // 30% فرصة للرد على رسالة سابقة
        if (conversation.length > 0 && Math.random() < 0.3 && !replyChain) {
            const randomPrevious = conversation[Math.floor(Math.random() * conversation.length)];
            replyTo = randomPrevious;
            replyChain = user.name;
            
            const replies = isBoy ? 
                chatData.interactiveMessages.filter(msg => msg.includes('شو') || msg.includes('بدي')) :
                chatData.girlsMessages.filter(msg => msg.includes('بدي') || msg.includes('شو'));
            
            message = replies[Math.floor(Math.random() * replies.length)];
        } else if (replyChain === user.name) {
            // استمرار سلسلة الردود
            const replies = isBoy ? chatData.boysMessages : chatData.girlsMessages;
            message = replies[Math.floor(Math.random() * replies.length)];
        } else {
            // رسالة عادية
            const messageType = Math.random();
            if (messageType < 0.6) {
                message = isBoy ? 
                    chatData.boysMessages[Math.floor(Math.random() * chatData.boysMessages.length)] :
                    chatData.girlsMessages[Math.floor(Math.random() * chatData.girlsMessages.length)];
            } else if (messageType < 0.8) {
                message = chatData.interactiveMessages[Math.floor(Math.random() * chatData.interactiveMessages.length)];
            } else {
                message = chatData.discussionTopics[Math.floor(Math.random() * chatData.discussionTopics.length)];
            }
            replyChain = null;
        }
        
        conversation.push({
            user: user,
            message: message,
            isBoy: isBoy,
            replyTo: replyTo,
            timestamp: new Date().getTime() + i * 60000
        });
        
        lastUser = user;
    }
    
    return conversation;
}

// محاكاة الدردشة بشكل واقعي
function startChatSimulation() {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '';
    
    // إنشاء محادثة عشوائية جديدة
    currentConversation = generateRandomConversation();
    
    // عرض المحادثة مع تأثيرات متتالية
    displayConversationWithEffects();
    
    // بدء إضافة رسائل جديدة بشكل عشوائي
    chatInterval = setInterval(() => {
        if (messageCount >= 25) {
            clearInterval(chatInterval);
            addMessage("النظام", "💝 هذه نهاية المحادثة التجريبية. اشترك في العضوية المميزة للوصول إلى محادثات حقيقية!", false, false);
            return;
        }
        
        addRandomMessage();
    }, 4000 + Math.random() * 6000);
}

// عرض المحادثة مع تأثيرات
function displayConversationWithEffects() {
    currentConversation.forEach((msg, index) => {
        setTimeout(() => {
            displayMessage(msg);
            messageCount++;
        }, index * 1200);
    });
}

// عرض رسالة مع التاغات
function displayMessage(msg) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    let messageClass = `message ${msg.isBoy ? 'sent' : 'received'}`;
    if (msg.user.premium) {
        messageClass += ' message-premium';
    }
    
    let messageContent = '';
    
    // إضافة تاغ الرد إذا كان هناك رد
    if (msg.replyTo) {
        messageContent += `
            <div class="reply-tag">
                ↳ رد على <strong>${msg.replyTo.user.name}</strong>: ${msg.replyTo.message.substring(0, 30)}...
            </div>
        `;
    }
    
    messageContent += `<strong>${msg.user.name} ${msg.user.premium ? '👑' : ''}</strong> ${msg.message}`;
    
    messageDiv.className = messageClass;
    messageDiv.innerHTML = messageContent;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// إضافة رسالة عشوائية جديدة
function addRandomMessage() {
    const user = getRandomName();
    const isBoy = chatData.boys.some(boy => boy.name === user.name);
    
    let message;
    let replyTo = null;
    
    // 40% فرصة للرد على رسالة سابقة من المحادثة الحالية
    if (currentConversation.length > 0 && Math.random() < 0.4) {
        const randomPrevious = currentConversation[Math.floor(Math.random() * currentConversation.length)];
        replyTo = randomPrevious;
        
        const replies = isBoy ? 
            chatData.interactiveMessages.filter(msg => msg.includes('شو') || msg.includes('بدي')) :
            chatData.girlsMessages.filter(msg => msg.includes('بدي') || msg.includes('شو'));
        
        message = replies[Math.floor(Math.random() * replies.length)];
    } else {
        // رسالة عادية
        const messageType = Math.random();
        if (messageType < 0.6) {
            message = isBoy ? 
                chatData.boysMessages[Math.floor(Math.random() * chatData.boysMessages.length)] :
                chatData.girlsMessages[Math.floor(Math.random() * chatData.girlsMessages.length)];
        } else if (messageType < 0.8) {
            message = chatData.interactiveMessages[Math.floor(Math.random() * chatData.interactiveMessages.length)];
        } else {
            message = chatData.discussionTopics[Math.floor(Math.random() * chatData.discussionTopics.length)];
        }
    }
    
    const newMessage = {
        user: user,
        message: message,
        isBoy: isBoy,
        replyTo: replyTo,
        timestamp: new Date().getTime()
    };
    
    currentConversation.push(newMessage);
    
    // مؤشر الكتابة
    showTypingIndicator(user);
    
    setTimeout(() => {
        removeTypingIndicator(user.name);
        displayMessage(newMessage);
        messageCount++;
    }, 1500 + Math.random() * 2000);
}

// إظهار مؤشر الكتابة
function showTypingIndicator(user) {
    const chatContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = `typing-${user.name}`;
    typingDiv.innerHTML = `
        <strong>${user.name}</strong>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// إزالة مؤشر الكتابة
function removeTypingIndicator(userName) {
    const typingIndicator = document.getElementById(`typing-${userName}`);
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// فتح نافذة الملف الشخصي
function openProfile() {
    if (!checkUserLogin()) return;
    
    updateProfileData();
    document.getElementById('profileModal').style.display = 'flex';
}

// إغلاق نافذة الملف الشخصي
function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

// إضافة رسالة مباشرة (للاستخدام في نهاية المحادثة)
function addMessage(sender, text, isBoy, isPremium) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    const messageClass = `message ${isBoy ? 'sent' : 'received'} ${isPremium ? 'message-premium' : ''}`;
    
    messageDiv.className = messageClass;
    messageDiv.innerHTML = `<strong>${sender} ${isPremium ? '👑' : ''}</strong> ${text}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// بيانات المستخدم والنظام
let userData = JSON.parse(localStorage.getItem('userData')) || null;
let featuresActivated = localStorage.getItem('featuresActivated') === 'true';
let chatInterval;
let usedNames = new Set();
let messageCount = 0;

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
    updateCounters();
    if (userData) {
        updateProfileData();
        showNotification(`مرحباً بعودتك ${userData.name}! 💖`, 'success');
    }
    
    // فتح نافذة التسجيل بعد ثانية إذا لم يكن المستخدم مسجلاً
    setTimeout(() => {
        if (!userData) {
            document.getElementById('signupModal').style.display = 'flex';
        }
    }, 1500);
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

// تحديث العدادات
function updateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// إرسال نموذج إنشاء الحساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const interest = document.getElementById('interest').value;
    
    if (!name || !birthdate || !gender || !interest) {
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
        
        // تشغيل الموسيقى إذا كانت متاحة
        if (window.musicSystem && !window.musicSystem.isPlaying) {
            setTimeout(() => window.musicSystem.play(), 1000);
        }
    }, 500);
});

// تحديث بيانات الملف الشخصي
function updateProfileData() {
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userId').textContent = `ID: ${userData.id}`;
        document.getElementById('userGender').textContent = `الجنس: ${userData.gender === 'male' ? 'ذكر' : 'أنثى'}`;
        
        let interestText = '';
        switch(userData.interest) {
            case 'friendship': interestText = 'صداقة'; break;
            case 'relationship': interestText = 'علاقة'; break;
            case 'marriage': interestText = 'زواج'; break;
            default: interestText = userData.interest;
        }
        document.getElementById('userInterest').textContent = `المهتم بـ: ${interestText}`;
        document.getElementById('userJoinDate').textContent = `تاريخ الانضمام: ${userData.joinDate}`;
        
        // تحديث حالة العضوية
        const membershipElement = document.querySelector('.membership-status');
        if (userData.isPremium) {
            membershipElement.innerHTML = '<span class="premium-badge">👑 عضو مميز</span>';
        } else {
            membershipElement.innerHTML = '<span class="free-badge">🆓 حساب مجاني</span>';
        }
    }
}

// إعادة التوجيه إلى تلجرام
function redirectToTelegram() {
    showNotification('جاري التوجيه إلى قناة الاشتراك...', 'success');
    setTimeout(() => {
        window.location.href = "https://t.me/Mariyemqp";
    }, 1500);
}

// فتح نافذة الدردشة العامة
function openChat() {
    if (!checkUserLogin()) return;
    
    document.getElementById('chatModal').style.display = 'flex';
    usedNames.clear();
    messageCount = 0;
    startChatSimulation();
    
    // تحديث إحصائيات الدردشة
    updateChatStats();
}

// إغلاق نافذة الدردشة العامة
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
    clearInterval(chatInterval);
    
    // إزالة مؤشر الكتابة إذا كان موجوداً
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// تحديث إحصائيات الدردشة
function updateChatStats() {
    const onlineCount = Math.floor(Math.random() * 15) + 20;
    const premiumCount = Math.floor(Math.random() * 8) + 12;
    const activeCount = Math.floor(Math.random() * 20) + 25;
    
    document.querySelector('.online-count').textContent = `🟢 ${onlineCount} متصل الآن`;
    document.querySelector('.premium-count').textContent = `👑 ${premiumCount} مشترك مميز`;
    document.querySelector('.active-count').textContent = `💬 ${activeCount} في محادثة`;
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

// محاكاة الدردشة العامة بشكل واقعي
function startChatSimulation() {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '';
    
    // إضافة رسائل أولية واقعية
    addMessage("أحمد 👑", "مساء الخير يا جماعة 💖 في بنت حابة تتعرف على شاب جاد؟", true, true);
    setTimeout(() => {
        addMessage("سارة 👑", "مساء النور 🌹 أنا مهتمة بالتعرف على أشخاص محترمين", false, true);
    }, 2000);
    
    setTimeout(() => {
        addMessage("محمد", "بدي أتعرف على بنت من حلب للزواج 👰", true, false);
    }, 4000);
    
    setTimeout(() => {
        addMessage("ليلى", "أنا من حلب 🌸 بدي أتعرف أكثر قبل أي خطوة", false, false);
    }, 6000);

    // بدء المحاكاة بعد الرسائل الأولية
    setTimeout(() => {
        chatInterval = setInterval(generateRandomMessage, 3000 + Math.random() * 4000);
    }, 8000);
}

// توليد رسالة عشوائية
function generateRandomMessage() {
    if (messageCount >= 50) {
        clearInterval(chatInterval);
        addMessage("النظام", "💝 هذه نهاية المحادثة التجريبية. اشترك في العضوية المميزة للوصول إلى محادثات حقيقية!", false, false);
        return;
    }

    const randomUser = getRandomName();
    const isBoy = chatData.boys.some(boy => boy.name === randomUser.name);
    
    // مؤشر الكتابة
    showTypingIndicator(randomUser);
    
    // تأخير قبل إظهار الرسالة
    setTimeout(() => {
        removeTypingIndicator(randomUser.name);
        
        let randomMessage;
        const messageType = Math.random();
        
        if (messageType < 0.4) {
            // رسائل عادية
            randomMessage = isBoy ? 
                chatData.boysMessages[Math.floor(Math.random() * chatData.boysMessages.length)] :
                chatData.girlsMessages[Math.floor(Math.random() * chatData.girlsMessages.length)];
        } else if (messageType < 0.7) {
            // رسائل تفاعلية
            randomMessage = chatData.interactiveMessages[Math.floor(Math.random() * chatData.interactiveMessages.length)];
        } else if (messageType < 0.85) {
            // مواضيع نقاشية
            randomMessage = chatData.discussionTopics[Math.floor(Math.random() * chatData.discussionTopics.length)];
        } else {
            // رسائل مع حسابات اجتماعية
            const baseMessage = isBoy ? 
                chatData.boysMessages[Math.floor(Math.random() * chatData.boysMessages.length)] :
                chatData.girlsMessages[Math.floor(Math.random() * chatData.girlsMessages.length)];
            const socialAccount = chatData.socialAccounts[Math.floor(Math.random() * chatData.socialAccounts.length)];
            randomMessage = `${baseMessage}\n${socialAccount}`;
        }

        addMessage(
            `${randomUser.name} ${randomUser.premium ? '👑' : ''}`,
            randomMessage,
            isBoy,
            randomUser.premium
        );
        
        messageCount++;
        updateChatStats();
        
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

// إضافة رسالة إلى الدردشة
function addMessage(user, message, isBoy, isPremium = false) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    let messageClass = `message ${isBoy ? 'sent' : 'received'}`;
    if (isPremium) {
        messageClass += ' message-premium';
    }
    
    messageDiv.className = messageClass;
    messageDiv.innerHTML = `<strong>${user}:</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
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

// تفعيل المميزات
function activateFeatures() {
    const codeInput = document.getElementById('featureCode');
    const code = codeInput.value.trim();
    
    if (chatData.featureCodes[code]) {
        featuresActivated = true;
        userData.isPremium = true;
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('featuresActivated', 'true');
        codeInput.value = '';
        updateProfileData();
        showNotification('🎉 تم تفعيل المميزات بنجاح! يمكنك الآن استخدام جميع خصائص الموقع.');
        
        // تأثير خاص للتفعيل
        document.querySelectorAll('.card').forEach(card => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => card.style.transform = '', 500);
        });
    } else {
        showNotification('❌ الكود غير صحيح. يرجى المحاولة مرة أخرى.', 'error');
        codeInput.value = '';
        codeInput.focus();
    }
}

// تحديث عداد المتصلين كل 15 ثانية
setInterval(updateChatStats, 15000);

// تأثيرات التمرير
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.3;
    
    cards.forEach((card, index) => {
        card.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
    });
});

// تحديث العدادات أول مرة
updateChatStats();

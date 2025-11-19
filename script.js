// بيانات المستخدم
let userData = JSON.parse(localStorage.getItem('userData'));
let featuresActivated = localStorage.getItem('featuresActivated') === 'true';
let chatInterval;
let usedNames = new Set();

// فحص إذا كان المستخدم مسجل الدخول
function checkUserLogin() {
    if (!userData) {
        document.getElementById('signupModal').style.display = 'flex';
        return false;
    }
    return true;
}

// عند تحميل الصفحة
window.onload = function() {
    if (userData) {
        updateProfileData();
    }
    
    // فتح نافذة التسجيل إذا لم يكن المستخدم مسجلاً
    setTimeout(() => {
        if (!userData) {
            document.getElementById('signupModal').style.display = 'flex';
        }
    }, 1000);
};

// إرسال نموذج إنشاء الحساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const interest = document.getElementById('interest').value;
    
    if (!name || !birthdate || !gender || !interest) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    userData = {
        name: name,
        birthdate: birthdate,
        gender: gender,
        interest: interest,
        id: Math.floor(10000 + Math.random() * 90000),
        joinDate: new Date().toISOString().split('T')[0],
        isPremium: false
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('signupModal').style.display = 'none';
    
    // تحديث بيانات المستخدم في الملف الشخصي
    updateProfileData();
    
    // إظهار رسالة ترحيب
    setTimeout(() => {
        alert(`مرحباً ${name}! 😊\nتم إنشاء حسابك بنجاح. استمتع بتجربتك في قُلوب 💖`);
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
    window.location.href = "https://t.me/Mariyemqp";
}

// فتح نافذة الدردشة العامة
function openChat() {
    if (!checkUserLogin()) return;
    
    document.getElementById('chatModal').style.display = 'flex';
    usedNames.clear(); // مسح الأسماء المستخدمة
    startChatSimulation();
}

// إغلاق نافذة الدردشة العامة
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
    clearInterval(chatInterval);
}

// الحصول على اسم عشوائي لم يستخدم من قبل
function getRandomName() {
    const allUsers = [...chatData.boys, ...chatData.girls];
    const availableNames = allUsers.filter(user => !usedNames.has(user.name));
    
    if (availableNames.length === 0) {
        usedNames.clear(); // إعادة تعيين إذا نفذت الأسماء
        return allUsers[Math.floor(Math.random() * allUsers.length)];
    }
    
    const randomUser = availableNames[Math.floor(Math.random() * availableNames.length)];
    usedNames.add(randomUser.name);
    return randomUser;
}

// محاكاة الدردشة العامة
function startChatSimulation() {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '';
    
    // إضافة رسائل أولية
    addMessage("أحمد 👑", "يا جماعة في بنت حلوة بدي أتعرف عليها 💖", true, true);
    addMessage("سارة 👑", "ما بضيف حدا على السناب شات 🙅‍♀️", false, true);
    addMessage("محمد", "بدي أضيف بنت على الإنستغرام 📸", true, false);
    addMessage("ليلى", "بدي أتعرف أكثر قبل ما أضيف أحد 👀", false, false);
    
    // محاكاة الدردشة كل 3-5 ثواني
    chatInterval = setInterval(() => {
        const randomUser = getRandomName();
        const isBoy = chatData.boys.some(boy => boy.name === randomUser.name);
        
        let randomMessage;
        if (isBoy) {
            // رسائل شباب
            randomMessage = chatData.boysMessages[Math.floor(Math.random() * chatData.boysMessages.length)];
            
            // 30% فرصة لإضافة حساب اجتماعي
            if (Math.random() < 0.3) {
                const socialAccount = chatData.socialAccounts[Math.floor(Math.random() * chatData.socialAccounts.length)];
                randomMessage += `\n${socialAccount}`;
            }
        } else {
            // رسائل بنات
            randomMessage = chatData.girlsMessages[Math.floor(Math.random() * chatData.girlsMessages.length)];
        }
        
        // 20% فرصة لرسالة تفاعلية
        if (Math.random() < 0.2) {
            randomMessage = chatData.interactiveMessages[Math.floor(Math.random() * chatData.interactiveMessages.length)];
        }
        
        // 10% فرصة لموضوع نقاشي
        if (Math.random() < 0.1) {
            randomMessage = chatData.discussionTopics[Math.floor(Math.random() * chatData.discussionTopics.length)];
        }
        
        addMessage(
            `${randomUser.name} ${randomUser.premium ? '👑' : ''}`,
            randomMessage,
            isBoy,
            randomUser.premium
        );
    }, 3000 + Math.random() * 2000); // بين 3-5 ثواني
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
        alert('🎉 تم تفعيل المميزات بنجاح! يمكنك الآن استخدام جميع خصائص الموقع.');
    } else {
        alert('❌ الكود غير صحيح. يرجى المحاولة مرة أخرى.');
        codeInput.value = '';
        codeInput.focus();
    }
}

// تحديث عداد المتصلين
function updateOnlineCounters() {
    const onlineCount = Math.floor(Math.random() * 10) + 20; // 20-30 متصل
    const premiumCount = Math.floor(Math.random() * 5) + 10; // 10-15 مشترك مميز
    
    document.querySelector('.online-count').textContent = `🟢 ${onlineCount} متصل الآن`;
    document.querySelector('.premium-count').textContent = `👑 ${premiumCount} مشترك مميز`;
}

// إضافة تأثيرات عند التمرير
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.card');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    cards.forEach((card, index) => {
        card.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
    });
});

// تحديث العدادات كل 10 ثواني
setInterval(updateOnlineCounters, 10000);
updateOnlineCounters(); // التشغيل الأولي

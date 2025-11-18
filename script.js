// بيانات الجمل والردود الرومانسية باللهجة الحلبية
const chatData = {
    messages: [
        // رسائل البنات (بدون يوزرات)
        "يا قمر شو مالي عينيك ياحلوين 💫",
        "قلبي صار يطنش لغيرك مابيعرف غيرك 💖",
        "شو هالغلا يلي قاعد بقلبي 🌹",
        "يا حبيبي والله مابقدرشلو بدونك 🌙",
        "عينيك سحروني ياحبيبي ✨",
        "كل ما اشوفك بزيد حبك بقلبي 💕",
        "يا حلو يلي مابي غيرك 🥰",
        "قلبي صار بيدك خليه معك 💘",
        "شو هالحلا يلي قاعد بعيونك 💎",
        "يا قمر انت يلي نورت حياتي 🌟",
        "مابقدرشلو يوم مابشوفك 💞",
        "حبيبي يلي مابي غيرك 💗",
        "تعال خاص ياحلو مابدي غيرك 💫",
        "قلبي صار بيتك خليه معك 🏡",
        "يا حبيبي والله مابنساك 💝",
        "عينيك سحر وعتاب 💫",
        "كل مابشوفك بزيد شوق 💘",
        "يا حلو يلي مابي غيرك 💖",
        "قلبي صار ملكك خديه معك 👑",
        "شو هالغلا يلي ماقدرشلو بدونه 💕",
        "يا قمر يلي نورت دربي 🌙",
        "يا حبيبي تعال خاص 💌",
        "شو هالغلا يلي بعيونك ✨",
        "قلبي نازل عليك 💖",
        "يا حلوة شو مالك 🌹",
        "بدي إياك ياقمر 💫",
        "شو رأيك فيي ياحبيبي 💕",
        "تعال عالحب ياغلا 🌟",
        "قلبي معك دايماً 💘",
        "يا قمرتي والله مابنساك 💝",
        "شو مالك ياحبيبي 💗",
        "تعال خاص ياقمر 🌹",
        "بحبك موت ياحلو 💖",
        "شو رأيك فيي ياغالية 💫",
        "قلبي عم ينتظرك 💕",
        "يا حبيبي بدي إياك 🌟",
        "تعال حضني ياقمر 💘",
        "شو هالحلا يلي قاعد 💝",
        "بحبك كتير ياحبيبي 💗",
        "تعال خاص ياغلا 🌹",
        "قلبي صار ملكك 💖",
        "يا قمر شو مالك 💫",
        "بدي إياك ياحلو 💕",
        "شو رأيك نتعرف 🌟",
        "قلبي نازل عليك 💘",
        "يا حبيبي تعال 💝",
        "شو مالك ياقمرة 💗",
        "بحبك موت 🌹",
        "تعال ياحبيبي 💖",
        "شو هالغلا يلي 💫",
        
        // رسائل الشباب (مع يوزرات)
        "@sara_love يا قمر يلي نورت دربي 🌙",
        "@noor_heart حبيبي يلي مابي غيرك 💞",
        "@laila_rose شو هالحلا يلي بقربك 💎",
        "@fatima_light قلبي صار بيت حبك 🏡",
        "@yasmin_star يا غلا يلي مابي غيرك 💗",
        "@sara_queen عينيك نار وحب 💥",
        "@noor_moon كل مابسمع صوتك بزيد شوق 🎶",
        "@laila_sun يا حبيبي والله مابنساك 💝",
        "@fatima_love قلبي صار ملكك خليه معك 👑",
        "@yasmin_angel شو هالغلا يلي مابي غيرك 💖",
        "@sara_sweet خاص ياقمر 🌹",
        "@noor_dream تعال خاص ياحبيبي 💫",
        "@laila_heart @sara_love شو رأيكم بالحب 💖",
        "@fatima_girl يا قمرتي تعالي خاص 🌟",
        "@yasmin_princess خاص ياحلوة 💌",
        "@sara_moon حبيبتي تعالي 💕",
        "@noor_sun يا قمر شو مالك 💘",
        "@laila_girl خاص ياغلا 💝",
        "@fatima_queen بدي إياك ياقمر 💗",
        "@yasmin_love تعال خاص 🌹",
        "@sara_angel شو مالك ياحلوة 💫",
        "@noor_princess بحبك ياقمر 💖",
        "@laila_moon تعال عالحب 🌟",
        "@fatima_sun قلبي معك 💕",
        "@yasmin_girl خاص ياحبيبي 💘"
    ],
    
    privateMessages: [
        "شو عم تعمل ياقمر؟ 💫",
        "بفكر فيك كتير ياحبيبي 💖",
        "تعال عالحب ياغلا 🌹",
        "قلبي معك دايماً 🌙",
        "بدي إياك ياحلو ✨",
        "شو مالك ياقمرة؟ 💕",
        "بحبك كتير ياحبيبي 🥰",
        "تعال حضني 💘",
        "شو رأيك نتعرف اكثر؟ 💎",
        "بدي إياك ياحبيبي 🌟",
        "قلبي نازل على عينيك 💞",
        "شو مالك ياغالية؟ 💗",
        "تعال خاص ياقمر 💫",
        "بحبك موت ياحلو 🏡",
        "شو رأيك فيي؟ 💝",
        "قلبي عم ينتظرك 💫",
        "بدي إياك ياحبيبي 💘",
        "تعال عالحب ياقمر 💖",
        "شو مالك ياغلا؟ 💕",
        "بحبك كتير ياحبيبي 👑"
    ],
    
    // أسماء المستخدمين الوهميين للدردشة
    fakeUsers: [
        { 
            name: "سارة", 
            id: "user_001",
            age: 22,
            gender: "female",
            city: "حلب"
        },
        { 
            name: "ليلى", 
            id: "user_002",
            age: 24,
            gender: "female",
            city: "دمشق"
        },
        { 
            name: "نور", 
            id: "user_003",
            age: 21,
            gender: "female", 
            city: "حمص"
        },
        { 
            name: "ياسمين", 
            id: "user_004",
            age: 23,
            gender: "female",
            city: "اللاذقية"
        },
        { 
            name: "فاطمة", 
            id: "user_005",
            age: 22,
            gender: "female",
            city: "حماة"
        },
        { 
            name: "أحمد", 
            id: "user_006",
            age: 25,
            gender: "male",
            city: "حلب"
        },
        { 
            name: "محمد", 
            id: "user_007",
            age: 26,
            gender: "male",
            city: "دمشق"
        },
        { 
            name: "خالد", 
            id: "user_008",
            age: 24,
            gender: "male",
            city: "حمص"
        },
        { 
            name: "علي", 
            id: "user_009",
            age: 27,
            gender: "male",
            city: "حلب"
        },
        { 
            name: "حسن", 
            id: "user_010",
            age: 23,
            gender: "male",
            city: "اللاذقية"
        }
    ],
    
    // أكواد المميزات
    featureCodes: {
        "kalpmutii": true,
        "حب": true,
        "رومانسية": true
    }
};

// بيانات المستخدم
let userData = JSON.parse(localStorage.getItem('userData'));
let featuresActivated = localStorage.getItem('featuresActivated') === 'true';
let chatInterval;
let privateChatInterval;
let onlineUsersCount = 25;

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
    
    // تحديث عدد المتصلين
    updateOnlineCount();
    
    // فتح نافذة التسجيل إذا لم يكن المستخدم مسجلاً
    setTimeout(() => {
        if (!userData) {
            document.getElementById('signupModal').style.display = 'flex';
        }
    }, 1000);
};

// تحديث عدد المتصلين
function updateOnlineCount() {
    onlineUsersCount = 20 + Math.floor(Math.random() * 15);
    document.querySelectorAll('.online-count').forEach(el => {
        el.textContent = `🟢 ${onlineUsersCount} متصل`;
    });
}

// التحقق من العمر
function checkAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 18;
}

// إرسال نموذج إنشاء الحساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const nationality = document.getElementById('nationality').value;
    const gender = document.getElementById('gender').value;
    const interest = document.getElementById('interest').value;
    
    if (!name || !birthdate || !nationality || !gender || !interest) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // التحقق من العمر
    if (!checkAge(birthdate)) {
        document.getElementById('ageError').style.display = 'block';
        return;
    } else {
        document.getElementById('ageError').style.display = 'none';
    }
    
    userData = {
        name: name,
        birthdate: birthdate,
        nationality: nationality,
        gender: gender,
        interest: interest,
        id: Math.floor(10000 + Math.random() * 90000),
        joinDate: new Date().toISOString().split('T')[0],
        balance: 0
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
        document.getElementById('userNationality').textContent = `الجنسية: ${userData.nationality}`;
        document.getElementById('userBirthdate').textContent = `تاريخ الميلاد: ${userData.birthdate}`;
        document.getElementById('userBalance').innerHTML = `الرصيد: <span>${userData.balance}</span> نقطة 💰`;
        
        let interestText = '';
        switch(userData.interest) {
            case 'friendship': interestText = 'صداقة'; break;
            case 'relationship': interestText = 'علاقة'; break;
            case 'marriage': interestText = 'زواج'; break;
            default: interestText = userData.interest;
        }
        document.getElementById('userInterest').textContent = `المهتم بـ: ${interestText}`;
    }
}

// إعادة التوجيه إلى تلجرام لشحن الرصيد
function redirectToTelegram() {
    if (!checkUserLogin()) return;
    window.location.href = "https://t.me/Mariyemqp";
}

// إعادة التوجيه إلى المشرف
function redirectToAdmin() {
    window.location.href = "https://t.me/Mariyemqp";
}

// فتح نافذة الدردشة العامة
function openChat() {
    if (!checkUserLogin()) return;
    
    document.getElementById('chatModal').style.display = 'flex';
    startChatSimulation();
}

// إغلاق نافذة الدردشة العامة
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
    clearInterval(chatInterval);
}

// محاكاة الدردشة العامة
function startChatSimulation() {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '';
    
    // إضافة رسائل أولية
    addMessage("سارة", "يا جماعة شو أخبار الحب عندكم؟ 💖", true);
    addMessage("أحمد", "@sara_love الحمدلله، الحب عم يزيد يوم بعد يوم 😍", false);
    addMessage("ليلى", "وينكم ياحلوين؟ تعالو نحكي شوي 💕", true);
    addMessage("محمد", "@laila_rose يا قمر أنتِ يلي حلوة 🌹", false);
    addMessage("نور", "تعال خاص ياحبيبي 💫", true);
    addMessage("خالد", "@noor_light خاص ياقمر 🌟", false);
    
    // محاكاة الدردشة كل 2-3 ثواني
    chatInterval = setInterval(() => {
        const randomUser = chatData.fakeUsers[Math.floor(Math.random() * chatData.fakeUsers.length)];
        const randomMessage = chatData.messages[Math.floor(Math.random() * chatData.messages.length)];
        
        // إضافة يوزرات للشباب فقط
        let messageText = randomMessage;
        if (randomUser.gender === 'male') {
            const randomGirl = chatData.fakeUsers.filter(u => u.gender === 'female')[Math.floor(Math.random() * 3)];
            if (randomGirl && Math.random() > 0.3) {
                messageText = `@${randomGirl.name.toLowerCase()}_love ${randomMessage}`;
            }
        }
        
        addMessage(randomUser.name, messageText, randomUser.gender === "female");
        
        // تحديث عدد المتصلين عشوائياً
        if (Math.random() > 0.7) {
            updateOnlineCount();
        }
    }, 2000 + Math.random() * 1000);
}

// إضافة رسالة إلى الدردشة
function addMessage(user, message, isReceived) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
    messageDiv.innerHTML = `<strong>${user}:</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// فتح نافذة الدردشة الخاصة
function openPrivateChat(userId) {
    if (!checkUserLogin()) return;
    
    const user = chatData.fakeUsers.find(u => u.id === userId);
    if (user) {
        document.getElementById('privateChatTitle').textContent = `الدردشة مع ${user.name} 💕`;
        document.getElementById('privateChatModal').style.display = 'flex';
        startPrivateChatSimulation(user);
    }
}

// إغلاق نافذة الدردشة الخاصة
function closePrivateChat() {
    document.getElementById('privateChatModal').style.display = 'none';
    clearInterval(privateChatInterval);
}

// محاكاة الدردشة الخاصة
function startPrivateChatSimulation(user) {
    const chatContainer = document.getElementById('privateChatMessages');
    chatContainer.innerHTML = '';
    
    // إضافة رسائل أولية
    addPrivateMessage(user.name, `مرحبا ${userData.name}!\nشو أخبارك ياقمر؟ 💫`, true);
    
    // محاكاة الدردشة كل 3 ثواني
    privateChatInterval = setInterval(() => {
        const randomMessage = chatData.privateMessages[Math.floor(Math.random() * chatData.privateMessages.length)];
        addPrivateMessage(user.name, randomMessage, true);
    }, 3000);
}

// إضافة رسالة إلى الدردشة الخاصة
function addPrivateMessage(user, message, isReceived) {
    const chatContainer = document.getElementById('privateChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
    messageDiv.innerHTML = `<strong>${user}:</strong> ${message}`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// فتح نافذة الأعضاء
function openUsers() {
    if (!checkUserLogin()) return;
    
    document.getElementById('usersModal').style.display = 'flex';
    loadUsersList();
}

// إغلاق نافذة الأعضاء
function closeUsers() {
    document.getElementById('usersModal').style.display = 'none';
}

// تحميل قائمة الأعضاء
function loadUsersList() {
    const usersGrid = document.getElementById('usersGrid');
    usersGrid.innerHTML = '';
    
    chatData.fakeUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.onclick = () => openUserProfile(user.id);
        userCard.innerHTML = `
            <div class="online-indicator"></div>
            <img src="https://via.placeholder.com/80" alt="${user.name}" class="user-avatar">
            <div class="user-name">${user.name}</div>
            <div class="user-age">${user.age} سنة</div>
            <div class="user-gender">${user.gender === 'female' ? '👩' : '👨'} ${user.city}</div>
            ${user.gender === 'male' ? `<div class="user-telegram">@${user.name.toLowerCase()}_telegram</div>` : ''}
        `;
        usersGrid.appendChild(userCard);
    });
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

// فتح نافذة ملف مستخدم
function openUserProfile(userId) {
    const user = chatData.fakeUsers.find(u => u.id === userId);
    if (user) {
        const userProfileContent = document.getElementById('userProfileContent');
        userProfileContent.innerHTML = `
            <h2>الملف الشخصي لـ ${user.name} 👤</h2>
            <div class="profile-grid">
                <div>
                    <img src="https://via.placeholder.com/150" alt="صورة ${user.name}" class="profile-pic">
                </div>
                <div class="profile-info">
                    <h3>${user.name}</h3>
                    <p>العمر: ${user.age} سنة</p>
                    <p>المدينة: ${user.city}</p>
                    <p>الجنس: ${user.gender === 'female' ? 'أنثى' : 'ذكر'}</p>
                    <p>الحالة: متصل(ة) الآن</p>
                    ${user.gender === 'male' ? `<p>التلجرام: @${user.name.toLowerCase()}_telegram</p>` : ''}
                </div>
            </div>
            <button class="btn" onclick="openPrivateChat('${user.id}')">💌 دردش مع ${user.name}</button>
        `;
        document.getElementById('userProfileModal').style.display = 'flex';
    }
}

// إغلاق نافذة ملف المستخدم
function closeUserProfile() {
    document.getElementById('userProfileModal').style.display = 'none';
}

// فتح نافذة الهدايا
function openGifts() {
    if (!checkUserLogin()) return;
    document.getElementById('giftsModal').style.display = 'flex';
}

// إغلاق نافذة الهدايا
function closeGifts() {
    document.getElementById('giftsModal').style.display = 'none';
}

// تعديل الملف الشخصي
function editProfile() {
    if (confirm('هل تريد تعديل ملفك الشخصي؟')) {
        document.getElementById('profileModal').style.display = 'none';
        document.getElementById('signupModal').style.display = 'flex';
        
        // تعبئة البيانات الحالية في النموذج
        if (userData) {
            document.getElementById('name').value = userData.name;
            document.getElementById('birthdate').value = userData.birthdate;
            document.getElementById('nationality').value = userData.nationality;
            document.getElementById('gender').value = userData.gender;
            document.getElementById('interest').value = userData.interest;
        }
    }
}

// تفعيل المميزات
function activateFeatures() {
    const codeInput = document.getElementById('featureCode');
    const code = codeInput.value.trim();
    
    if (chatData.featureCodes[code]) {
        featuresActivated = true;
        localStorage.setItem('featuresActivated', 'true');
        codeInput.value = '';
        alert('🎉 تم تفعيل المميزات بنجاح! يمكنك الآن استخدام جميع خصائص الموقع.');
    } else {
        alert('❌ الكود غير صحيح. يرجى المحاولة مرة أخرى.');
        codeInput.value = '';
        codeInput.focus();
    }
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

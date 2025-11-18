// بيانات المستخدم
let userData = JSON.parse(localStorage.getItem('userData'));
let featuresActivated = localStorage.getItem('featuresActivated') === 'true';
let chatInterval;
let gameInterval;

// إذا لم يكن هناك بيانات مستخدم، عرض نموذج التسجيل
if (!userData) {
    document.getElementById('signupModal').style.display = 'flex';
}

// إرسال نموذج إنشاء الحساب
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const interest = document.getElementById('interest').value;
    
    userData = {
        name: name,
        birthdate: birthdate,
        gender: gender,
        interest: interest,
        id: Math.floor(10000 + Math.random() * 90000),
        followers: Math.floor(Math.random() * 50),
        following: Math.floor(Math.random() * 30)
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('signupModal').style.display = 'none';
    
    // تحديث بيانات المستخدم في الملف الشخصي
    updateProfileData();
});

// تحديث بيانات الملف الشخصي
function updateProfileData() {
    if (userData) {
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userId').textContent = `ID: ${userData.id}`;
        document.getElementById('userGender').textContent = `الجنس: ${userData.gender === 'male' ? 'ذكر' : 'أنثى'}`;
        document.getElementById('followersCount').textContent = userData.followers;
        document.getElementById('followingCount').textContent = userData.following;
    }
}

// إعادة التوجيه إلى تلجرام
function redirectToTelegram() {
    window.location.href = "https://t.me/Mariyemqp";
}

// إعادة التوجيه إلى المشرف
function redirectToAdmin() {
    window.location.href = "https://t.me/Mariyemqp";
}

// فتح نافذة الدردشة العامة
function openChat() {
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
    addMessage("سارة", "مرحبا، شو أخباركم؟", true);
    addMessage("أحمد", "الحمدلله، شو في جديد؟", false);
    addMessage("ليلى", "وينكم ياجماعة؟", true);
    addMessage("محمد", "تعالو خاص نحكي", false);
    
    // محاكاة الدردشة كل 20 ثانية
    chatInterval = setInterval(() => {
        const randomUser = chatData.fakeUsers[Math.floor(Math.random() * chatData.fakeUsers.length)];
        const randomMessage = chatData.messages[Math.floor(Math.random() * chatData.messages.length)];
        addMessage(randomUser.name, randomMessage, randomUser.gender === "female");
    }, 20000);
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
    const user = chatData.fakeUsers.find(u => u.id === userId);
    if (user) {
        document.getElementById('privateChatTitle').textContent = `الدردشة مع ${user.name}`;
        document.getElementById('privateChatModal').style.display = 'flex';
        startPrivateChatSimulation(user);
    }
}

// إغلاق نافذة الدردشة الخاصة
function closePrivateChat() {
    document.getElementById('privateChatModal').style.display = 'none';
    clearInterval(chatInterval);
}

// محاكاة الدردشة الخاصة
function startPrivateChatSimulation(user) {
    const chatContainer = document.getElementById('privateChatMessages');
    chatContainer.innerHTML = '';
    
    // إضافة رسائل أولية
    addPrivateMessage(user.name, "مرحبا، شو أخبارك؟", true);
    
    // محاكاة الدردشة كل 20 ثانية
    chatInterval = setInterval(() => {
        const randomMessage = chatData.messages[Math.floor(Math.random() * chatData.messages.length)];
        addPrivateMessage(user.name, randomMessage, true);
    }, 20000);
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

// فتح نافذة اللعبة
function openGame() {
    document.getElementById('gameModal').style.display = 'flex';
    initializeGame();
}

// إغلاق نافذة اللعبة
function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
    clearInterval(gameInterval);
}

// تهيئة اللعبة
function initializeGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    // إضافة اللاعبين الوهميين
    chatData.gamePlayers.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player ${index === 3 ? 'active' : ''}`;
        playerDiv.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="dice" id="dice-${index}">0</div>
            <div>النقاط: <span id="score-${index}">0</span></div>
        `;
        gameBoard.appendChild(playerDiv);
    });
    
    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('rollDiceBtn').disabled = false;
}

// رمي النرد
function rollDice() {
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    rollDiceBtn.disabled = true;
    
    // رمي النرد للاعب الحقيقي
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-3').textContent = playerRoll;
    chatData.gamePlayers[3].score += playerRoll;
    document.getElementById('score-3').textContent = chatData.gamePlayers[3].score;
    
    // رمي النرد للاعبين الوهميين بعد تأخير
    setTimeout(() => {
        let aiRolls = [];
        for (let i = 0; i < 3; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            document.getElementById(`dice-${i}`).textContent = roll;
            chatData.gamePlayers[i].score += roll;
            document.getElementById(`score-${i}`).textContent = chatData.gamePlayers[i].score;
            aiRolls.push(roll);
        }
        
        // تحديد الفائز
        setTimeout(() => {
            determineWinner(playerRoll, aiRolls);
            rollDiceBtn.disabled = false;
        }, 1000);
    }, 1500);
}

// تحديد الفائز
function determineWinner(playerRoll, aiRolls) {
    const playerScore = chatData.gamePlayers[3].score;
    const maxScore = Math.max(...chatData.gamePlayers.map(p => p.score));
    
    if (playerScore === maxScore) {
        document.getElementById('gameResult').innerHTML = `
            <p>مبروك! فزت في هذه الجولة</p>
            <p>نقاطك: ${playerScore}</p>
        `;
    } else {
        const winnerIndex = chatData.gamePlayers.findIndex(p => p.score === maxScore && p.isAI);
        const winner = chatData.gamePlayers[winnerIndex];
        document.getElementById('gameResult').innerHTML = `
            <p>${winner.name} فاز/ت في هذه الجولة</p>
            <p>نقاطها: ${maxScore}</p>
        `;
    }
}

// فتح نافذة الملف الشخصي
function openProfile() {
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
            <h2>الملف الشخصي لـ ${user.name}</h2>
            <div class="profile-grid">
                <div>
                    <img src="https://via.placeholder.com/150" alt="صورة ${user.name}" class="profile-pic">
                </div>
                <div class="profile-info">
                    <h3>${user.name}</h3>
                    <p>العمر: ${user.age}</p>
                    <p>الجنس: ${user.gender === 'female' ? 'أنثى' : 'ذكر'}</p>
                </div>
            </div>
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">${user.followers}</div>
                    <div>المتابعون</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${user.following}</div>
                    <div>يتابع</div>
                </div>
            </div>
            <button class="btn" onclick="openPrivateChat('${user.id}')">دردش مع ${user.name}</button>
        `;
        document.getElementById('userProfileModal').style.display = 'flex';
    }
}

// إغلاق نافذة ملف المستخدم
function closeUserProfile() {
    document.getElementById('userProfileModal').style.display = 'none';
}

// عرض قائمة المستخدمين
function showUsersList() {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '<h3>المستخدمون النشطون</h3>';
    
    const usersGrid = document.createElement('div');
    usersGrid.className = 'users-grid';
    
    chatData.fakeUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.onclick = () => openUserProfile(user.id);
        userCard.innerHTML = `
            <img src="https://via.placeholder.com/80" alt="${user.name}" class="user-avatar">
            <div class="user-name">${user.name}</div>
            <div class="user-followers">${user.followers} متابع</div>
        `;
        usersGrid.appendChild(userCard);
    });
    
    chatContainer.appendChild(usersGrid);
}

// تفعيل المميزات
function activateFeatures() {
    const code = document.getElementById('featureCode').value;
    if (chatData.featureCodes[code]) {
        featuresActivated = true;
        localStorage.setItem('featuresActivated', 'true');
        alert('تم تفعيل المميزات بنجاح! يمكنك الآن استخدام جميع خصائص الموقع.');
    } else {
        alert('الكود غير صحيح. يرجى المحاولة مرة أخرى.');
    }
}

// تهيئة الصفحة عند التحميل
window.onload = function() {
    if (userData) {
        updateProfileData();
    }
};

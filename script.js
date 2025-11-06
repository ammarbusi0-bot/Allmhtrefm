// بيانات التطبيق
let currentUser = null;
let suggestedUsers = [];
let activeRooms = [];
let followers = [];

// تهيئة التطبيق
function initApp() {
    loadSuggestedUsers();
    loadActiveRooms();
    generateUserUID();
    updateOnlineCount();
}

// دخول التطبيق
function enterApp() {
    const userName = document.getElementById('userName').value.trim();
    const userGender = document.getElementById('userGender').value;
    
    if (!userName) {
        showNotification('🚫 يزميل، اكتب اسمك أولاً!');
        return;
    }
    
    currentUser = {
        id: generateId(),
        name: userName,
        gender: userGender,
        level: 'SVIP',
        wallet: 60,
        followers: 69,
        following: 1,
        visitors: 0,
        joinDate: new Date()
    };
    
    // تحديث الواجهة
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // تحديث الملف الشخصي
    updateUserProfile();
    
    // بدء المحاكاة
    initApp();
    
    showNotification(`أهلاً وسهلاً ${userName}! 🌹`);
}

// تحديث الملف الشخصي
function updateUserProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('navUserName').textContent = currentUser.name;
    document.getElementById('userUID').textContent = currentUser.id.substr(0, 8).toUpperCase();
    
    document.getElementById('followersCount').textContent = currentUser.followers;
    document.getElementById('followingCount').textContent = currentUser.following;
    document.getElementById('visitorsCount').textContent = currentUser.visitors;
    
    // إنشاء صورة رمزية
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ff6b9d&color=fff&bold=true&length=1`;
    document.getElementById('profileAvatar').src = avatarUrl;
    document.getElementById('navUserAvatar').src = avatarUrl;
}

// توليد UID عشوائي
function generateUserUID() {
    const uid = Math.floor(10000000 + Math.random() * 90000000);
    document.getElementById('userUID').textContent = uid;
}

// تحديث عدد المتصلين
function updateOnlineCount() {
    const baseCount = 722539;
    const randomChange = Math.floor(Math.random() * 1000) - 500;
    const currentCount = baseCount + randomChange;
    document.getElementById('totalOnline').textContent = currentCount.toLocaleString();
}

// تحميل المستخدمين المقترحين
function loadSuggestedUsers() {
    suggestedUsers = [
        { name: "AYA...", gender: "female", avatar: "👸", followers: 1250 },
        { name: "الاميرة ...", gender: "female", avatar: "👑", followers: 890 },
        { name: "Blanda...", gender: "female", avatar: "💃", followers: 670 },
        { name: "Beba...", gender: "female", avatar: "🐰", followers: 430 },
        { name: "DALAI...", gender: "female", avatar: "🌸", followers: 2100 },
        { name: "هذب...ال...", gender: "male", avatar: "🎩", followers: 340 },
        { name: "Chern...", gender: "female", avatar: "🌺", followers: 780 },
        { name: "خوخة...", gender: "female", avatar: "🍑", followers: 560 }
    ];
    
    const friendsList = document.getElementById('suggestedFriends');
    friendsList.innerHTML = '';
    
    suggestedUsers.forEach(user => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.innerHTML = `
            <div class="friend-avatar">${user.avatar}</div>
            <div class="friend-name">${user.name}</div>
            <div class="friend-gender">${user.gender === 'female' ? '👩' : '👨'}</div>
            <div class="friend-followers">${user.followers} متابع</div>
            <div class="friend-actions">
                <button class="btn-follow-small" onclick="followUser('${user.name}')">
                    متابعة
                </button>
                <button class="btn-message-small disabled" onclick="requestMessageAccess('${user.name}')">
                    رسالة
                </button>
            </div>
        `;
        
        friendCard.addEventListener('click', () => showUserProfile(user));
        friendsList.appendChild(friendCard);
    });
}

// تحميل الغرف النشطة
function loadActiveRooms() {
    activeRooms = [
        { name: "قهوة الصباح", members: 12, icon: "fa-coffee" },
        { name: "ساحة الجامعة", members: 8, icon: "fa-graduation-cap" },
        { name: "ليالي حلب", members: 15, icon: "fa-moon" },
        { name: "حب وغرام", members: 18, icon: "fa-heart" }
    ];
    
    const roomsList = document.getElementById('activeRoomsList');
    roomsList.innerHTML = '';
    
    activeRooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room-item';
        roomElement.innerHTML = `
            <div class="room-icon">
                <i class="fas ${room.icon}"></i>
            </div>
            <div class="room-info">
                <div class="room-name">${room.name}</div>
                <div class="room-members">${room.members} أعضاء</div>
            </div>
        `;
        
        roomElement.addEventListener('click', () => showChatRooms());
        roomsList.appendChild(roomElement);
    });
}

// إظهار غرف الدردشة
function showChatRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = '';
    
    const rooms = [
        { name: "قهوة الصباح", description: "أحلى صباح مع القهوة الحلبية", members: 12, icon: "fa-coffee" },
        { name: "ساحة الجامعة", description: "شو أخبار الدراسة والجامعة", members: 8, icon: "fa-graduation-cap" },
        { name: "ليالي حلب", description: "أحلى سهرات وأغاني", members: 15, icon: "fa-moon" },
        { name: "مطبخ حلب", description: "وصفات وأكلات حلبية", members: 6, icon: "fa-utensils" },
        { name: "قلعة حلب", description: "تاريخ وأثار حلب", members: 10, icon: "fa-landmark" },
        { name: "حب وغرام", description: "مواضيع غرامية ورومانسية", members: 18, icon: "fa-heart" }
    ];
    
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <div class="room-card-icon">
                <i class="fas ${room.icon}"></i>
            </div>
            <h5>${room.name}</h5>
            <p>${room.description}</p>
            <div class="room-stats">
                <span>${room.members} أعضاء</span>
                <span>نشيط</span>
            </div>
        `;
        
        roomCard.addEventListener('click', () => requestChatAccess());
        roomsGrid.appendChild(roomCard);
    });
    
    document.getElementById('chatRoomsModal').classList.remove('hidden');
}

// إظهار التوافق الصوتي
function showVoiceMatch() {
    document.getElementById('voiceMatchModal').classList.remove('hidden');
}

// إظهار أقسام المحتوى
function showSection(section) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إزالة النشاط من جميع عناصر القائمة
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    document.getElementById(section + 'Section').classList.add('active');
    
    // إضافة النشاط لعنصر القائمة
    event.currentTarget.classList.add('active');
}

// إظهار الملف الشخصي للمستخدم
function showUserProfile(user) {
    document.getElementById('viewProfileName').textContent = user.name;
    document.getElementById('viewProfileUID').textContent = Math.floor(10000000 + Math.random() * 90000000);
    document.getElementById('viewProfileAvatar').textContent = user.avatar;
    document.getElementById('viewFollowers').textContent = user.followers;
    document.getElementById('viewFollowing').textContent = Math.floor(Math.random() * 100);
    
    document.getElementById('profileModal').classList.remove('hidden');
}

// طلب الوصول للدردشة
function requestChatAccess() {
    showNotification('💬 للدردشة في الغرف، يجب التواصل مع الإدارة أولاً');
    contactAdmin('chat');
}

// طلب الوصول للرسائل
function requestMessageAccess(userName) {
    showNotification(`📩 لإرسال رسائل لـ${userName}، يجب التواصل مع الإدارة`);
    contactAdmin('message');
}

// متابعة مستخدم
function followUser(userName) {
    if (userName) {
        showNotification(`✅ بدأت متابعة ${userName}`);
        currentUser.following++;
    } else {
        showNotification('✅ تمت المتابعة بنجاح');
    }
    updateUserProfile();
}

// التواصل مع الإدارة
function contactAdmin(type) {
    let message = '';
    
    switch(type) {
        case 'voice':
            message = `مرحبا، أنا ${currentUser.name} وبدي أفعّل خدمة التوافق الصوتي في SoulChill!`;
            break;
        case 'chat':
            message = `مرحبا، أنا ${currentUser.name} وبدي أشارك في الدردشة في غرف SoulChill!`;
            break;
        case 'message':
            message = `مرحبا، أنا ${currentUser.name} وبدي أرسل رسايل خاصة في SoulChill!`;
            break;
        default:
            message = `مرحبا، أنا ${currentUser.name} وبدي أستفسر عن خدمات SoulChill!`;
    }
    
    const telegramLink = `https://t.me/Talaa_almalika?text=${encodeURIComponent(message)}`;
    window.open(telegramLink, '_blank');
    showNotification('📩 تم فتح تيليجرام للتواصل مع الإدارة');
}

// إغلاق النوافذ المنبثقة
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// إظهار الإشعارات
function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// توليد معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// إظهار تعديل الملف الشخصي
function showEditProfile() {
    showNotification('🛠️ خدمة تعديل الملف الشخصي قريباً!');
}

// إظهار غرف الفيديو
function showVideoRooms() {
    showNotification('🎥 خدمة غرف الفيديو قريباً!');
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمعي الأحداث
    document.getElementById('userName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') enterApp();
    });
    
    // تحديث عدد المتصلين كل 30 ثانية
    setInterval(updateOnlineCount, 30000);
});

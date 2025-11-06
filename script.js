// بيانات التطبيق
let currentUser = null;
let currentRoom = null;
let rooms = [];
let onlineUsers = [];
let privateMessages = [];
let activeCalls = [];
let notifications = [];

// تهيئة التطبيق
function initApp() {
    loadRooms();
    simulateOnlineUsers();
    simulateActiveCalls();
    startAutoChat();
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
        level: 'جديد',
        messageCount: 0,
        roomCount: 0,
        joinDate: new Date()
    };
    
    // تحديث الواجهة
    document.getElementById('loginBox').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // تحديث الملف الشخصي
    updateUserProfile();
    
    // إضافة المستخدم للمتصلين
    addOnlineUser(currentUser);
    
    // بدء المحاكاة
    initApp();
    
    showNotification(`أهلاً وسهلاً ${userName}! 🌹`);
}

// تحديث الملف الشخصي
function updateUserProfile() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('navUserName').textContent = currentUser.name;
    document.getElementById('userLevel').textContent = currentUser.level;
    document.getElementById('messageCount').textContent = currentUser.messageCount;
    document.getElementById('roomCount').textContent = currentUser.roomCount;
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ff6b9d&color=fff&bold=true&length=1`;
    document.getElementById('profileAvatar').src = avatarUrl;
    document.getElementById('navUserAvatar').src = avatarUrl;
}

// تحميل الغرف
function loadRooms() {
    rooms = chatData.rooms;
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';
    
    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room-item';
        roomElement.innerHTML = `
            <div class="room-name">
                <i class="fas ${room.icon}"></i>
                ${room.name}
            </div>
            <div class="room-info">
                <span class="room-members">${room.members} متصل</span>
                <span class="room-activity">${room.activity}</span>
            </div>
        `;
        
        roomElement.addEventListener('click', () => joinRoom(room));
        roomsList.appendChild(roomElement);
    });
}

// الانضمام لغرفة
function joinRoom(room) {
    currentRoom = room;
    
    // تحديث واجهة الغرفة
    document.getElementById('currentRoomName').textContent = room.name;
    document.getElementById('roomMembers').textContent = `${room.members} متصل`;
    document.getElementById('roomTopic').textContent = room.topic;
    
    // إزالة النشاط من جميع الغرف
    document.querySelectorAll('.room-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // إضافة النشاط للغرفة المحددة
    event.currentTarget.classList.add('active');
    
    // تحميل محادثات الغرفة
    loadRoomChat(room.id);
    
    showNotification(`دخلت غرفة ${room.name} 💫`);
}

// تحميل محادثات الغرفة
function loadRoomChat(roomId) {
    const chatBox = document.getElementById('chatBox');
    const welcomeMessage = document.getElementById('welcomeMessage');
    
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    chatBox.innerHTML = '';
    
    // إضافة رسائل الغرفة
    const roomMessages = chatData.messages.filter(msg => msg.roomId === roomId);
    roomMessages.forEach(message => {
        addMessageToChat(message, false);
    });
}

// إضافة رسالة للشات
function addMessageToChat(message, isNew = true) {
    const chatBox = document.getElementById('chatBox');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.gender} ${isNew ? 'new' : ''}`;
    
    const time = new Date(message.timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${message.sender}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${message.content}</div>
    `;
    
    if (isNew) {
        messageElement.style.animation = 'messageSlide 0.3s ease';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    chatBox.appendChild(messageElement);
}

// إرسال رسالة
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    if (!currentRoom) {
        showNotification('🚫 اختر غرفة أولاً عشان تحكي!');
        return;
    }
    
    // للمستخدمين الجدد، توجيه للتواصل مع المشرف
    if (currentUser.messageCount < 3) {
        showNotification('💬 تواصل مع المشرف أولاً عشان تقدر تحكي في الغرف!');
        contactAdmin();
        messageInput.value = '';
        return;
    }
    
    const message = {
        id: generateId(),
        roomId: currentRoom.id,
        sender: currentUser.name,
        gender: currentUser.gender,
        content: messageText,
        timestamp: new Date()
    };
    
    addMessageToChat(message);
    currentUser.messageCount++;
    updateUserProfile();
    
    messageInput.value = '';
    
    // محاكاة ردود الفعل
    simulateReactions(messageText);
}

// التعامل مع ضغط المفاتيح
function handleMessageKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// محاكاة ردود الفعل
function simulateReactions(messageText) {
    setTimeout(() => {
        if (Math.random() < 0.4) { // 40% فرصة لرد
            const roomUsers = onlineUsers.filter(user => 
                user.id !== currentUser.id && 
                Math.random() < 0.3
            );
            
            if (roomUsers.length > 0) {
                const randomUser = roomUsers[Math.floor(Math.random() * roomUsers.length)];
                const reactions = chatData.getReactions(messageText);
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                
                const reactionMessage = {
                    id: generateId(),
                    roomId: currentRoom.id,
                    sender: randomUser.name,
                    gender: randomUser.gender,
                    content: randomReaction,
                    timestamp: new Date()
                };
                
                addMessageToChat(reactionMessage);
                showTypingIndicator(randomUser.name);
            }
        }
    }, 1000 + Math.random() * 3000);
}

// مؤشر الكتابة
function showTypingIndicator(userName) {
    const typingIndicator = document.getElementById('typingIndicator');
    const typingUsers = document.getElementById('typingUsers');
    
    typingUsers.textContent = userName;
    typingIndicator.style.display = 'block';
    
    setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 2000);
}

// المحادثة التلقائية
function startAutoChat() {
    setInterval(() => {
        if (currentRoom && Math.random() < 0.3) {
            const activeRoomUsers = onlineUsers.filter(user => 
                user.id !== currentUser.id && 
                Math.random() < 0.2
            );
            
            if (activeRoomUsers.length > 0) {
                const randomUser = activeRoomUsers[Math.floor(Math.random() * activeRoomUsers.length)];
                const roomTopics = chatData.getRoomTopics(currentRoom.id);
                const randomMessage = roomTopics[Math.floor(Math.random() * roomTopics.length)];
                
                const autoMessage = {
                    id: generateId(),
                    roomId: currentRoom.id,
                    sender: randomUser.name,
                    gender: randomUser.gender,
                    content: randomMessage,
                    timestamp: new Date()
                };
                
                addMessageToChat(autoMessage);
                showTypingIndicator(randomUser.name);
            }
        }
    }, 5000 + Math.random() * 10000);
}

// محاكاة المستخدمين المتصلين
function simulateOnlineUsers() {
    const sampleUsers = [
        { name: "سارة الحلبية", gender: "female" },
        { name: "ليان", gender: "female" },
        { name: "ريم", gender: "female" },
        { name: "أحمد الشامي", gender: "male" },
        { name: "محمد", gender: "male" },
        { name: "خالد", gender: "male" },
        { name: "نور", gender: "female" },
        { name: "ياسمين", gender: "female" }
    ];
    
    sampleUsers.forEach(user => {
        const onlineUser = {
            id: generateId(),
            name: user.name,
            gender: user.gender,
            status: 'online',
            lastSeen: new Date()
        };
        onlineUsers.push(onlineUser);
    });
    
    updateOnlineUsersList();
}

// تحديث قائمة المتصلين
function updateOnlineUsersList() {
    const onlineUsersList = document.getElementById('onlineUsersList');
    const onlineCount = document.getElementById('onlineCount');
    
    onlineUsersList.innerHTML = '';
    onlineCount.textContent = `(${onlineUsers.length})`;
    
    onlineUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-status';
        userElement.innerHTML = `
            <div class="status-indicator ${user.status}"></div>
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007bff&color=fff" 
                 class="user-avatar-sm" alt="${user.name}">
            <span>${user.name}</span>
            ${user.gender === 'female' ? '👩' : '👨'}
        `;
        
        userElement.addEventListener('click', () => startPrivateChat(user));
        onlineUsersList.appendChild(userElement);
    });
}

// إضافة مستخدم متصل
function addOnlineUser(user) {
    onlineUsers.push({
        id: user.id,
        name: user.name,
        gender: user.gender,
        status: 'online',
        lastSeen: new Date()
    });
    updateOnlineUsersList();
}

// محاكاة المكالمات النشطة
function simulateActiveCalls() {
    activeCalls = [
        {
            id: generateId(),
            participants: ["سارة", "أحمد"],
            duration: "5:32",
            active: true
        },
        {
            id: generateId(),
            participants: ["ليان", "محمد"],
            duration: "12:15",
            active: true
        },
        {
            id: generateId(),
            participants: ["نور", "خالد"],
            duration: "8:47",
            active: true
        }
    ];
    
    updateActiveCallsList();
}

// تحديث قائمة المكالمات
function updateActiveCallsList() {
    const activeCallsList = document.getElementById('activeCallsList');
    activeCallsList.innerHTML = '';
    
    activeCalls.forEach(call => {
        const callElement = document.createElement('div');
        callElement.className = 'call-item';
        callElement.innerHTML = `
            <i class="fas fa-phone-alt call-active"></i>
            <div class="call-info">
                <div class="call-participants">${call.participants.join(' و ')}</div>
                <div class="call-duration">${call.duration}</div>
            </div>
        `;
        activeCallsList.appendChild(callElement);
    });
}

// البدء بمحادثة خاصة
function startPrivateChat(user) {
    if (currentUser.messageCount < 5) {
        showNotification('💬 تواصل مع المشرف أولاً عشان تقدر ترسل رسايل خاصة!');
        contactAdmin();
        return;
    }
    
    const pmWindow = document.getElementById('pmWindow');
    const pmUserName = document.getElementById('pmUserName');
    const pmChatBox = document.getElementById('pmChatBox');
    
    pmUserName.textContent = user.name;
    pmChatBox.innerHTML = '';
    
    // تحميل المحادثة الخاصة
    const existingPm = privateMessages.find(pm => 
        (pm.senderId === user.id && pm.receiverId === currentUser.id) ||
        (pm.senderId === currentUser.id && pm.receiverId === user.id)
    );
    
    if (existingPm) {
        existingPm.messages.forEach(msg => {
            addMessageToPm(msg);
        });
    }
    
    pmWindow.classList.remove('hidden');
}

// إضافة رسالة للمحادثة الخاصة
function addMessageToPm(message) {
    const pmChatBox = document.getElementById('pmChatBox');
    
    const messageElement = document.createElement('div');
    messageElement.className = `pm-message ${message.senderId === currentUser.id ? 'own' : 'other'}`;
    messageElement.textContent = message.content;
    
    pmChatBox.appendChild(messageElement);
    pmChatBox.scrollTop = pmChatBox.scrollHeight;
}

// إرسال رسالة خاصة
function sendPrivateMessage() {
    const pmMessageInput = document.getElementById('pmMessageInput');
    const messageText = pmMessageInput.value.trim();
    const pmUserName = document.getElementById('pmUserName').textContent;
    
    if (!messageText) return;
    
    const targetUser = onlineUsers.find(user => user.name === pmUserName);
    if (!targetUser) return;
    
    const message = {
        id: generateId(),
        senderId: currentUser.id,
        receiverId: targetUser.id,
        content: messageText,
        timestamp: new Date(),
        read: false
    };
    
    // إيجاد أو إنشاء محادثة خاصة
    let conversation = privateMessages.find(pm => 
        (pm.senderId === currentUser.id && pm.receiverId === targetUser.id) ||
        (pm.senderId === targetUser.id && pm.receiverId === currentUser.id)
    );
    
    if (!conversation) {
        conversation = {
            id: generateId(),
            participants: [currentUser.id, targetUser.id],
            messages: []
        };
        privateMessages.push(conversation);
    }
    
    conversation.messages.push(message);
    addMessageToPm(message);
    
    pmMessageInput.value = '';
    updatePrivateMessagesList();
    
    // محاكاة رد المستخدم
    setTimeout(() => {
        const responses = chatData.getPrivateResponses();
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
            id: generateId(),
            senderId: targetUser.id,
            receiverId: currentUser.id,
            content: randomResponse,
            timestamp: new Date(),
            read: false
        };
        
        conversation.messages.push(responseMessage);
        addMessageToPm(responseMessage);
        
        // إشعار برسالة جديدة
        showNotification(`رسالة جديدة من ${pmUserName} 💌`);
    }, 2000 + Math.random() * 3000);
}

// التعامل مع ضغط المفاتيح في المحادثة الخاصة
function handlePmKeyPress(event) {
    if (event.key === 'Enter') {
        sendPrivateMessage();
    }
}

// إغلاق نافذة المحادثة الخاصة
function closePmWindow() {
    document.getElementById('pmWindow').classList.add('hidden');
}

// تحديث قائمة الرسائل الخاصة
function updatePrivateMessagesList() {
    const privateMessagesList = document.getElementById('privateMessagesList');
    const pmCount = document.getElementById('pmCount');
    
    privateMessagesList.innerHTML = '';
    
    const userConversations = privateMessages.filter(pm => 
        pm.participants.includes(currentUser.id)
    );
    
    pmCount.textContent = userConversations.length;
    
    userConversations.forEach(conversation => {
        const otherUserId = conversation.participants.find(id => id !== currentUser.id);
        const otherUser = onlineUsers.find(user => user.id === otherUserId);
        
        if (otherUser) {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const unreadCount = conversation.messages.filter(msg => 
                msg.senderId !== currentUser.id && !msg.read
            ).length;
            
            const pmElement = document.createElement('div');
            pmElement.className = `pm-item ${unreadCount > 0 ? 'unread' : ''}`;
            pmElement.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=ff6b9d&color=fff" 
                     class="pm-avatar" alt="${otherUser.name}">
                <div class="pm-preview">
                    <div class="pm-sender">${otherUser.name}</div>
                    <div class="pm-text">${lastMessage.content}</div>
                </div>
                <div class="pm-time">${new Date(lastMessage.timestamp).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</div>
            `;
            
            pmElement.addEventListener('click', () => startPrivateChat(otherUser));
            privateMessagesList.appendChild(pmElement);
        }
    });
}

// التواصل مع المشرف
function contactAdmin() {
    const message = `مرحبا، أنا ${currentUser.name} وبدي أشارك في النقاش في البوتجة الحلبية!`;
    const telegramLink = `https://t.me/Talaa_almalika?text=${encodeURIComponent(message)}`;
    window.open(telegramLink, '_blank');
    showNotification('📩 تم فتح تيليجرام للتواصل مع المشرف');
}

// تبديل الوضع الليلي
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    if (document.body.classList.contains('dark-mode')) {
        darkModeIcon.className = 'fas fa-sun';
        showNotification('تم تفعيل الوضع الليلي 🌙');
    } else {
        darkModeIcon.className = 'fas fa-moon';
        showNotification('تم تفعيل الوضع النهاري ☀️');
    }
}

// إظهار الإشعارات
function showNotifications() {
    // في التطبيق الحقيقي، هنا نعرض قائمة الإشعارات
    showNotification('لا توجد إشعارات جديدة 📢');
}

// إظهار إشعار
function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// إظهار الشروط
function showTerms() {
    alert(`شروط استخدام بوتجة حلبية:

1. احترم جميع الأعضاء وتجنب الألفاظ النابية
2. المحتوى المسيء سيؤدي للحظر الفوري
3. الحفاظ على الخصوصية وعدم مشاركة معلومات شخصية
4. المشاركة في المكالمات الصوتية تتطلب موافقة المشرف
5. الإدارة تحتفظ بحق حظر أي مستخدم يخالف الشروط

شكراً لالتزامك بالشروط! 🌹`);
}

// توليد معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمعي الأحداث
    document.getElementById('userName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') enterApp();
    });
    
    // تهيئة الخلفية المتحركة
    initAnimatedBackground();
});

// تهيئة الخلفية المتحركة
function initAnimatedBackground() {
    // تم إضافة CSS للخلفية المتحركة
}

// تحديث إحصاءات المستخدم
setInterval(() => {
    if (currentUser) {
        currentUser.roomCount = rooms.filter(room => 
            Math.random() < 0.1
        ).length;
        updateUserProfile();
    }
}, 10000);

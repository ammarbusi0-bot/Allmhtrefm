const appData = {
    // بيانات التطبيق الأساسية
    appName: "SoulChill",
    appSubtitle: "بوتجة حلبية",
    
    // إعدادات التواصل
    adminTelegram: "https://t.me/Talaa_almalika",
    
    // رسائل النظام
    systemMessages: {
        welcome: "أهلاً وسهلاً في SoulChill! 🌹",
        chatDisabled: "للمشاركة في الدردشة، يجب التواصل مع الإدارة أولاً",
        voiceDisabled: "خدمة التوافق الصوتي معطلة. تواصل مع الإدارة لتفعيلها",
        messageDisabled: "لا يمكنك إرسال رسائل خاصة حتى يتم تفعيل حسابك",
        contactAdmin: "تواصل مع الإدارة على تيليجرام @Talaa_almalika"
    },
    
    // المستخدمين النشطين
    activeUsers: [
        { name: "AYA...", status: "online", lastSeen: "الآن" },
        { name: "الاميرة ...", status: "online", lastSeen: "الآن" },
        { name: "Blanda...", status: "online", lastSeen: "2 د" },
        { name: "Beba...", status: "away", lastSeen: "5 د" },
        { name: "DALAI...", status: "online", lastSeen: "الآن" },
        { name: "هذب...ال...", status: "online", lastSeen: "الآن" },
        { name: "Chern...", status: "away", lastSeen: "10 د" },
        { name: "خوخة...", status: "online", lastSeen: "1 د" }
    ],
    
    // الإحصاءات
    getStats: function() {
        return {
            totalUsers: 722539,
            onlineNow: 722539,
            activeRooms: 6,
            newMatches: 1247
        };
    }
};

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appData;
}

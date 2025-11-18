// بيانات الجمل والردود باللهجة الحلبية
const chatData = {
    messages: [
        "شو صاير معك اليوم؟",
        "تعال خاص نحكي",
        "شو رأيك نتعرف أكثر؟",
        "تعي خاص يا حلو",
        "بدي أحكيلك شي",
        "شو عاملة هلق؟",
        "تعال خاص ما تقلق",
        "في شي بدك تحكيه؟",
        "تعالي نحكي سوا",
        "شو في جديد معك؟",
        "بدي أعرفك أكثر",
        "تعال خاص ما تتردد",
        "وينك من زمان؟",
        "شو عامل هالأيام؟",
        "بدي أشوفك مرة",
        "تعال خاص عالخصوصي",
        "في شي جديد معك؟",
        "بدي أسمع صوتك",
        "تعال خاص عالريڨ",
        "شو رأيك نتواعد؟",
        "بدك نحكي شوي؟",
        "تعال خاص بسرعة",
        "وين كنت ضايع؟",
        "بدي ألاقيك",
        "تعال خاص عالحكي"
    ],
    
    // أسماء المستخدمين الوهميين للدردشة
    fakeUsers: [
        { 
            name: "سارة", 
            id: "user_001",
            followers: Math.floor(Math.random() * 100) + 100, 
            following: Math.floor(Math.random() * 50) + 50,
            gender: "female",
            age: 22
        },
        { 
            name: "ليلى", 
            id: "user_002",
            followers: Math.floor(Math.random() * 100) + 80, 
            following: Math.floor(Math.random() * 50) + 40,
            gender: "female",
            age: 24
        },
        { 
            name: "نور", 
            id: "user_003",
            followers: Math.floor(Math.random() * 100) + 120, 
            following: Math.floor(Math.random() * 50) + 60,
            gender: "female", 
            age: 21
        },
        { 
            name: "ياسمين", 
            id: "user_004",
            followers: Math.floor(Math.random() * 100) + 90, 
            following: Math.floor(Math.random() * 50) + 45,
            gender: "female",
            age: 23
        },
        { 
            name: "أحمد", 
            id: "user_005",
            followers: Math.floor(Math.random() * 80) + 70, 
            following: Math.floor(Math.random() * 60) + 40,
            gender: "male",
            age: 25
        },
        { 
            name: "محمد", 
            id: "user_006",
            followers: Math.floor(Math.random() * 80) + 60, 
            following: Math.floor(Math.random() * 60) + 50,
            gender: "male",
            age: 26
        },
        { 
            name: "خالد", 
            id: "user_007",
            followers: Math.floor(Math.random() * 80) + 75, 
            following: Math.floor(Math.random() * 60) + 45,
            gender: "male",
            age: 24
        }
    ],
    
    // بيانات اللاعبين للعبة النرد
    gamePlayers: [
        { name: "سارة", score: 0, isAI: true },
        { name: "ليلى", score: 0, isAI: true },
        { name: "نور", score: 0, isAI: true },
        { name: "أنت", score: 0, isAI: false }
    ],
    
    // أكواد المميزات
    featureCodes: {
        "kalpmutii": true
    }
};

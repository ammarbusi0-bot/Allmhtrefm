// ملف script.js

const nameInputSection = document.getElementById('name-input-section');
const mainAppContent = document.getElementById('main-app-content');
const usernameInput = document.getElementById('username-input');
const startAppBtn = document.getElementById('start-app-btn');
const nameError = document.getElementById('name-error');
const homeBtn = document.getElementById('home-btn');
const supportMenuBtn = document.getElementById('support-menu-btn');
const backBtn = document.getElementById('back-btn');
const screenContainers = document.querySelectorAll('.screen-container');

// سجل لتتبع الصفحات التي زارها المستخدم
let historyStack = [];

/**
 * دالة لتخزين الاسم في ملف JSON خارجي (افتراضي)
 * في تطبيق حقيقي، يتم استخدام API لإرسال البيانات إلى خادم
 */
async function saveUser(username) {
    // في هذا المثال، نفترض أننا نرسل البيانات إلى خادم
    // هنا يمكن استخدام fetch API لإرسال البيانات إلى ملف PHP/NodeJS
    
    // لغرض هذا المثال، سنقوم فقط بمحاكاة تخزين الاسم
    console.log(`تم محاكاة حفظ اسم المستخدم: ${username}`);
    
    // هنا يجب إضافة الاسم إلى ملف users.json (سيتم شرح ذلك في القسم 4)
    // هذا الجزء يتطلب بيئة خادم حقيقية (مثل Node.js أو PHP) لكتابة البيانات إلى الملف.
    
    // لحل طلبك بدون خادم، سنخزن الاسم مؤقتاً في Local Storage
    localStorage.setItem('currentUsername', username);
    return true; // محاكاة نجاح الحفظ
}

/**
 * دالة للتحكم في التنقل بين الشاشات
 * @param {string} targetId - معرف (ID) الشاشة المستهدفة (مثل 'home-screen')
 * @param {boolean} isBackAction - هل هذا الإجراء هو رجوع؟
 */
function navigateTo(targetId, isBackAction = false) {
    const currentActiveScreen = document.querySelector('.screen-container:not(.hidden)');
    const targetScreen = document.getElementById(targetId);

    if (!targetScreen) return;

    if (!isBackAction && currentActiveScreen && currentActiveScreen.id !== targetId) {
        // إذا لم يكن رجوع، نضيف الشاشة الحالية إلى السجل
        historyStack.push(currentActiveScreen.id);
    }
    
    // إخفاء جميع الشاشات
    screenContainers.forEach(screen => screen.classList.add('hidden'));
    
    // إظهار الشاشة المستهدفة
    targetScreen.classList.remove('hidden');

    // تحديث حالة زر الرجوع
    if (historyStack.length > 0 && targetId !== 'home-screen') {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
        historyStack = []; // تفريغ السجل إذا عدنا إلى الرئيسية
    }
    
    // تحديث حالة زر الرجوع عندما تكون الصفحة الرئيسية مرئية
    if (targetId === 'home-screen') {
        backBtn.classList.add('hidden');
        historyStack = [];
    }
}


// -----------------------------------
// الأحداث Listeners
// -----------------------------------

// 1. تسجيل الاسم
startAppBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username.length < 3) {
        nameError.textContent = 'الرجاء إدخال اسم لا يقل عن 3 أحرف.';
        return;
    }
    
    nameError.textContent = '';
    const success = await saveUser(username);

    if (success) {
        // إخفاء شاشة تسجيل الاسم وإظهار المحتوى الرئيسي (كما طلبت)
        nameInputSection.classList.add('hidden');
        mainAppContent.classList.remove('hidden');
        navigateTo('home-screen'); // الانتقال للشاشة الرئيسية
    }
});

// 2. زر الرئيسية (Home)
homeBtn.addEventListener('click', () => {
    historyStack = []; // تفريغ السجل والذهاب للمنزل مباشرة
    navigateTo('home-screen');
});

// 3. زر الدعم (Support)
supportMenuBtn.addEventListener('click', () => {
    navigateTo('support-screen');
});

// 4. التنقل بين الشاشات (للأزرار التي لديها data-target)
document.addEventListener('click', (event) => {
    const targetId = event.target.getAttribute('data-target');
    if (targetId && targetId !== 'support-screen') {
        navigateTo(targetId);
    }
});


// 5. زر الرجوع
backBtn.addEventListener('click', () => {
    if (historyStack.length > 0) {
        // استرجاع الشاشة الأخيرة من السجل وحذفها
        const prevScreenId = historyStack.pop();
        navigateTo(prevScreenId, true); // الانتقال مع إشارة أنه إجراء رجوع
    } else {
        navigateTo('home-screen');
    }
});

// عند تحميل الصفحة، نتحقق مما إذا كان هناك اسم مسجل بالفعل
document.addEventListener('DOMContentLoaded', () => {
    const storedUsername = localStorage.getItem('currentUsername');
    if (storedUsername) {
        // إذا وجد اسم، نتجاوز شاشة التسجيل
        nameInputSection.classList.add('hidden');
        mainAppContent.classList.remove('hidden');
        navigateTo('home-screen');
    }
});

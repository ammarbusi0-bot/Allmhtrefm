// تشغيل هذه الوظيفة عند تحميل الصفحة
window.onload = function() {
    checkUserName();
};

// وظيفة حفظ الاسم وتحديث واجهة المستخدم (ميزة تسجيل الدخول بالاسم)
function saveUserName() {
    const inputElement = document.getElementById('userNameInput');
    const userName = inputElement.value.trim();

    if (userName) {
        // حفظ الاسم في وحدة التخزين المحلية للمتصفح
        localStorage.setItem('userName', userName);
        
        // إخفاء حقل الإدخال وزر "بدء المشروع"
        document.getElementById('userNameInput').style.display = 'none';
        document.querySelector('#usernameSection button').style.display = 'none';
        
        // عرض رسالة الترحيب
        const welcomeMsg = document.getElementById('welcomeMessage');
        welcomeMsg.innerHTML = `مرحباً بك، <strong>${userName}</strong>! يمكنك الآن بدء العمل.`;
        welcomeMsg.style.display = 'block';

        alert(`تم تسجيل الدخول باسم: ${userName}`);
        
    } else {
        alert("الرجاء إدخال اسمك أولاً.");
    }
}

// وظيفة التحقق من الاسم عند زيارة الصفحة
function checkUserName() {
    const storedName = localStorage.getItem('userName');
    
    if (storedName) {
        // إذا كان الاسم محفوظاً، يتم إخفاء حقل الإدخال وعرض رسالة الترحيب
        document.getElementById('userNameInput').style.display = 'none';
        document.querySelector('#usernameSection button').style.display = 'none';

        const welcomeMsg = document.getElementById('welcomeMessage');
        welcomeMsg.innerHTML = `مرحباً بك مجدداً، <strong>${storedName}</strong>!`;
        welcomeMsg.style.display = 'block';
    } else {
        // إذا لم يكن الاسم محفوظاً، يتم عرض حقل الإدخال
        document.getElementById('userNameInput').style.display = 'block';
        document.querySelector('#usernameSection button').style.display = 'block';
    }
}

// وظيفة افتراضية لتحميل قسم الأسئلة (ميزة تقسيم الأسئلة)
// يجب عليك تطوير هذه الوظيفة لتعرض الأسئلة الفعلية من questions.js
function loadQuestionsSection(sectionNumber) {
    // مثال افتراضي: عرض رسالة أن القسم قيد التحميل
    alert(`جارٍ تحميل القسم رقم ${sectionNumber} من الأسئلة المُقسمة.`);

    // في مشروعك الفعلي، ستستخدم رقم القسم (sectionNumber)
    // لاستخراج مجموعة الأسئلة المناسبة من ملف questions.js وعرضها في الصفحة.
    
    // مثال لاستخدام بيانات questions.js (على افتراض أنها array)
    // if (typeof questions !== 'undefined' && questions.length > 0) {
    //     const sectionData = questions.filter(q => q.sectionId === sectionNumber);
    //     console.log('بيانات القسم المحمل:', sectionData);
    //     // هنا تضع الكود الذي يعرض الأسئلة على الشاشة.
    // }
}

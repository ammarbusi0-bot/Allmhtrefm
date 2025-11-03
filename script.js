// Background Music Toggle
const backgroundMusic = document.getElementById('background-music');
const musicToggleButton = document.getElementById('music-toggle');
let isMusicPlaying = false; // Set to false to start muted

// Initial setup: Mute music by default
backgroundMusic.muted = true;
musicToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>';

musicToggleButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        backgroundMusic.muted = true;
        musicToggleButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        backgroundMusic.play().catch(e => console.log("Music auto-play blocked:", e));
        backgroundMusic.muted = false;
        musicToggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Scroll Animation for Sections
const hiddenSections = document.querySelectorAll('.hidden');

const showContent = () => {
    const heroButton = document.getElementById('explore-button');
    heroButton.style.display = 'none'; // Hide the explore button after first click

    hiddenSections.forEach(section => {
        section.classList.add('visible');
    });

    // Scroll to the first visible section
    const firstSection = document.getElementById('about');
    if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
    }
};

document.getElementById('explore-button').addEventListener('click', showContent);

// Intersection Observer for subsequent sections (optional, but good for performance)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Uncomment to observe only once
        }
    });
}, { threshold: 0.1 });

hiddenSections.forEach(section => {
    observer.observe(section);
});


// ----------------------------------------------------
// منطق الكود السري والتحقق (ميزة جديدة)
// ----------------------------------------------------

const securityModal = document.getElementById('securityModal');
const closeButton = securityModal.querySelector('.close-button');
const secretCodeDisplay = document.getElementById('secretCodeDisplay');
const verifyCodeButton = document.getElementById('verifyCodeButton');
const userInputCode = document.getElementById('userInputCode');
const verificationMessage = document.getElementById('verificationMessage');
const serviceNamePlaceholder = securityModal.querySelector('.service-name-placeholder');

let currentSecretCode = '';
let serviceToBuy = {};

// دالة لإنشاء كود سري عشوائي (يبدأ بـ SH- ثم 4 أرقام)
function generateSecretCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `SH-${randomNum}`;
}

// استبدال الدالة القديمة لفتح النافذة المنبثقة
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const serviceCard = event.target.closest('.service-card');
        
        // حفظ تفاصيل الخدمة الحالية
        serviceToBuy = {
            name: serviceCard.getAttribute('data-name'),
            price: serviceCard.getAttribute('data-price')
        };

        // إعداد النافذة المنبثقة
        currentSecretCode = generateSecretCode(); // توليد كود جديد
        secretCodeDisplay.innerHTML = currentSecretCode;
        serviceNamePlaceholder.innerHTML = `الخدمة: ${serviceToBuy.name}`;
        userInputCode.value = ''; // مسح الإدخال السابق
        verificationMessage.innerHTML = '';
        
        securityModal.style.display = 'block'; // إظهار النافذة
    });
});


// وظيفة التحقق عند النقر على 'تحقق وتواصل'
verifyCodeButton.onclick = () => {
    const enteredCode = userInputCode.value.trim().toUpperCase();
    
    if (enteredCode === currentSecretCode) {
        // إذا كان الكود صحيحاً: التوجيه الآمن إلى التلغرام
        const telegramUsername = "Armanex"; // تأكد من صحة اسم المستخدم للتلغرام
        // ملاحظة: الرسالة تحتوي الآن على الكود السري لزيادة الواقعية
        const message = `أريد طلب خدمة "${serviceToBuy.name}". الرمز السري المستخدم: ${currentSecretCode}.`;
        const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
        
        // إغلاق النافذة والتوجيه
        securityModal.style.display = 'none';
        window.open(url, '_blank');
        
    } else {
        // إذا كان الكود خاطئاً
        verificationMessage.innerHTML = '⚠️ رمز سري خاطئ. حاول مجدداً.';
        verificationMessage.style.color = 'var(--secondary)';
    }
};

// وظيفة إغلاق النافذة
closeButton.onclick = () => {
    securityModal.style.display = 'none';
};

// إغلاق النافذة بالنقر خارجها
window.onclick = (event) => {
    if (event.target === securityModal) {
        securityModal.style.display = 'none';
    }
};


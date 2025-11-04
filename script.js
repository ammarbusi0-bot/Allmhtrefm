// تحديث الأسعار والتواريخ تلقائياً
function updatePricesAndDates() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    // تحديث تواريخ الكروت
    document.querySelectorAll('.update-date').forEach(element => {
        element.textContent = `آخر تحديث: ${now.toLocaleDateString('ar-AR', options)}`;
    });
    
    // تحديث الأسعار عشوائياً (محاكاة)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const priceElement = card.querySelector('.price');
        if (priceElement) {
            const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
            const newPrice = (currentPrice * (0.9 + Math.random() * 0.2)).toFixed(2);
            priceElement.textContent = `$${newPrice}`;
        }
    });
}

// فتح صفحة الدعم
function openSupport() {
    window.open('support.html', '_blank');
}

// إظهار إخلاء المسؤولية
function showDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'flex';
}

function closeDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'none';
}

// تشغيل التحديثات كل 5 دقائق
setInterval(updatePricesAndDates, 300000);

// تحديث فوري عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    showDisclaimer();
    updatePricesAndDates();
    
    // إزالة زر التليجرام إن وجد
    const telegramBtn = document.querySelector('a[href*="telegram"], a[href*="t.me"]');
    if (telegramBtn) {
        telegramBtn.remove();
    }
});

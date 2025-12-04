// تنفيذ المسبحة الإلكترونية
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع عدادات التسبيح في الصفحة
    const allCounters = document.querySelectorAll('.counter');
    
    allCounters.forEach(counter => {
        const countDisplay = counter.querySelector('.count-display');
        const incButton = counter.querySelector('.counter-btn');
        const resetButton = counter.querySelector('.reset-btn');
        
        let currentCount = 0;
        const targetCount = 33; // العدد الافتراضي للتسبيح
        
        function updateDisplay() {
            countDisplay.textContent = `${currentCount} / ${targetCount}`;
            if(currentCount >= targetCount) {
                countDisplay.style.color = '#2a9d8f';
                incButton.disabled = true;
                incButton.textContent = 'أكملت';
                incButton.style.backgroundColor = '#ccc';
            } else {
                countDisplay.style.color = '#1a5f7a';
                incButton.disabled = false;
                incButton.textContent = 'تسبيح';
                incButton.style.backgroundColor = '';
            }
        }
        
        incButton.addEventListener('click', function() {
            if(currentCount < targetCount) {
                currentCount++;
                updateDisplay();
            }
        });
        
        resetButton.addEventListener('click', function() {
            currentCount = 0;
            updateDisplay();
        });
        
        // التهيئة الأولى
        updateDisplay();
    });

    // تأثيرات بسيطة عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر لإضافة تأثير الظهور
    document.querySelectorAll('section, .feature-card, .link-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

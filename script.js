document.addEventListener('DOMContentLoaded', () => {
    const activateButton = document.getElementById('activate-btn');
    const codeInput = document.getElementById('activation-code');
    const messageDisplay = document.getElementById('activation-message');

    // كود التفعيل السري
    const SECRET_CODE = 'ammar';

    if (activateButton) {
        activateButton.addEventListener('click', () => {
            const enteredCode = codeInput.value.trim().toLowerCase();
            
            messageDisplay.textContent = ''; // مسح الرسالة السابقة
            
            if (enteredCode === SECRET_CODE) {
                // حالة النجاح: تفعيل الميزات
                messageDisplay.textContent = '✅ مبروك! تم تفعيل ميزات العضوية الماسية بنجاح بواسطة رمز ' + enteredCode.toUpperCase() + '. استمتع بوصول غير محدود!';
                messageDisplay.style.color = '#4CAF50'; // أخضر
                
                // تغيير وهمي لحالة الزر
                activateButton.disabled = true;
                activateButton.textContent = 'تم التفعيل!';
            } else if (enteredCode === '') {
                 messageDisplay.textContent = '⚠️ يرجى إدخال رمز التفعيل للمتابعة.';
                 messageDisplay.style.color = '#ff9800'; // برتقالي
            } else {
                // حالة الفشل: كود غير صحيح
                messageDisplay.textContent = '❌ عذراً، رمز التفعيل (' + enteredCode.toUpperCase() + ') غير صالح. يرجى التحقق من الرمز والمحاولة مرة أخرى.';
                messageDisplay.style.color = '#e91e63'; // لون الموقع الأساسي
            }
        });
    }

    // وظيفة وهمية لفتح وإغلاق المودال
    const modal = document.getElementById('modal-features');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = "none";
            }
        }

        // إغلاق المودال عند النقر خارج المحتوى
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});

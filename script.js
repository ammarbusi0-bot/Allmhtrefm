// وظيفة حفظ الاسم وأعلى نتيجة والإحصائيات المتراكمة في المتصفح
function saveUserData() {
    localStorage.setItem('username', username);
    localStorage.setItem('bestScoreMCQ', bestScoreMCQ);
    localStorage.setItem('bestScoreTF', bestScoreTF);
    // *** إضافة حفظ الإحصائيات الجديدة ***
    localStorage.setItem('totalAttempted', totalAttempted);
    localStorage.setItem('totalCorrect', totalCorrect);
    localStorage.setItem('totalWrong', totalWrong);
    // -----------------------------------
}

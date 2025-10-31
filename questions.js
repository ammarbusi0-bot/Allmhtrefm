// بيانات الأسئلة (Normal + Hard, TF + MC)
const allQuestions = {
    normal: { tf: [], mc: [] },
    hard: { tf: [], mc: [] }
};

// ملء أسئلة نموذجية (50 سؤالاً لكل فئة ونوع لضمان عمل الجولات)
for(let i=1; i<=50; i++){
    // أسئلة عادية
    allQuestions.normal.tf.push({question:`سؤال عادي (صح/خطأ) في المعرفة الإسلامية رقم ${i}.`,answer:i%2===0});
    allQuestions.normal.mc.push({question:`سؤال عادي (متعدد) في المعرفة الإسلامية رقم ${i}: ما هو الخيار الصحيح؟`,options:["الخيار الصحيح","خيار خاطئ 1","خيار خاطئ 2"],correct:"الخيار الصحيح"});
    
    // أسئلة صعبة (رفع المستوى)
    allQuestions.hard.tf.push({question:`سؤال صعب (صح/خطأ) في التفسير والفقه رقم ${i}.`,answer:i%2!==0});
    allQuestions.hard.mc.push({question:`سؤال صعب (متعدد) في الفقه المقارن رقم ${i}: ما هو الحكم الشرعي؟`,options:["الخيار المعقد أ","الخيار المعقد ب","الإجابة الصحيحة"],correct:"الإجابة الصحيحة"});
}

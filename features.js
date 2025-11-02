// features.js - الأحاديث والأذكار والاختبارات

// مصفوفة الأسئلة الدينية
const ALL_QUIZ_QUESTIONS = [
    {
        question: "ما هي أول سورة نزلت كاملة في القرآن الكريم؟",
        options: ["سورة الفاتحة", "سورة المدثر", "سورة العلق", "سورة النصر"],
        correctIndex: 1 
    },
    // ... (بقية الأسئلة العشرة)
    {
        question: "كم عدد أركان الإسلام؟",
        options: ["ثلاثة", "أربعة", "خمسة", "ستة"],
        correctIndex: 2 
    },
    {
        question: "من هو أول الخلفاء الراشدين؟",
        options: ["علي بن أبي طالب", "عمر بن الخطاب", "أبو بكر الصديق", "عثمان بن عفان"],
        correctIndex: 2 
    },
    {
        question: "ما هو الشهر الذي يصومه المسلمون كل عام؟",
        options: ["شوال", "شعبان", "رمضان", "محرم"],
        correctIndex: 2 
    },
    {
        question: "ما هو اسم النبي الذي ألقاه قومه في النار؟",
        options: ["يونس", "موسى", "إبراهيم", "عيسى"],
        correctIndex: 2 
    },
    {
        question: "في أي ركن من أركان الإسلام يتم الوقوف بعرفة؟",
        options: ["الصلاة", "الزكاة", "الحج", "الصوم"],
        correctIndex: 2 
    },
    {
        question: "من هو صاحب لقب 'فاروق الأمة'؟",
        options: ["أبو بكر الصديق", "عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب"],
        correctIndex: 1 
    },
    {
        question: "ما هي السورة التي بدأت بالتسبيح وختمت به؟",
        options: ["الحديد", "الواقعة", "الرحمن", "الإخلاص"],
        correctIndex: 0 
    },
    {
        question: "ما هي قبلة المسلمين الأولى؟",
        options: ["الكعبة المشرفة", "المسجد الأقصى", "المسجد النبوي", "مسجد قباء"],
        correctIndex: 1 
    },
    {
        question: "كم سنة استغرقت الدعوة السرية للإسلام؟",
        options: ["سنتان", "ثلاث سنوات", "أربع سنوات", "خمس سنوات"],
        correctIndex: 1 
    }
];


document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------
    // 1. متغيرات الأحاديث والأذكار والاختبار
    // --------------------------------------
    const hadithListDiv = document.getElementById('hadith-list');
    const azkarDisplayDiv = document.getElementById('azkar-display');
    const newHadithBtn = document.getElementById('new-hadith-btn');
    const HADITH_API_URL = 'https://hadeethenc.com/api/v1/hadeeths/one'; 
    const AZKAR_API_URL = 'https://hadeethenc.com/api/v1/azkar/list/?language=ar'; 
    const HADITH_LANG = 'ar'; 

    const quizContainer = document.getElementById('quiz-container');
    const scoreDisplay = document.getElementById('score-display');
    const roundNumberDisplay = document.getElementById('round-number');
    const timerDisplay = document.getElementById('timer-display');
    const fiftyFiftyBtn = document.getElementById('fifty-fifty-btn'); 

    const QUESTION_TIME = 20; 
    let countdown;
    let helpUsedInRound = false; 
    let questionsPool = []; 
    let questionsForRound = []; 
    let currentQuestionIndex = 0;
    let score = 0;
    let roundNumber = 1;


    // --------------------------------------
    // 2. دوال مساعدة
    // --------------------------------------
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };


    // --------------------------------------
    // 3. منطق الأحاديث والأذكار
    // --------------------------------------

    const loadRandomHadith = async () => {
        if (!hadithListDiv) return;
        
        hadithListDiv.innerHTML = '<p style="text-align: center;">جاري جلب الحديث والتفسير...</p>';
        newHadithBtn.disabled = true;

        try {
            const response = await fetch(`${HADITH_API_URL}?language=${HADITH_LANG}&random=1`);
            const data = await response.json();

            if (!data || !data.hadeeth) {
                throw new Error('فشل في جلب بيانات الحديث.');
            }

            const hadith = data.hadeeth;
            
            const htmlContent = `
                <div class="hadith-container">
                    <p class="hadith-text" style="font-size: 1.3rem; font-weight: bold; color: var(--secondary-color);">${hadith.header}</p>
                    <p class="hadith-text">${hadith.hadeeth}</p>
                    <span class="hadith-source">المصدر: ${hadith.source} (الدرجة: ${hadith.grade})</span>
                    
                    <h3 style="margin-top: 20px; color: var(--accent-color);">شرح الحديث (التفسير)</h3>
                    <div class="hadith-explanation" style="
                        background: var(--accent-color-light); 
                        padding: 15px; border-radius: 8px; 
                        line-height: 1.8; color: var(--text-color);">
                        ${hadith.explanation || 'لا يتوفر شرح لهذا الحديث.'}
                    </div>
                </div>
            `;
            hadithListDiv.innerHTML = htmlContent;

        } catch (error) {
            hadithListDiv.innerHTML = `<p style="color: red; text-align: center;">❌ فشل تحميل الحديث. حاول مجدداً.</p>`;
        } finally {
            newHadithBtn.disabled = false;
        }
    };
    
    const loadAzkar = async () => {
        if (!azkarDisplayDiv) return;
        
        azkarDisplayDiv.innerHTML = '<p style="text-align: center;">جاري جلب الأذكار...</p>';

        try {
            const response = await fetch(AZKAR_API_URL);
            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('فشل في جلب بيانات الأذكار.');
            }

            // عرض أول 10 أذكار 
            const azkarHTML = data.slice(0, 10).map(azkarGroup => {
                const zikrText = azkarGroup.content || 'لا يوجد نص';
                return `
                    <details class="azkar-details">
                        <summary>${azkarGroup.title || 'ذكر نبوي'}</summary>
                        <p style="padding: 10px; border-top: 1px dashed var(--accent-color-light);">${zikrText}</p>
                    </details>
                `;
            }).join('');
            
            azkarDisplayDiv.innerHTML = azkarHTML;
            
        } catch (error) {
            azkarDisplayDiv.innerHTML = `<p style="color: red; text-align: center;">❌ فشل تحميل الأذكار.</p>`;
        }
    };
    
    // --------------------------------------
    // 4. منطق لعبة الأسئلة الدينية
    // --------------------------------------
    
    if (quizContainer) {
        if (ALL_QUIZ_QUESTIONS.length === 0) {
             quizContainer.innerHTML = '<p style="color: red; text-align: center;">خطأ: مصفوفة الأسئلة فارغة.</p>';
        } else {
            questionsPool = [...ALL_QUIZ_QUESTIONS]; 
            shuffleArray(questionsPool);
            startQuiz();
        }
    }

    const startQuiz = () => {
        if (questionsPool.length < 10) {
            questionsPool = [...ALL_QUIZ_QUESTIONS]; 
            shuffleArray(questionsPool);
        }
        
        questionsForRound = questionsPool.splice(0, 10); 
        currentQuestionIndex = 0;
        score = 0;
        
        helpUsedInRound = false; 
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.disabled = false;
            fiftyFiftyBtn.style.opacity = '1';
        }
        
        roundNumberDisplay.textContent = roundNumber;
        scoreDisplay.textContent = score;
        displayQuestion();
    };

    const startTimer = () => {
        let timeLeft = QUESTION_TIME;
        if (timerDisplay) timerDisplay.textContent = timeLeft;

        countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                handleTimeout();
            }
        }, 1000);
    };
    
    const handleTimeout = () => {
        clearInterval(countdown);
        
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            const qData = questionsForRound[currentQuestionIndex];
            if (parseInt(btn.getAttribute('data-original-index')) === qData.correctIndex) {
                btn.style.backgroundColor = '#28a745'; 
                btn.style.color = 'white';
            }
        });

        quizContainer.insertAdjacentHTML('beforeend', '<p style="color: red; text-align: center; margin-top: 15px;">انتهى الوقت! السؤال لم يحتسب.</p>');

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    };

    const displayQuestion = () => {
        if (currentQuestionIndex >= questionsForRound.length) {
            endRound();
            return;
        }
        
        clearInterval(countdown);
        startTimer();

        const qData = questionsForRound[currentQuestionIndex];
        
        const optionsWithIndices = qData.options.map((text, index) => ({ text, index }));
        shuffleArray(optionsWithIndices);

        let optionsHTML = '';
        optionsWithIndices.forEach(opt => {
            optionsHTML += `<button class="answer-btn" data-original-index="${opt.index}">${opt.text}</button>`;
        });

        quizContainer.innerHTML = `
            <div class="question-box" id="current-question-box">
                <p>${(currentQuestionIndex + 1)}. ${qData.question}</p>
                ${optionsHTML}
            </div>
        `;

        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', handleAnswer);
        });

        if (fiftyFiftyBtn && !helpUsedInRound) {
            fiftyFiftyBtn.onclick = useFiftyFifty;
        }
    };

    const useFiftyFifty = () => {
        if (helpUsedInRound) return;

        const qData = questionsForRound[currentQuestionIndex];
        const correctIndex = qData.correctIndex;
        let incorrectButtons = [];

        document.querySelectorAll('.answer-btn').forEach(button => {
            if (parseInt(button.getAttribute('data-original-index')) !== correctIndex) {
                incorrectButtons.push(button);
            }
        });

        shuffleArray(incorrectButtons);
        
        for (let i = 0; i < 2 && i < incorrectButtons.length; i++) {
            incorrectButtons[i].disabled = true;
            incorrectButtons[i].style.opacity = '0.3'; 
            incorrectButtons[i].style.textDecoration = 'line-through';
        }

        helpUsedInRound = true;
        if (fiftyFiftyBtn) {
            fiftyFiftyBtn.disabled = true;
            fiftyFiftyBtn.style.opacity = '0.5';
        }
    };

    const handleAnswer = (event) => {
        clearInterval(countdown); 
        
        const selectedButton = event.target;
        const originalIndex = parseInt(selectedButton.getAttribute('data-original-index'));
        const qData = questionsForRound[currentQuestionIndex];
        
        document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
        
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (parseInt(btn.getAttribute('data-original-index')) === qData.correctIndex) {
                btn.style.backgroundColor = '#28a745'; 
                btn.style.color = 'white';
            }
        });

        if (originalIndex === qData.correctIndex) {
            score++;
        } else {
            selectedButton.style.backgroundColor = '#dc3545'; 
            selectedButton.style.color = 'white';
        }
        
        scoreDisplay.textContent = score;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    };

    const endRound = () => {
        roundNumber++;
        clearInterval(countdown); 
        if (timerDisplay) timerDisplay.textContent = QUESTION_TIME; 

        quizContainer.innerHTML = `
            <div style="text-align: center;">
                <h2>🎉 انتهت الجولة ${roundNumber - 1}</h2>
                <p>لقد أحرزت **${score}** من **10** نقاط.</p>
                <p style="font-weight: bold; color: var(--accent-color);">${score >= 7 ? 'نتائج ممتازة! استمر.' : 'يمكنك تحقيق نتيجة أفضل في الجولة القادمة.'}</p>
                <button id="next-round-btn" style="
                    background-color: var(--accent-color); color: white; border: none; 
                    padding: 10px 20px; border-radius: 25px; cursor: pointer; margin-top: 15px; font-weight: bold;
                ">ابدأ الجولة التالية (${roundNumber})</button>
            </div>
        `;
        document.getElementById('next-round-btn').addEventListener('click', startQuiz);
    };


    // --------------------------------------
    // 5. بدء تشغيل الميزات
    // --------------------------------------
    if (hadithListDiv) {
        loadRandomHadith(); 
        loadAzkar(); 
        if (newHadithBtn) {
            newHadithBtn.addEventListener('click', loadRandomHadith);
        }
    }
});

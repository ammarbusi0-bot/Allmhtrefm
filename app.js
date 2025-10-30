// app.js
(function(){
  // عناصر DOM
  const loginOverlay = document.getElementById('login-overlay');
  const usernameInput = document.getElementById('username-input');
  const saveUsernameBtn = document.getElementById('save-username');
  const userGreet = document.getElementById('user-greet');

  const homeScreen = document.getElementById('home-screen');
  const startMcqBtn = document.getElementById('start-mcq');
  const startTfBtn = document.getElementById('start-tf');
  const openProfileBtn = document.getElementById('open-profile');

  const gameScreen = document.getElementById('game-screen');
  const gameTitle = document.getElementById('game-title');
  const qnumSpan = document.getElementById('qnum');
  const questionText = document.getElementById('question-text');
  const optionsDiv = document.getElementById('options');
  const nextQuestionBtn = document.getElementById('next-question');
  const afterActions = document.getElementById('after-actions');

  const roundEnd = document.getElementById('round-end');
  const roundScoreEl = document.getElementById('round-score');
  const newRoundBtn = document.getElementById('new-round');

  const profileScreen = document.getElementById('profile-screen');
  const profileUsername = document.getElementById('profile-username');
  const historyUl = document.getElementById('history-ul');
  const noHistory = document.getElementById('no-history');
  const clearHistoryBtn = document.getElementById('clear-history');
  const logoutBtn = document.getElementById('logout');

  const backHome1 = document.getElementById('back-home-1');
  const backHome2 = document.getElementById('back-home-2');
  const backHome3 = document.getElementById('back-home-3');

  const toast = document.getElementById('toast');

  // إعدادات
  const ROUND_SIZE = 10;

  // الحالة الجارية
  let username = null;
  let currentGame = null; // 'mcq' أو 'tf'
  let currentRoundQuestions = [];
  let currentQIndex = 0; // 0..ROUND_SIZE-1
  let currentScore = 0;

  // مفتاح تخزين المستخدم
  function userKey(name){ return `qa_user_${name}`; }
  function historyKey(name){ return `qa_history_${name}`; }

  // ابتدائياً: التأكد من وجود QUESTIONS محمّلة
  if(!window.QUESTIONS || !window.QUESTIONS.mcq || !window.QUESTIONS.tf){
    alert('خطأ: لم يتم تحميل ملف الأسئلة (questions.js) أو أن هيكل البيانات غير صحيح.');
    throw new Error('QUESTIONS missing');
  }

  // --- إدارة المستخدم ---
  function showLoginIfNeeded(){
    const stored = localStorage.getItem('qa_username');
    if(stored){
      username = stored;
      loginOverlay.classList.add('hidden');
      userGreet.textContent = `مرحبا، ${username}`;
      profileUsername.textContent = username;
    } else {
      loginOverlay.classList.remove('hidden');
      usernameInput.value = '';
      usernameInput.focus();
    }
  }

  saveUsernameBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if(!name){
      alert('الرجاء إدخال اسم مستخدم صالح.');
      return;
    }
    username = name;
    localStorage.setItem('qa_username', name);
    userGreet.textContent = `مرحبا، ${username}`;
    profileUsername.textContent = username;
    loginOverlay.classList.add('hidden');
  });

  // خيار الخروج / تغيير اسم المستخدم
  logoutBtn.addEventListener('click', () => {
    if(confirm('هل تريد تغيير اسم المستخدم؟ سيتم عرض شاشة إدخال اسم جديد.')) {
      localStorage.removeItem('qa_username');
      username = null;
      showLoginIfNeeded();
      navigateTo('home');
    }
  });

  // --- إدارة التنقل بين الشاشات ---
  function hideAll(){
    homeScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    roundEnd.classList.add('hidden');
    profileScreen.classList.add('hidden');
  }
  function navigateTo(screen){
    hideAll();
    afterActions.classList.add('hidden');
    if(screen === 'home'){
      homeScreen.classList.remove('hidden');
    } else if(screen === 'game'){
      gameScreen.classList.remove('hidden');
    } else if(screen === 'roundEnd'){
      roundEnd.classList.remove('hidden');
    } else if(screen === 'profile'){
      profileScreen.classList.remove('hidden');
      renderHistory();
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }

  backHome1.addEventListener('click', ()=> navigateTo('home'));
  backHome2.addEventListener('click', ()=> navigateTo('home'));
  backHome3.addEventListener('click', ()=> navigateTo('home'));
  openProfileBtn.addEventListener('click', ()=> navigateTo('profile'));

  // --- اختيار أسئلة جولة عشوائية ---
  function pickRandomQuestions(list, n){
    const indices = [];
    for(let i=0;i<list.length;i++) indices.push(i);
    // خلط (Fisher-Yates)
    for(let i=indices.length-1;i>0;i--){
      const j = Math.floor(Math.random() * (i+1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const picked = indices.slice(0, Math.min(n, indices.length)).map(i => list[i]);
    return picked;
  }

  // --- البدء في لعبة ---
  startMcqBtn.addEventListener('click', ()=> startGame('mcq'));
  startTfBtn.addEventListener('click', ()=> startGame('tf'));

  function startGame(gameType){
    if(!username) { showLoginIfNeeded(); return; }
    currentGame = gameType;
    currentRoundQuestions = pickRandomQuestions(window.QUESTIONS[gameType], ROUND_SIZE);
    currentQIndex = 0;
    currentScore = 0;
    gameTitle.textContent = (gameType === 'mcq') ? 'لعبة الأسئلة والأجوبة (متعدد الخيارات)' : 'لعبة صح أو خطأ';
    qnumSpan.textContent = (currentQIndex + 1) + ' / ' + ROUND_SIZE;
    showQuestion();
    navigateTo('game');
  }

  // --- عرض سؤال ---
  function showQuestion(){
    afterActions.classList.add('hidden');
    const qobj = currentRoundQuestions[currentQIndex];
    qnumSpan.textContent = (currentQIndex + 1) + ' / ' + ROUND_SIZE;
    questionText.textContent = `${currentQIndex + 1}. ${qobj.q}`;
    optionsDiv.innerHTML = '';

    if(currentGame === 'mcq'){
      qobj.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', ()=> handleAnswerMCQ(idx));
        optionsDiv.appendChild(btn);
      });
    } else if(currentGame === 'tf'){
      ['صح','خطأ'].forEach((label, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = label;
        btn.addEventListener('click', ()=> handleAnswerTF(idx === 0));
        optionsDiv.appendChild(btn);
      });
    }
  }

  // --- التعامل مع إجابة MCQ ---
  function handleAnswerMCQ(selectedIdx){
    disableOptions();
    const qobj = currentRoundQuestions[currentQIndex];
    const isCorrect = (selectedIdx === qobj.answerIndex);
    if(isCorrect) currentScore++;
    saveAnswerToHistory({
      game: 'mcq',
      questionId: qobj.id,
      questionText: qobj.q,
      selected: qobj.options[selectedIdx],
      correct: isCorrect,
      qNumberInRound: currentQIndex + 1,
      timestamp: new Date().toISOString()
    });
    showTemporaryResult(isCorrect);
  }

  // --- التعامل مع إجابة TF ---
  function handleAnswerTF(chosenIsTrue){
    disableOptions();
    const qobj = currentRoundQuestions[currentQIndex];
    const isCorrect = (chosenIsTrue === qobj.answer);
    if(isCorrect) currentScore++;
    saveAnswerToHistory({
      game: 'tf',
      questionId: qobj.id,
      questionText: qobj.q,
      selected: chosenIsTrue ? 'صح' : 'خطأ',
      correct: isCorrect,
      qNumberInRound: currentQIndex + 1,
      timestamp: new Date().toISOString()
    });
    showTemporaryResult(isCorrect);
  }

  function disableOptions(){
    const btns = optionsDiv.querySelectorAll('.option-btn');
    btns.forEach(b => b.classList.add('disabled'), b => b.disabled = true);
    // بعد الإجابة، إظهار زر "التالي"
    afterActions.classList.remove('hidden');
  }

  // عرض رسالة نتيجة قصيرة قبل الانتقال
  function showTemporaryResult(isCorrect){
    showToast(isCorrect ? 'إجابة صحيحة ✅' : 'إجابة خاطئة ❌');
  }

  nextQuestionBtn.addEventListener('click', ()=> {
    currentQIndex++;
    if(currentQIndex < ROUND_SIZE){
      showQuestion();
    } else {
      endRound();
    }
  });

  // --- نهاية الجولة ---
  function endRound(){
    roundScoreEl.textContent = `${currentScore}`;
    // حفظ ملخّص الجولة (اختياري) في الـ history
    saveRoundSummary({
      game: currentGame,
      score: currentScore,
      total: ROUND_SIZE,
      timestamp: new Date().toISOString()
    });
    navigateTo('roundEnd');
  }

  newRoundBtn.addEventListener('click', () => {
    startGame(currentGame);
  });

  // --- التخزين في localStorage للسجل ---
  function getHistory(){
    const raw = localStorage.getItem(historyKey(username));
    if(!raw) return [];
    try { return JSON.parse(raw) } catch(e){ return []; }
  }
  function setHistory(list){
    localStorage.setItem(historyKey(username), JSON.stringify(list));
  }

  function saveAnswerToHistory(entry){
    // entry: {game, questionId, questionText, selected, correct, qNumberInRound, timestamp}
    const h = getHistory();
    h.unshift({type:'answer', ...entry});
    setHistory(h);
  }

  function saveRoundSummary(summary){
    // summary: {game, score, total, timestamp}
    const h = getHistory();
    h.unshift({type:'round', ...summary});
    setHistory(h);
  }

  // --- عرض السجل في الملف الشخصي ---
  function renderHistory(){
    const h = getHistory();
    historyUl.innerHTML = '';
    if(!h || h.length === 0){
      noHistory.classList.remove('hidden');
      historyUl.classList.add('hidden');
      return;
    }
    noHistory.classList.add('hidden');
    historyUl.classList.remove('hidden');

    h.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'card';
      if(item.type === 'round'){
        li.innerHTML = `<strong>جولة — ${item.game === 'mcq' ? 'متعدد الخيارات' : 'صح/خطأ'}</strong>
                        <div>النتيجة: ${item.score} / ${item.total}</div>
                        <div class="muted">${new Date(item.timestamp).toLocaleString()}</div>`;
      } else if(item.type === 'answer'){
        li.innerHTML = `<strong>سؤال (${item.game === 'mcq' ? 'MCQ' : 'TF'}) — رقم الجولة: ${item.qNumberInRound}</strong>
                        <div>السؤال: ${item.questionText}</div>
                        <div>إجابتك: ${item.selected} — ${item.correct ? 'صحيح' : 'خاطئ'}</div>
                        <div class="muted">${new Date(item.timestamp).toLocaleString()}</div>`;
      }
      historyUl.appendChild(li);
    });
  }

  clearHistoryBtn.addEventListener('click', ()=>{
    if(confirm('هل تريد مسح سجل الأداء بالكامل؟')) {
      localStorage.removeItem(historyKey(username));
      renderHistory();
    }
  });

  // toast صغير
  let toastTimer = null;
  function showToast(text){
    if(toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    toast.textContent = text;
    toast.classList.remove('hidden');
    toastTimer = setTimeout(()=> {
      toast.classList.add('hidden');
    }, 1200);
  }

  // init
  showLoginIfNeeded();
  navigateTo('home');

  // لراحة المستخدم: السماح بالضغط Enter لحفظ اسم المستخدم
  usernameInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') saveUsernameBtn.click();
  });

})();

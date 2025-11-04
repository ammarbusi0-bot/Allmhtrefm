/* تنسيقات متقدمة للتصميم */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 🟢 ألوان الثيم الحيوي (الأخضر النيون والماجينتا) */
:root {
    --primary: #00ff88; /* أخضر نيون */
    --secondary: #ff0088; /* ماجينتا نيون */
    --accent: #8800ff; /* بنفسجي كهربائي */
    --dark: #0a0a0a;
    --darker: #000000;
    --light: #ffffff;
    --glow: 0 0 20px;
}

body {
    background: var(--darker);
    color: var(--light);
    overflow-x: hidden;
    position: relative;
}

/* نافذة إخلاء المسؤولية المحدثة */
.modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    z-index: 9999;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    padding: 2.5rem;
    border-radius: 15px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    text-align: right;
    border: 2px solid var(--primary);
    box-shadow: 0 0 40px var(--primary);
}

.modal-content h3 {
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-align: center;
}

.disclaimer-text {
    line-height: 1.8;
    margin-bottom: 2rem;
}

.disclaimer-text p {
    margin-bottom: 1rem;
    color: #ccc;
}

.disclaimer-text strong {
    color: var(--primary);
}

.disclaimer-text ul {
    margin: 1rem 0;
    padding-right: 1.5rem;
}

.disclaimer-text li {
    margin-bottom: 0.5rem;
    color: #00ff88;
}

.modal-content button {
    background: linear-gradient(45deg, var(--primary), var(--accent));
    color: var(--dark);
    padding: 1rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.modal-content button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px var(--primary);
}

/* تأثيرات الخلفية المتحركة */
.matrix-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.1;
}

/* شريط التنقل */
.navbar {
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    padding: 1rem 2rem;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    border-bottom: 2px solid var(--primary);
}

.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

.logo {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary);
    text-shadow: var(--glow) var(--primary);
}

.nav-links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
}

.nav-links a {
    color: var(--light);
    text-decoration: none;
    transition: all 0.3s;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 25px;
}

.nav-links a:hover {
    color: var(--primary);
    background: rgba(0, 255, 136, 0.1); 
    transform: translateY(-2px);
}

/* الهيرو المتطور */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    position: relative;
    background: radial-gradient(circle at center, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
}

.hero-content h1 {
    font-size: 4.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(45deg, var(--primary), var(--accent), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: var(--glow) var(--primary);
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { text-shadow: 0 0 20px var(--primary); }
    to { text-shadow: 0 0 30px var(--accent), 0 0 40px var(--secondary); }
}

.hero-content p {
    font-size: 1.8rem;
    margin-bottom: 3rem;
    opacity: 0.9;
    text-shadow: var(--glow) var(--primary);
}

.cta-button {
    background: linear-gradient(45deg, var(--primary), var(--accent));
    color: var(--dark);
    padding: 1.2rem 3rem;
    border: none;
    border-radius: 50px;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.4s ease;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 0 25px var(--primary);
}

.cta-button:hover {
    transform: scale(1.1);
    box-shadow: 0 0 40px var(--accent);
    background: linear-gradient(45deg, var(--accent), var(--primary));
}

/* الخدمات المحسنة */
.services {
    padding: 6rem 2rem;
    background: var(--dark);
}

.section-title {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 4rem;
    color: var(--primary);
    text-shadow: var(--glow) var(--primary);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
}

.service-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border: 2px solid var(--primary);
    border-radius: 20px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
}

.service-card:hover {
    transform: translateY(-15px) scale(1.02);
    border-color: var(--accent);
    box-shadow: 0 0 40px var(--primary);
}

.best-seller {
    border-color: gold;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a00 100%);
}

.best-seller-badge {
    background: linear-gradient(45deg, gold, #ffd700);
    color: #000;
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    font-weight: bold;
    margin-bottom: 1rem;
    display: inline-block;
    box-shadow: 0 0 15px gold;
}

.service-icon {
    font-size: 3.5rem;
    color: var(--primary);
    margin-bottom: 1.5rem;
    text-shadow: var(--glow) var(--primary);
}

.service-card h3 {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
    color: var(--light);
}

.service-card p {
    color: var(--light);
    opacity: 0.8;
    line-height: 1.7;
    margin-bottom: 2rem;
}

.price {
    color: var(--accent);
    font-size: 2.2rem;
    font-weight: bold;
    margin: 1.5rem 0;
    text-shadow: var(--glow) var(--accent);
}

.buy-btn {
    background: linear-gradient(45deg, var(--accent), var(--secondary));
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
    transition: all 0.4s ease;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.buy-btn:hover {
    background: linear-gradient(45deg, var(--secondary), var(--accent));
    box-shadow: 0 0 25px var(--accent);
    transform: scale(1.05);
}

/* المميزات المتطورة */
.features-section {
    padding: 6rem 2rem;
    background: var(--darker);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 2.5rem;
    border-radius: 15px;
    border: 2px solid transparent;
    transition: all 0.4s ease;
    cursor: pointer;
    text-align: center;
    backdrop-filter: blur(10px);
}

.feature-card:hover {
    border-color: var(--primary);
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
}

.feature-card i {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(45deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.feature-card h3 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: var(--light);
}

.feature-card p {
    color: #ccc;
    line-height: 1.6;
}

/* قسم التعليقات المحسن */
.comments-section {
    background: var(--dark);
    padding: 6rem 2rem;
    border-top: 3px solid var(--secondary);
    border-bottom: 3px solid var(--secondary);
}

.comments-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1300px;
    margin: 3rem auto;
}

.comment {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    padding: 2rem;
    border-radius: 15px;
    border: 1px solid #333;
    text-align: right;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.comment::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: var(--primary);
}

.comment:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
    box-shadow: 0 0 25px rgba(0, 255, 136, 0.2);
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.comment-name {
    color: var(--primary);
    font-weight: bold;
    font-size: 1.1rem;
}

.comment-badge {
    background: linear-gradient(45deg, var(--secondary), var(--accent));
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
}

.comment-text {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #ccc;
    font-size: 1rem;
}

.comment-stars {
    color: gold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.comment-time {
    color: #888;
    font-size: 0.9rem;
    text-align: left;
}

.comment-notice {
    background: linear-gradient(135deg, #102a10, #301030);
    color: var(--primary);
    padding: 1.5rem;
    border-radius: 10px;
    margin: 2rem auto;
    border: 2px solid var(--primary);
    font-size: 1.1rem;
    max-width: 800px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

/* قسم الأسئلة الشائعة المتطور */
.faq-section {
    padding: 6rem 2rem;
    background: var(--darker);
}

.faq-container {
    max-width: 1000px;
    margin: 3rem auto;
}

.faq-item {
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    border-radius: 15px;
    margin-bottom: 1.5rem;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.faq-item:hover {
    border-color: var(--primary);
}

.faq-question {
    background: rgba(0, 255, 136, 0.1); 
    color: var(--light);
    padding: 1.5rem 2rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.faq-question:hover {
    background: rgba(0, 255, 136, 0.2);
}

.faq-answer {
    padding: 0 2rem;
    color: #ccc;
    line-height: 1.7;
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid #333;
    max-height: 0; 
    overflow: hidden;
    transition: max-height 0.4s ease-out, padding 0.4s ease-out;
}

.faq-item.active .faq-answer {
    max-height: 500px; 
    padding: 2rem;
}

.faq-toggle {
    color: var(--primary);
    transition: transform 0.3s ease;
}

.faq-item.active .faq-toggle {
    transform: rotate(180deg);
}

/* الفوتر المحسن */
.footer {
    background: var(--dark);
    padding: 4rem 2rem;
    text-align: center;
    border-top: 3px solid var(--primary);
}

.footer p {
    color: var(--light);
    opacity: 0.8;
    margin-bottom: 1rem;
}

.telegram-float {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    background: #0088cc;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    box-shadow: 0 0 25px #0088cc;
    z-index: 1000;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.telegram-float:hover {
    transform: scale(1.1);
    box-shadow: 0 0 35px #0088cc;
}

/* 🟢🔐 التنسيق الأهم: إخفاء جميع الأقسام ما عدا الهيرو عند التحميل */
.services, .features-section, .comments-section, .faq-section, .footer {
    opacity: 0; /* اخفاء المحتوى */
    transition: opacity 1s ease-out; /* إضافة سلاسة للظهور */
    pointer-events: none; /* منع أي تفاعل بالماوس قبل الظهور */
}

/* التجاوب للهواتف */
@media (max-width: 768px) {
    .hero-content h1 { font-size: 2.8rem; }
    .nav-links { display: none; }
    .services-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr; }
    .comments-container { grid-template-columns: 1fr; }
    .telegram-float { bottom: 1rem; left: 1rem; padding: 0.8rem 1.2rem; }
    .modal-content { margin: 1rem; padding: 2rem; }
}

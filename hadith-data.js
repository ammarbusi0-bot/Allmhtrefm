<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حابس إبليس بالكيس - الأحاديث النبوية</title>
    
    <style>
        /* CSS مدمج */
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;700&display=swap');
        
        :root {
            --main-bg-color: #f0f4f8;        
            --text-color: #1a1a1a;
            --card-bg-color: #ffffff;
            --accent-color: #b8860b;         
            --accent-color-light: #ffd700;   
            --shadow-color: rgba(0, 0, 0, 0.15);
            --font-family: 'Cairo', 'Amiri', serif;
        }
        .dark-mode {
            --main-bg-color: #0e1628;        
            --text-color: #f0e68c;           
            --card-bg-color: #1a243a;
            --accent-color: #ffd700;         
            --accent-color-light: #b8860b;
            --shadow-color: rgba(0, 0, 0, 0.5);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--font-family);
            background-color: var(--main-bg-color); color: var(--text-color);
            line-height: 1.8; transition: background-color 0.5s, color 0.5s;
            padding: 20px; direction: rtl;
        }
        header { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 20px 0; margin-bottom: 20px; 
        }
        header h1 { 
            font-size: 2.5rem; color: var(--accent-color); 
            text-shadow: 1px 1px 3px var(--accent-color-light); 
        }
        #theme-toggle { 
            background-color: var(--accent-color); color: var(--card-bg-color); border: none; 
            padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: bold;
            transition: all 0.3s; 
        }
        #theme-toggle:hover { 
            background-color: var(--accent-color-light); color: var(--text-color);
            box-shadow: 0 4px 10px var(--shadow-color);
        }
        nav { 
            display: flex; flex-wrap: wrap; gap: 20px; 
            margin-bottom: 30px; 
            padding: 10px 0;
            justify-content: center;
            border-bottom: 2px solid var(--accent-color);
            border-top: 2px solid var(--accent-color);
        }
        nav a {
            color: var(--accent-color); 
            text-decoration: none; 
            font-size: 1.1rem; 
            padding: 5px 10px;
            border-bottom: 2px solid transparent;
            transition: color 0.3s, border-bottom 0.3s;
            font-weight: 700;
        }
        nav a:hover {
            color: var(--accent-color-light);
            border-bottom: 2px solid var(--accent-color-light);
        }
        main { max-width: 900px; margin: 0 auto; }
        .card { 
            background-color: var(--card-bg-color); padding: 30px; border-radius: 15px; 
            box-shadow: 0 8px 25px var(--shadow-color); 
            border-top: 5px solid var(--accent-color);
            margin-bottom: 30px;
        }
        .card h2 { 
            color: var(--accent-color); margin-bottom: 20px; 
            border-bottom: 2px solid var(--accent-color-light); 
            padding-bottom: 8px; font-size: 1.8rem; font-weight: 700;
        }
        .hadith-container {
            border: 1px dashed var(--accent-color-light);
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 10px;
            background-color: var(--main-bg-color);
        }
        .hadith-text {
            font-family: 'Amiri', serif;
            font-size: 1.3rem;
            line-height: 2;
            margin-bottom: 10px;
            text-align: justify;
        }
        .hadith-source {
            font-size: 0.95rem;
            color: var(--accent-color);
            font-weight: bold;
            display: block;
            margin-top: 10px;
            border-top: 1px solid var(--accent-color-light);
            padding-top: 5px;
        }
        @media (max-width: 767px) {
            header { flex-direction: column; gap: 15px; }
            nav { flex-direction: column; gap: 10px; }
        }
    </style>
</head>
<body class="light-mode">
    <header>
        <h1>😈 حابس إبليس بالكيس</h1>
        <button id="theme-toggle">🌙 الوضع الليلي</button>
    </header>
    
    <nav> 
        <a href="index.html">القرآن الكريم (المصحف)</a>
        <a href="hadith.html">الأحاديث النبوية</a>
        <a href="quiz.html">الأسئلة الدينية</a> 
    </nav>

    <main>
        <section class="card">
            <h2>📜 الأحاديث النبوية الشريفة</h2>
            <p>مختارات من الأحاديث الصحيحة:</p>
            
            <div id="hadith-list">
                <p style="text-align: center; color: var(--accent-color);">جاري تحميل الأحاديث...</p>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 حابس إبليس بالكيس</p>
    </footer>

    <script src="hadith-data.js"></script> 
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const themeToggleBtn = document.getElementById('theme-toggle');
            const body = document.body;
            const THEME_KEY = 'appTheme';
            const hadithListDiv = document.getElementById('hadith-list');
            
            // 1. منطق الوضع الليلي
            const loadTheme = () => {
                const savedTheme = localStorage.getItem(THEME_KEY) || 'light-mode';
                body.className = savedTheme;
                if (themeToggleBtn) {
                    themeToggleBtn.textContent = savedTheme === 'dark-mode' ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
                }
            };
            
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    const newTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
                    body.className = newTheme;
                    localStorage.setItem(THEME_KEY, newTheme);
                    loadTheme();
                });
            }
            loadTheme();


            // 2. منطق عرض الأحاديث
            const displayHadiths = () => {
                // التأكد من أن مصفوفة البيانات (المحمّلة من hadith-data.js) متاحة
                if (typeof PROPHET_HADITHS === 'undefined' || !Array.isArray(PROPHET_HADITHS)) {
                    hadithListDiv.innerHTML = '<p style="color: red; text-align: center;">خطأ: فشل تحميل ملف بيانات الأحاديث (hadith-data.js). تأكد من وجوده وبأن اسمه مكتوب بشكل صحيح.</p>';
                    return;
                }

                hadithListDiv.innerHTML = ''; // تفريغ رسالة التحميل

                PROPHET_HADITHS.forEach(hadith => {
                    const htmlContent = `
                        <div class="hadith-container">
                            <p class="hadith-text">${hadith.text}</p>
                            <span class="hadith-source">${hadith.source}</span>
                        </div>
                    `;
                    hadithListDiv.insertAdjacentHTML('beforeend', htmlContent);
                });
            };

            displayHadiths();
        });
    </script>
</body>
</html>

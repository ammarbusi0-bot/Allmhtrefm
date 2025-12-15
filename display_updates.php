<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>منشورات الغرفة الداخلية</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #e9ecef; padding: 20px; text-align: right; }
        .post-container { max-width: 800px; margin: 50px auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); border-right: 5px solid #007bff; }
        h1 { color: #007bff; text-align: center; margin-bottom: 25px; }
        #messageDisplayArea { font-size: 1.2em; color: #555; line-height: 1.8; white-space: pre-wrap; /* يحافظ على تنسيق الأسطر الجديدة */ }
        .loading-text { color: #aaa; text-align: center; }
        .last-update { font-size: 0.8em; color: #999; margin-top: 20px; border-top: 1px dashed #eee; padding-top: 10px; }
    </style>
</head>
<body>

    <div class="post-container">
        <h1>🔔 آخر تحديث من الغرفة الداخلية 🔔</h1>
        
        <div id="messageDisplayArea" class="loading-text">
            جاري تحميل آخر منشور...
        </div>
        
        <div class="last-update">
            آخر تحديث تم جلبه في: <span id="timestamp">--:--</span>
        </div>
    </div>

    <script>
        function fetchLatestMessage() {
            // نقوم هنا بطلب مباشر للملف الذي يحوي المنشور
            fetch('latest_message.txt?t=' + new Date().getTime()) 
                .then(response => {
                    if (!response.ok) {
                        // إذا لم يتم العثور على الملف
                        throw new Error('لم يتم العثور على ملف المنشور.');
                    }
                    return response.text();
                })
                .then(data => {
                    document.getElementById('messageDisplayArea').innerHTML = data.trim() || 'لا توجد منشورات جديدة بعد.';
                    document.getElementById('messageDisplayArea').classList.remove('loading-text');
                    
                    // تحديث وقت الجلب
                    const now = new Date();
                    document.getElementById('timestamp').innerText = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    document.getElementById('messageDisplayArea').innerHTML = 'تعذر تحميل المنشور. حاول مرة أخرى.';
                    document.getElementById('messageDisplayArea').classList.remove('loading-text');
                });
        }

        // 1. استدعاء الوظيفة عند تحميل الصفحة لأول مرة
        fetchLatestMessage();

        // 2. تحديث المنشور تلقائياً كل 30 ثانية (30000 مللي ثانية)
        setInterval(fetchLatestMessage, 30000); 
    </script>

</body>
</html>

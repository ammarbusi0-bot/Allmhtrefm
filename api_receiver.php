<?php
// إعداد الرأس (Header) ليعيد استجابة JSON
header('Content-Type: application/json');

// 1. مفتاح الأمان: يجب أن يكون مطابقاً للمفتاح في send_update.php
$SECRET_KEY = 'YOUR_STRONG_SECRET_KEY_123'; 

// 2. التحقق من أسلوب الطلب والمفتاح السري
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['secret_key']) || $_POST['secret_key'] !== $SECRET_KEY) {
    http_response_code(401);
    die(json_encode(['status' => 'error', 'message' => 'Unauthorized Access or Invalid Request Method.']));
}

// 3. التحقق من وجود الرسالة
if (!isset($_POST['message'])) {
    http_response_code(400);
    die(json_encode(['status' => 'error', 'message' => 'Missing message parameter.']));
}

$receivedMessage = $_POST['message'];
$filename = 'latest_message.txt';

// 4. حفظ الرسالة في ملف
// يتم استخدام LOCK_EX لضمان أن ملفاً واحداً فقط يكتب في الوقت نفسه
if (file_put_contents($filename, $receivedMessage, LOCK_EX) !== false) {
    echo json_encode(['status' => 'success', 'message' => 'Message received and saved successfully.']);
} else {
    // فشل في عملية الكتابة
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to write message to file.']);
}
?>

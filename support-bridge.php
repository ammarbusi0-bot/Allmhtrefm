<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_POST) {
    $name = $_POST['name'] ?? 'مجهول';
    $message = $_POST['message'] ?? 'لا رسالة';
    
    $botToken = "7102386451:AAEa9a0example";
    $chatId = "6125184094";
    
    $text = "🆕 رسالة دعم\n👤 الاسم: $name\n💬 الرسالة: $message";
    
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $data = ["chat_id" => $chatId, "text" => $text];
    
    file_get_contents($url . '?' . http_build_query($data));
    echo json_encode(["status" => "success"]);
}
?>

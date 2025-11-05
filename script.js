function sendMessage() {
    var message = document.getElementById('messageInput').value;
    if (message !== '') {
        var messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += '<p>أنت: ' + message + '</p>';
        document.getElementById('messageInput').value = '';
        
        // رد تلقائي (لمحاكاة وجود أشخاص حقيقيين)
        setTimeout(function() {
            messagesDiv.innerHTML += '<p>غريب: أحب دردشتنا هذه 💋</p>';
        }, 2000);
    }
}

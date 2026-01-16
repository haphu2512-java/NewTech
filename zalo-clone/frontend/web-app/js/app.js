// WebSocket connection
const socket = io('http://localhost:8083');

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Current user (mock data)
const currentUser = {
    id: 1,
    username: 'current_user',
    displayName: 'Tôi'
};

// Current conversation
let currentConversation = {
    id: 'conv_123',
    recipientId: 2,
    recipientName: 'Nguyễn Văn A'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Zalo Clone App initialized');
    setupEventListeners();
    connectWebSocket();
    loadMessages();
});

// Setup event listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Typing indicator
    let typingTimeout;
    messageInput.addEventListener('input', () => {
        socket.emit('typing', {
            conversationId: currentConversation.id,
            userId: currentUser.id,
            isTyping: true
        });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('typing', {
                conversationId: currentConversation.id,
                userId: currentUser.id,
                isTyping: false
            });
        }, 1000);
    });
}

// Connect WebSocket
function connectWebSocket() {
    socket.on('connect', () => {
        console.log('✅ WebSocket connected:', socket.id);
        socket.emit('join-conversation', currentConversation.id);
    });

    socket.on('new-message', (message) => {
        console.log('📨 New message received:', message);
        appendMessage(message);
    });

    socket.on('user-typing', ({ userId, isTyping }) => {
        showTypingIndicator(userId, isTyping);
    });

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
    });
}

// Send message
async function sendMessage() {
    const content = messageInput.value.trim();

    if (!content) return;

    const message = {
        conversationId: currentConversation.id,
        senderId: currentUser.id,
        recipientId: currentConversation.recipientId,
        content: content,
        type: 'text'
    };

    try {
        const response = await fetch('http://localhost:8083/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        const result = await response.json();

        if (result.success) {
            appendMessage(result.message, true);
            messageInput.value = '';
            scrollToBottom();
        }
    } catch (error) {
        console.error('❌ Error sending message:', error);
        alert('Không thể gửi tin nhắn. Vui lòng thử lại!');
    }
}

// Load messages
async function loadMessages() {
    try {
        const response = await fetch(
            `http://localhost:8083/api/messages/conversation/${currentConversation.id}`
        );
        const result = await response.json();

        if (result.success) {
            messagesContainer.innerHTML = '';
            result.data.reverse().forEach(msg => appendMessage(msg));
            scrollToBottom();
        }
    } catch (error) {
        console.error('❌ Error loading messages:', error);
    }
}

// Append message to UI
function appendMessage(message, isSent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent || message.senderId === currentUser.id ? 'sent' : 'received'}`;

    const time = new Date(message.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (!isSent && message.senderId !== currentUser.id) {
        messageDiv.innerHTML = `
      <img src="https://via.placeholder.com/32" alt="Avatar" class="message-avatar">
      <div class="message-bubble">
        <p>${escapeHtml(message.content)}</p>
        <span class="message-time">${time}</span>
      </div>
    `;
    } else {
        messageDiv.innerHTML = `
      <div class="message-bubble">
        <p>${escapeHtml(message.content)}</p>
        <span class="message-time">${time}</span>
        <span class="message-status">✓✓</span>
      </div>
    `;
    }

    messagesContainer.appendChild(messageDiv);
}

// Typing indicator
function showTypingIndicator(userId, isTyping) {
    const existingIndicator = document.getElementById('typing-indicator');

    if (isTyping && userId !== currentUser.id) {
        if (!existingIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'message received';
            indicator.innerHTML = `
        <img src="https://via.placeholder.com/32" alt="Avatar" class="message-avatar">
        <div class="message-bubble">
          <p style="color: var(--text-secondary);">Đang nhập...</p>
        </div>
      `;
            messagesContainer.appendChild(indicator);
            scrollToBottom();
        }
    } else {
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }
}

// Utility functions
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for use in other modules
window.ZaloApp = {
    sendMessage,
    loadMessages,
    currentUser,
    currentConversation
};

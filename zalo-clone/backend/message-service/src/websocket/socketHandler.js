let io;

const initializeWebSocket = (socketIO) => {
    io = socketIO;

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Join conversation room
        socket.on('join-conversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.id} joined conversation ${conversationId}`);
        });

        // Leave conversation room
        socket.on('leave-conversation', (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${socket.id} left conversation ${conversationId}`);
        });

        // Typing indicator
        socket.on('typing', ({ conversationId, userId, isTyping }) => {
            socket.to(conversationId).emit('user-typing', { userId, isTyping });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};

// Send message to conversation room
const sendMessageToConversation = (conversationId, event, data) => {
    if (io) {
        io.to(conversationId).emit(event, data);
    }
};

module.exports = {
    initializeWebSocket,
    sendMessageToConversation
};

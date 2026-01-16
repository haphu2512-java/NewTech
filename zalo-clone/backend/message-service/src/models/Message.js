const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: Number,
        required: true,
        index: true
    },
    recipientId: {
        type: Number,
        default: null
    },
    groupId: {
        type: Number,
        default: null
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'file', 'emoji'],
        default: 'text'
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaMetadata: {
        filename: String,
        size: Number,
        mimeType: String
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readAt: {
        type: Date,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, status: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

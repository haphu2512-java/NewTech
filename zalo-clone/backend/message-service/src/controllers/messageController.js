const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const { publishEvent } = require('../kafka/kafkaProducer');

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { conversationId, senderId, recipientId, groupId, content, type, mediaUrl } = req.body;

        const message = new Message({
            conversationId,
            senderId,
            recipientId,
            groupId,
            content,
            type,
            mediaUrl,
            status: 'sent',
            timestamp: new Date()
        });

        await message.save();

        // Publish to Kafka
        await publishEvent('message.sent', {
            messageId: message._id,
            conversationId,
            senderId,
            recipientId,
            content,
            type,
            timestamp: message.timestamp
        });

        // TODO: Send via WebSocket to recipient

        res.status(201).json({
            success: true,
            message: message
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get conversation messages
exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ conversationId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Message.countDocuments({ conversationId });

        res.json({
            success: true,
            data: messages,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByIdAndUpdate(
            messageId,
            { status: 'read', readAt: new Date() },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        // Publish event
        await publishEvent('message.read', {
            messageId: message._id,
            conversationId: message.conversationId,
            readAt: message.readAt
        });

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findByIdAndDelete(messageId);

        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Search messages
exports.searchMessages = async (req, res) => {
    try {
        const { q, conversationId } = req.query;

        const query = {
            content: { $regex: q, $options: 'i' }
        };

        if (conversationId) {
            query.conversationId = conversationId;
        }

        const messages = await Message.find(query)
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('Error searching messages:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

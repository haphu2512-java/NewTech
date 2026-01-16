const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const messageController = require('../controllers/messageController');

// Send message
router.post('/send',
    [
        body('conversationId').notEmpty(),
        body('senderId').isInt(),
        body('content').notEmpty(),
        body('type').isIn(['text', 'image', 'video', 'file', 'emoji'])
    ],
    messageController.sendMessage
);

// Get conversation messages
router.get('/conversation/:conversationId',
    param('conversationId').notEmpty(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    messageController.getConversationMessages
);

// Mark message as read
router.put('/:messageId/read',
    param('messageId').isMongoId(),
    messageController.markAsRead
);

// Delete message
router.delete('/:messageId',
    param('messageId').isMongoId(),
    messageController.deleteMessage
);

// Search messages
router.get('/search',
    query('q').notEmpty(),
    query('conversationId').optional(),
    messageController.searchMessages
);

module.exports = router;

const { producer } = require('./kafkaClient');

const publishEvent = async (topic, event) => {
    try {
        const message = {
            event_type: topic,
            event_id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            version: '1.0',
            payload: event
        };

        await producer.send({
            topic: 'message.events',
            messages: [
                {
                    key: event.conversationId || event.messageId,
                    value: JSON.stringify(message)
                }
            ]
        });

        console.log(`📤 Event published to ${topic}:`, event);
    } catch (error) {
        console.error('❌ Error publishing event:', error);
        throw error;
    }
};

module.exports = { publishEvent };

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'message-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'message-service-group' });

let isProducerConnected = false;
let isConsumerConnected = false;

// Connect Kafka producer and consumer
const connectKafka = async () => {
    try {
        await producer.connect();
        isProducerConnected = true;
        console.log('✅ Kafka Producer connected');

        await consumer.connect();
        isConsumerConnected = true;
        console.log('✅ Kafka Consumer connected');

        // Subscribe to topics
        await consumer.subscribe({ topics: ['user.events', 'notification.events'], fromBeginning: false });

        // Handle messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value.toString());
                console.log(`📬 Received event from ${topic}:`, event);
                // Handle event based on type
            }
        });
    } catch (error) {
        console.error('❌ Kafka connection error:', error);
    }
};

// Graceful shutdown
const disconnectKafka = async () => {
    if (isProducerConnected) await producer.disconnect();
    if (isConsumerConnected) await consumer.disconnect();
};

module.exports = {
    kafka,
    producer,
    consumer,
    connectKafka,
    disconnectKafka
};

const { kafka } = require('../kafkaClient');
const { Partitioners } = require('kafkajs');

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
let isConnected = false;

async function connectProducer() {
  if (!isConnected) {
    try {
      await producer.connect();
      isConnected = true;
      console.log('✅ Kafka Producer connected');
    } catch (err) {
      console.error('❌ Failed to connect Kafka Producer:', err.message);
      throw err;
    }
  }
}

async function publishMessage(message) {
  try {
    await connectProducer();
    await producer.send({
      topic: 'whatsapp-messages',
      messages: [
        {
          key: message.messageId.toString(),
          value: JSON.stringify(message),
        },
      ],
    });
    console.log(`📤 Published message ${message.messageId} to Kafka`);
  } catch (err) {
    console.error('❌ Error publishing message:', err.message);
    throw err; // Rethrow for upstream handling
  }
}

module.exports = { publishMessage };
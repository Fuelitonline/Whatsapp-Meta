const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'whatsapp-dashboard',
  brokers: ['kafka:9092'],  // Ensure this matches your Kafka broker's address
});

const producer = kafka.producer();
let isProducerConnected = false;

// Function to connect producer (only once)
async function connectProducer() {
  if (!isProducerConnected) {
    await producer.connect();
    isProducerConnected = true;
    console.log('✅ Kafka producer connected');
  }
}

async function initKafka(app) {
  try {
    // Connect producer
    await connectProducer();
    // Start consumer (your logic here)
    await startConsumer(app);
    console.log('🚀 Kafka initialized successfully');
  } catch (err) {
    console.error('❌ Kafka initialization failed:', err);
    process.exit(1);
  }
}

function getProducer() {
  if (!isProducerConnected) {
    throw new Error('Producer not connected. Call initKafka first.');
  }
  return producer;
}

module.exports = { initKafka, getProducer };

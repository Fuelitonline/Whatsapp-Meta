const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'whatsapp-dashboard',
  brokers: ['localhost:9092'], // For local execution
  logLevel: 'debug', // Set log level as a string
  retry: {
    initialRetryTime: 300, // Increased to 300ms
    retries: 2 // Reduced retries
  }
});

module.exports = { kafka };

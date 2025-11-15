const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'whatsapp-dashboard',
  brokers: ['localhost:9092'], // For local execution
  logLevel: Kafka.logLevel.DEBUG, // Use Kafka.logLevel.DEBUG
  retry: {
    initialRetryTime: 300,
    retries: 5
  }
});

module.exports = { kafka };
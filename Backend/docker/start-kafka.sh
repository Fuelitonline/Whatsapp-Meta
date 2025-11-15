echo "🚀 Starting Zookeeper, Kafka, and Kafka UI..."
docker-compose -f docker/docker-compose.yml up -d

echo "⏳ Waiting for Kafka to be ready..."
sleep 10

echo "✅ Creating default topic: whatsapp-messages"
docker exec -it kafka kafka-topics --create \
  --topic whatsapp-messages \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 \
  --partitions 3 || echo "⚠️ Topic may already exist"

echo "🎉 Kafka setup complete. UI available at http://localhost:6000"

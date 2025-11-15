const { kafka } = require('../kafkaClient');
const Message = require('../../model/Message/messageModel');
const UserInteraction = require('../../model/UserInteraction');
const axios = require('axios');

const WHATSAPP_LIMITS = {
  image: { maxSize: 16 * 1024 * 1024, formats: ['jpg', 'png'] },
  video: { maxSize: 16 * 1024 * 1024, formats: ['mp4', '3gp'] },
  document: { maxSize: 100 * 1024 * 1024, formats: ['pdf', 'doc', 'docx'] },
  audio: { maxSize: 16 * 1024 * 1024, formats: ['mp3', 'ogg'] },
};

function validatePayload(type, content) {
  if (type === 'text' && !content?.text?.body) throw new Error('Text body required');
  if (type === 'template' && (!content?.name || !content?.language)) throw new Error('Template name and language required');
  if (type === 'location' && (!content?.latitude || !content?.longitude)) throw new Error('Location coordinates required');
  if (type in WHATSAPP_LIMITS && content?.url) {
    const format = content.url.split('.').pop()?.toLowerCase();
    if (!format || !WHATSAPP_LIMITS[type].formats.includes(format)) {
      throw new Error(`Invalid ${type} format; supported: ${WHATSAPP_LIMITS[type].formats.join(', ')}`);
    }
  }
  return true;
}

async function canSendNonTemplate(userId, recipient) {
  const lastInteraction = await UserInteraction.findOne({ userId, recipient }).sort({ timestamp: -1 }).lean();
  return lastInteraction && (Date.now() - lastInteraction.timestamp) <= 24 * 60 * 60 * 1000;
}

async function sendMessageWithRetry(payload, user, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const waRes = await axios.post(
        `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waPhoneNumberId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.waAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return waRes;
    } catch (err) {
      attempt++;
      console.error(`❌ Error (attempt ${attempt}) sending WhatsApp message:`, err.message);
      if (attempt >= retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function startConsumer(app) {
  const { default: pLimit } = await import('p-limit');

  try {
    const consumer = kafka.consumer({
      groupId: 'message-group',
      sessionTimeout: 60000, // Increased to 60s
      rebalanceTimeout: 180000, // Increased to 180s
      heartbeatInterval: 3000,
      maxPollInterval: 600000, // Increased to 10 min
    });
    await consumer.connect();
    await consumer.subscribe({ topic: 'whatsapp-messages', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const startTime = Date.now();
        const data = JSON.parse(message.value.toString());
        console.log('📥 Consumed message:', data);

        try {
          const { messageId, recipients, type, content, user } = data;

          if (!user.waPhoneNumberId || !user.waAccessToken) {
            throw new Error('Missing WhatsApp credentials');
          }

          const limit = pLimit(5);
          const updatePromises = recipients.map(recipient => limit(async () => {
            try {
              if (recipient.endsWith('@g.us')) {
                // Group message
              } else {
                recipient = recipient.replace(/[\s\-\(\)]/g, '');
                if (!recipient.startsWith('+')) recipient = `+${recipient}`;
              }

              if (type === 'template' && content.category === 'MARKETING' && recipient.startsWith('+1')) {
                throw new Error('Marketing templates paused for US numbers (as of April 1, 2025)');
              }

              if (type !== 'template' && !(await canSendNonTemplate(user._id, recipient))) {
                throw new Error('No active customer service window; use template message');
              }

              validatePayload(type, content);

              const payload = {
                messaging_product: 'whatsapp',
                to: recipient,
                type,
              };

              if (type === 'text') payload.text = { body: content.text };
              else if (type === 'image') payload.image = { link: content.url };
              else if (type === 'video') payload.video = { link: content.url };
              else if (type === 'document') payload.document = { link: content.url };
              else if (type === 'audio') payload.audio = { link: content.url };
              else if (type === 'location') payload.location = content;
              else if (type === 'template') payload.template = content;

              const waRes = await sendMessageWithRetry(payload, user);

              const status = waRes.data.messages[0].message_status || 'SENT';
              await Message.findByIdAndUpdate(messageId, {
                waMessageId: waRes.data.messages[0].id,
                status: status === 'pending' ? 'SCHEDULED' : 'SENT',
              });

              const io = app.get('io');
              io.emit('messageStatus', { messageId, status, recipient });

              console.log(`✅ Message sent to ${recipient}, ID: ${waRes.data.messages[0].id}`);
            } catch (err) {
              console.error(`❌ Error sending to ${recipient}:`, err.message);
              await Message.findByIdAndUpdate(messageId, {
                status: 'FAILED',
                error: err.response?.data?.error?.message || err.message,
              });
              const io = app.get('io');
              io.emit('messageStatus', { messageId, status: 'FAILED', recipient });
            }
          }));

          await Promise.all(updatePromises);
          console.log(`📊 Processed message ${data.messageId} in ${Date.now() - startTime}ms`);
        } catch (err) {
          console.error('❌ Error processing message:', err.message);
        }
      },
    });

    console.log('🟢 Kafka Message Consumer running...');
  } catch (err) {
    console.error('❌ Kafka Consumer init failed:', err.message);
    throw err;
  }
}

module.exports = { startConsumer };
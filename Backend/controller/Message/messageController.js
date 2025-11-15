const Message = require('../../model/Message/messageModel');
const User = require('../../model/Auth/userModel');
const { publishMessage } = require('../../kafka/producers/message.producer');

const sendMessage = async (req, res) => {
  let { recipients, type, content, sendNow = true, scheduleDate, scheduleTime } = req.body;
  const userId = req.userId;
  const mediaFile = req.file; // From multer

  try {
    const user = await User.findById(userId);
    if (!user || !user.waPhoneNumberId || !user.waAccessToken) {
      return res.status(400).json({ success: false, error: 'WhatsApp Business account not linked' });
    }

    // Normalize recipients to array
    recipients = Array.isArray(recipients) ? recipients : [recipients];

    // Handle media file
    if (mediaFile && ['image', 'video', 'document', 'audio'].includes(type)) {
      content = { url: mediaFile.path }; // Cloudinary URL
    } else if (type === 'text' || type === 'template' || type === 'location') {
      content = typeof content === 'string' ? JSON.parse(content) : content;
    } else {
      return res.status(400).json({ success: false, error: 'Invalid message type or missing content' });
    }

    // Validate required fields
    if (!recipients.length || !type || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const scheduled = !sendNow;
    const scheduledTime = scheduled ? new Date(`${scheduleDate}T${scheduleTime}`) : null;

    const msgDoc = await Message.create({
      userId,
      recipients,
      type,
      content,
      scheduledTime,
      status: scheduled ? 'SCHEDULED' : 'QUEUED',
    });

    if (scheduled) {
      return res.status(200).json({ success: true, message: 'Message scheduled successfully', msg: msgDoc });
    }

    await publishMessage({
      messageId: msgDoc._id,
      recipients,
      type,
      content,
      user: {
        _id: user._id,
        waPhoneNumberId: user.waPhoneNumberId,
        waAccessToken: user.waAccessToken,
      },
    });

    res.status(200).json({ success: true, message: 'Message queued for sending', msg: msgDoc });
  } catch (error) {
    console.error('❌ Send message error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const messages = await Message.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ userId: req.userId });

    res.status(200).json({
      success: true,
      messages,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('❌ Get messages error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findOne({ _id: req.params.id, userId: req.userId });
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error('❌ Get message by ID error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch message' });
  }
};

// Add getGroups endpoint for group messaging
const getGroups = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const response = await axios.get(
      `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waPhoneNumberId}/groups`,
      { headers: { Authorization: `Bearer ${user.waAccessToken}` } }
    );
    res.status(200).json({ success: true, groups: response.data.groups });
  } catch (err) {
    console.error('❌ Get groups error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch groups' });
  }
};

module.exports = { sendMessage, getMessages, getMessageById, getGroups };
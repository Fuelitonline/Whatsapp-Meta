const axios = require('axios');
const User = require('../../model/Auth/userModel');
const Template = require('../../model/Template/templateModel');
const UserInteraction = require('../../model/UserInteraction');

exports.verifyWebhook = async (req, res) => {
    try {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        const userId = req.userId; // From authMiddleware
        const user = await User.findById(userId);
        if (!user || !user.verifyToken) {
            console.error('No verify token set for user:', userId);
            return res.sendStatus(403);
        }
        if (mode === 'subscribe' && token === user.verifyToken) {
            console.log('✅ Webhook verified for user:', userId);
            await User.findByIdAndUpdate(userId, { webhookStatus: 'Verified', lastVerified: new Date() });
            return res.status(200).send(challenge);
        }
        res.sendStatus(403);
    } catch (err) {
        console.error('Webhook verification error:', err.message);
        res.sendStatus(500);
    }
};

exports.handleWebhook = async (req, res) => {
    try {
        const io = req.app.get('io');
        const body = req.body;
        if (!body.object) {
            return res.sendStatus(404);
        }
        for (const entry of body.entry) {
            for (const change of entry.changes) {
                if (change.field === 'messages' && change.value.messages) {
                    console.log('📩 Incoming WhatsApp message:', change.value.messages);
                    const message = change.value.messages[0];
                    const phoneNumberId = change.value.metadata.phone_number_id;
                    const user = await User.findOne({ waPhoneNumberId: phoneNumberId });
                    if (!user) {
                        console.error(`No user found for phone_number_id: ${phoneNumberId}`);
                        continue;
                    }
                    const recipient = message.from;
                    await UserInteraction.create({
                        userId: user._id,
                        recipient,
                        timestamp: new Date(),
                    });
                    io.emit(`webhook_event_${user._id}`, {
                        timestamp: new Date().toISOString(),
                        type: 'messages',
                        status: 'processed',
                    });
                }
                if (change.field === 'statuses' && change.value.statuses) {
                    console.log('📡 Message status update:', change.value.statuses);
                    const user = await User.findOne({ waPhoneNumberId: change.value.metadata.phone_number_id });
                    if (user) {
                        io.emit(`webhook_event_${user._id}`, {
                            timestamp: new Date().toISOString(),
                            type: 'statuses',
                            status: change.value.statuses[0].status,
                        });
                    }
                }
                if (change.field === 'message_template_status_update' && change.value) {
                    console.log('📋 Template status update:', change.value);
                    const { id, status, rejected_reason } = change.value;
                    const template = await Template.findOneAndUpdate(
                        { waTemplateId: id },
                        { status, rejectionReason: rejected_reason || '' },
                        { new: true }
                    );
                    if (template) {
                        const user = await User.findById(template.userId);
                        if (user) {
                            io.emit(`webhook_event_${user._id}`, {
                                timestamp: new Date().toISOString(),
                                type: 'message_template_status_update',
                                status: status.toLowerCase(),
                                details: rejected_reason || '',
                            });
                        }
                    }
                }
            }
        }
        res.sendStatus(200);
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
};

exports.saveWebhookSettings = async (req, res) => {
    try {
        const { webhookUrl, verifyToken, subscribedEvents } = req.body;
        const userId = req.userId;
        if (!webhookUrl || !verifyToken || !subscribedEvents?.length) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const url = new URL(webhookUrl);
        if (url.protocol !== 'https:') {
            return res.status(400).json({ success: false, error: 'Webhook URL must use HTTPS' });
        }
        const validEvents = ['messages', 'message_template_status_update', 'statuses'];
        if (!subscribedEvents.every(event => validEvents.includes(event))) {
            return res.status(400).json({ success: false, error: 'Invalid subscribed events' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await axios.post(
            `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${user.waBusinessAccountId}/subscribed_apps`,
            { subscribed_fields: subscribedEvents },
            { headers: { Authorization: `Bearer ${user.waAccessToken}` } }
        );
        await User.findByIdAndUpdate(userId, {
            webhookUrl,
            verifyToken,
            subscribedEvents,
            webhookStatus: 'Pending Verification',
            lastVerified: null,
        });
        res.status(200).json({ success: true, message: 'Webhook settings saved' });
    } catch (error) {
        console.error('Save webhook settings error:', error.message);
        res.status(500).json({ success: false, error: error.response?.data?.error?.message || 'Failed to save webhook settings' });
    }
};

exports.getWebhookSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('webhookUrl verifyToken subscribedEvents webhookStatus lastVerified');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                webhookUrl: user.webhookUrl || '',
                verifyToken: user.verifyToken || '',
                subscribedEvents: user.subscribedEvents || ['messages', 'message_template_status_update', 'statuses'],
                status: user.webhookStatus || 'Pending Verification',
                lastVerified: user.lastVerified,
            },
        });
    } catch (error) {
        console.error('Get webhook settings error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch webhook settings' });
    }
};

exports.testWebhook = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.webhookUrl) {
            return res.status(400).json({ success: false, error: 'Webhook URL not configured' });
        }
        const testPayload = {
            object: 'whatsapp_business_account',
            entry: [{
                changes: [{
                    field: 'messages',
                    value: {
                        messages: [{ id: 'test_message', from: '1234567890', type: 'text', text: { body: 'Test webhook' } }],
                        metadata: { phone_number_id: user.waPhoneNumberId },
                    },
                }],
            }],
        };
        await axios.post(user.webhookUrl, testPayload, {
            headers: { 'Content-Type': 'application/json' },
        });
        const io = req.app.get('io');
        io.emit(`webhook_event_${userId}`, {
            timestamp: new Date().toISOString(),
            type: 'test',
            status: 'sent',
        });
        res.status(200).json({ success: true, message: 'Test webhook sent' });
    } catch (error) {
        console.error('Test webhook error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to send test webhook' });
    }
};
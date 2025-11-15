const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhook, saveWebhookSettings, getWebhookSettings, testWebhook } = require('../controller/Webhook/webhookController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', verifyWebhook);
router.post('/', handleWebhook);
router.post('/settings', authMiddleware, saveWebhookSettings);
router.get('/settings', authMiddleware, getWebhookSettings);
router.post('/test', authMiddleware, testWebhook);

module.exports = router;
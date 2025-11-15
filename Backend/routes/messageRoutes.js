// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Import multer middleware
const {
    sendMessage,
    getMessages,
    getMessageById,
    // deleteMessage,
} = require('../controller/Message/messageController');

// Send a message (with optional file upload)
router.post('/', authMiddleware, upload.single('mediaFile'), sendMessage);
// Get all messages
router.get('/', authMiddleware, getMessages);
// Get a single message by ID
router.get('/:id', authMiddleware, getMessageById);
// Delete a message
// router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
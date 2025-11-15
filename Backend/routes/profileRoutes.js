const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, logoutDevice } = require('../controller/Profile/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Routes
router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'businessLogo', maxCount: 1 }
]), updateProfile);
router.post('/logout-device', authMiddleware, logoutDevice);

module.exports = router;
const express = require('express');
const { embeddedLogin } = require('../controller/Auth/userController');

const router = express.Router();

router.post('/embedded-login', embeddedLogin);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const commandCtrl = require('../controllers/command.controller');

router.post('/send', authMiddleware, commandCtrl.sendCommand);

module.exports = router;

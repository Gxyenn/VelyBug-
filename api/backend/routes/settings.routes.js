const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const settings = require('../controllers/settings.controller');

router.get('/', authMiddleware, requireRole(['creator','developer']), settings.getSettings);
router.put('/', authMiddleware, requireRole(['creator','developer']), settings.updateSettings);

module.exports = router;

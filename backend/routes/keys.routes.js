const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const keysCtrl = require('../controllers/keys.controller');

router.get('/', authMiddleware, requireRole(['admin','creator','developer']), keysCtrl.getKeys);
router.post('/', authMiddleware, requireRole(['admin','creator','developer']), keysCtrl.createKey);
router.delete('/:id', authMiddleware, requireRole(['admin','creator','developer']), keysCtrl.deleteKey);
router.put('/change-my-key', authMiddleware, keysCtrl.changeMyKey);

module.exports = router;

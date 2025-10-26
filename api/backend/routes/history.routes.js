const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const historyCtrl = require('../controllers/history.controller');

router.get('/', authMiddleware, requireRole(['admin','creator','developer']), historyCtrl.getAll);
router.delete('/', authMiddleware, requireRole(['developer']), historyCtrl.deleteAll);

module.exports = router;

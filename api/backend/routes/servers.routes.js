const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const servers = require('../controllers/servers.controller');

router.get('/', authMiddleware, requireRole(['creator','developer']), servers.list);
router.post('/', authMiddleware, requireRole(['creator','developer']), servers.create);
router.get('/:id', authMiddleware, requireRole(['creator','developer']), servers.getOne);
router.put('/:id', authMiddleware, requireRole(['creator','developer']), servers.update);
router.delete('/:id', authMiddleware, requireRole(['creator','developer']), servers.remove);

module.exports = router;

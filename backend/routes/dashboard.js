const express = require('express');
const { getAdminStats, getAgentStats } = require('../controllers/dashboard');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', verifyToken, authorizeRoles("ADMIN"), getAdminStats);
router.get('/agent-stats', verifyToken, authorizeRoles("AGENT", "ADMIN"), getAgentStats);

module.exports = router;

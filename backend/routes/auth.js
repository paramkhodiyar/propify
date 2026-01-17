const express = require('express');
const { register, login, logout, me } = require('../controllers/auth');

const router = express.Router();

const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, me);

module.exports = router;

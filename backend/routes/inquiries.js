const express = require('express');
const { addInquiry, getInquiries } = require('../controllers/inquiry');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, addInquiry);
router.get('/', verifyToken, getInquiries);

module.exports = router;

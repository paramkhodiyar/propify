const express = require('express');
const { sendContactMessage } = require('../controllers/contact');
// No authentication required for contact form usually
const router = express.Router();

router.post('/', sendContactMessage);

module.exports = router;

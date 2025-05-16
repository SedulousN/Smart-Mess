// routes/guest.js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.post('/generate-qr', guestController.generateGuestQRCode);

module.exports = router;
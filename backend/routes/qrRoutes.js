const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Route to generate QR Code
router.post('/generate', qrController.generateQRCode);

// Route to validate QR Code
router.post('/validate', qrController.validateQRCode);

router.get('/history', qrController.getMealHistory);

// Serve QR codes statically
// router.use('/qrcodes', express.static('qrcodes'));
router.use('/qrcodes', express.static('qrcodes'));


module.exports = router;

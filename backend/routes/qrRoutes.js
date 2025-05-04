const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const MealSummary = require("../models/MealSummary")

// Route to generate QR Code
router.post('/generate', qrController.generateQRCode);

// Route to validate QR Code
router.post('/validate', qrController.validateQRCode);

router.get('/history', qrController.getMealHistory);


// Get all meal summaries for today
router.get('/meal-summary', async (req, res) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const summaries = await MealSummary.find({ date });
      res.json(summaries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch meal summary' });
    }
  });

// Serve QR codes statically
// router.use('/qrcodes', express.static('qrcodes'));
router.use('/qrcodes', express.static('qrcodes'));


module.exports = router;

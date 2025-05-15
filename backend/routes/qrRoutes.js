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
// Get all meal summaries (past and present)
router.get('/meal-summary', async (req, res) => {
  try {
    const summaries = await MealSummary.find({}).sort({ date: -1 }); // No date filter, fetches all
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meal summary' });
  }
});


// Serve QR codes statically
// router.use('/qrcodes', express.static('qrcodes'));
router.use('/qrcodes', express.static('qrcodes'));


module.exports = router;

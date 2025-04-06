    const QRCode = require('qrcode');
    const multer = require('multer');
    const path = require('path');
    const Student = require('../models/student');

    // Multer Storage Configuration
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'qrcodes'); // Ensure this path matches the static path in index.js
        },
        filename: (req, file, cb) => {
            const { studentID } = req.body;
            cb(null, `${studentID}.png`);
        }
    });

    const upload = multer({ storage });

    // Generate QR Code
    exports.generateQRCode = async (req, res) => {
        try {
            const { studentID, name } = req.body;

            // Check if student already exists
            let student = await Student.findOne({ studentID });
            if (student) {
                return res.status(400).json({ success: false, message: "Student already exists!" });
            }

            // Generate QR Code data
            const qrData = `${studentID}-${name}`;
            const qrCodeFilePath = path.resolve(__dirname, '../../qrcodes', `${studentID}.png`);

            // Generate and save QR Code image
            await QRCode.toFile(qrCodeFilePath, qrData);

            // Save student data with QR code path
            student = new Student({
                studentID,
                name,
                qrCode: `/qrcodes/${studentID}.png`,
                hasEaten: false
            });

            await student.save();

            res.status(201).json({
                success: true,
                qrCodePath: `/qrcodes/${studentID}.png`,
                message: "QR Code generated and saved successfully!"
            });

        } catch (error) {
            console.error('QR Code Generation Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

    // Validate QR Code
// Validate QR Code
// Validate QR Code
exports.validateQRCode = async (req, res) => {
    try {
        const { studentID } = req.body;

        // Find student by ID
        const student = await Student.findOne({ studentID });

        if (!student) {
            return res.status(404).json({ success: false, message: "Invalid QR Code!" });
        }

        // Get the current time to determine the meal period
        const currentHour = new Date().getHours();
        let currentMeal = '';

        if (currentHour >= 8 && currentHour < 12) {
            currentMeal = "Breakfast";
        } else if (currentHour >= 12 && currentHour < 15) {
            currentMeal = "Lunch";
        } else if (currentHour >= 15 && currentHour < 20) {
            currentMeal = "Snacks";
        } else {
            currentMeal = "Dinner";
        }

        // Check if the student has already eaten in the current period
        if (student.hasEaten && student.lastMeal === currentMeal) {
            return res.status(400).json({ success: false, message: "Meal already claimed for this period!" });
        }

        // If the student has eaten before in a previous period, reset hasEaten for the new meal
        if (student.lastMeal !== currentMeal) {
            student.hasEaten = false;  // Reset for new meal period
        }

        // Mark student as having eaten and set the last meal period
        student.hasEaten = true;
        student.lastMeal = currentMeal;

        // Save the student document with updated status
        await student.save();

        res.json({ success: true, message: `QR Code validated. Enjoy your ${currentMeal}!` });
    } catch (error) {
        console.error('QR Code Validation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};



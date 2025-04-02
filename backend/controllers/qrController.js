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
    exports.validateQRCode = async (req, res) => {
        try {
            const { studentID } = req.body;

            // Find student by ID
            const student = await Student.findOne({ studentID });

            if (!student) {
                return res.status(404).json({ success: false, message: "Invalid QR Code!" });
            }

            // Check if student has already eaten
            if (student.hasEaten) {
                return res.status(400).json({ success: false, message: "Meal already claimed!" });
            }

            // Mark student as having eaten
            student.hasEaten = true;
            await student.save();

            res.json({ success: true, message: "QR Code validated. Enjoy your meal!" });
        } catch (error) {
            console.error('QR Code Validation Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    };

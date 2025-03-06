const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const Student = require('../../../Smart_Mess/backend/models/student');

// Generate QR Code
exports.generateQRCode = async (req, res) => {
    try {
        const { studentID, name } = req.body;

        // Check if the student already exists
        let student = await Student.findOne({ studentID });

        if (student) {
            return res.status(400).json({ success: false, message: "Student already exists!" });
        }

        // Generate QR Code data
        const qrData = `${studentID}-${name}`;
        const qrCodeFilePath = path.join(__dirname, `../../../Smart_Mess/backend/qrcodes/${studentID}.png`);

        // Ensure the directory exists
        const dir = path.dirname(qrCodeFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Save QR code as an image
        await QRCode.toFile(qrCodeFilePath, qrData);

        // Save student details with QR code image path
        student = new Student({
            studentID,
            name,
            qrCode: `/qrcodes/${studentID}.png`, // Store the relative path
            hasEaten: false
        });

        await student.save();

        res.status(201).json({ 
            success: true, 
            qrCodePath: `/qrcodes/${studentID}.png`, 
            message: "QR Code generated and saved successfully!" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Validate QR Code
exports.validateQRCode = async (req, res) => {
    try {
        const { studentID } = req.body;
        // console.log(studentID);
        // console.log(req.body);

        // Find student by ID
        const student = await Student.findOne({ studentID });

        if (!student) {
            return res.status(404).json({ success: false, message: "Invalid QR Code!" });
        }

        // Check if the student has already eaten
        if (student.hasEaten) {
            return res.status(400).json({ success: false, message: "Meal already claimed!" });
        }

        // Mark student as having eaten
        student.hasEaten = true;
        await student.save();

        res.json({ success: true, message: "QR Code validated. Enjoy your meal!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

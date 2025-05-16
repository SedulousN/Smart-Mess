const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

exports.generateGuestQRCode = async (req, res) => {
    try {
        const { meals } = req.body;

        if (!meals || meals.length === 0) {
            return res.status(400).json({ success: false, message: "No meals selected" });
        }

        const guestID = `guest-${Date.now()}`;
        const qrData = JSON.stringify({
            guestID,
            meals,
            timestamp: new Date()
        });

        const qrCodeFilePath = path.resolve(__dirname, '../qrcodes', `${guestID}.png`);

        // Generate QR code image
        await QRCode.toFile(qrCodeFilePath, qrData);

        res.status(201).json({
            success: true,
            qrCodePath: `/qrcodes/${guestID}.png`,
            message: "Guest QR Code generated successfully"
        });

    } catch (error) {
        console.error('Guest QR Code Generation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

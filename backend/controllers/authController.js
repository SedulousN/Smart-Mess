const Student = require("../models/student.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

// REGISTER
// REGISTER
const register = async (req, res) => {
    const { username, email, password, studentID } = req.body;

    try {
        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate QR Code data
        const qrData = `${studentID}-${username}`;
        const qrCodeFilePath = path.join(__dirname, `../qrcodes/${studentID}.png`);

        // Ensure the directory exists
        const dir = path.dirname(qrCodeFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Generate QR Code
        await QRCode.toFile(qrCodeFilePath, qrData);

        const newUser = new Student({
            studentID,
            username,
            email,
            password: hashedPassword,
            qrCode: `/qrcodes/${studentID}.png`
        });

        await newUser.save();
        res.status(201).json({
            message: 'Registration successful',
            qrCodePath: `/qrcodes/${studentID}.png`
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// LOGIN
// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Student.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                studentID: user.studentID, 
                role: user.role 
            },
            "your_secret_key",
            { expiresIn: '1h' }
        );

        res.json({
            token,
            role: user.role,
            qrCodePath: user.qrCode, // Include the QR code path
            message: `Logged in as ${user.role}`,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { login, register };

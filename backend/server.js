// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/authRoute.js');
const qrRoutes = require('./routes/qrRoutes');
const Student = require('./models/student.js');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve QR codes as static files
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/messDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/qr', qrRoutes);
app.use("/api/auth", authRouter);

// ✅ Correct QR Code Endpoint
app.get('/api/users/:userId/qrcode', async (req, res) => {
    const { userId } = req.params; // Correct parameter name
    try {
        const student = await Student.findById(userId);
        if (!student || !student.qrCode) {
            return res.status(404).json({ message: "QR Code not found" });
        }

        res.json({ qrCodePath: student.qrCode });
    } catch (error) {
        console.error("Error fetching QR code:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Correct Profile Endpoint
app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            studentID: student.studentID,
            username: student.username,
            email: student.email,
            qrCodePath: student.qrCode
        });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Port Setup
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

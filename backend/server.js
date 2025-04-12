// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/authRoute.js');
const qrRoutes = require('./routes/qrRoutes');
const Student = require('./models/student.js');
const path = require('path');
const multer = require('multer');
const Feedback = require("./models/Feedback");


const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve QR codes as static files
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // save in uploads folder
    },
    filename: (req, file, cb) => {
      // Get the original file's extension (e.g., .pdf, .jpg)
      const ext = path.extname(file.originalname);
      cb(null, `MessMenu${ext}`); // Always use the same name with the original extension
    }
  });
  

const upload = multer({ storage });

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


// POST API to handle menu upload
app.post('/api/upload-mess-menu', upload.single('menu'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: `http://localhost:5500${filePath}`,
    });
});

// Feedback API
app.post("/api/feedback", async (req, res) => {
    try {
        const { studentID, rating, message, mealType, timestamp } = req.body;

        if (!studentID || !rating || !message || !mealType) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const feedback = new Feedback({ studentID, rating, message, mealType, timestamp });
        await feedback.save();

        res.status(200).json({ success: true, message: "Feedback submitted" });
    } catch (err) {
        console.error("Feedback POST error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ timestamp: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Server error" });
    }
});



// Port Setup
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
const MealHistory = require("./models/mealHistory");
const MealSummary = require("./models/MealSummary");
const cron = require('node-cron');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve QR codes as static files
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb+srv://smartmess:omeKiHTjkww42WPP@mess.elupfnx.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/qr', qrRoutes);
app.use("/api/auth", authRouter);
app.use('/api/admin', qrRoutes);

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

// Get feedback by studentID
app.get('/api/feedback/:studentID', async (req, res) => {
    try {
        const { studentID } = req.params;
        const feedbacks = await Feedback.find({ studentID }).sort({ timestamp: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error("Error fetching user's feedback:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Notice API
const Notice = require("./models/Notice");

app.post("/api/notices", async (req, res) => {
  try {
    const { title, message, timestamp } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Missing title or message" });
    }

    const notice = new Notice({ title, message, timestamp });
    await notice.save();

    res.status(201).json({ success: true, message: "Notice created" });
  } catch (err) {
    console.error("Notice POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all notices
app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ timestamp: -1 });
    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// app.post('/api/generate-meal-summary', async (req, res) => {
//     const { date, mealType } = req.body;
  
//     try {
//       // Count meals marked as "Taken"
//       const count = await MealHistory.countDocuments({
//         date,
//         meal: mealType,
//         status: 'Taken',
//       });
  
//       // Save or update the summary
//       await MealSummary.findOneAndUpdate(
//         { date, mealType },
//         { $set: { count } },
//         { upsert: true, new: true }
//       );
  
//       res.status(200).json({ message: 'Meal summary updated', date, mealType, count });
//     } catch (err) {
//       console.error("Error generating meal summary:", err);
//       res.status(500).json({ error: "Failed to generate meal summary" });
//     }
//   });
  

// Get meal summary for the last 7 days
// app.get("/api/meal-summary", async (req, res) => {
//     try {
//       const summaries = await MealSummary.find().sort({ date: -1 });
  
//       // Group by date into one row per date
//       const grouped = {};
//       summaries.forEach((item) => {
//         if (!grouped[item.date]) {
//           grouped[item.date] = {
//             date: item.date,
//             breakfast: 0,
//             lunch: 0,
//             snacks: 0,
//             dinner: 0,
//           };
//         }
//         grouped[item.date][item.mealType.toLowerCase()] = item.count;
//       });
  
//       const result = Object.values(grouped);
//       res.json(result);
//     } catch (err) {
//       console.error("Error fetching meal summary:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   });


// // Schedule task to run at 12:00 PM (for Breakfast)
// cron.schedule('0 12 * * *', () => {
//   axios.post('http://localhost:5500/api/generate-meal-summary', {
//     date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
//     mealType: 'Breakfast'
//   })
//   .then(response => {
//     console.log('Breakfast summary updated:', response.data);
//   })
//   .catch(error => {
//     console.error('Error updating breakfast summary:', error);
//   });
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata'
// });

// // Schedule task to run at 5:00 PM (for Lunch)
// cron.schedule('0 17 * * *', () => {
//   axios.post('http://localhost:5500/api/generate-meal-summary', {
//     date: new Date().toISOString().split('T')[0],
//     mealType: 'Lunch'
//   })
//   .then(response => {
//     console.log('Lunch summary updated:', response.data);
//   })
//   .catch(error => {
//     console.error('Error updating lunch summary:', error);
//   });
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata'
// });

// // Schedule task to run at 8:00 PM (for Snacks)
// cron.schedule('0 20 * * *', () => {
//   axios.post('http://localhost:5500/api/generate-meal-summary', {
//     date: new Date().toISOString().split('T')[0],
//     mealType: 'Snacks'
//   })
//   .then(response => {
//     console.log('Snacks summary updated:', response.data);
//   })
//   .catch(error => {
//     console.error('Error updating snacks summary:', error);
//   });
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata'
// });

// // Schedule task to run at 12:00 AM (for Dinner)
// cron.schedule('0 0 * * *', () => {
//   axios.post('http://localhost:5500/api/generate-meal-summary', {
//     date: new Date().toISOString().split('T')[0],
//     mealType: 'Dinner'
//   })
//   .then(response => {
//     console.log('Dinner summary updated:', response.data);
//   })
//   .catch(error => {
//     console.error('Error updating dinner summary:', error);
//   });
// }, {
//   scheduled: true,
//   timezone: 'Asia/Kolkata'
// });



// Port Setup
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

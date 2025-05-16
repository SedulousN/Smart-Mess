const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
const Student = require('../models/student');
const MealHistory = require('../models/mealHistory');
const MealSummary = require('../models/MealSummary');

// Helper to get IST date and hour
function getISTDateTime() {
    const istNow = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const dateInIST = new Date(istNow);
    const mealDate = dateInIST.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const currentHour = dateInIST.getHours();
    return { mealDate, currentHour };
}

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

        let student = await Student.findOne({ studentID });
        if (student) {
            return res.status(400).json({ success: false, message: "Student already exists!" });
        }

        const qrData = `${studentID}-${name}`;
        const qrCodeFilePath = path.resolve(__dirname, '../../qrcodes', `${studentID}.png`);
        await QRCode.toFile(qrCodeFilePath, qrData);

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
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ success: false, message: "Invalid QR Code!" });
        }

        const { mealDate, currentHour } = getISTDateTime();

        let currentMeal = '';
        if (currentHour >= 5 && currentHour < 12) {
            currentMeal = "Breakfast";
        } else if (currentHour >= 12 && currentHour < 16) {
            currentMeal = "Lunch";
        } else if (currentHour >= 16 && currentHour < 19) {
            currentMeal = "Snacks";
        } else {
            currentMeal = "Dinner";
        }

        if (student.hasEaten && student.lastMeal === currentMeal && student.lastMealDate === mealDate) {
            return res.status(400).json({ success: false, message: `Meal already claimed for ${currentMeal}!` });
        }

        if (student.lastMeal !== currentMeal || student.lastMealDate !== mealDate) {
            student.hasEaten = false;
        }

        student.hasEaten = true;
        student.lastMeal = currentMeal;
        student.lastMealDate = mealDate;
        await student.save();

        let mealHistory = await MealHistory.findOne({ studentID, date: mealDate, meal: currentMeal });
        if (!mealHistory) {
            mealHistory = new MealHistory({
                studentID,
                date: mealDate,
                meal: currentMeal,
                status: "Claimed"
            });
        } else {
            mealHistory.status = "Claimed";
        }
        await mealHistory.save();

        const existingSummary = await MealSummary.findOne({ date: mealDate, mealType: currentMeal });
        if (existingSummary) {
            existingSummary.count += 1;
            await existingSummary.save();
        } else {
            const newSummary = new MealSummary({
                date: mealDate,
                mealType: currentMeal,
                count: 1
            });
            await newSummary.save();
        }

        res.json({ success: true, message: `QR Code validated. Enjoy your ${currentMeal}!` });

    } catch (error) {
        console.error('QR Code Validation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark missed meals job
const markMissedMeals = async () => {
    try {
        const { mealDate: currentDate, currentHour } = getISTDateTime();

        let currentMeal = '';
        if (currentHour >= 5 && currentHour < 12) {
            currentMeal = "Breakfast";
        } else if (currentHour >= 12 && currentHour < 16) {
            currentMeal = "Lunch";
        } else if (currentHour >= 16 && currentHour < 19) {
            currentMeal = "Snacks";
        } else {
            currentMeal = "Dinner";
        }

        const students = await Student.find({
            $or: [
                { lastMealDate: { $ne: currentDate } },
                { lastMeal: { $ne: currentMeal } }
            ]
        });

        for (const student of students) {
            await MealHistory.create({
                studentID: student.studentID,
                date: currentDate,
                meal: currentMeal,
                status: "Missed"
            });
        }
    } catch (error) {
        console.error('Error marking missed meals:', error);
    }
};

// Schedule it every hour
setInterval(markMissedMeals, 60 * 60 * 1000);

// Fetch Meal History for a student
exports.getMealHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const studentID = student.studentID;
        const meals = await MealHistory.find({ studentID }).sort({ date: -1 });
        res.json(meals);
    } catch (error) {
        console.error('Error fetching meal history:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

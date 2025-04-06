    const QRCode = require('qrcode');
    const multer = require('multer');
    const path = require('path');
    const Student = require('../models/student');
    const MealHistory = require('../models/mealHistory');

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
        let status = "Missed";  // Default to Missed

        if (currentHour >= 8 && currentHour < 12) {
            currentMeal = "Breakfast";
        } else if (currentHour >= 12 && currentHour < 17) {
            currentMeal = "Lunch";
        } else if (currentHour >= 17 && currentHour < 20) {
            currentMeal = "Snacks";
        } else {
            currentMeal = "Dinner";
        }

        // Check if the student has already eaten in the current period
        if (student.hasEaten && student.lastMeal === currentMeal) {
            status = "Claimed";  // Meal already claimed
            return res.status(400).json({ success: false, message: `Meal already claimed for ${currentMeal}!` });
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

        // Add the meal history entry
        const mealDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
        await MealHistory.create({
            studentID,
            date: mealDate,
            meal: currentMeal,
            status: "Claimed"  // Successfully claimed the meal
        });

        res.json({ success: true, message: `QR Code validated. Enjoy your ${currentMeal}!` });
    } catch (error) {
        console.error('QR Code Validation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Job or task to automatically mark missed meals (can be scheduled to run every hour)
const markMissedMeals = async () => {
    try {
        const currentHour = new Date().getHours();
        let currentMeal = '';

        if (currentHour >= 8 && currentHour < 12) {
            currentMeal = "Breakfast";
        } else if (currentHour >= 12 && currentHour < 17) {
            currentMeal = "Lunch";
        } else if (currentHour >= 17 && currentHour < 20) {
            currentMeal = "Snacks";
        } else {
            currentMeal = "Dinner";
        }

        // Find students who haven't eaten yet for the current meal period
        const students = await Student.find({ hasEaten: false, lastMeal: currentMeal });

        // Mark missed meal history for students who haven't eaten
        for (const student of students) {
            const mealDate = new Date().toISOString().split('T')[0]; // Get current date
            await MealHistory.create({
                studentID: student.studentID,
                date: mealDate,
                meal: currentMeal,
                status: "Missed"  // Mark the meal as missed
            });
        }
    } catch (error) {
        console.error('Error marking missed meals:', error);
    }
};

// Example to schedule the missed meal marking (e.g., every hour)
setInterval(markMissedMeals, 60 * 60 * 1000); // Every hour


// Fetch Meal History for a student
exports.getMealHistory = async (req, res) => {
    try {
        const { userId } = req.query;  // Get the userId from query parameters (decoded from JWT)
        
        // First, fetch the studentID based on userId
        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        
        const studentID = student.studentID;  // Get the studentID from the Student model
        
        // Fetch meal history based on the studentID
        const meals = await MealHistory.find({ studentID }).sort({ date: -1 });  // Sort by date descending
        
        res.json(meals);  // Return the meal history
    } catch (error) {
        console.error('Error fetching meal history:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};




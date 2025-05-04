    const QRCode = require('qrcode');
    const multer = require('multer');
    const path = require('path');
    const Student = require('../models/student');
    const MealHistory = require('../models/mealHistory');
    const MealSummary = require('../models/MealSummary');

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
    
            const student = await Student.findOne({ studentID });
            if (!student) {
                return res.status(404).json({ success: false, message: "Invalid QR Code!" });
            }
    
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
    
            if (student.hasEaten && student.lastMeal === currentMeal) {
                return res.status(400).json({ success: false, message: `Meal already claimed for ${currentMeal}!` });
            }
    
            if (student.lastMeal !== currentMeal) {
                student.hasEaten = false;
            }
    
            student.hasEaten = true;
            student.lastMeal = currentMeal;
            await student.save();
    
            const mealDate = new Date().toISOString().split('T')[0];
    
            let mealHistory = await MealHistory.findOne({ studentID, date: mealDate });
    
            if (!mealHistory) {
                mealHistory = new MealHistory({
                    studentID,
                    date: mealDate,
                    meal: currentMeal,
                    status: "Taken"
                });
            } else {
                mealHistory.meal = currentMeal;
                mealHistory.status = "Taken";
            }
    
            await mealHistory.save();
    
            // Update or create MealSummary
            const summary = await MealSummary.findOne({ date: mealDate, meal: currentMeal });
            if (summary) {
                summary.count += 1;
                await summary.save();
            } else {
                await MealSummary.create({ date: mealDate, meal: currentMeal, count: 1 });
            }
    
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




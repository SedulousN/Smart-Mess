const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    qrCode: { type: String, required: true },
    hasEaten: { type: Boolean, default: false },
    lastMeal: { type: String, default: '' }  // New field to track last meal time
});

module.exports = mongoose.model('Student', studentSchema);

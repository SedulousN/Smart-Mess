const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    qrCode: { type: String, required: true }  // Added QR code field
    // hasEaten: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);

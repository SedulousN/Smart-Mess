const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    qrCode: { type: String, required: true },
    hasEaten: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);

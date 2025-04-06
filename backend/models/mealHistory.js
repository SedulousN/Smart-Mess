const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealHistorySchema = new Schema({
    studentID: { type: String, required: true },
    date: { type: String, required: true },
    meal: { type: String, required: true },
    status: { type: String, required: true, default: 'Missed' }  // Set default value to "Missed"
});

const MealHistory = mongoose.model('MealHistory', mealHistorySchema);

module.exports = MealHistory;

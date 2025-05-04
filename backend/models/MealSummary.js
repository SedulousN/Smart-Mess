// models/MealSummary.js
const mongoose = require('mongoose');

const mealSummarySchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  meal: {
    type: String, // e.g., Breakfast, Lunch, Snacks, Dinner
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

mealSummarySchema.index({ date: 1, meal: 1 }, { unique: true });

module.exports = mongoose.model('MealSummary', mealSummarySchema);

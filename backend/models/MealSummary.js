const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSummarySchema = new Schema({
  date: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
  count: { type: Number, required: true }
});

const MealSummary = mongoose.model('MealSummary', mealSummarySchema);

module.exports = MealSummary;

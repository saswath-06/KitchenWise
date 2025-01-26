const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['receipt', 'manual'],
    required: true
  },
  expiryDate: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String,
    required: Boolean
  }],
  instructions: [{
    step: Number,
    text: String
  }],
  cuisine: {
    type: String,
    trim: true
  },
  cookingTime: {
    prep: Number,
    cook: Number
  },
  servings: {
    type: Number,
    required: true
  },
  macros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  cookingNotes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastCooked: Date
});

module.exports = mongoose.model('Recipe', RecipeSchema);

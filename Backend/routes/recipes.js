require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateRecipes } = require('../services/geminiService');
const { 
  createRecipe, 
  updateIngredientsAfterCooking,
  getUserRecipes,
  toggleFavorite,
  addCookingNote
} = require('../services/recipeService');

// Get recipe suggestions
router.get('/suggest', auth, async (req, res) => {
  try {
    const { cuisine, difficulty, maxTime, dietaryRestrictions } = req.query;
    
    const recipes = await generateRecipes({
      cuisine,
      difficulty,
      maxTime: maxTime ? parseInt(maxTime) : undefined,
      dietaryRestrictions: dietaryRestrictions ? dietaryRestrictions.split(',') : undefined
    });
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save recipe
router.post('/', auth, async (req, res) => {
  try {
    const recipe = await createRecipe(req.body, req.user._id);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's saved recipes
router.get('/', auth, async (req, res) => {
  try {
    const { cuisine, difficulty, maxTime, favorite, limit, skip } = req.query;
    const recipes = await getUserRecipes(req.user._id, {
      cuisine,
      difficulty,
      maxTime: maxTime ? parseInt(maxTime) : undefined,
      favorite: favorite === 'true',
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark recipe as cooked
router.post('/:id/cooked', auth, async (req, res) => {
  try {
    const recipe = await updateIngredientsAfterCooking(req.params.id, req.user._id);
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle favorite recipe
router.patch('/:id/favorite', auth, async (req, res) => {
  try {
    const recipe = await toggleFavorite(req.params.id, req.user._id);
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add cooking note to recipe
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const recipe = await addCookingNote(req.params.id, req.user._id, req.body.note);
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
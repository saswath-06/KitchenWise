require('dotenv').config();
const express = require('express');
const router = express.Router();
const { 
  addIngredients, 
  removeIngredients, 
  updateIngredientQuantity,
  searchIngredients 
} = require('../services/dbService');
const Ingredient = require('../models/Ingredient');

// Get all ingredients for user
router.get('/', async (req, res) => {
  try {
    const { search, sort = 'dateAdded', order = 'desc' } = req.query;
    let query = { user: req.user._id };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const ingredients = await Ingredient.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 });
    
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new ingredient
router.post('/', async (req, res) => {
  try {
    const ingredients = await addIngredients([req.body], req.user._id);
    res.status(201).json(ingredients[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update ingredient quantity
router.patch('/:id', async (req, res) => {
  try {
    const ingredient = await updateIngredientQuantity(
      req.params.id,
      req.body.quantity,
      req.user._id
    );
    res.json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete ingredient
router.delete('/:id', async (req, res) => {
  try {
    await removeIngredients([req.params.id], req.user._id);
    res.json({ message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search ingredients
router.get('/search', async (req, res) => {
  try {
    const ingredients = await searchIngredients(req.user._id, req.query.term);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
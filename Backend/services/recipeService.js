require('dotenv').config();
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const { getRecipeDetails } = require('./geminiService');

const createRecipe = async (recipeData, userId) => {
  try {
    // Get detailed recipe information from Gemini
    const details = await getRecipeDetails(recipeData);
    
    const recipe = new Recipe({
      ...recipeData,
      ...details,
      user: userId
    });
    
    return await recipe.save();
  } catch (error) {
    throw new Error('Failed to create recipe: ' + error.message);
  }
};

const updateIngredientsAfterCooking = async (recipeId, userId) => {
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, user: userId });
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Update last cooked date
    recipe.lastCooked = new Date();
    recipe.timesCooked = (recipe.timesCooked || 0) + 1;
    await recipe.save();

    // Update ingredient quantities
    for (const recipeIngredient of recipe.ingredients) {
      const userIngredient = await Ingredient.findOne({
        user: userId,
        name: recipeIngredient.name,
        quantity: { $gte: recipeIngredient.quantity }
      });

      if (userIngredient) {
        userIngredient.quantity -= recipeIngredient.quantity;
        if (userIngredient.quantity <= 0) {
          await Ingredient.deleteOne({ _id: userIngredient._id });
        } else {
          await userIngredient.save();
        }
      }
    }

    return recipe;
  } catch (error) {
    throw new Error('Failed to update ingredients: ' + error.message);
  }
};

const getUserRecipes = async (userId, filters = {}) => {
  try {
    const query = { user: userId };
    
    if (filters.cuisine) {
      query.cuisine = filters.cuisine;
    }
    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }
    if (filters.maxTime) {
      query['cookingTime.total'] = { $lte: filters.maxTime };
    }
    if (filters.favorite) {
      query.isFavorite = true;
    }

    return await Recipe.find(query)
      .sort({ dateCreated: -1 })
      .limit(filters.limit || 20)
      .skip(filters.skip || 0);
  } catch (error) {
    throw new Error('Failed to fetch recipes: ' + error.message);
  }
};

const toggleFavorite = async (recipeId, userId) => {
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, user: userId });
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    recipe.isFavorite = !recipe.isFavorite;
    return await recipe.save();
  } catch (error) {
    throw new Error('Failed to toggle favorite: ' + error.message);
  }
};

const addCookingNote = async (recipeId, userId, note) => {
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, user: userId });
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    recipe.cookingNotes.push({ text: note });
    return await recipe.save();
  } catch (error) {
    throw new Error('Failed to add cooking note: ' + error.message);
  }
};

module.exports = {
  createRecipe,
  updateIngredientsAfterCooking,
  getUserRecipes,
  toggleFavorite,
  addCookingNote
};
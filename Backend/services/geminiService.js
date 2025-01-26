require('dotenv').config();
const { getGeminiModel, getTextModel } = require('../config/gemini');
const fs = require('fs').promises;

const extractIngredientsFromReceipt = async (imagePath) => {
  try {
    const model = getGeminiModel();
    const imageData = await fs.readFile(imagePath);
    
    const prompt = `
      Analyze this receipt image and extract all grocery items.
      For each item, identify:
      1. Item name (standardized)
      2. Quantity
      3. Unit of measurement
      4. Confidence level of extraction (0-1)
      
      Return a JSON array with objects containing 'name', 'quantity', 'unit', and 'confidence' properties.
      Standardize units to common measurements (e.g., 'g', 'kg', 'ml', 'l', 'pieces').
      Skip non-food items.
    `;
    
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error processing receipt with Gemini:', error);
    throw new Error('Failed to process receipt: ' + error.message);
  }
};

const generateRecipes = async (ingredients, preferences = {}) => {
  try {
    const model = getTextModel();
    const { cuisine, difficulty, maxTime, dietaryRestrictions } = preferences;
    
    let prompt = `
      Given these ingredients: ${JSON.stringify(ingredients)},
      suggest possible recipes that can be made.
      
      Requirements:
      ${cuisine ? `- Cuisine type: ${cuisine}` : ''}
      ${difficulty ? `- Difficulty level: ${difficulty}` : ''}
      ${maxTime ? `- Maximum cooking time: ${maxTime} minutes` : ''}
      ${dietaryRestrictions ? `- Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
      
      Return a JSON array of recipe objects with:
      - title
      - ingredients (with quantities)
      - instructions (step by step)
      - cookingTime (prep and cook times)
      - servings
      - difficulty level
      - macros (calories, protein, carbs, fat)
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw new Error('Failed to generate recipes: ' + error.message);
  }
};

const getRecipeDetails = async (recipe) => {
  try {
    const model = getTextModel();
    
    const prompt = `
      For this recipe: ${recipe.title}
      With these ingredients: ${JSON.stringify(recipe.ingredients)}
      
      Provide detailed:
      1. Step-by-step cooking instructions
      2. Accurate macro calculations
      3. Cooking tips and tricks
      4. Possible ingredient substitutions
      5. Storage recommendations
      
      Return as JSON with these properties:
      - detailedInstructions
      - macros
      - tips
      - substitutions
      - storage
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error getting recipe details:', error);
    throw new Error('Failed to get recipe details: ' + error.message);
  }
};

module.exports = {
  extractIngredientsFromReceipt,
  generateRecipes,
  getRecipeDetails
};
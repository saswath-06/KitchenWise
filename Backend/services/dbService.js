require('dotenv').config();
const Ingredient = require('../models/Ingredient');
const Receipt = require('../models/Receipt');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Ingredient Operations
const addIngredients = async (ingredients, userId, source = 'manual') => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const ingredientPromises = ingredients.map(async ingredient => {
        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({
          user: userId,
          name: ingredient.name,
          unit: ingredient.unit
        }).session(session);

        if (existingIngredient) {
          // Update existing ingredient quantity
          existingIngredient.quantity += ingredient.quantity;
          return existingIngredient.save({ session });
        } else {
          // Create new ingredient
          return new Ingredient({
            ...ingredient,
            user: userId,
            source
          }).save({ session });
        }
      });

      return await Promise.all(ingredientPromises);
    });
  } catch (error) {
    throw new Error('Failed to add ingredients: ' + error.message);
  } finally {
    session.endSession();
  }
};

const removeIngredients = async (ingredientIds, userId) => {
  try {
    return await Ingredient.deleteMany({
      _id: { $in: ingredientIds },
      user: userId
    });
  } catch (error) {
    throw new Error('Failed to remove ingredients: ' + error.message);
  }
};

const updateIngredientQuantity = async (ingredientId, quantity, userId) => {
  try {
    const ingredient = await Ingredient.findOneAndUpdate(
      { _id: ingredientId, user: userId },
      { quantity },
      { new: true }
    );

    if (!ingredient) {
      throw new Error('Ingredient not found');
    }

    return ingredient;
  } catch (error) {
    throw new Error('Failed to update ingredient quantity: ' + error.message);
  }
};

// Receipt Operations
const saveReceipt = async (receiptData, userId) => {
  try {
    const receipt = new Receipt({
      ...receiptData,
      user: userId
    });
    return await receipt.save();
  } catch (error) {
    throw new Error('Failed to save receipt: ' + error.message);
  }
};

const getUserReceipts = async (userId, limit = 20, skip = 0) => {
  try {
    return await Receipt.find({ user: userId })
      .sort({ dateUploaded: -1 })
      .limit(limit)
      .skip(skip);
  } catch (error) {
    throw new Error('Failed to fetch receipts: ' + error.message);
  }
};

// Inventory Management
const getInventoryStats = async (userId) => {
  try {
    const stats = await Ingredient.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        sourceCounts: { 
          $push: { 
            source: '$source',
            count: 1
          }
        }
      }}
    ]);

    return stats[0] || { totalItems: 0, totalQuantity: 0, sourceCounts: [] };
  } catch (error) {
    throw new Error('Failed to get inventory stats: ' + error.message);
  }
};

const searchIngredients = async (userId, searchTerm) => {
  try {
    return await Ingredient.find({
      user: userId,
      name: { $regex: searchTerm, $options: 'i' }
    }).sort({ name: 1 });
  } catch (error) {
    throw new Error('Failed to search ingredients: ' + error.message);
  }
};

module.exports = {
  addIngredients,
  removeIngredients,
  updateIngredientQuantity,
  saveReceipt,
  getUserReceipts,
  getInventoryStats,
  searchIngredients
};
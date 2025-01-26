require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { extractIngredientsFromReceipt } = require('../services/geminiService');
const { addIngredients, saveReceipt, getUserReceipts } = require('../services/dbService');
const Receipt = require('../models/Receipt');

// Upload and process receipt
router.post('/upload', 
  auth, 
  upload.single('receipt'), 
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Create initial receipt record
      const receipt = await saveReceipt({
        imagePath: req.file.path,
        originalName: req.file.originalname,
        user: req.user._id
      });

      try {
        // Process receipt with Gemini AI
        const extractedItems = await extractIngredientsFromReceipt(req.file.path);

        // Save ingredients to database
        const savedIngredients = await addIngredients(extractedItems, req.user._id, 'receipt');

        // Update receipt with processed items
        receipt.processedItems = extractedItems;
        receipt.processed = true;
        await receipt.save();

        res.status(201).json({
          receipt,
          ingredients: savedIngredients
        });
      } catch (processingError) {
        // Update receipt with processing error
        receipt.processed = false;
        receipt.processingError = processingError.message;
        await receipt.save();

        throw processingError;
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get receipt history
router.get('/', auth, async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const receipts = await getUserReceipts(req.user._id, Number(limit), Number(skip));
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific receipt
router.get('/:id', auth, async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete receipt
router.delete('/:id', auth, async (req, res) => {
  try {
    const receipt = await Receipt.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Delete the image file
    const fs = require('fs').promises;
    await fs.unlink(receipt.imagePath);
    
    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
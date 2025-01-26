const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  processedItems: [{
    name: String,
    quantity: Number,
    unit: String,
    confidence: Number
  }],
  dateUploaded: {
    type: Date,
    default: Date.now
  },
  store: {
    type: String,
    trim: true
  },
  totalAmount: {
    type: Number
  },
  processed: {
    type: Boolean,
    default: false
  },
  processingError: {
    type: String
  }
});

// Add index for faster queries
ReceiptSchema.index({ user: 1, dateUploaded: -1 });

module.exports = mongoose.model('Receipt', ReceiptSchema);
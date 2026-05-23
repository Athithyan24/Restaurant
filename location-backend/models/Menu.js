const mongoose = require('mongoose');

// NEW: Define the structure for an individual item inside a combo
const ComboItemSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: { type: String },
  image: { type: String }
});

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a dish title name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category layout map']
  },
  price: {
    type: String,
    required: [true, 'Please add an INR price point valuation or custom pricing note']
  },
  description: {
    type: String,
    required: [true, 'Please add descriptive menu items notes']
  },
  dietary: {
    type: String,
    enum: ['None', 'Vegetarian', 'Vegan', 'Non-Vegetarian'],
    default: 'None'
  },
  image: {
    type: String,
    default: ''
  },
  
  // MODIFIED COMBO FIELDS
  isCombo: {
    type: Boolean,
    default: false
  },
  comboItems: {
    type: [ComboItemSchema], // Now uses the advanced object schema
    default: []
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', MenuSchema);
const mongoose = require('mongoose');

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
  
  // ⚠️ CRITICAL MODIFICATION: Changed from Number to String
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
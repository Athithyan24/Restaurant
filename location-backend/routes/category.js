const express = require('express');
const router = express.Router();
const CategoryMeta = require('../models/CategoryMeta');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await CategoryMeta.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/categories
// @desc    Create or Update a category (Admin Only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { categoryName, description, images } = req.body;
    
    // Using findOneAndUpdate with upsert: true means it will update if it exists, or create if it doesn't!
    const category = await CategoryMeta.findOneAndUpdate(
      { categoryName },
      { categoryName, description, images },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
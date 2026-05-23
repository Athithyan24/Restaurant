const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu'); 
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Menu.find();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // ⚠️ Added isCombo and comboItems here
    const { name, category, price, description, dietary, image, isCombo, comboItems } = req.body;

    const menuItem = await Menu.create({
      name,
      category,
      price,
      description,
      dietary,
      image,
      isCombo,        // Save to DB
      comboItems     // Save to DB
    });

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create menu item entry."
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update an existing menu item (EDIT)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // ⚠️ Added isCombo and comboItems here
    const { name, category, price, description, dietary, image, isCombo, comboItems } = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, category, price, description, dietary, image, isCombo, comboItems }, // Update in DB
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found in database.' });
    }

    res.status(200).json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update menu item."
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item (DELETE)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found in database.' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete menu item."
    });
  }
});

module.exports = router;
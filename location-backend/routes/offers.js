const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// @route   GET /api/offers
// @desc    Get the active hero offers (Public)
router.get('/', async (req, res) => {
  try {
    const offerDoc = await Offer.findOne();
    
    // If no offers are configured yet in the DB, return empty array
    if (!offerDoc) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: offerDoc.slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/offers
// @desc    Update the 4 hero offer slots (Admin)
router.post('/', async (req, res) => {
  try {
    const { offers } = req.body; // Expects the array of 4 slots

    // Find the single Offer configuration document
    let offerDoc = await Offer.findOne();

    if (!offerDoc) {
      // If it doesn't exist yet, create it
      offerDoc = await Offer.create({ slots: offers });
    } else {
      // If it exists, update it
      offerDoc.slots = offers;
      await offerDoc.save();
    }

    res.status(200).json({ success: true, data: offerDoc.slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
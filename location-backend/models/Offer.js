const mongoose = require('mongoose');

const OfferSlotSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // 1, 2, 3, or 4
  name: { type: String, required: true },
  img: { type: String },
  icon: { type: String },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  alignment: { type: String }
});

const OfferSchema = new mongoose.Schema({
  // We store an array of exactly 4 slots in a single document
  slots: {
    type: [OfferSlotSchema],
    default: []
  }
});

module.exports = mongoose.model('Offer', OfferSchema);
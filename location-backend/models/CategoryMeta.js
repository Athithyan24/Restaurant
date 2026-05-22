const mongoose = require('mongoose');

const CategoryMetaSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String // We will store arrays of image URLs here
  }]
}, { timestamps: true });

module.exports = mongoose.model('CategoryMeta', CategoryMetaSchema);
// models/Table.js
const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Occupied', 'Reserved'], 
    default: 'Available' 
  },
  
  occupiedAt: { type: Date },
  expiresAt: { type: Date },

  currentPartySize: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Table', TableSchema);
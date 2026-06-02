const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    quantity: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ['Pending', 'Preparing', 'Ready', 'Served'], 
      default: 'Pending' 
    }
  }],
  totalAmount: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['Unpaid', 'Paid'], 
    default: 'Unpaid' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
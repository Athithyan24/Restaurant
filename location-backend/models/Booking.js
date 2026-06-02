const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
  guests: { type: String, required: true },
  tableNumber: { type: String, required: true }, // e.g., "T-01"
  specialRequests: { type: String },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Arrived', 'Cancelled', 'Completed'], 
    default: 'Confirmed' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
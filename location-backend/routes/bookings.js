const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @desc    Submit a new luxury reservation
// @route   POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);

    // ⚡ Socket.io: Notify the Kitchen Terminal of a new reservation
    const io = req.app.get('io');
    if (io) {
      io.emit('newReservationNotification', newBooking);
    }

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get all bookings (For Kitchen/Admin view)
// @route   GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
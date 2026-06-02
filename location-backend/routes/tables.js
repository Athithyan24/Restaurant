const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// 1. Restore the GET route (CRITICAL for BookATable.jsx to work!)
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json({ success: true, data: tables });
  } catch (error) {
    console.error("Error fetching live tables:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Find best fit table
router.post('/find-best-fit', async (req, res) => {
  try {
    const { partySize } = req.body;

    const availableTables = await Table.find({
      status: 'Available',
      capacity: { $gte: partySize } 
    }).sort({ capacity: 1 });

    if (availableTables.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No tables available for that party size right now.' 
      });
    }

    const bestFitTable = availableTables[0];
    res.status(200).json({ success: true, table: bestFitTable });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}); // <-- FIXED: This bracket properly closes the POST route now!

// 3. Occupy Table & Start Timer
router.patch('/:id/occupy', async (req, res) => {
  try {
    const { partySize } = req.body;
    
    // Calculate the Time Window
    const now = new Date();
    const durationInMinutes = 45; 
    const expiryTime = new Date(now.getTime() + durationInMinutes * 60000);

    // Update Table with Timing Data
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Occupied', 
        currentPartySize: partySize || 0,
        occupiedAt: now,
        expiresAt: expiryTime 
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // ⚡ BROADCAST THE TIMER TO THE ADMIN & WEB ⚡
    const io = req.app.get('io');
    if (io) {
      io.emit('tableStatusChanged', { 
        tableId: table._id, 
        tableNumber: table.tableNumber,
        status: 'Occupied',
        expiresAt: table.expiresAt 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Table locked. Available again at ${expiryTime.toLocaleTimeString()}`,
      table 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CRITICAL FIX: Export the router so Express doesn't crash!
module.exports = router;
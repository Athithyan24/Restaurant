const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');

router.post('/', async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    // 1. Look for the table
    let table = await Table.findOne({ tableNumber: Number(tableNumber) });
    
    if (!table) {
      console.log(`Table ${tableNumber} not found in DB. Auto-creating it now...`);
      table = await Table.create({
        tableNumber: Number(tableNumber),
        capacity: 4,
        status: 'Occupied',
        currentPartySize: 2
      });
    } else {
      // ✅ THE CRITICAL FIX: Even if table exists, force it to 'Occupied' 
      // so the Booking UI knows someone is sitting there.
      table.status = 'Occupied';
      await table.save();
    }

    // 3. Create the Order
    const newOrder = await Order.create({
      table: table._id,
      items: items // { menuItem, quantity }
    });

    // 4. Fetch the full dish details to show the kitchen
    const io = req.app.get('io');
    if (io) {
      const populatedOrder = await Order.findById(newOrder._id)
                            .populate('table')
                            .populate('items.menuItem', 'name image category');
      
      io.emit('newKitchenOrder', {
        tableNumber: table.tableNumber,
        order: populatedOrder
      });
    }

    res.status(201).json({ success: true, order: newOrder });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body; 
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status }, 
      { new: true }
    )
    .populate('table')
    .populate('items.menuItem');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdated', order);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Unpaid' })
      .populate('table')
      .populate('items.menuItem')
      .sort({ createdAt: 1 }); 
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
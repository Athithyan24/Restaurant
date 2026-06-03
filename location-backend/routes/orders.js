const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');

// --- 1. CREATE NEW ORDER ---
router.post('/', async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    const io = req.app.get('io');
    
    // Look for the table
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
      table.status = 'Occupied';
      await table.save();
    }

    if (io) {
      io.emit('tableStatusChanged', { 
        tableNumber: Number(tableNumber), 
        status: 'Occupied' 
      });
    }

    const newOrder = await Order.create({
      table: table._id,
      items: items
    });

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

// --- 2. UPDATE ORDER STATUS (Kitchen) ---
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

// --- 3. GET ACTIVE ORDERS ---
router.get('/active', async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Unpaid' })
      .populate('table')
      .populate('items.menuItem') // This is critical for prices/names
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 4. NEW: CHECKOUT ROUTE (Cashier) ---
router.patch('/:id/checkout', async (req, res) => {
  try {
    // 1. Mark order as paid
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { paymentStatus: 'Paid' }, 
      { new: true }
    ).populate('table');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // 2. Free up the table automatically
    if (order.table) {
      await Table.findByIdAndUpdate(order.table._id, { 
        status: 'Available',
        currentPartySize: 0 
      });

      const io = req.app.get('io');
      if (io) {
        // Tell everyone the table is now green/available
        io.emit('tableStatusChanged', { 
          tableNumber: order.table.tableNumber, 
          status: 'Available' 
        });
        // Tell the dashboard to remove this order from the Billing tab
        io.emit('orderStatusUpdated', order); 
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
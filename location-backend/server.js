require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category'); // Add to top
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const bookingRoutes = require('./routes/bookings');
const tableRoutes = require('./routes/tables');

const app = express();

// Configure strict cross-origin pipeline sharing schemas
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.use(express.json());

app.set('io', io);

io.on('connection' , (socket) => {
  console.log(`Live connection established: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Connection disconnected: ${socket.id}`);
  });
});

// Bind active route routing components
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/offers', require('./routes/offers'));
// Health check status terminal probe
app.get('/health', (req, res) => res.status(200).json({ status: 'online', time: new Date() }));

const PORT = process.env.PORT || 5000;

setInterval(async () => {
  try {
    const Table = require('./models/Table'); // Ensure path is correct
    const now = new Date();

    // 1. Find tables that are 'Occupied' but their time has run out
    const expiredTables = await Table.find({
      status: 'Occupied',
      expiresAt: { $lt: now }
    });

    if (expiredTables.length > 0) {
      // 2. Reset them to Available
      await Table.updateMany(
        { _id: { $in: expiredTables.map(t => t._id) } },
        { 
          $set: { 
            status: 'Available', 
            occupiedAt: null, 
            expiresAt: null,
            currentPartySize: 0 
          } 
        }
      );

      // 3. ⚡ Notify everyone (Admin & Web) that tables are now free
      const io = app.get('io'); 
      if (io) {
        io.emit('tablesAutoRefreshed', {
          message: `${expiredTables.length} tables have been released.`,
          releasedTableNumbers: expiredTables.map(t => t.tableNumber)
        });
      }
      console.log(`[Timer] Auto-released ${expiredTables.length} tables.`);
    }
  } catch (err) {
    console.error("Error in Table Auto-Release Worker:", err);
  }
}, 60000);

// Connect to MongoDB Cluster and start engine listener
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🛡️ Database operational pipeline linked successfully.');
    // REMOVED app.listen() FROM HERE
  })
  .catch(err => {
    console.error('🛑 Critical database connection failure:', err.message);
    process.exit(1);
  });

// KEEP THIS ONE: This starts both Express and Socket.io properly
server.listen(PORT, () => {
  console.log(`🚀 Server & WebSockets running on port ${PORT}`);
});
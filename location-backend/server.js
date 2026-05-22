require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category'); // Add to top
const menuRoutes = require('./routes/menu');

const app = express();

// Configure strict cross-origin pipeline sharing schemas
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Bind active route routing components
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
// Health check status terminal probe
app.get('/health', (req, res) => res.status(200).json({ status: 'online', time: new Date() }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Cluster and start engine listener
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🛡️ Database operational pipeline linked successfully.');
    app.listen(PORT, () => console.log(`🚀 System server core running online at: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('🛑 Critical database connection failure:', err.message);
    process.exit(1);
  });
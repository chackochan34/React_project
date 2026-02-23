const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const plateRoutes = require('./routes/plateRoutes');
const bidRoutes = require('./routes/bidRoutes');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plates', plateRoutes);
app.use('/api/bids', bidRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Auction System API - Ready!' });
});

// DB status endpoint for health checks / Thunder Client
app.get('/api/db-status', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  res.json({ readyState, status: states[readyState] || 'unknown' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/plates, POST /api/bids`);
});

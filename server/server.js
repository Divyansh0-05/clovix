require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { fetchAndStoreProducts, syncBatch } = require('./services/serpApiService');

// Import routes
const authRoutes = require('./routes/auth');
const skinToneRoutes = require('./routes/skinTone');
const outfitRoutes = require('./routes/outfits');
const wishlistRoutes = require('./routes/wishlist');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://clovix.in',
  'https://www.clovix.in',
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server calls and same-origin requests with no Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Connect to MongoDB
connectDB().then(() => {
  // One-time startup sync to fill database
  // fetchAndStoreProducts().catch(console.error);
});
// Batch 1 — 1st of every month at 3am (queries 0–99)
cron.schedule('0 3 1 * *', () => {
  console.log('⏰ Monthly sync batch 1');
  syncBatch(0, 99).catch(console.error);
});

// Batch 2 — 11th of every month at 3am (queries 100–199)
cron.schedule('0 3 11 * *', () => {
  console.log('⏰ Monthly sync batch 2');
  syncBatch(100, 199).catch(console.error);
});

// Batch 3 — 21st of every month at 3am (queries 200–end)
cron.schedule('0 3 21 * *', () => {
  console.log('⏰ Monthly sync batch 3');
  syncBatch(200, 999).catch(console.error);
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skin-tone', skinToneRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Clovix server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

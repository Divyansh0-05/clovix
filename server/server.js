require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const {
  fetchAndStoreProducts,
  syncBatch,
  getCurrentSyncCycleId,
  getMonthlyBatchRanges,
} = require('./services/serpApiService');

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

connectDB().then(() => {
  // fetchAndStoreProducts().catch(console.error);
});

const monthlyBatchRanges = getMonthlyBatchRanges();
const batch2Range = monthlyBatchRanges[1];
const batch3Range = monthlyBatchRanges[2];

cron.schedule('0 3 1 * *', () => {
  const cycleId = getCurrentSyncCycleId(new Date());
  console.log(`Monthly sync batch 1 for cycle ${cycleId}`);
  fetchAndStoreProducts({
    cycleId,
    cleanupStale: false,
    maxQueries: Number.MAX_SAFE_INTEGER,
    logLabel: 'monthly batch 1 full sync',
  }).catch(console.error);
});

cron.schedule('0 3 11 * *', () => {
  const cycleId = getCurrentSyncCycleId(new Date());

  if (batch2Range?.isEmpty) {
    console.log(`Monthly sync batch 2 skipped for cycle ${cycleId} because no queries were assigned`);
    return;
  }

  console.log(`Monthly sync batch 2 for cycle ${cycleId}`);
  syncBatch(batch2Range.start, batch2Range.end, {
    cycleId,
    cleanupStale: false,
    logLabel: 'monthly batch 2 refresh',
  }).catch(console.error);
});

cron.schedule('0 3 21 * *', () => {
  const cycleId = getCurrentSyncCycleId(new Date());

  if (batch3Range?.isEmpty) {
    console.log(`Monthly sync batch 3 skipped for cycle ${cycleId} because no queries were assigned`);
    return;
  }

  console.log(`Monthly sync batch 3 for cycle ${cycleId}`);
  syncBatch(batch3Range.start, batch3Range.end, {
    cycleId,
    cleanupStale: true,
    logLabel: 'monthly batch 3 refresh and cleanup',
  }).catch(console.error);
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/skin-tone', skinToneRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Clovix server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

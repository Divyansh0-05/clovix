const express = require('express');
const Outfit = require('../models/Outfit');
const {
  fetchAndStoreProducts,
  syncBatch,
  MANUAL_MAX_QUERIES,
} = require('../services/serpApiService');

const router = express.Router();

// GET /api/outfits — Get outfits with optional filters
// Query params: skinTone, gender, sort
router.get('/', async (req, res) => {
  try {
    const { skinTone, gender, sort = 'price_asc' } = req.query;

    const filter = {};

    if (skinTone) {
      filter.recommendedSkinTones = skinTone;
    }
    if (gender) {
      filter.gender = { $in: [gender, 'unisex'] };
    }

    const sortOrder = sort === 'price_desc' ? -1 : 1;

    const outfits = await Outfit.find(filter)
      .sort({ price: sortOrder })
      .limit(100);

    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/outfits/sources — Get outfit counts by source
router.get('/sources', async (req, res) => {
  try {
    const counts = await Outfit.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    res.json({ sources: counts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/outfits/sync — Manually trigger product sync
router.post('/sync', async (req, res) => {
  try {
    const requestedStartIndex = Number.parseInt(req.body?.startIndex, 10);
    const requestedQueryCount = Number.parseInt(req.body?.queryCount, 10);

    const startIndex = Number.isNaN(requestedStartIndex) ? 0 : requestedStartIndex;
    const queryCount = Number.isNaN(requestedQueryCount) ? MANUAL_MAX_QUERIES : requestedQueryCount;

    const result = await fetchAndStoreProducts({
      manual: true,
      startIndex,
      maxQueries: queryCount,
      cleanupStale: false,
      logLabel: 'manual limited sync',
    });

    res.json({
      success: true,
      synced: result.totalSaved,
      searchesUsed: result.searchesUsed,
      queriesRequested: result.queriesRequested,
      manualQueryCap: MANUAL_MAX_QUERIES,
      startIndex: result.startIndex,
      message: `Manual sync completed with ${result.queriesRequested} query slots and ${result.totalSaved} products saved`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/sync-batch', async (req, res) => {
  const { from = 0, to = 99 } = req.body;
  try {
    const count = await syncBatch(from, to);
    res.json({ success: true, synced: count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/outfits/:id/similar — Get similar products and recommendations
router.get('/:id/similar', async (req, res) => {
  try {
    const product = await Outfit.findById(req.params.id);

    if (!product) return res.status(404).json({ error: 'Not found' });

    const similar = await Outfit.find({
      _id: { $ne: product._id },
      color: product.color,
      category: product.category,
      gender: { $in: [product.gender, 'unisex'] },
    })
      .limit(8)
      .sort({ price: 1 });

    const youMayLike = await Outfit.find({
      _id: { $ne: product._id },
      recommendedSkinTones: {
        $in: product.recommendedSkinTones,
      },
      category: { $ne: product.category },
      gender: { $in: [product.gender, 'unisex'] },
    })
      .limit(8)
      .sort({ lastUpdated: -1 });

    res.json({ similar, youMayLike });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/outfits/:id — Get single outfit
router.get('/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    res.json({ outfit });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

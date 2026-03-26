const express = require('express');
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/wishlist — Add outfit to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { outfitId, outfitData } = req.body;

    if (!outfitId) {
      return res.status(400).json({ message: 'outfitId is required' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: req.user._id, outfitId });
    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userId: req.user._id,
      outfitId,
      outfitData,
    });
    await wishlistItem.save();

    res.status(201).json({ message: 'Added to wishlist', item: wishlistItem });
  } catch (error) {
    console.error('Wishlist add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/wishlist — Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id })
      .sort({ addedAt: -1 });

    res.json({ wishlist: items });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist/:outfitId — Remove outfit from wishlist
router.delete('/:outfitId', auth, async (req, res) => {
  try {
    const result = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      outfitId: req.params.outfitId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist — Clear entire wishlist
router.delete('/', auth, async (req, res) => {
  try {
    await Wishlist.deleteMany({ userId: req.user._id });
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

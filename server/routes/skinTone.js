const express = require('express');
const SkinTone = require('../models/SkinTone');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/skin-tone — Save skin tone detection result
router.post('/', auth, async (req, res) => {
  try {
    const { hexColor, skinToneType } = req.body;
    const detectedAt = new Date();

    if (!hexColor || !skinToneType) {
      return res.status(400).json({ message: 'hexColor and skinToneType are required' });
    }

    const existingSkinTones = await SkinTone.find({ userId: req.user._id })
      .sort({ detectedAt: -1, _id: -1 });

    let skinTone;

    if (existingSkinTones.length > 0) {
      skinTone = existingSkinTones[0];
      skinTone.hexColor = hexColor;
      skinTone.skinToneType = skinToneType;
      skinTone.detectedAt = detectedAt;
      await skinTone.save();

      if (existingSkinTones.length > 1) {
        const duplicateIds = existingSkinTones.slice(1).map((entry) => entry._id);
        await SkinTone.deleteMany({ _id: { $in: duplicateIds } });
      }
    } else {
      skinTone = await SkinTone.create({
        userId: req.user._id,
        hexColor,
        skinToneType,
        detectedAt,
      });
    }

    // Update user's current skin tone
    await User.findByIdAndUpdate(req.user._id, {
      skinTone: {
        hexColor,
        type: skinToneType,
        detectedAt,
      },
    });

    res.status(200).json({
      message: 'Skin tone saved successfully',
      skinTone,
    });
  } catch (error) {
    console.error('Skin tone save error:', error);
    res.status(500).json({ message: 'Server error saving skin tone' });
  }
});

// GET /api/skin-tone/history — Get user's skin tone detection history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await SkinTone.find({ userId: req.user._id })
      .sort({ detectedAt: -1 })
      .limit(10);

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/skin-tone/latest — Get user's latest skin tone
router.get('/latest', auth, async (req, res) => {
  try {
    const latest = await SkinTone.findOne({ userId: req.user._id })
      .sort({ detectedAt: -1 });

    res.json({ skinTone: latest });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

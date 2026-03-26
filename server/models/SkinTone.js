const mongoose = require('mongoose');

const skinToneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  hexColor: {
    type: String,
    required: true,
  },
  skinToneType: {
    type: String,
    enum: ['warm', 'cool', 'neutral'],
    required: true,
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
});

skinToneSchema.index({ userId: 1, detectedAt: -1 });

module.exports = mongoose.model('SkinTone', skinToneSchema);

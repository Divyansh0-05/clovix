const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  externalId: {
    type: String,
    unique: true,
    sparse: true,
  },
  brand: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  affiliateLink: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  recommendedSkinTones: {
    type: [String],
    enum: ['warm', 'cool', 'neutral'],
    required: true,
  },
  source: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unisex'],
    required: true,
  },
  category: {
    type: String,
    default: null,
  },
  productType: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
  styleTags: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: null,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  delivery: {
    type: String,
    default: null,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lastSyncedAt: {
    type: Date,
    default: null,
  },
  syncCycleId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
outfitSchema.index({ recommendedSkinTones: 1, gender: 1, source: 1 });
outfitSchema.index({ syncCycleId: 1, lastSyncedAt: -1 });
outfitSchema.index({ category: 1, productType: 1, gender: 1 });

module.exports = mongoose.model('Outfit', outfitSchema);

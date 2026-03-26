const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  outfitId: {
    type: String,
    required: true,
  },
  outfitData: {
    name: String,
    description: String,
    price: String,
    imageUrl: String,
    affiliateLink: String,
    recommendedSkinTones: [String],
    source: String,
    gender: String,
    category: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate wishlist entries
wishlistSchema.index({ userId: 1, outfitId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);

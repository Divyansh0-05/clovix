export interface Outfit {
    _id: string;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    imageUrl: string;
    affiliateLink?: string;
    recommendedSkinTones: string[];
    source?: string;
    gender: string; // Required: 'male', 'female', or 'unisex'
    category?: string;
  }


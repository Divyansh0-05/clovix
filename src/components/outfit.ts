export interface Outfit {
    _id: string;
    name: string;
    brand?: string;
    description: string;
    price: string | number;
    originalPrice?: string | number;
    imageUrl?: string;
    image?: string;
    affiliateLink?: string;
    link?: string;
    recommendedSkinTones: string[];
    source?: string;
    color?: string;
    gender: string; // Required: 'male', 'female', or 'unisex'
    category?: string;
    rating?: number | null;
    reviews?: number;
    delivery?: string | null;
    externalId?: string;
    lastUpdated?: string;
  }


import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Outfit } from './outfit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ShopProps {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  detectedSkinTone?: { color: string; type: string } | null | undefined;
  wishlist: Outfit[];
  toggleWishlist: (outfit: Outfit) => void;
  selectedGender: string | null;
}

export default function Shop({ isLoggedIn, userId, token, detectedSkinTone, wishlist, toggleWishlist, selectedGender }: ShopProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [amazonOutfits, setAmazonOutfits] = useState<Outfit[]>([]);
  const [flipkartOutfits, setFlipkartOutfits] = useState<Outfit[]>([]);
  const [myntraOutfits, setMyntraOutfits] = useState<Outfit[]>([]);
  const [ajioOutfits, setAjioOutfits] = useState<Outfit[]>([]);
  const [visibleAllOutfits, setVisibleAllOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Gender is now received from props (selected on first app load)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [allItemsToShow, setAllItemsToShow] = useState(8);
  const [amazonOffset, setAmazonOffset] = useState(0);
  const [flipkartOffset, setFlipkartOffset] = useState(0);
  const [myntraOffset, setMyntraOffset] = useState(0);
  const [ajioOffset, setAjioOffset] = useState(0);
  const [priceSort, setPriceSort] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Outfit | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Outfit[]>([]);
  const [youMayLike, setYouMayLike] = useState<Outfit[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const amazonScrollRef = useRef<HTMLDivElement>(null);
  const flipkartScrollRef = useRef<HTMLDivElement>(null);
  const myntraScrollRef = useRef<HTMLDivElement>(null);
  const ajioScrollRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 4;
  const ITEM_WIDTH = 320 + 32;
  const MOBILE_ITEM_WIDTH = 240 + 16; // Increased mobile card width

  const currentSkinTone = detectedSkinTone?.type;

  useEffect(() => {
    const fetchOutfits = async () => {
      if (!currentSkinTone) {
        setOutfits([]);
        setFilteredOutfits([]);
        setAmazonOutfits([]);
        setFlipkartOutfits([]);
        setMyntraOutfits([]);
        setAjioOutfits([]);
        setVisibleAllOutfits([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const gender = selectedGender || '';
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/outfits?skinTone=${currentSkinTone}&gender=${gender}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch outfits');
        }
        const data: Outfit[] = await res.json();
        setOutfits(data);
      } catch (err) {
        setError('Error loading outfits');
        console.error('Error fetching outfits:', err);
        setOutfits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [currentSkinTone, selectedGender]);

  useEffect(() => {
    let filtered = [...outfits];
    if (priceSort === 'lowToHigh') {
      filtered.sort((a, b) => (parsePriceValue(a.price) || 0) - (parsePriceValue(b.price) || 0));
    } else if (priceSort === 'highToLow') {
      filtered.sort((a, b) => (parsePriceValue(b.price) || 0) - (parsePriceValue(a.price) || 0));
    }
    setFilteredOutfits(filtered);

    const allAmazonOutfits = filtered.filter(outfit => outfit.source === 'amazon');
    const allFlipkartOutfits = filtered.filter(outfit => outfit.source === 'flipkart');
    const allMyntraOutfits = filtered.filter(outfit => outfit.source === 'myntra');
    const allAjioOutfits = filtered.filter(outfit => outfit.source === 'ajio');
    const allOutfits = filtered.filter(outfit => ['warm', 'cool', 'neutral'].some(tone => outfit.recommendedSkinTones.includes(tone)));

    setAmazonOutfits(allAmazonOutfits);
    setFlipkartOutfits(allFlipkartOutfits);
    setMyntraOutfits(allMyntraOutfits);
    setAjioOutfits(allAjioOutfits);
    setVisibleAllOutfits(allOutfits.slice(0, allItemsToShow));

    setAmazonOffset(0);
    setFlipkartOffset(0);
    setMyntraOffset(0);
    setAjioOffset(0);
  }, [allItemsToShow, outfits, priceSort]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'BODY') {
        if (event.key === 'ArrowLeft') {
          if (amazonScrollRef.current && amazonOffset > 0) setAmazonOffset(prev => prev - ITEMS_PER_PAGE);
          if (flipkartScrollRef.current && flipkartOffset > 0) setFlipkartOffset(prev => prev - ITEMS_PER_PAGE);
          if (myntraScrollRef.current && myntraOffset > 0) setMyntraOffset(prev => prev - ITEMS_PER_PAGE);
          if (ajioScrollRef.current && ajioOffset > 0) setAjioOffset(prev => prev - ITEMS_PER_PAGE);
        } else if (event.key === 'ArrowRight') {
          if (amazonScrollRef.current && amazonOffset + ITEMS_PER_PAGE < amazonOutfits.length) setAmazonOffset(prev => prev + ITEMS_PER_PAGE);
          if (flipkartScrollRef.current && flipkartOffset + ITEMS_PER_PAGE < flipkartOutfits.length) setFlipkartOffset(prev => prev + ITEMS_PER_PAGE);
          if (myntraScrollRef.current && myntraOffset + ITEMS_PER_PAGE < myntraOutfits.length) setMyntraOffset(prev => prev + ITEMS_PER_PAGE);
          if (ajioScrollRef.current && ajioOffset + ITEMS_PER_PAGE < ajioOutfits.length) setAjioOffset(prev => prev + ITEMS_PER_PAGE);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [amazonOffset, flipkartOffset, myntraOffset, ajioOffset, amazonOutfits.length, flipkartOutfits.length, myntraOutfits.length, ajioOutfits.length]);

  useEffect(() => {
    if (amazonScrollRef.current) {
      amazonScrollRef.current.style.transform = `translateX(-${amazonOffset * ITEM_WIDTH}px)`;
    }
    if (flipkartScrollRef.current) {
      flipkartScrollRef.current.style.transform = `translateX(-${flipkartOffset * ITEM_WIDTH}px)`;
    }
    if (myntraScrollRef.current) {
      myntraScrollRef.current.style.transform = `translateX(-${myntraOffset * ITEM_WIDTH}px)`;
    }
    if (ajioScrollRef.current) {
      ajioScrollRef.current.style.transform = `translateX(-${ajioOffset * ITEM_WIDTH}px)`;
    }
  }, [amazonOffset, flipkartOffset, myntraOffset, ajioOffset]);
 
  const handleShowMore = (type: 'all') => {
    if (type === 'all') setAllItemsToShow(prev => prev + 8);
  };

  const handleWishlistClick = (outfit: Outfit) => {
    toggleWishlist(outfit);
    setShowWishlistPopup(true);
    setTimeout(() => setShowWishlistPopup(false), 2000);
  };

  const normalizeSourceLabel = (source?: string) => {
    if (!source) return 'Clovix';
    if (source.toLowerCase() === 'ajio') return 'Ajio';
    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  const getPlatformBadgeClass = (source?: string) => {
    const normalized = normalizeSourceLabel(source).toLowerCase();
    if (normalized.includes('myntra')) return 'bg-pink-600 text-white';
    if (normalized.includes('amazon')) return 'bg-amber-400 text-slate-900';
    if (normalized.includes('flipkart')) return 'bg-blue-600 text-white';
    if (normalized.includes('bewakoof') || normalized.includes('ajio')) return 'bg-slate-900 text-white';
    return 'bg-slate-700 text-white';
  };

  const getDisplayImage = (outfit: Outfit) => outfit.imageUrl || outfit.image || '';

  const getProductLink = (outfit: Outfit) => outfit.affiliateLink || outfit.link || '#';

  const getBrandLabel = (outfit: Outfit) =>
    (outfit.brand || normalizeSourceLabel(outfit.source)).toUpperCase();

  const parsePriceValue = (value?: string | number) => {
    if (typeof value === 'number') return value;
    if (!value) return null;
    const numeric = Number(value.toString().replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  };

  const formatPriceLabel = (value?: string | number) => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number') return `Rs. ${value.toLocaleString('en-IN')}`;
    if (/^\d+(\.\d+)?$/.test(value)) return `Rs. ${Number(value).toLocaleString('en-IN')}`;
    return value;
  };

  const getDiscountLabel = (outfit: Outfit) => {
    const current = parsePriceValue(outfit.price);
    const original = parsePriceValue(outfit.originalPrice);
    if (!current || !original || original <= current) return null;
    const discount = Math.round(((original - current) / original) * 100);
    return `${discount}% OFF`;
  };

  const getFallbackRecommendations = (product: Outfit) => {
    const similar = outfits
      .filter((item) =>
        item._id !== product._id &&
        item.color &&
        product.color &&
        item.color === product.color &&
        item.category === product.category &&
        (item.gender === product.gender || item.gender === 'unisex')
      )
      .slice(0, 8);

    const recommended = outfits
      .filter((item) =>
        item._id !== product._id &&
        item.category !== product.category &&
        item.recommendedSkinTones.some((tone) => product.recommendedSkinTones.includes(tone)) &&
        (item.gender === product.gender || item.gender === 'unisex')
      )
      .slice(0, 8);

    return { similar, youMayLike: recommended };
  };

  const fetchSimilar = async (product: Outfit) => {
    setIsDetailLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/outfits/${product._id}/similar`);

      if (!res.ok) {
        throw new Error('Falling back to local recommendations');
      }

      const data = await res.json();
      setSimilarProducts(data.similar || []);
      setYouMayLike(data.youMayLike || []);
    } catch {
      const fallback = getFallbackRecommendations(product);
      setSimilarProducts(fallback.similar);
      setYouMayLike(fallback.youMayLike);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openProductDetail = (outfit: Outfit) => {
    setSelectedProduct(outfit);
    fetchSimilar(outfit);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSimilarProducts([]);
    setYouMayLike([]);
    setIsDetailLoading(false);
  };

  useEffect(() => {
    if (!selectedProduct) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeProductDetail();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProduct]);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>, type: 'amazon' | 'flipkart' | 'myntra' | 'ajio') => {
    if (ref.current) {
      if (type === 'amazon' && amazonOffset > 0) {
        setAmazonOffset(prev => prev - ITEMS_PER_PAGE);
      } else if (type === 'flipkart' && flipkartOffset > 0) {
        setFlipkartOffset(prev => prev - ITEMS_PER_PAGE);
      } else if (type === 'myntra' && myntraOffset > 0) {
        setMyntraOffset(prev => prev - ITEMS_PER_PAGE);
      } else if (type === 'ajio' && ajioOffset > 0) {
        setAjioOffset(prev => prev - ITEMS_PER_PAGE);
      }
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>, type: 'amazon' | 'flipkart' | 'myntra' | 'ajio') => {
    if (ref.current) {
      if (type === 'amazon' && amazonOffset + ITEMS_PER_PAGE < amazonOutfits.length) {
        setAmazonOffset(prev => prev + ITEMS_PER_PAGE);
      } else if (type === 'flipkart' && flipkartOffset + ITEMS_PER_PAGE < flipkartOutfits.length) {
        setFlipkartOffset(prev => prev + ITEMS_PER_PAGE);
      } else if (type === 'myntra' && myntraOffset + ITEMS_PER_PAGE < myntraOutfits.length) {
        setMyntraOffset(prev => prev + ITEMS_PER_PAGE);
      } else if (type === 'ajio' && ajioOffset + ITEMS_PER_PAGE < ajioOutfits.length) {
        setAjioOffset(prev => prev + ITEMS_PER_PAGE);
      }
    }
  };

  const ProductCard = ({ outfit }: { outfit: Outfit }) => {
    const isWishlisted = wishlist.some(item => item._id === outfit._id);
    const discountLabel = getDiscountLabel(outfit);
    const displayImage = getDisplayImage(outfit);

    return (
      <div
        className="group w-full cursor-pointer bg-white"
        onClick={() => openProductDetail(outfit)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
          <button type="button" className="h-full w-full" onClick={() => openProductDetail(outfit)}>
            <img
              src={displayImage}
              alt={outfit.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
          <div className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getPlatformBadgeClass(outfit.source)}`}>
            {normalizeSourceLabel(outfit.source)}
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleWishlistClick(outfit);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-700 backdrop-blur transition hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="px-1 pb-2 pt-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-slate-900">
            {getBrandLabel(outfit)}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-500">
            {outfit.name}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-bold text-slate-950">{formatPriceLabel(outfit.price)}</span>
            {outfit.originalPrice && (
              <span className="text-slate-400 line-through">{formatPriceLabel(outfit.originalPrice)}</span>
            )}
            {discountLabel && (
              <span className="font-semibold text-emerald-600">{discountLabel}</span>
            )}
          </div>
          {outfit.rating ? (
            <div className="mt-2 flex items-center gap-1 text-[12px] text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current text-emerald-600" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{outfit.rating}</span>
              <span>({outfit.reviews || 0})</span>
            </div>
          ) : null}
          {outfit.delivery && (
            <p className="mt-1 text-[12px] text-slate-500">{outfit.delivery}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">Tap to view details</p>
        </div>
      </div>
    );
  };

  const MobileProductCard = ({ outfit }: { outfit: Outfit }) => {
    const isWishlisted = wishlist.some(item => item._id === outfit._id);
    const discountLabel = getDiscountLabel(outfit);
    const displayImage = getDisplayImage(outfit);

    return (
      <div
        className="group w-full cursor-pointer bg-white"
        onClick={() => openProductDetail(outfit)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
          <button type="button" className="h-full w-full" onClick={() => openProductDetail(outfit)}>
            <img
              src={displayImage}
              alt={outfit.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
          <div className={`absolute bottom-2 left-2 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${getPlatformBadgeClass(outfit.source)}`}>
            {normalizeSourceLabel(outfit.source)}
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleWishlistClick(outfit);
            }}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-slate-700 backdrop-blur"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="px-1 pb-2 pt-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-900">{getBrandLabel(outfit)}</p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-500">{outfit.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
            <span className="font-bold text-slate-950">{formatPriceLabel(outfit.price)}</span>
            {outfit.originalPrice && (
              <span className="text-slate-400 line-through">{formatPriceLabel(outfit.originalPrice)}</span>
            )}
            {discountLabel && <span className="font-semibold text-emerald-600">{discountLabel}</span>}
          </div>
          {outfit.rating ? (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current text-emerald-600" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{outfit.rating}</span>
              <span>({outfit.reviews || 0})</span>
            </div>
          ) : null}
          {outfit.delivery && <p className="mt-1 text-[11px] text-slate-500">{outfit.delivery}</p>}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section id="shop" className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-20">
        <div className="flex flex-col items-center gap-4 text-slate-600">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="text-sm font-medium uppercase tracking-[0.18em]">Loading products</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section id="shop" className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-20">
        <p className="text-center text-base text-slate-600">{error}</p>
      </section>
    );
  }

  return (
    <section id="shop" className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-20 px-4">
      <div className="container mx-auto max-w-7xl relative">
        {showWishlistPopup && (
          <div className="fixed top-20 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade">
            Added to Wishlist!
          </div>
        )}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            {detectedSkinTone
              ? `Outfits for Your ${detectedSkinTone.type} Skin Tone`
              : selectedGender === 'male'
                ? "Men's Collection"
                : selectedGender === 'female'
                  ? "Women's Collection"
                  : 'Shop by Category'}
          </h2>
        </div>

        {detectedSkinTone && (
          <div className="flex justify-center items-center mb-12">
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
              <div className="w-10 h-10 rounded-full border-4 border-white shadow-lg mr-4" style={{ backgroundColor: detectedSkinTone.color }}></div>
              <div>
                <h4 className="font-semibold text-gray-800">Your Skin Tone</h4>
                <p className="text-sm text-gray-600">{detectedSkinTone.type}</p>
              </div>
            </div>
          </div>
        )}

        {!visibleAllOutfits.length && (
          <div className="mx-auto mb-12 max-w-xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-600">
            We're loading products for you. Check back soon!
          </div>
        )}

        {/* Amazon Section */}
        <div className={`mb-12 hidden md:block ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <div className="flex justify-between items-center pl-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Amazon</h3>
            <div className="w-full max-w-[8rem] sm:max-w-xs relative">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-50 transition-colors duration-200 appearance-none cursor-pointer"
              >
                <option value="">Sort by Price</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>
          <div className="relative pl-4" tabIndex={0}>
            <button
              onClick={() => scrollLeft(amazonScrollRef, 'amazon')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div
                ref={amazonScrollRef}
                className="flex space-x-8 transition-transform duration-300 ease-in-out touch-auto"
              >
                {amazonOutfits.map(outfit => (
                  <ProductCard key={outfit._id} outfit={outfit} />
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollRight(amazonScrollRef, 'amazon')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Flipkart Section */}
        <div className={`mb-12 hidden md:block ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <h3 className="text-2xl font-bold text-gray-800 pl-4 mb-4">Flipkart</h3>
          <div className="relative pl-4" tabIndex={0}>
            <button
              onClick={() => scrollLeft(flipkartScrollRef, 'flipkart')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div
                ref={flipkartScrollRef}
                className="flex space-x-8 transition-transform duration-300 ease-in-out touch-auto"
              >
                {flipkartOutfits.map(outfit => (
                  <ProductCard key={outfit._id} outfit={outfit} />
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollRight(flipkartScrollRef, 'flipkart')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        {/* Myntra Section */}
        <div className={`mb-12 hidden md:block ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <div className="flex justify-between items-center pl-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Myntra</h3>
            <div className="w-full max-w-[8rem] sm:max-w-xs relative">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-50 transition-colors duration-200 appearance-none cursor-pointer"
              >
                <option value="">Sort by Price</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>
          <div className="relative pl-4" tabIndex={0}>
            <button
              onClick={() => scrollLeft(myntraScrollRef, 'myntra')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div
                ref={myntraScrollRef}
                className="flex space-x-8 transition-transform duration-300 ease-in-out touch-auto"
              >
                {myntraOutfits.map(outfit => (
                  <ProductCard key={outfit._id} outfit={outfit} />
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollRight(myntraScrollRef, 'myntra')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ajio Section */}
        <div className={`mb-12 hidden md:block ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <div className="flex justify-between items-center pl-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Bewakoof</h3>
            <div className="w-full max-w-[8rem] sm:max-w-xs relative">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-50 transition-colors duration-200 appearance-none cursor-pointer"
              >
                <option value="">Sort by Price</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>
          <div className="relative pl-4" tabIndex={0}>
            <button
              onClick={() => scrollLeft(ajioScrollRef, 'ajio')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div
                ref={ajioScrollRef}
                className="flex space-x-8 transition-transform duration-300 ease-in-out touch-auto"
              >
                {ajioOutfits.map(outfit => (
                  <ProductCard key={outfit._id} outfit={outfit} />
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollRight(ajioScrollRef, 'ajio')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Amazon, Flipkart, Myntra, and Ajio Section */}
        <div className={`md:hidden ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <div className="mb-6">
            <div className="flex justify-between items-center pl-2 mb-2">
              <h3 className="text-xl font-bold text-gray-800">Amazon</h3>
              <div className="w-full max-w-[6rem] relative">
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-1 text-sm text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-50 transition-colors duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Sort by Price</option>
                  <option value="lowToHigh">Low to High</option>
                  <option value="highToLow">High to Low</option>
                </select>
              </div>
            </div>
            <div className="relative pl-2">
              <button
                onClick={() => scrollLeft(amazonScrollRef, 'amazon')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div
                  ref={amazonScrollRef}
                  className="flex space-x-4 transition-transform duration-300 ease-in-out touch-auto"
                  style={{ width: '100%' }}
                >
                  {amazonOutfits.map(outfit => (
                    <MobileProductCard key={outfit._id} outfit={outfit} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => scrollRight(amazonScrollRef, 'amazon')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 pl-2 mb-2">Flipkart</h3>
            <div className="relative pl-2">
              <button
                onClick={() => scrollLeft(flipkartScrollRef, 'flipkart')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div
                  ref={flipkartScrollRef}
                  className="flex space-x-4 transition-transform duration-300 ease-in-out touch-auto"
                  style={{ width: '100%' }}
                >
                  {flipkartOutfits.map(outfit => (
                    <MobileProductCard key={outfit._id} outfit={outfit} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => scrollRight(flipkartScrollRef, 'flipkart')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 pl-2 mb-2">Myntra</h3>
            <div className="relative pl-2">
              <button
                onClick={() => scrollLeft(myntraScrollRef, 'myntra')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div
                  ref={myntraScrollRef}
                  className="flex space-x-4 transition-transform duration-300 ease-in-out touch-auto"
                  style={{ width: '100%' }}
                >
                  {myntraOutfits.map(outfit => (
                    <MobileProductCard key={outfit._id} outfit={outfit} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => scrollRight(myntraScrollRef, 'myntra')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 pl-2 mb-2">Bewakoof</h3>
            <div className="relative pl-2">
              <button
                onClick={() => scrollLeft(ajioScrollRef, 'ajio')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div
                  ref={ajioScrollRef}
                  className="flex space-x-4 transition-transform duration-300 ease-in-out touch-auto"
                  style={{ width: '100%' }}
                >
                  {ajioOutfits.map(outfit => (
                    <MobileProductCard key={outfit._id} outfit={outfit} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => scrollRight(ajioScrollRef, 'ajio')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* All Products Section */}
        <div className={`mb-12 ${visibleAllOutfits.length ? '' : 'hidden'}`}>
          <h3 className="mb-8 pl-1 text-2xl font-bold text-gray-800">
            {selectedGender ? `${selectedGender === 'male' ? "Men's" : "Women's"} Collection` : 'All Products'}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {visibleAllOutfits.map(outfit => (
              <ProductCard key={outfit._id} outfit={outfit} />
            ))}
          </div>
          {visibleAllOutfits.length < filteredOutfits.filter(o => ['warm', 'cool', 'neutral'].some(tone => o.recommendedSkinTones.includes(tone))).length && (
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => handleShowMore('all')}
                className="border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                Show More
              </motion.button>
            </div>
          )}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" onClick={closeProductDetail}>
            <div
              className="max-h-[92vh] w-full max-w-7xl overflow-y-auto bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
                <button
                  type="button"
                  onClick={closeProductDetail}
                  className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:text-slate-950"
                >
                  Back
                </button>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Product details</p>
              </div>

              <div className="grid gap-8 p-5 lg:grid-cols-[1.5fr_1fr] lg:gap-10 lg:p-8">
                <div className="bg-slate-100">
                  <img src={getDisplayImage(selectedProduct)} alt={selectedProduct.name} className="aspect-[3/4] h-full w-full object-cover" />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getPlatformBadgeClass(selectedProduct.source)}`}>
                      {normalizeSourceLabel(selectedProduct.source)}
                    </span>
                    <span className="border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {selectedProduct.category || 'Clothing'}
                    </span>
                    {selectedProduct.color && (
                      <span className="border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {selectedProduct.color}
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-[13px] font-bold uppercase tracking-[0.08em] text-slate-900">
                    {getBrandLabel(selectedProduct)}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-900 lg:text-3xl">{selectedProduct.name}</h2>
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {selectedProduct.description || 'Handpicked by Clovix to match your style profile.'}
                  </p>

                  {selectedProduct.rating ? (
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current text-emerald-600" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-slate-700">{selectedProduct.rating}</span>
                      <span>({selectedProduct.reviews || 0} reviews)</span>
                    </div>
                  ) : null}

                  <div className="mt-6 border-b border-slate-200 pb-6">
                    <div className="flex flex-wrap items-center gap-3 text-[15px]">
                      <span className="text-3xl font-bold text-slate-950">{formatPriceLabel(selectedProduct.price)}</span>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice !== selectedProduct.price && (
                        <span className="text-base text-slate-400 line-through">{formatPriceLabel(selectedProduct.originalPrice)}</span>
                      )}
                      {getDiscountLabel(selectedProduct) && (
                        <span className="text-sm font-semibold text-emerald-600">{getDiscountLabel(selectedProduct)}</span>
                      )}
                    </div>
                    {selectedProduct.delivery && (
                      <p className="mt-2 text-sm text-slate-500">{selectedProduct.delivery}</p>
                    )}
                  </div>

                  <div className="mt-6 border-b border-slate-200 pb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Recommended for</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProduct.recommendedSkinTones.map((tone) => (
                        <span key={tone} className="border border-slate-200 px-3 py-2 text-sm font-medium capitalize text-slate-700">
                          {tone} tone
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={getProductLink(selectedProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-slate-800"
                    >
                      Buy Now
                    </a>
                    <button
                      type="button"
                      onClick={() => handleWishlistClick(selectedProduct)}
                      className="border border-slate-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
                    >
                      {wishlist.some((item) => item._id === selectedProduct._id) ? 'Saved to Wishlist' : 'Save to Wishlist'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 px-5 py-8 lg:px-8">
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold uppercase tracking-[0.08em] text-slate-900">Similar Products</h3>
                    {isDetailLoading && <span className="text-sm text-slate-500">Loading recommendations...</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                    {similarProducts.map((item) => (
                      <ProductCard key={`similar-${item._id}`} outfit={item} />
                    ))}
                    {!isDetailLoading && similarProducts.length === 0 && (
                      <div className="col-span-full border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        No similar products found yet for this item.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold uppercase tracking-[0.08em] text-slate-900">You May Also Like</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                    {youMayLike.map((item) => (
                      <ProductCard key={`like-${item._id}`} outfit={item} />
                    ))}
                    {!isDetailLoading && youMayLike.length === 0 && (
                      <div className="col-span-full border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                        No additional recommendations found yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .touch-auto {
          -webkit-overflow-scrolling: touch;
        }
        @keyframes fade {
          0% { opacity: 0; transform: translateY(-10px); }
          50% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fade {
          animation: fade 2s ease-in-out;
        }
      `}</style>
    </section>
  );
}

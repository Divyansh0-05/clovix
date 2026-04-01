import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers3, ShoppingBag, Sparkles } from 'lucide-react';
import { Outfit } from './outfit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ClosetLook {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  items: Outfit[];
  totalPrice: number;
}

interface PersonalClosetProps {
  detectedSkinTone?: { color: string; type: string } | null;
  selectedGender: string | null;
  onBackToShop: () => void;
}

const categoryKeywords: Record<string, string[]> = {
  Dress: ['dress', 'gown', 'bodycon'],
  Set: ['co ord', 'co-ord', 'coord', 'set'],
  EthnicWear: ['kurta', 'kurti', 'lehenga', 'saree', 'sherwani', 'pathani', 'bandhgala'],
  Bottom: ['trouser', 'trousers', 'chino', 'pant', 'pants', 'jeans', 'palazzo', 'skirt'],
  Footwear: ['sneaker', 'sneakers', 'shoe', 'shoes', 'loafer', 'loafers', 'heel', 'heels', 'flats', 'sandal', 'sandals', 'boots'],
  Outerwear: ['jacket', 'blazer', 'cardigan', 'hoodie', 'coat', 'overshirt'],
  Accessory: ['watch', 'belt', 'handbag', 'bag', 'earring', 'earrings'],
  Top: ['shirt', 'tshirt', 't-shirt', 'top', 'blouse', 'polo'],
};

const parsePriceValue = (value?: string | number) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = Number(value.toString().replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-IN')}`;

const normalizeCategory = (outfit: Outfit) => {
  const rawCategory = (outfit.category || '').toLowerCase();
  const rawType = (outfit.productType || '').toLowerCase();
  const name = outfit.name.toLowerCase();
  const text = `${rawCategory} ${rawType} ${name}`;

  if (rawCategory.includes('dress') || categoryKeywords.Dress.some((keyword) => text.includes(keyword))) {
    return 'Dress';
  }

  if (rawCategory.includes('set') || categoryKeywords.Set.some((keyword) => text.includes(keyword))) {
    return 'Set';
  }

  if (rawCategory.includes('ethnic') || categoryKeywords.EthnicWear.some((keyword) => text.includes(keyword))) {
    return 'EthnicWear';
  }

  if (rawCategory.includes('bottom') || categoryKeywords.Bottom.some((keyword) => text.includes(keyword))) {
    return 'Bottom';
  }

  if (rawCategory.includes('footwear') || categoryKeywords.Footwear.some((keyword) => text.includes(keyword))) {
    return 'Footwear';
  }

  if (rawCategory.includes('outerwear') || categoryKeywords.Outerwear.some((keyword) => text.includes(keyword))) {
    return 'Outerwear';
  }

  if (rawCategory.includes('accessory') || categoryKeywords.Accessory.some((keyword) => text.includes(keyword))) {
    return 'Accessory';
  }

  return 'Top';
};

const buildClosetLooks = (products: Outfit[], selectedGender: string | null, skinTone?: string | null) => {
  const relevantProducts = products.filter((item) => {
    if (!selectedGender) return true;
    return item.gender === selectedGender || item.gender === 'unisex';
  });

  const buckets = {
    Top: [] as Outfit[],
    Bottom: [] as Outfit[],
    Dress: [] as Outfit[],
    Set: [] as Outfit[],
    EthnicWear: [] as Outfit[],
    Outerwear: [] as Outfit[],
    Footwear: [] as Outfit[],
    Accessory: [] as Outfit[],
  };

  relevantProducts.forEach((item) => {
    const bucket = normalizeCategory(item);
    buckets[bucket].push(item);
  });

  const looks: ClosetLook[] = [];
  const vibeLabel = skinTone ? `${skinTone} tone` : 'signature tone';

  const addLook = (title: string, subtitle: string, vibe: string, items: Array<Outfit | undefined>) => {
    const normalizedItems = items.filter(Boolean) as Outfit[];
    if (normalizedItems.length < 2) return;

    const lookId = normalizedItems.map((item) => item._id).join('-');
    if (looks.some((look) => look.id === lookId)) return;

    looks.push({
      id: lookId,
      title,
      subtitle,
      vibe,
      items: normalizedItems,
      totalPrice: normalizedItems.reduce((sum, item) => sum + parsePriceValue(item.price), 0),
    });
  };

  const footwearPool = buckets.Footwear;
  const accessoryPool = buckets.Accessory;
  const outerwearPool = buckets.Outerwear;

  buckets.Dress.slice(0, 4).forEach((dress, index) => {
    addLook(
      'One-And-Done Look',
      `A streamlined ${vibeLabel} outfit anchored by a statement dress.`,
      'Easy polish',
      [dress, footwearPool[index % footwearPool.length], accessoryPool[index % accessoryPool.length]]
    );
  });

  buckets.Set.slice(0, 4).forEach((setItem, index) => {
    addLook(
      'Co-Ord Closet Pick',
      `A ready-made matching set styled for your ${vibeLabel}.`,
      'Matched energy',
      [setItem, footwearPool[(index + 1) % footwearPool.length], accessoryPool[(index + 1) % accessoryPool.length]]
    );
  });

  buckets.EthnicWear.slice(0, 4).forEach((ethnic, index) => {
    addLook(
      'Festive Outfit',
      `An occasion-ready ethnic look for your ${vibeLabel}.`,
      'Celebration ready',
      [ethnic, footwearPool[(index + 2) % footwearPool.length], accessoryPool[(index + 2) % accessoryPool.length]]
    );
  });

  const pairCount = Math.min(buckets.Top.length, buckets.Bottom.length);
  for (let index = 0; index < Math.min(pairCount, 6); index += 1) {
    addLook(
      'Everyday Styled Look',
      `A complete layered outfit mixed from pieces that flatter your ${vibeLabel}.`,
      index % 2 === 0 ? 'Daily go-to' : 'Sharp casual',
      [
        buckets.Top[index],
        buckets.Bottom[index % buckets.Bottom.length],
        outerwearPool[index % outerwearPool.length],
        footwearPool[index % footwearPool.length],
        accessoryPool[index % accessoryPool.length],
      ]
    );
  }

  return looks
    .sort((a, b) => a.totalPrice - b.totalPrice)
    .slice(0, 12);
};

export default function PersonalCloset({
  detectedSkinTone,
  selectedGender,
  onBackToShop,
}: PersonalClosetProps) {
  const [products, setProducts] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<ClosetLook | null>(null);

  useEffect(() => {
    const fetchClosetProducts = async () => {
      if (!detectedSkinTone?.type || !selectedGender) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/api/outfits?skinTone=${detectedSkinTone.type}&gender=${selectedGender}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch closet products');
        }

        const data: Outfit[] = await response.json();
        setProducts(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to build your closet right now.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClosetProducts();
  }, [detectedSkinTone?.type, selectedGender]);

  const looks = useMemo(
    () => buildClosetLooks(products, selectedGender, detectedSkinTone?.type),
    [products, selectedGender, detectedSkinTone?.type]
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_48%,_#ffffff_100%)] px-4 pb-20 pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <button
                type="button"
                onClick={onBackToShop}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back To Shop
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">Personal Closet</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-slate-900 md:text-5xl">
                Complete outfits built around your tone, not just individual pieces.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                We assemble ready-to-wear looks from your catalog so users can browse finished combinations for everyday styling,
                sharper dressing, and occasion-ready picks.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">Skin Tone</p>
                <p className="mt-2 text-lg font-semibold capitalize">{detectedSkinTone?.type || 'Pending'}</p>
              </div>
              <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Looks Ready</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{looks.length}</p>
              </div>
              <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Products Used</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{products.length}</p>
              </div>
            </div>
          </div>

          {!selectedGender || !detectedSkinTone?.type ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <Layers3 className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Closet unlocks after detection</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Detect a skin tone and choose a gender first, then this page can assemble complete looks from your product catalog.
              </p>
            </div>
          ) : loading ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Building Your Closet</p>
            </div>
          ) : error ? (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
              {error}
            </div>
          ) : looks.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-slate-400" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">More product variety is still syncing in</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                This page needs enough tops, bottoms, footwear, and accessories to assemble finished looks. Once the new catalog finishes
                syncing, your closet will start showing more complete outfits here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {looks.map((look, index) => {
                const hero = look.items[0];
                const secondary = look.items.slice(1, 4);

                return (
                  <motion.article
                    key={look.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.08)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <button type="button" onClick={() => setSelectedLook(look)} className="block w-full text-left">
                      <div className="grid gap-2 bg-slate-100 p-3 md:grid-cols-[1.3fr_0.9fr]">
                        <div className="overflow-hidden rounded-[1.25rem] bg-white">
                          <img
                            src={hero.imageUrl || hero.image}
                            alt={hero.name}
                            className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="grid gap-2">
                          {secondary.map((item) => (
                            <div key={item._id} className="overflow-hidden rounded-[1rem] bg-white">
                              <img src={item.imageUrl || item.image} alt={item.name} className="h-[102px] w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600">{look.vibe}</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{look.title}</h2>
                          </div>
                          <div
                            className="h-12 w-12 rounded-full border-4 border-white shadow-md"
                            style={{ backgroundColor: detectedSkinTone.color }}
                          />
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">{look.subtitle}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {look.items.map((item) => (
                            <span
                              key={item._id}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600"
                            >
                              {item.productType || item.category || 'Piece'}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Look Total</p>
                            <p className="mt-1 text-xl font-bold text-slate-950">{formatPrice(look.totalPrice)}</p>
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">
                            View Look
                            <ShoppingBag className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </button>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedLook && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4" onClick={() => setSelectedLook(null)}>
          <div
            className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600">{selectedLook.vibe}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{selectedLook.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLook(null)}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedLook.items.map((item, index) => (
                  <div key={item._id} className={`overflow-hidden rounded-[1.5rem] bg-slate-100 ${index === 0 ? 'sm:col-span-2' : ''}`}>
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className={`w-full object-cover ${index === 0 ? 'h-[420px]' : 'h-[220px]'}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm leading-7 text-slate-600">{selectedLook.subtitle}</p>

                <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Total Outfit Price</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{formatPrice(selectedLook.totalPrice)}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {selectedLook.items.map((item) => (
                    <div key={item._id} className="rounded-[1.25rem] border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {item.productType || item.category || 'Piece'}
                          </p>
                          <h3 className="mt-2 text-base font-semibold text-slate-900">{item.name}</h3>
                          <p className="mt-2 text-sm text-slate-500">{item.brand || item.source}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{formatPrice(parsePriceValue(item.price))}</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href={item.affiliateLink || item.link || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                        >
                          Buy Piece
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

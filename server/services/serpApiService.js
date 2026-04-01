const axios = require('axios');
const Outfit = require('../models/Outfit');

const BATCHES_PER_MONTH = 3;
const RESULTS_PER_QUERY = 10;
const REQUEST_DELAY_MS = 1000;
const MIN_PRODUCT_PRICE = 500;
const MANUAL_MAX_QUERIES = 3;

const createQuery = (search, tone, gender, category, productType, styleTags = []) => ({
  search,
  tone,
  gender,
  category,
  productType,
  styleTags,
});

const SHOPPING_QUERY_CATALOG = [
  // Warm tone - men
  createQuery('olive green men casual shirt under 1499', 'warm', 'male', 'Top', 'shirt', ['casual', 'budget']),
  createQuery('mustard men polo tshirt under 999', 'warm', 'male', 'Top', 'polo', ['casual', 'budget']),
  createQuery('rust men linen kurta under 1799', 'warm', 'male', 'Ethnic Wear', 'kurta', ['ethnic']),
  createQuery('camel men chinos under 1499', 'warm', 'male', 'Bottom', 'chinos', ['casual', 'budget']),
  createQuery('khaki men straight trousers under 1699', 'warm', 'male', 'Bottom', 'trousers', ['smart-casual']),
  createQuery('brown men lightweight jacket under 2999', 'warm', 'male', 'Outerwear', 'jacket', ['layering']),
  createQuery('tan men blazer under 3999', 'warm', 'male', 'Outerwear', 'blazer', ['formal']),
  createQuery('brown men sneakers under 1999', 'warm', 'male', 'Footwear', 'sneakers', ['casual']),
  createQuery('tan men loafers under 2499', 'warm', 'male', 'Footwear', 'loafers', ['formal']),
  createQuery('brown men leather belt under 999', 'warm', 'male', 'Accessory', 'belt', ['essential', 'budget']),
  createQuery('gold men analog watch under 1999', 'warm', 'male', 'Accessory', 'watch', ['essential']),
  createQuery('burnt orange men overshirt under 1999', 'warm', 'male', 'Top', 'overshirt', ['streetwear']),

  // Warm tone - women
  createQuery('peach women blouse under 1199', 'warm', 'female', 'Top', 'blouse', ['casual', 'budget']),
  createQuery('mustard women kurti under 1499', 'warm', 'female', 'Ethnic Wear', 'kurti', ['ethnic', 'budget']),
  createQuery('olive women co ord set under 2499', 'warm', 'female', 'Set', 'co-ord set', ['casual']),
  createQuery('beige women trousers under 1499', 'warm', 'female', 'Bottom', 'trousers', ['smart-casual', 'budget']),
  createQuery('rust women palazzo under 1299', 'warm', 'female', 'Bottom', 'palazzo', ['ethnic', 'budget']),
  createQuery('terracotta women midi dress under 2199', 'warm', 'female', 'Dress', 'midi dress', ['casual']),
  createQuery('camel women cropped jacket under 2999', 'warm', 'female', 'Outerwear', 'jacket', ['layering']),
  createQuery('gold women block heels under 1999', 'warm', 'female', 'Footwear', 'block heels', ['dressy']),
  createQuery('tan women flats under 1299', 'warm', 'female', 'Footwear', 'flats', ['casual', 'budget']),
  createQuery('brown women handbag under 1999', 'warm', 'female', 'Accessory', 'handbag', ['essential']),
  createQuery('gold women earrings under 999', 'warm', 'female', 'Accessory', 'earrings', ['dressy', 'budget']),
  createQuery('warm beige women blazer under 3499', 'warm', 'female', 'Outerwear', 'blazer', ['formal']),

  // Cool tone - men
  createQuery('navy men formal shirt under 1499', 'cool', 'male', 'Top', 'shirt', ['formal', 'budget']),
  createQuery('charcoal men tshirt under 999', 'cool', 'male', 'Top', 'tshirt', ['casual', 'budget']),
  createQuery('royal blue men kurta under 1799', 'cool', 'male', 'Ethnic Wear', 'kurta', ['ethnic']),
  createQuery('grey men formal trousers under 1699', 'cool', 'male', 'Bottom', 'trousers', ['formal']),
  createQuery('black men chinos under 1499', 'cool', 'male', 'Bottom', 'chinos', ['casual', 'budget']),
  createQuery('charcoal men bomber jacket under 3499', 'cool', 'male', 'Outerwear', 'jacket', ['streetwear']),
  createQuery('navy men blazer under 3999', 'cool', 'male', 'Outerwear', 'blazer', ['formal']),
  createQuery('black men sneakers under 1999', 'cool', 'male', 'Footwear', 'sneakers', ['casual']),
  createQuery('black men loafers under 2499', 'cool', 'male', 'Footwear', 'loafers', ['formal']),
  createQuery('silver men watch under 1999', 'cool', 'male', 'Accessory', 'watch', ['essential']),
  createQuery('black men belt under 999', 'cool', 'male', 'Accessory', 'belt', ['essential', 'budget']),
  createQuery('powder blue men overshirt under 1999', 'cool', 'male', 'Top', 'overshirt', ['smart-casual']),

  // Cool tone - women
  createQuery('navy women top under 1199', 'cool', 'female', 'Top', 'top', ['casual', 'budget']),
  createQuery('lavender women kurti under 1499', 'cool', 'female', 'Ethnic Wear', 'kurti', ['ethnic', 'budget']),
  createQuery('ice blue women co ord set under 2499', 'cool', 'female', 'Set', 'co-ord set', ['casual']),
  createQuery('grey women trousers under 1499', 'cool', 'female', 'Bottom', 'trousers', ['formal', 'budget']),
  createQuery('black women skirt under 1499', 'cool', 'female', 'Bottom', 'skirt', ['dressy']),
  createQuery('navy women dress under 2199', 'cool', 'female', 'Dress', 'dress', ['casual']),
  createQuery('grey women blazer under 3499', 'cool', 'female', 'Outerwear', 'blazer', ['formal']),
  createQuery('black women heels under 1999', 'cool', 'female', 'Footwear', 'heels', ['dressy']),
  createQuery('white women sneakers under 1999', 'cool', 'female', 'Footwear', 'sneakers', ['casual']),
  createQuery('silver women handbag under 1999', 'cool', 'female', 'Accessory', 'handbag', ['essential']),
  createQuery('silver women earrings under 999', 'cool', 'female', 'Accessory', 'earrings', ['dressy', 'budget']),
  createQuery('powder blue women cardigan under 2499', 'cool', 'female', 'Outerwear', 'cardigan', ['layering']),

  // Neutral tone - men
  createQuery('teal men shirt under 1499', 'neutral', 'male', 'Top', 'shirt', ['casual', 'budget']),
  createQuery('burgundy men tshirt under 999', 'neutral', 'male', 'Top', 'tshirt', ['casual', 'budget']),
  createQuery('sage green men kurta under 1799', 'neutral', 'male', 'Ethnic Wear', 'kurta', ['ethnic']),
  createQuery('forest green men trousers under 1699', 'neutral', 'male', 'Bottom', 'trousers', ['smart-casual']),
  createQuery('off white men chinos under 1499', 'neutral', 'male', 'Bottom', 'chinos', ['casual', 'budget']),
  createQuery('olive men jacket under 2999', 'neutral', 'male', 'Outerwear', 'jacket', ['layering']),
  createQuery('wine men blazer under 3999', 'neutral', 'male', 'Outerwear', 'blazer', ['formal']),
  createQuery('white men sneakers under 1999', 'neutral', 'male', 'Footwear', 'sneakers', ['casual']),
  createQuery('tan men boots under 2999', 'neutral', 'male', 'Footwear', 'boots', ['streetwear']),
  createQuery('brown men watch under 1999', 'neutral', 'male', 'Accessory', 'watch', ['essential']),
  createQuery('burgundy men belt under 999', 'neutral', 'male', 'Accessory', 'belt', ['essential', 'budget']),
  createQuery('dusty blue men polo under 1199', 'neutral', 'male', 'Top', 'polo', ['smart-casual', 'budget']),

  // Neutral tone - women
  createQuery('teal women blouse under 1199', 'neutral', 'female', 'Top', 'blouse', ['casual', 'budget']),
  createQuery('sage green women kurti under 1499', 'neutral', 'female', 'Ethnic Wear', 'kurti', ['ethnic', 'budget']),
  createQuery('burgundy women co ord set under 2499', 'neutral', 'female', 'Set', 'co-ord set', ['casual']),
  createQuery('off white women trousers under 1499', 'neutral', 'female', 'Bottom', 'trousers', ['smart-casual', 'budget']),
  createQuery('mauve women skirt under 1499', 'neutral', 'female', 'Bottom', 'skirt', ['dressy']),
  createQuery('teal women midi dress under 2199', 'neutral', 'female', 'Dress', 'midi dress', ['casual']),
  createQuery('forest green women blazer under 3499', 'neutral', 'female', 'Outerwear', 'blazer', ['formal']),
  createQuery('beige women sandals under 1499', 'neutral', 'female', 'Footwear', 'sandals', ['casual', 'budget']),
  createQuery('white women sneakers under 1999', 'neutral', 'female', 'Footwear', 'sneakers', ['casual']),
  createQuery('tan women handbag under 1999', 'neutral', 'female', 'Accessory', 'handbag', ['essential']),
  createQuery('rose gold women watch under 1999', 'neutral', 'female', 'Accessory', 'watch', ['essential']),
  createQuery('dusty rose women cardigan under 2499', 'neutral', 'female', 'Outerwear', 'cardigan', ['layering']),
];

function getCurrentSyncCycleId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getMonthlyBatchRanges(totalQueries = SHOPPING_QUERY_CATALOG.length) {
  const batchSize = Math.ceil(totalQueries / BATCHES_PER_MONTH);

  return Array.from({ length: BATCHES_PER_MONTH }, (_, index) => {
    const start = index * batchSize;
    const end = Math.min(totalQueries - 1, start + batchSize - 1);

    return {
      batchNumber: index + 1,
      start,
      end,
      isEmpty: start >= totalQueries || start > end,
    };
  });
}

function extractColor(...parts) {
  const text = parts.join(' ').toLowerCase();
  const colors = [
    'olive green', 'mustard', 'rust', 'terracotta', 'brown', 'camel', 'gold', 'golden',
    'burnt orange', 'tan', 'khaki', 'peach', 'navy', 'navy blue', 'royal blue', 'grey',
    'gray', 'purple', 'black', 'steel blue', 'cobalt blue', 'indigo', 'charcoal',
    'powder blue', 'lavender', 'pink', 'ice blue', 'lilac', 'dusty pink', 'mint green',
    'teal', 'burgundy', 'sage green', 'forest green', 'wine', 'wine red', 'dusty blue',
    'off white', 'white', 'plum', 'warm grey', 'mauve', 'dusty rose', 'beige', 'silver',
    'rose gold'
  ];

  return colors.find((color) => text.includes(color)) || 'multicolor';
}

function extractBrand(source = '', title = '') {
  const knownBrands = [
    'Snitch', 'Levi', 'Roadster', 'H&M', 'WROGN', 'Highlander', 'HERE&NOW',
    'Campus Sutra', 'Woodland', 'INVICTUS', 'Nobero', 'Dennis Lingo',
    'The Souled Store', 'The Indian Garage Co', 'Urbano', 'Allen Solly',
    'Peter England', 'Van Heusen', 'US Polo', 'Jack & Jones', 'Puma',
    'Nike', 'Adidas', 'Biba', 'Fabindia', 'Global Desi', 'AND', 'Aurelia',
    'Mango', 'Styli', 'AJIO', 'Myntra', 'Bewakoof', 'Louis Philippe'
  ];

  const text = `${source} ${title}`.toLowerCase();
  const matchedBrand = knownBrands.find((brand) => text.includes(brand.toLowerCase()));
  return matchedBrand || source.split('.')[0] || 'Unknown';
}

function detectPlatform(source = '') {
  const normalized = source.toLowerCase();

  if (normalized.includes('amazon')) return 'Amazon';
  if (normalized.includes('myntra')) return 'Myntra';
  if (normalized.includes('ajio')) return 'Ajio';
  if (normalized.includes('flipkart')) return 'Flipkart';
  if (normalized.includes('bewakoof')) return 'Bewakoof';
  if (normalized.includes('nykaa')) return 'Nykaa Fashion';
  return source || 'Other';
}

function normalizePrice(product) {
  const rawPrice = product.extracted_price ?? product.price ?? null;
  const numericPrice = Number(rawPrice);

  if (!Number.isFinite(numericPrice)) {
    return null;
  }

  return numericPrice;
}

async function upsertProductsForQueries(queries, options = {}) {
  const cycleId = options.cycleId || getCurrentSyncCycleId();
  const cleanupStale = Boolean(options.cleanupStale);
  const logLabel = options.logLabel || 'catalog sync';

  if (!queries.length) {
    if (cleanupStale) {
      const cleanup = await cleanupStaleProducts(cycleId);
      return { totalSaved: 0, searchesUsed: 0, deletedCount: cleanup.deletedCount };
    }

    console.log(`No queries to sync for ${logLabel}`);
    return { totalSaved: 0, searchesUsed: 0, deletedCount: 0 };
  }

  console.log(`Starting ${logLabel} for cycle ${cycleId} with ${queries.length} queries`);

  let totalSaved = 0;
  let searchesUsed = 0;
  let failedQueries = 0;

  for (const query of queries) {
    try {
      console.log(`[${++searchesUsed}/${queries.length}] Searching: ${query.search}`);

      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_shopping',
          q: query.search,
          gl: 'in',
          hl: 'en',
          num: RESULTS_PER_QUERY,
          api_key: process.env.SERPAPI_KEY,
        },
      });

      const results = response.data?.shopping_results || [];

      if (!results.length) {
        console.log(`No results for query: ${query.search}`);
        continue;
      }

      for (const product of results) {
        try {
          if (!product.thumbnail) continue;

          const numericPrice = normalizePrice(product);
          if (!numericPrice || numericPrice < MIN_PRODUCT_PRICE) continue;

          const externalId = `serp_${product.product_id ||
            Buffer.from(query.search + (product.title || '')).toString('base64').slice(0, 40)}`;

          await Outfit.findOneAndUpdate(
            { externalId },
            {
              externalId,
              name: product.title,
              brand: extractBrand(product.source || '', product.title || ''),
              price: numericPrice.toString(),
              originalPrice: (product.extracted_old_price || numericPrice).toString(),
              image: product.thumbnail,
              link: product.product_link,
              source: detectPlatform(product.source || ''),
              color: extractColor(query.search, product.title || ''),
              gender: query.gender,
              recommendedSkinTones: [query.tone],
              category: query.category,
              productType: query.productType,
              styleTags: query.styleTags,
              rating: product.rating || null,
              reviews: product.reviews || 0,
              delivery: product.delivery || null,
              lastUpdated: new Date(),
              lastSyncedAt: new Date(),
              syncCycleId: cycleId,
            },
            { upsert: true, new: true }
          );

          totalSaved++;
        } catch (productErr) {
          console.error(`Skipped product for "${query.search}": ${productErr.message}`);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
    } catch (err) {
      failedQueries++;
      console.error(`Failed query "${query.search}":`, {
        status: err.response?.status,
        message: err.response?.data?.error || err.message,
      });
    }
  }

  let deletedCount = 0;

  if (cleanupStale && failedQueries === 0) {
    const cleanup = await cleanupStaleProducts(cycleId);
    deletedCount = cleanup.deletedCount;
  }

  if (cleanupStale && failedQueries > 0) {
    console.log(`Skipped stale cleanup for cycle ${cycleId} because ${failedQueries} queries failed`);
  }

  console.log(
    `Completed ${logLabel}. Searches used: ${searchesUsed} | Products saved: ${totalSaved} | Failed queries: ${failedQueries} | Deleted stale: ${deletedCount}`
  );

  return { totalSaved, searchesUsed, deletedCount };
}

async function cleanupStaleProducts(cycleId) {
  const result = await Outfit.deleteMany({
    syncCycleId: { $ne: cycleId },
  });

  console.log(`Deleted ${result.deletedCount} stale products after cycle ${cycleId}`);
  return result;
}

async function fetchAndStoreProducts(options = {}) {
  const requestedStartIndex = Number.isInteger(options.startIndex) ? options.startIndex : 0;
  const safeStartIndex = Math.max(0, requestedStartIndex);
  const requestedQueryCount = Number.isInteger(options.maxQueries)
    ? options.maxQueries
    : SHOPPING_QUERY_CATALOG.length;

  const queryCount = options.manual
    ? Math.min(Math.max(requestedQueryCount, 1), MANUAL_MAX_QUERIES)
    : Math.max(requestedQueryCount, 1);

  const queries = SHOPPING_QUERY_CATALOG.slice(safeStartIndex, safeStartIndex + queryCount);

  const result = await upsertProductsForQueries(queries, {
    cycleId: options.cycleId,
    cleanupStale: options.cleanupStale ?? true,
    logLabel: options.logLabel || 'full catalog sync',
  });

  return {
    ...result,
    queriesRequested: queries.length,
    startIndex: safeStartIndex,
  };
}

async function syncBatch(fromIndex, toIndex, options = {}) {
  const queries = SHOPPING_QUERY_CATALOG.slice(fromIndex, toIndex + 1);
  const result = await upsertProductsForQueries(queries, {
    cycleId: options.cycleId,
    cleanupStale: options.cleanupStale ?? false,
    logLabel: options.logLabel || `batch sync ${fromIndex}-${toIndex}`,
  });

  return result.totalSaved;
}

module.exports = {
  fetchAndStoreProducts,
  syncBatch,
  getCurrentSyncCycleId,
  getMonthlyBatchRanges,
  SHOPPING_QUERY_CATALOG,
  MANUAL_MAX_QUERIES,
};

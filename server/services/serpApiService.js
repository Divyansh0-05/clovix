const axios = require('axios');
const Outfit = require('../models/Outfit');

const skinToneQueries = {
  warm: [
    'olive green shirt men', 'mustard tshirt men', 'rust casual shirt men',
    'terracotta shirt men', 'brown casual shirt men', 'camel polo tshirt men',
    'golden yellow shirt men', 'burnt orange shirt men', 'tan linen shirt men',
    'khaki shirt men', 'camel trousers men', 'brown chinos men',
    'khaki pants men', 'olive green trousers men', 'terracotta kurta men',
    'mustard kurta men', 'rust nehru jacket men', 'olive green top women',
    'mustard kurta women', 'rust blouse women', 'terracotta top women',
    'peach kurti women', 'golden yellow kurta women', 'burnt orange top women',
    'camel blouse women', 'warm beige top women', 'olive green dress women',
    'mustard co ord set women', 'rust ethnic wear women', 'terracotta saree women',
    'peach dress women', 'camel jacket women', 'brown blazer men',
    'olive green jacket men'
  ],
  cool: [
    'navy blue shirt men', 'royal blue tshirt men', 'grey formal shirt men',
    'purple casual shirt men', 'black shirt men', 'steel blue shirt men',
    'cobalt blue shirt men', 'indigo shirt men', 'charcoal tshirt men',
    'powder blue shirt men', 'grey formal trousers men', 'navy blue trousers men',
    'black chinos men', 'charcoal trousers men', 'navy blue kurta men',
    'royal blue sherwani men', 'black bandhgala men', 'navy blue top women',
    'lavender kurta women', 'pink blouse women', 'grey top women',
    'ice blue kurti women', 'steel blue top women', 'cobalt blue top women',
    'lilac top women', 'dusty pink kurti women', 'navy blue dress women',
    'lavender co ord set women', 'pink co ord set women', 'mint green dress women',
    'ice blue dress women', 'cobalt blue lehenga women', 'navy blue blazer women',
    'grey jacket men', 'black jacket men'
  ],
  neutral: [
    'teal shirt men', 'burgundy tshirt men', 'sage green shirt men',
    'forest green shirt men', 'wine red shirt men', 'dusty blue shirt men',
    'off white shirt men', 'plum shirt men', 'warm grey shirt men',
    'burgundy trousers men', 'forest green pants men', 'teal trousers men',
    'wine red chinos men', 'teal kurta men', 'burgundy pathani men',
    'forest green sherwani men', 'sage green kurta men', 'teal top women',
    'burgundy kurti women', 'sage green blouse women', 'mauve top women',
    'forest green kurti women', 'wine red blouse women', 'off white kurti women',
    'plum blouse women', 'dusty rose blouse women', 'teal dress women',
    'burgundy co ord set women', 'sage green dress women', 'forest green lehenga women',
    'wine red dress women', 'mauve saree women', 'burgundy jacket women',
    'forest green jacket men', 'teal blazer women'
  ]
};

// Build reverse lookup: query → skin tone
const queryToTone = {};
for (const [tone, queries] of Object.entries(skinToneQueries)) {
  for (const q of queries) {
    queryToTone[q] = tone;
  }
}

function detectGender(title = '', query = '') {
  const text = `${title} ${query}`.toLowerCase();
  if (text.includes('women') || text.includes('female') || text.includes('girl') ||
      text.includes('ladies') || text.includes('saree') || text.includes('kurti') ||
      text.includes('blouse') || text.includes('lehenga')) return 'female';
  if (text.includes(' men') || text.includes("men's") || text.includes('male') ||
      text.includes('sherwani') || text.includes('pathani') || text.includes('bandhgala'))
    return 'male';
  return 'unisex';
}

function extractColor(query = '') {
  const colors = [
    'olive green', 'mustard', 'rust', 'terracotta', 'brown', 'camel', 'golden yellow',
    'burnt orange', 'tan', 'khaki', 'peach', 'navy blue', 'royal blue', 'grey',
    'purple', 'black', 'steel blue', 'cobalt blue', 'indigo', 'charcoal',
    'powder blue', 'lavender', 'pink', 'ice blue', 'lilac', 'dusty pink',
    'mint green', 'teal', 'burgundy', 'sage green', 'forest green', 'wine red',
    'dusty blue', 'off white', 'plum', 'warm grey', 'mauve', 'dusty rose', 'white'
  ];
  return colors.find(c => query.includes(c)) || 'multicolor';
}

function detectCategory(title = '', query = '') {
  const text = `${title} ${query}`.toLowerCase();
  if (text.includes('saree') || text.includes('lehenga')) return 'Ethnic Wear';
  if (text.includes('kurta') || text.includes('kurti') || text.includes('pathani') ||
      text.includes('sherwani') || text.includes('bandhgala') || text.includes('nehru'))
    return 'Ethnic Wear';
  if (text.includes('dress') || text.includes('co ord') || text.includes('coord'))
    return 'Dress';
  if (text.includes('jacket') || text.includes('blazer') || text.includes('coat') ||
      text.includes('hoodie') || text.includes('sweater')) return 'Outerwear';
  if (text.includes('trouser') || text.includes('pant') || text.includes('chino') ||
      text.includes('jeans') || text.includes('skirt') || text.includes('legging'))
    return 'Bottom';
  return 'Top';
}

function extractBrand(source = '', title = '') {
  // Source field from SerpApi is already the brand/platform name
  const knownBrands = [
    'Snitch', 'Levi', 'Roadster', 'H&M', 'WROGN', 'Highlander', 'HERE&NOW',
    'Campus Sutra', 'Woodland', 'INVICTUS', 'Nobero', 'Dennis Lingo',
    'The Souled Store', 'The Indian Garage Co', 'Urbano', 'Allen Solly',
    'Peter England', 'Van Heusen', 'US Polo', 'Jack & Jones', 'Puma',
    'Nike', 'Adidas', 'Biba', 'W ', 'Fabindia', 'Global Desi', 'AND',
    'Aurelia', 'Mango', 'Styli', 'AJIO', 'Myntra'
  ];
  const text = `${source} ${title}`;
  return knownBrands.find(b => text.includes(b)) || source.split('.')[0] || 'Unknown';
}

function detectPlatform(source = '') {
  const s = source.toLowerCase();
  if (s.includes('amazon')) return 'Amazon';
  if (s.includes('myntra')) return 'Myntra';
  if (s.includes('ajio')) return 'Ajio';
  if (s.includes('flipkart')) return 'Flipkart';
  if (s.includes('nykaa')) return 'Nykaa Fashion';
  if (s.includes('snitch')) return 'Snitch';
  if (s.includes('levi')) return 'Levi\'s';
  return source || 'Other';
}

async function fetchAndStoreProducts() {
  console.log('🔄 Starting SerpApi product sync...');
  let totalSaved = 0;
  let searchesUsed = 0;

  // Flatten all queries
  const allQueries = Object.values(skinToneQueries).flat();

  for (const query of allQueries) {
    try {
      console.log(`🔍 [${++searchesUsed}/${allQueries.length}] Searching: ${query}`);

      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_shopping',
          q: query,
          gl: 'in',          // India
          hl: 'en',
          num: 10,           // 10 results per query
          api_key: process.env.SERPAPI_KEY
        }
      });

      const results = response.data?.shopping_results || [];

      if (results.length === 0) {
        console.log(`⚠️  No results for: ${query}`);
        continue;
      }

      const skinTone = queryToTone[query] || 'neutral';
      const color = extractColor(query);
      const gender = detectGender('', query);
      const category = detectCategory('', query);

      for (const product of results) {
        try {
          // Skip products without image or price
          if (!product.thumbnail) continue;
          if (!product.extracted_price) continue;

          const externalId = `serp_${product.product_id || 
            Buffer.from(query + product.title).toString('base64').slice(0, 40)}`;

          const brand = extractBrand(product.source || '', product.title || '');
          const platform = detectPlatform(product.source || '');

          await Outfit.findOneAndUpdate(
            { externalId },
            {
              externalId,
              name: product.title,
              brand,
              price: product.extracted_price,
              originalPrice: product.extracted_old_price || product.extracted_price,
              image: product.thumbnail,
              link: product.product_link,  // Google Shopping link
              source: platform,
              color,
              gender,
              recommendedSkinTones: [skinTone],
              category,
              rating: product.rating || null,
              reviews: product.reviews || 0,
              delivery: product.delivery || null,
              lastUpdated: new Date()
            },
            { upsert: true, new: true }
          );

          totalSaved++;
        } catch (productErr) {
          console.error(`  ⚠️ Skipped one product:`, productErr.message);
          continue;
        }
      }

      // 1 second delay between requests to be safe
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`❌ Failed query "${query}":`, {
        status: err.response?.status,
        message: err.response?.data?.error || err.message
      });
      continue;
    }
  }

  console.log(`✅ Sync done. Searches used: ${searchesUsed} | Products stored: ${totalSaved}`);
  return totalSaved;
}

async function syncBatch(fromIndex, toIndex) {
  const allQueries = Object.values(skinToneQueries).flat();
  const batch = allQueries.slice(fromIndex, toIndex + 1);
  console.log(`🔄 Syncing batch: queries ${fromIndex}–${toIndex} (${batch.length} queries)`);
  
  let totalSaved = 0;
  let searchesUsed = 0;

  for (const query of batch) {
    try {
      console.log(`🔍 [${++searchesUsed}/${batch.length}] ${query}`);
      
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google_shopping',
          q: query,
          gl: 'in',
          hl: 'en',
          num: 10,
          api_key: process.env.SERPAPI_KEY
        }
      });

      const results = response.data?.shopping_results || [];
      const skinTone = queryToTone[query] || 'neutral';
      const color = extractColor(query);
      const gender = detectGender('', query);
      const category = detectCategory('', query);

      for (const product of results) {
        if (!product.thumbnail || !product.extracted_price) continue;

        const externalId = `serp_${product.product_id || 
          Buffer.from(query + product.title).toString('base64').slice(0, 40)}`;

        await Outfit.findOneAndUpdate(
          { externalId },
          {
            externalId,
            name: product.title,
            brand: extractBrand(product.source || '', product.title || ''),
            price: product.extracted_price,
            originalPrice: product.extracted_old_price || product.extracted_price,
            image: product.thumbnail,
            link: product.product_link,
            source: detectPlatform(product.source || ''),
            color, gender,
            recommendedSkinTones: [skinTone],
            category,
            rating: product.rating || null,
            reviews: product.reviews || 0,
            delivery: product.delivery || null,
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );
        totalSaved++;
      }
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Failed: "${query}"`, err.message);
      continue;
    }
  }

  console.log(`✅ Batch done. Searches: ${searchesUsed} | Saved: ${totalSaved}`);
  return totalSaved;
}

module.exports = { fetchAndStoreProducts, syncBatch };

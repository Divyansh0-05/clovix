/**
 * Seed script to populate MongoDB with outfit data.
 * 
 * Usage: node seed/seedOutfits.js
 * 
 * This reads the static outfits from a JSON file and inserts them into MongoDB.
 * Run `node seed/exportOutfits.js` first to generate the JSON from the frontend.
 * Or run this script directly — it contains a representative sample of outfits.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Outfit = require('../models/Outfit');

const sampleOutfits = [
  // === AMAZON - WARM ===
  { name: "Bellstone Men's Cotton Blend Regular Fit Shirt", description: "A stylish shirt for men", price: "₹378", imageUrl: "https://m.media-amazon.com/images/I/6191fQZv3GL._SY550_.jpg", affiliateLink: "https://amzn.to/3G0TXZE", recommendedSkinTones: ["warm"], source: "amazon", gender: "male", category: "clothing" },
  { name: "MAHIRA'S Comfort Short Kurti for Women", description: "Black Kurti", price: "₹378", imageUrl: "https://m.media-amazon.com/images/I/417aCFXarKL.jpg", affiliateLink: "https://amzn.to/43MCpuf", recommendedSkinTones: ["neutral"], source: "amazon", gender: "female", category: "clothing" },
  { name: "Men Polo Polyester Blend Half Sleeve T-Shirt", description: "A stylish shirt for men", price: "₹269", imageUrl: "https://m.media-amazon.com/images/I/717v0WWKUHL._SY550_.jpg", affiliateLink: "https://amzn.to/426DDiJ", recommendedSkinTones: ["warm"], source: "amazon", gender: "male", category: "clothing" },
  { name: "AVANOVA Women's Solid Knitted T-Shirts", description: "A trendy tshirt for women", price: "₹349", imageUrl: "https://m.media-amazon.com/images/I/61HrW8ZFuhL._SY550_.jpg", affiliateLink: "https://amzn.to/42oQ8VT", recommendedSkinTones: ["warm"], source: "amazon", gender: "female", category: "clothing" },
  { name: "WEBRIC Shirt for Men | Mens Casual Shirt", description: "A stylish shirt for men", price: "₹399", imageUrl: "https://m.media-amazon.com/images/I/71s7esDi6NL._SY550_.jpg", affiliateLink: "https://amzn.to/425Fa8O", recommendedSkinTones: ["warm"], source: "amazon", gender: "male", category: "clothing" },

  // === AMAZON - COOL ===
  { name: "Louis Philippe Men's Solid Slim Fit Shirt", description: "A shirt for men", price: "₹1,322", imageUrl: "https://m.media-amazon.com/images/I/61CKPI8x4eL._SY550_.jpg", affiliateLink: "https://amzn.to/3XUNshd", recommendedSkinTones: ["cool"], source: "amazon", gender: "male", category: "clothing" },
  { name: "Bowrain Satin Silk Fabric Spread Collar Full Sleeve Top", description: "A satin shirt for women", price: "₹444", imageUrl: "https://m.media-amazon.com/images/I/71MzHF-r9yL._SX425_.jpg", affiliateLink: "https://amzn.to/4iu0NER", recommendedSkinTones: ["cool"], source: "amazon", gender: "female", category: "clothing" },
  { name: "Leriya Fashion Textured Shirts for Men", description: "A shirt for men", price: "₹429", imageUrl: "https://m.media-amazon.com/images/I/61hmjIQ3tqL._SY679_.jpg", affiliateLink: "https://amzn.to/3YmFRbq", recommendedSkinTones: ["cool"], source: "amazon", gender: "male", category: "clothing" },
  { name: "Women's Sweet Heart Neck Puff/Balloon Bishop Sleeve", description: "A shirt for women", price: "₹199", imageUrl: "https://m.media-amazon.com/images/I/61jc77u+mQL._SY550_.jpg", affiliateLink: "https://amzn.to/3G6lzwM", recommendedSkinTones: ["cool"], source: "amazon", gender: "female", category: "clothing" },

  // === AMAZON - NEUTRAL ===
  { name: "Aahwan Women's Square Neck Slim Fit Tank Tops", description: "A tank top for women", price: "₹289", imageUrl: "https://m.media-amazon.com/images/I/61+M3jbMj0L._SY550_.jpg", affiliateLink: "https://amzn.to/44jnUhG", recommendedSkinTones: ["neutral"], source: "amazon", gender: "female", category: "clothing" },
  { name: "XYXX Men's Nova 100% Combed Cotton Polo", description: "A tshirt for men", price: "₹589", imageUrl: "https://m.media-amazon.com/images/I/61CRA1kEDIL._SY550_.jpg", affiliateLink: "https://amzn.to/4jl1y3M", recommendedSkinTones: ["neutral"], source: "amazon", gender: "male", category: "clothing" },
  { name: "Campus Sutra Men's Relaxed Fit Shirt", description: "A shirt for men", price: "₹797", imageUrl: "https://m.media-amazon.com/images/I/51b-I67RSmL._SX522_.jpg", affiliateLink: "https://amzn.to/4j4Rbl1", recommendedSkinTones: ["neutral"], source: "amazon", gender: "male", category: "clothing" },

  // === FLIPKART - WARM ===
  { name: "Men Collar Casual Shirt", description: "A cool shirt for men", price: "₹260", imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/j/b/s/m-fm-orange-frank-man-original-imahb9ambvr8vjqc.jpeg?q=70&crop=false", affiliateLink: "https://clnk.in/woHn", recommendedSkinTones: ["warm"], source: "flipkart", gender: "male", category: "clothing" },
  { name: "Casual Regular Sleeves Solid Women Orange Top", description: "A fashionable top for women", price: "₹382", imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/n/6/p/s-square-neck-full-sleeve-ribbed-top-redamancii-original-imagxrp276nyzhrw.jpeg?q=70&crop=false", affiliateLink: "https://clnk.in/woJU", recommendedSkinTones: ["warm"], source: "flipkart", gender: "female", category: "clothing" },
  { name: "Men Solid Polo Neck Orange T-Shirt", description: "A fashionable t-shirt for men", price: "₹348", imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/v/6/r/l-pocket-orange-l-black-blink-original-imahfxnzqaxqmfhm.jpeg?q=70&crop=false", affiliateLink: "https://clnk.in/woKd", recommendedSkinTones: ["warm"], source: "flipkart", gender: "male", category: "clothing" },

  // === FLIPKART - COOL ===
  { name: "Casual Sleeveless Self Design Women White Top", description: "A casual top for women", price: "₹351", imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/t/w/1/l-2353-nuevosdamas-original-imagqmuf9e8skdyx.jpeg?q=70&crop=false", affiliateLink: "https://clnk.in/woLx", recommendedSkinTones: ["cool"], source: "flipkart", gender: "female", category: "clothing" },
  { name: "Men Slim Fit Solid Spread Collar Casual Shirt", description: "A casual shirt for men", price: "₹499", imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/o/z/v/4xl-c301-white-dennis-lingo-original-imah4aav5rfdznra.jpeg?q=70&crop=false", affiliateLink: "https://clnk.in/woLz", recommendedSkinTones: ["cool"], source: "flipkart", gender: "male", category: "clothing" },

  // === MYNTRA - WARM ===
  { name: "Women Solid Teal Body con Dress", description: "A body con dress for women", price: "₹479", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/21714776/2023/2/16/71f7e2eb-a56f-4ec2-afb9-dcf2b73c5dfe1676541497043-Lavish-Alice-Women-Dresses-1381676541496576-1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fdresses%2Flavish-alice%2Flavish-alice-teal-blue-bodycon-dress%2F21714776%2Fbuy", recommendedSkinTones: ["warm"], source: "myntra", gender: "female", category: "clothing" },
  { name: "Men Graphic Printed T-shirt", description: "A graphic tshirt for men", price: "₹449", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25697122/2023/10/17/f71d3e4f-b04b-4c3b-943b-7a0f6abb34221697560629398-The-Souled-Store-Men-Tshirts-4611697560628921-1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fthe-souled-store%2Fthe-souled-store-men-brown-graphic-printed-t-shirt%2F25697122%2Fbuy", recommendedSkinTones: ["warm"], source: "myntra", gender: "male", category: "clothing" },

  // === MYNTRA - COOL ===
  { name: "Men Printed Bomber Jacket", description: "A bomber jacket for men", price: "₹1,049", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/28174802/2024/3/8/9e27e3e6-7c73-4bb8-b710-bbb5e5c4b7551709887684556-VROJASS-Men-Jackets-2501709887684056-1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fjackets%2Fvrojass%2Fvrojass-geometric-printed-bomber-jacket%2F28174802%2Fbuy", recommendedSkinTones: ["cool"], source: "myntra", gender: "male", category: "clothing" },
  { name: "Women Solid Off-White Top", description: "An off-white top for women", price: "₹296", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/18834878/2022/6/27/c3f114fe-38d2-4a36-b34d-b6e2bfaa22031656323979541DressBerryWomenTopswithCrochetDetail1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fdressberry%2Fdressberry-solid-regular-top%2F18834878%2Fbuy", recommendedSkinTones: ["cool"], source: "myntra", gender: "female", category: "clothing" },

  // === AJIO/BEWAKOOF - WARM ===
  { name: "Men's Printed Cotton Relaxed Fit T-shirt", description: "A printed t-shirt for men", price: "₹599", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29247724/2024/5/18/9e1e54c5-d55f-4eee-9b39-59c62fca42b11716009993862BewakoofMenTypographicPrintedRoundNeckPureCotonT-shirt1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-men-typographic-printed-round-neck-pure-cotton-t-shirt%2F29247724%2Fbuy", recommendedSkinTones: ["warm"], source: "ajio", gender: "male", category: "clothing" },

  // === AJIO/BEWAKOOF - COOL ===
  { name: "Round Neck Cotton Oversized T-shirt", description: "Men Typography Printed Round Neck Cotton Oversized T-shirt", price: "₹2249", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JANUARY/28/emTPQwMQ_ba4f62c5805c401595c67a3afc86ee7b.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-men-typography-printed-round-neck-cotton-oversized-t-shirt%2F32532603%2Fbuy", recommendedSkinTones: ["cool"], source: "ajio", gender: "male", category: "clothing" },

  // === AJIO/BEWAKOOF - NEUTRAL ===
  { name: "Oversized Cotton T-shirt", description: "Printed Drop-Shoulder Sleeves Oversized Cotton T-shirt", price: "₹599", imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/20450280/2024/12/24/7e947a01-74bb-42ae-ae28-0aded22b5c761735036280324-Bewakoof-Women-White-Printed-Drop-Shoulder-Sleeves-Oversized-1.jpg", affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-women-white-printed-drop-shoulder-sleeves-oversized-cotton-t-shirt%2F20450280%2Fbuy", recommendedSkinTones: ["neutral"], source: "ajio", gender: "female", category: "clothing" },
];

async function seedOutfits() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing outfits
    await Outfit.deleteMany({});
    console.log('Cleared existing outfits');

    // Insert sample outfits
    const inserted = await Outfit.insertMany(sampleOutfits);
    console.log(`✅ Seeded ${inserted.length} outfits successfully`);

    // Log counts by source
    const sources = ['amazon', 'flipkart', 'myntra', 'ajio'];
    for (const source of sources) {
      const count = inserted.filter(o => o.source === source).length;
      console.log(`  ${source}: ${count} outfits`);
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedOutfits();

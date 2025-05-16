import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Outfit } from './outfit';

interface ShopProps {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  detectedSkinTone?: { color: string; type: string } | null | undefined;
  wishlist: Outfit[];
  toggleWishlist: (outfit: Outfit) => void;
}

export default function Shop({ isLoggedIn, userId, token, detectedSkinTone, wishlist, toggleWishlist }: ShopProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [amazonOutfits, setAmazonOutfits] = useState<Outfit[]>([]);
  const [flipkartOutfits, setFlipkartOutfits] = useState<Outfit[]>([]);
  const [myntraOutfits, setMyntraOutfits] = useState<Outfit[]>([]);
  const [ajioOutfits, setAjioOutfits] = useState<Outfit[]>([]);
  const [visibleAllOutfits, setVisibleAllOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showWishlistPopup, setShowWishlistPopup] = useState(false);
  const [allItemsToShow, setAllItemsToShow] = useState(8);
  const [amazonOffset, setAmazonOffset] = useState(0);
  const [flipkartOffset, setFlipkartOffset] = useState(0);
  const [myntraOffset, setMyntraOffset] = useState(0);
  const [ajioOffset, setAjioOffset] = useState(0);
  const [priceSort, setPriceSort] = useState<string>('');

  const amazonScrollRef = useRef<HTMLDivElement>(null);
  const flipkartScrollRef = useRef<HTMLDivElement>(null);
  const myntraScrollRef = useRef<HTMLDivElement>(null);
  const ajioScrollRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 4;
  const ITEM_WIDTH = 320 + 32;
  const MOBILE_ITEM_WIDTH = 240 + 16; // Increased mobile card width

  const staticOutfits: Outfit[] = [
    {
      _id: "a1",
      name: "Bellstone Men's Cotton Blend Regular Fit Shirt ",
      description: "A stylish shirt for men",
      price: "₹379",
      imageUrl: " https://m.media-amazon.com/images/I/6191fQZv3GL._SY550_.jpg",
      affiliateLink: "https://amzn.to/3G0TXZE",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a2",
      name: "MAHIRA'S Comfort Short Kurti for Women",
      description: "Black Kurti",
      price: "₹367",
      imageUrl: "https://m.media-amazon.com/images/I/417aCFXarKL.jpg",
      affiliateLink: "https://amzn.to/43MCpuf",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a3",
      name: "Men Polo Polyester Blend Half Sleeve T-Shirt",
      description: "A stylish shirt for men",
      price: "₹269",
      imageUrl: "https://m.media-amazon.com/images/I/717v0WWKUHL._SY550_.jpg",
      affiliateLink: "https://amzn.to/426DDiJ",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a4",
      name: "AVANOVA Women's Solid Knitted T-Shirts",
      description: "A trendy tshirt for women",
      price: "₹339",
      imageUrl: "https://m.media-amazon.com/images/I/61HrW8ZFuhL._SY550_.jpg",
      affiliateLink: "https://amzn.to/42oQ8VT",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a5",
      name: "Sugathari Women's & Girl's Black Short Sleeve Top",
      description: "A trendy top for women",
      price: "₹339",
      imageUrl: "https://m.media-amazon.com/images/I/61EgdSKaj9L._SY550_.jpg",
      affiliateLink: "https://amzn.to/4j1cymZ",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a6",
      name: "RATAN Art Silk Gold Printed Straight Kurta for Women",
      description: "A trendy kurti for women",
      price: "₹549",
      imageUrl: "https://m.media-amazon.com/images/I/61FlHlUGk7L._SY550_.jpg",
      affiliateLink: "https://amzn.to/4cs8FF9",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a7",
      name: "WEBRIC Shirt for Men | Mens Casual Shirt",
      description: "A stylish shirt for men",
      price: "₹399",
      imageUrl: "https://m.media-amazon.com/images/I/71s7esDi6NL._SY550_.jpg",
      affiliateLink: "https://amzn.to/425Fa8O",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a9",
      name: "CB-COLEBROOK Men's Casual Button Down Shirts",
      description: "A stylish shirt for men",
      price: "₹499",
      imageUrl: " https://m.media-amazon.com/images/I/51STJxwM9KL._SY500_.jpg",
      affiliateLink: "https://amzn.to/4icmYPI",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a10",
      name: "Ben Martin Men Jeans | Wide Leg Jeans for Men",
      description: "A stylish jeans for men",
      price: "₹749",
      imageUrl: " https://m.media-amazon.com/images/I/71Y04yfGcaL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4j7bJcy",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a11",
      name: "TAGDO Men's Solid Shirt with Chest Pocket",
      description: "A stylish shirt for men",
      price: "₹359",
      imageUrl: " https://m.media-amazon.com/images/I/61VXGjDfcHL._SY550_.jpg",
      affiliateLink: "https://amzn.to/3EilfKy",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a12",
      name: "Thomas Scott Men’s Premium Slim Fit Oversized",
      description: "A stylish shirt for men",
      price: "₹549",
      imageUrl: " https://m.media-amazon.com/images/I/71iqrSRO2uL._SY550_.jpg",
      affiliateLink: "https://amzn.to/3Retk66",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a13",
      name: "HIGH BUY Women's Wide Leg Jeans, Loose Fit Jeans",
      description: "wide leg jeans for women",
      price: "₹999",
      imageUrl: "https://m.media-amazon.com/images/I/61yznV31iOL._SY741_.jpg",
      affiliateLink: "https://amzn.to/4lmdUKR",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a14",
      name: "Neostreak Men's Loose Baggy Fit",
      description: "A stylish jeans for men",
      price: "₹979",
      imageUrl: " https://m.media-amazon.com/images/I/61q8EC4xaNL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4ievRYJ",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a16",
      name: "AKHILAM Women's Pure Chiffon Embellished Saree",
      description: "A chiffon saree for women",
      price: "₹2,399",
      imageUrl: " https://m.media-amazon.com/images/I/71ornyBtqML._SY550_.jpg",
      affiliateLink: "https://amzn.to/4lnc8Jc",
      recommendedSkinTones: ["warm"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a17",
      name: "Louis Philippe Men's Solid Slim Fit Shirt",
      description: "A shirt for men",
      price: "₹1,322",
      imageUrl: "https://m.media-amazon.com/images/I/61CKPI8x4eL._SY550_.jpg",
      affiliateLink: "https://amzn.to/3XUNshd",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a18",
      name: "Bowrain Satin Silk Fabric Spread Collar Full Sleeve Top",
      description: "A satin shirt for women",
      price: "₹444",
      imageUrl: "https://m.media-amazon.com/images/I/71MzHF-r9yL._SX425_.jpg",
      affiliateLink: "https://amzn.to/4iu0NER",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a20",
      name: "rosery paris Women One Piece Puff Sleeve",
      description: "A stylish dress for women",
      price: "₹699",
      imageUrl: "https://m.media-amazon.com/images/I/61Ibo4WuZzL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4j2QOXQ",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a22",
      name: "Leriya Fashion Textured Shirts for Men",
      description: "A shirt for men",
      price: "₹499",
      imageUrl: "https://m.media-amazon.com/images/I/61hmjIQ3tqL._SY679_.jpg",
      affiliateLink: "https://amzn.to/3YmFRbq",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a23",
      name: "Pinkmint Casual Shirt for Men Stylish Men's Shirt",
      description: "A shirt for men",
      price: "₹399",
      imageUrl: "https://m.media-amazon.com/images/I/31NfkV9hKXL.jpg",
      affiliateLink: "https://amzn.to/4lrTvnE",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a24",
      name: "Women's Sweet Heart Neck Puff/Balloon Bishop Sleeve",
      description: "A shirt for women",
      price: "₹210",
      imageUrl: "https://m.media-amazon.com/images/I/61jc77u+mQL._SY550_.jpg",
      affiliateLink: "https://amzn.to/3G6lzwM",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a25",
      name: "Lymio Men's Loose Jeans | Men's Jeans Pants",
      description: "A jeans for men",
      price: "₹749",
      imageUrl: "https://m.media-amazon.com/images/I/71QwN7BmaDL._SY550_.jpg",
      affiliateLink: "https://amzn.to/42DmgGl",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a26",
      name: "Men's Premium Polycotton Causal Baggy Fit Jogger",
      description: "A jogger for men",
      price: "₹449",
      imageUrl: "https://m.media-amazon.com/images/I/41+aMG0TXxL._SY500_.jpg",
      affiliateLink: "https://amzn.to/4j2Rxbw",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a27",
      name: "Glossia Fashion High Waist Cargo Denim Jeans",
      description: "A straight fit jeans for women",
      price: "₹999",
      imageUrl: "https://m.media-amazon.com/images/I/61xK+WFCj7L._SY550_.jpg",
      affiliateLink: "https://amzn.to/4iu2fah",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a28",
      name: "Fashion Dream Printed Regular Fit Casual",
      description: "A casual top for women",
      price: "₹380",
      imageUrl: "https://m.media-amazon.com/images/I/81duwQU95RL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4jqPWMu",
      recommendedSkinTones: ["cool"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a29",
      name: "Aahwan Women's Square Neck Slim Fit Tank Tops",
      description: "A tank top for women",
      price: "₹289",
      imageUrl: "https://m.media-amazon.com/images/I/61+M3jbMj0L._SY550_.jpg",
      affiliateLink: "https://amzn.to/44jnUhG",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a30",
      name: "XYXX Men's Nova 100% Combed Cotton Polo",
      description: "A tshirt for men",
      price: "₹549",
      imageUrl: "https://m.media-amazon.com/images/I/61CRA1kEDIL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4jl1y3M",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a31",
      name: "Campus Sutra Men's Relaxed Fit Shirt",
      description: "A shirt for men",
      price: "₹797",
      imageUrl: "https://m.media-amazon.com/images/I/51b-I67RSmL._SX522_.jpg",
      affiliateLink: "https://amzn.to/4j4Rbl1",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a32",
      name: "Pistaa's Women Cotton Flex Kurta with Palazzo Set",
      description: "A palazoo set for women",
      price: "₹999",
      imageUrl: "https://m.media-amazon.com/images/I/71cp0fAKVCL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4co7vKO",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a33",
      name: "Women Straight Fit  Solid Trousers",
      description: "A fit trouser for women",
      price: "₹300",
      imageUrl: "https://m.media-amazon.com/images/I/51jXgsSM6SL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4ieB82t",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a34",
      name: "Long Kurta-Timeless Elegance for Festivals",
      description: "A stylish kurta for men",
      price: "₹1,343",
      imageUrl: "https://m.media-amazon.com/images/I/61G5ISzI0PL._SY550_.jpg",
      affiliateLink: "https://amzn.to/42DnW2B",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "a35",
      name: "AUMBE Sequence Fashion Tops for Woman",
      description: "A stylish top for women",
      price: "₹399",
      imageUrl: "https://m.media-amazon.com/images/I/41SlVnASGKL._SY500_.jpg",
      affiliateLink: "https://amzn.to/3R9Heq3",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "a37",
      name: "Jompers Purple Ombre Printed Kurtas for Men",
      description: "A stylish kurta for men",
      price: "₹783",
      imageUrl: "https://m.media-amazon.com/images/I/61labepnQpL._SY550_.jpg",
      affiliateLink: "https://amzn.to/4cwRPVQ",
      recommendedSkinTones: ["neutral"],
      source: "amazon",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "f1",
      name: "MenCollar Casual Shirt",
      description: "A cool shirt for men",
      price: "₹258",
      imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/j/b/s/m-fm-orange-frank-man-original-imahb9ambvr8vjqc.jpeg?q=70&crop=false",
      affiliateLink: "https://clnk.in/woHn",
      recommendedSkinTones: ["warm"],
      source: "flipkart",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "f2",
      name: "Casual Regular Sleeves Solid Women Orange Top",
      description: "A fashionable top for women",
      price: "₹366",
      imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/n/6/p/s-square-neck-full-sleeve-ribbed-top-redamancii-original-imagxrp276nyzhrw.jpeg?q=70&crop=false",
      affiliateLink: "https://clnk.in/woJU",
      recommendedSkinTones: ["warm"],
      source: "flipkart",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "f3",
      name: "Casual Cap Sleeves Solid Women Orange Top",
      description: "A fashionable top for women",
      price: "₹220",
      imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/h/8/z/s-1-cded-womentop-94-shahveer-creation-original-imahbachffbhfrxv.jpeg?q=70&crop=false",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.flipkart.com%2Fshahveer-creation-casual-solid-women-orange-top%2Fp%2Fitm1e97f971652f5%3Fpid%3DTOPHBACNZCT5PQGC%26lid%3DLSTTOPHBACNZCT5PQGCSFAJZV%26marketplace%3DFLIPKART%26q%3Dorange%2Btop%26store%3Dclo%252Fash%252Fohw%252F36j%26srno%3Ds_1_23%26otracker%3Dsearch%26otracker1%3Dsearch%26fm%3DSearch%26iid%3Df770a496-eeb4-4f52-8a64-d686c17375c6.TOPHBACNZCT5PQGC.SEARCH%26ppt%3Dsp%26ppn%3Dsp%26qH%3D2982fa0b0d8f80fe",
      recommendedSkinTones: ["warm"],
      source: "flipkart",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "f4",
      name: "Casual Regular Sleeves Printed Women Orange Top",
      description: "A fashionable kurti for women",
      price: "₹260",
      imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shopsy-top/b/k/p/s-1-1100-shortkurtas-sangouri-original-imah9zdjr4etagvy.jpeg?q=70&crop=false",
      affiliateLink: "https://clnk.in/woJ7",
      recommendedSkinTones: ["warm"],
      source: "flipkart",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "f5",
      name: "Men Solid Polo Neck Orange T-Shirt",
      description: "A fashionable t-shirt for men",
      price: "₹348",
      imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/v/6/r/l-pocket-orange-l-black-blink-original-imahfxnzqaxqmfhm.jpeg?q=70&crop=false",
      affiliateLink: "https://clnk.in/woKd",
      recommendedSkinTones: ["warm"],
      source: "flipkart",
      gender: "male",
      category: "clothing",
    },
    {
    _id: "f6",
    name: "Men Slim Fit Checkered Spread Collar Casual Shirt",
    description: "A stylish shirt for men",
    price: "₹999",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/p/e/r/-original-imah4eccgxpvpdw8.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKr",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
{
    _id: "f7",
    name: "Men Slim Fit Solid Mandarin Collar Casual Shirt",
    description: "A stylish shirt for men",
    price: "₹289",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/n/w/j/xl-kcsh-prm-110-dusty-grn-fubar-original-imahfbf5hpedzsta.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKg",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
{
    _id: "f8",
    name: "Men Regular Fit Printed Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹489",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/shirt/l/y/r/l-bul-23bs-15b-bullmer-original-imagwryc3u4xup3b.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKs",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
{
    _id: "f9",
    name: "Casual Regular Sleeves Printed Women Green Top",
    description: "A top for women",
    price: "₹891",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l34ry4w0/top/k/u/f/4xl-ltp12887-armyolive-pluss-original-imagebjpgfuzcbsn.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKx",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
{
    _id: "f10",
    name: "Women Regular Fit Green Cotton Blend Trousers",
    description: "A trouser for women",
    price: "₹389",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/trouser/m/m/a/34-jg-b2-army-q-rious-original-imah9gx5dcbdrtff.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKy",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
{
    _id: "f11",
    name: "Women Regular Fit Green Polyester Trousers",
    description: "A regular fit trousers for women",
    price: "₹449",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/trouser/k/v/s/30-29931232-mast-harbour-original-imah4eca5sxz3hvh.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKz",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
{
    _id: "f12",
    name: "Men Straight Fit Green Cotton Blend Trousers",
    description: "A straight fit trousers for men",
    price: "₹509",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/trouser/3/j/3/34-28973180-kook-n-keech-original-imah4zvmmmn5gqhz.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKA",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f13",
    name: "Casual Puff Sleeves Solid Women Orange Top",
    description: "A stylish top for women",
    price: "₹379",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/d/x/t/l-1-p-popm00826-metronaut-original-imagvfrypy4bbyzp.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKC",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f14",
    name: "Casual Bell Sleeves Self Design Women Orange Top",
    description: "A casual top for women",
    price: "₹332",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l3vxbbk0/top/z/s/h/l-lvt1007-a-kibo-original-imagewv8bymbx2gn.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKE",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f15",
    name: "Party Sleeveless Solid Women Brown Top",
    description: "A casual top for women",
    price: "₹339",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/j/c/t/l-mt968-oomph-original-imah49fhpedqh7bq.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKF",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f16",
    name: "Men Colorblock Polo Neck Polycotton Orange T-Shirt",
    description: "A polo T-Shirt for men",
    price: "₹799",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/x/p/3/xl-by-mpol-182-beyoung-original-imahasc7hfwbkshx.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKG",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f17",
    name: "Regular Fit Men Solid Round Neck Pure Cotton Brown T-Shirt",
    description: "A T-Shirt for men",
    price: "₹329",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/4/t/f/m-tsh-v-99-cork-veirdo-original-imah9fpmfvgehphd.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKH",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f18",
    name: "Men Regular Fit Printed Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹280",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/e/9/b/m-sa-d01-youth-first-original-imahbcm3te5at5xs.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKJ",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f19",
    name: "Casual Regular Sleeves Solid Women White Top",
    description: "A casual top for women",
    price: "₹327",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/z/q/h/m-1-31545514-glitchez-original-imah8nxq4mggyffb.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKS",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f20",
    name: "Casual Regular Sleeves Self Design Women Silver Top",
    description: "A casual top for women",
    price: "₹498",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/r/u/v/m-24007-katline-original-imahbxh4xnmmsmfv.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKT",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f21",
    name: "Casual Regular Sleeves Printed Women White Top",
    description: "A regular top for women",
    price: "₹342",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/top/x/f/x/xl-101creamtop-cavercha-original-imah6kdcnhmgbfz5.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKU",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f22",
    name: "Men Printed Round Neck Cotton Blend White T-Shirt",
    description: "A t-shirt for men",
    price: "₹342",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/t-shirt/4/u/j/m-30529538-fcuk-original-imah6r2hxqtngfsa.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKV",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f23",
    name: "Men Printed Round Neck Pure Cotton White T-Shirt",
    description: "A t-shirt for men",
    price: "₹229",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/t-shirt/q/g/t/m-31353038-glitchez-original-imahbzp9zph9h2zg.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKW",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f24",
    name: "Men Boot-Leg Mid Rise Beige Jeans",
    description: "A jeans for men",
    price: "₹734",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/jean/o/3/t/34-baggy-jeans-rileyrush-original-imahbwk2efexbru3.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woKZ",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f25",
    name: "Men Relaxed Fit Mid Rise Beige Jeans",
    description: "A jeans for men",
    price: "₹1,303",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/jean/r/k/i/36-baggy29-bwolves-original-imagzhpm5gkbpfxm.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK1",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f26",
    name: "Men Regular Fit Self Design Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹455",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/shirt/5/a/s/-original-imahb2brhgygb86g.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK5",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f27",
    name: "Party Regular Sleeves Embroidered Women Beige Top",
    description: "A top for women",
    price: "₹299",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/top/u/n/l/l-128-rr-sa-kurtis-original-imah5f8cfqwu3ay8.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK6",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f28",
    name: "Casual Sleeveless Solid Women Beige Top",
    description: "A top for women",
    price: "₹495",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/top/e/s/x/s-1-31993961-glitchez-original-imahbzpfrzs5ya5x.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK7",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f29",
    name: "Party Regular Sleeves Printed Women Beige Top",
    description: "A top for women",
    price: "₹179",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/u/t/j/s-girl-rib-crop-top-feshteval-original-imah3nfkddergjmc.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK8",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f30",
    name: "Casual Puff Sleeves Self Design Women Orange Top",
    description: "A top for women",
    price: "₹320",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/d/t/g/s-1-top-115-iuga-original-imahykkzjjjz4hg7.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woK9",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f31",
    name: "Casual Puff Sleeves Printed Women Orange Top",
    description: "A top for women",
    price: "₹330",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/b/k/v/m-top-leriya-fashion-original-imaggbqwv38zzzjd.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLa",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f32",
    name: "Men Regular Fit Self Design Spread Collar Casual Shirt",
    description: "A shirt for men",
    price: "₹375",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/g/e/r/s-deu018-deneeja-original-imah7n8wztgfswx9.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLd",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f33",
    name: "Men Regular Fit Solid Spread Collar Casual Shirt",
    description: "A shirt for men",
    price: "₹491",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/g/s/7/l-formal-shirt-psi-original-imah2knrsvz3ggyj.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLe",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f34",
    name: "Men Solid Polo Neck Cotton Blend Red T-Shirt",
    description: "A t-shirt for men",
    price: "₹292",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/1/o/f/xl-rega1037-red-get-golf-original-imah2tjwzfnzqwse.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLf",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f35",
    name: "Casual Regular Sleeves Solid Women Red Top",
    description: "A top for men",
    price: "₹236",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l4bn5ow0/top/g/y/g/xs-wm-30-half-button-top-western-darji-original-imagf9ydxauaud6f.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLg",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f36",
    name: "Casual Puff Sleeves Solid Women Red Top",
    description: "A top for women",
    price: "₹234",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l1zc6fk0/top/j/m/n/m-t-504-eva-red-dream-beauty-fashion-original-imagdfghjwxu86cg.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLm",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f37",
    name: "Casual Regular Sleeves Solid Women Red Top",
    description: "A top for women",
    price: "₹590",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/top/o/b/x/xl-ulss24tp19-23-121-uptownie-lite-original-imah7z4gtth6mm2y.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLn",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f38",
    name: "Casual Regular Sleeves Solid Women Orange Top",
    description: "A top for women",
    price: "₹413",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/jz4g3gw0/top/d/3/y/l-vvv955-veni-vidi-vici-original-imafj6nud2hz4rxe.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLo",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f39",
    name: "Casual Bell Sleeves Embroidered Women Orange Top",
    description: "A top for women",
    price: "₹755",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/w/x/x/xl-321-j-turritopsis-original-imahbhvpzqwgfjaw.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLp",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f40",
    name: "Casual Regular Sleeves Solid Women Orange Top",
    description: "A top for women",
    price: "₹329",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/j/k/o/xxl-1-29547038-sztori-original-imah4t2syknwnpvz.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLq",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f41",
    name: "Men Regular Fit Self Design Spread Collar Casual Shirt",
    description: "A shirt for men",
    price: "₹315",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/f/k/a/s-popcon-formal-shirt-cloth-factory-original-imahba99phbzbeyp.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLr",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f42",
    name: "Men Loose Fit Mid Rise Grey Jeans",
    description: "A jeans for men",
    price: "₹475",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/jean/7/t/g/34-aj-n-jaar-fashion-original-imah7n7scfpdfy4j.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLv",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f43",
    name: "Women Boot-Leg High Rise Grey Jeans",
    description: "A jeans for women",
    price: "₹687",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/jean/h/c/5/30-31178376-glitchez-original-imahbzzapyfnsegc.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLw",
    recommendedSkinTones: ["warm"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f44",
    name: "Casual Sleeveless Self Design Women White Top",
    description: "A casual top for women",
    price: "₹348",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/t/w/1/l-2353-nuevosdamas-original-imagqmuf9e8skdyx.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLx",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f45",
    name: "Casual Sleeveless Solid Women White Top",
    description: "A casual top for women",
    price: "₹292",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/0/4/s/l-lh-w-rib-tt-185-white-london-hills-original-imah94g5535qm3ut.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLy",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f46",
    name: "Men Slim Fit Solid Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹549",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/o/z/v/4xl-c301-white-dennis-lingo-original-imah4aav5rfdznra.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLz",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f47",
    name: "Men Regular Fit Self Design Casual Shirt",
    description: "A casual shirt for men",
    price: "₹2,999",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/b/v/u/s-28355380-roadster-original-imah9yf5jqvmunn3.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLA",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f48",
    name: "Men Slim Fit Solid Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹489",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/h/j/z/xxl-bslinhssld-bs-blue-squad-original-imah7jf3dfnwytyz.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLB",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f49",
    name: "Casual Sleeveless Solid Women Blue Top",
    description: "A casual top for women",
    price: "₹347",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l52sivk0/top/d/p/x/m-1112-navy-xs-femea-original-imagftt6ghpbz3zj.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLF",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f50",
    name: "Women Regular Fit Solid Casual Shirt",
    description: "A casual top for women",
    price: "₹479",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/l/w/p/m-29548254-french-connection-original-imah3xzhyqr9qycu.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLM",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f51",
    name: "Casual Regular Sleeves Solid Women Purple Top",
    description: "A casual top for women",
    price: "₹479",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/e/q/y/xs-1-flakit-perfette-wollo-original-imah5qp8yhzgwggt.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLO",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f52",
    name: "Casual Regular Sleeves Solid Women Purple Top",
    description: "A casual top for women",
    price: "₹329",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/9/0/a/3xl-1-30884819-dressberry-curve-original-imah6cewmremngz2.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLP",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f53",
    name: "Pure Cotton Purple T-Shirt",
    description: "Men Printed Round Neck Pure Cotton Purple T-Shirt",
    price: "₹400",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/y/j/s/l-hx-23-heathex-original-imagxk7zdthhr56y.jpeg?q=70&crop=false 2x, https://rukminim2.flixcart.com/image/416/416/xif0q/t-shirt/y/j/s/l-hx-23-heathex-original-imagxk7zdthhr56y.jpeg?q=70&crop=false 1x",
    affiliateLink: "https://clnk.in/woLQ",
    recommendedSkinTones: ["cool"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f54",
    name: "Men Slim Fit Striped Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹400",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/shirt/g/x/i/xl-surhi-patta-lgreen-u-turn-original-imah8fnfmbvmwz2s.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLT",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f55",
    name: "Men Slim Fit Striped Spread Collar Casual Shirt",
    description: "A casual shirt for men",
    price: "₹289",
    imageUrl: "https://rukminim2.flixcart.com/image/416/416/xif0q/shirt/z/1/n/3xl-patta-green-seige-original-imagw5vanz79ktne.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLU",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f56",
    name: "Casual Regular Sleeves Solid Women Light Green Top",
    description: "A regular top for women",
    price: "₹499",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/l3rmzrk0/top/h/y/y/m-lvt1027-a-kibo-original-imagetb7zbyx3tzp.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLV",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f57",
    name: "Casual Sleeveless Striped Women Light Green Top",
    description: "A regular top for women",
    price: "₹279",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/s/e/x/s-crop-top-41-l-green-blinkin-original-imagjh92cnqghmhu.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLW",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f58",
    name: "Casual Regular Sleeves Solid Women Green Top",
    description: "A casual top for women",
    price: "₹479",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/s/o/6/xl-1-ms-top-1051-mint-street-original-imahyvvtznwkmtjz.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLX",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f59",
    name: "Men Regular Fit Self Design Spread Collar Casual Shirt",
    description: "A shirt for men",
    price: "₹449",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/b/r/l/42-f-523-filo-hevis-original-imah8877pnyfuuqc.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woLY",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "male",
    category: "clothing",
  },
  {
    _id: "f60",
    name: "Casual Cuffed Sleeves Striped Women Purple Top",
    description: "A shirt for men",
    price: "₹618",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/v/d/p/3xl-ltp17897-lavender-pluss-original-imagru8yzdhaz8mk.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woL1",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
  {
    _id: "f61",
    name: "Casual Puff Sleeves Floral Print Women Purple, White Top",
    description: "A stylish top for women",
    price: "₹239",
    imageUrl: "https://rukminim2.flixcart.com/image/832/832/xif0q/top/e/7/v/-original-imagxgerxtpbzdez.jpeg?q=70&crop=false",
    affiliateLink: "https://clnk.in/woL2",
    recommendedSkinTones: ["neutral"],
    source: "flipkart",
    gender: "female",
    category: "clothing",
  },
    // Myntra Products
    {
      _id: "m1",
      name: "Hancock",
      description: "Men Mustard Yellow Slim Fit Striped Formal Shirt",
      price: "₹887",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/15854884/2021/12/20/5db975ef-3fc4-47df-ae86-0bc759eb84401639995115556-Hancock-Men-Shirts-4391639995115078-1.jpg",
      affiliateLink: "https://clnk.in/wh0K",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m2",
      name: "Crop Bralette Top",
      description: "Mustard Yellow Floral Print Crop Bralette Top",
      price: "₹294",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/22930160/2023/4/28/4ec69d63-056e-4ff4-b4d9-efad55f58f041682656226500TokyoTalkiesMustardYellowFloralPrintTop1.jpg",
      affiliateLink: "https://clnk.in/wh0Z",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m3",
      name: "Cotton Casual Shirt",
      description: "Men Comfort Relaxed Fit Textured Spread Collar Cotton Casual Shirt",
      price: "₹831",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MARCH/27/fAePJDsX_ff617eaf8ee448e88dcffff9b1858e76.jpg",
      affiliateLink: "https://clnk.in/wh01",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m4",
      name: "Striped Kurta",
      description: "Olive Green Striped Kurta with Palazzos",
      price: "₹474",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25394482/2023/10/7/1c2a1365-72c0-4294-abca-4207d4942b711696658646544KurtaSets1.jpg",
      affiliateLink: "https://clnk.in/wh00",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m5",
      name: "Casual Shirt",
      description: "Cuban Collar Textured Relaxed Fit Casual Shirt",
      price: "₹799",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/33006207/2025/3/25/23b30474-6b3c-4b3b-a021-bd7b6f52a43d1742911700668-Dennis-Lingo-Cuban-Collar-Textured-Relaxed-Fit-Casual-Shirt--1.jpg",
      affiliateLink: "https://clnk.in/wh02",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m6",
      name: "StyleCast",
      description: "Flutter Sleeve Top",
      price: "₹314",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/24/aiMUlYD9_77e320e6c0f94155b38bb0045b83614e.jpg",
      affiliateLink: "https://clnk.in/wh03",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m7",
      name: "Women's Kurti",
      description: "Women Rust Orange Ethnic Printed A-Line Kurtis",
      price: "₹402",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/8350177/2023/9/15/deb4d0d1-1a01-4cc7-8508-9daae1e7c1f61694776749269-Sangria-Women-Rust-Orange-Ethnic-Printed-A-Line-Top-24116947-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fkurtis%2Fsangria%2Fsangria-women-rust-orange-ethnic-printed-a-line-kurtis%2F8350177%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m8",
      name: "Cotton Casual Shirt",
      description: "Opaque Pure Cotton Casual Shirt",
      price: "₹1271",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30101307/2025/2/19/9e207d1f-76ff-4535-b1c7-53a6d4467d0c1739963213425-WROGN-Opaque-Pure-Cotton-Casual-Shirt-8181739963212938-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fwrogn%2Fwrogn-opaque-pure-cotton-casual-shirt%2F30101307%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m9",
      name: "V-Neck Waistcoat",
      description: "Pure Cotton V-Neck Waistcoat",
      price: "₹569",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29893957/2024/6/28/90027f5a-732a-456b-bd44-9ae73e65bb551719551799659DressBerryPureCottonV-NeckWaistcoat1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fwaistcoat%2Fdressberry%2Fdressberry-pure-cotton-v-neck-waistcoat%2F29893957%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m10",
      name: "Men's Shirt",
      description: "Regular Fit Outline Shirt",
      price: "₹1399",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31236285/2024/11/9/bdf3e835-cc79-4ca6-923a-b279c02e0c2e1731134363251-HM-Regular-Fit-Outline-Shirt-6081731134362826-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fh%2526m%2F-hm-regular-fit-outline-shirt-%2F31236285%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m11",
      name: "Cargos Trousers",
      description: "Girls Easy Wash Slip On Cargos Trousers",
      price: "₹479",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JANUARY/22/iFAwLqB5_a8547d48b8a34f47a15085167b5fa77a.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftrousers%2Fcutiekins%2Fcutiekins-girls-easy-wash-slip-on-cargos-trousers%2F32440682%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m12",
      name: "Kurti",
      description: "Ethnic Motifs Embroidered Thread Work Thread Work Kurti",
      price: "₹588",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/AUGUST/29/YXMxpexG_f5d9df19fa7044e0a6c2e08ca7d94825.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fkurtis%2Fkalini%2Fkalini-ethnic-motifs-embroidered-thread-work-thread-work-kurti%2F30744168%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m13",
      name: "Denim Casual Shirt",
      description: "Pure Cotton Drop-Shoulder Sleeves Relaxed Fit Denim Casual Shirt",
      price: "₹944",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31307631/2025/4/8/c8fa95cb-f366-4dc8-ae61-9e2914b43b7f1744110083908-Aeropostale-Pure-Cotton-Drop-Shoulder-Sleeves-Relaxed-Fit-De-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Faeropostale%2Faeropostale-pure-cotton-drop-shoulder-sleeves-relaxed-fit-denim-casual-shirt%2F31307631%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m14",
      name: "Printed T-shirt",
      description: "Bow Blush Printed T-shirt",
      price: "₹230",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31735975/2025/1/31/5bcaa710-4275-486e-a50c-27caa539c6cd1738314833518-glitchez-Women-Tshirts-8141738314832982-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fglitchez%2Fglitchez-bow-blush-printed-t-shirt%2F31735975%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m15",
      name: "Women's Top",
      description: "Teal Blue Floral Printed Mandarin Collar Cotton Top",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29181432/2024/4/25/cc22e210-301c-4952-b2cd-0ede66aeeafd1714019625414allaboutyouFloralPrintMandarinCollarTop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fall%2Babout%2Byou%2Fall-about-you-teal-blue-floral-printed-mandarin-collar-cotton-top%2F29181432%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m16",
      name: "Men's Casual Shirt",
      description: "Men Button-Down Collar Vertical Striped Casual Shirt",
      price: "₹1099",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31969505/2024/12/14/0aa51b05-8eb0-451f-8224-70bf82d52cbe1734165095166PowerlookMenOpaqueStripedCasualShirt1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fpowerlook%2Fpowerlook-men-button-down-collar-vertical-striped-casual-shirt%2F31969505%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m17",
      name: "Pure Cotton Top",
      description: "Mustard Yellow Checked Pure Cotton Top",
      price: "₹384",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/17357976/2022/3/3/61b8bce6-9fe3-4a2e-ba13-6daa03d6dd0d1646282255456DECKEDUPMustardYellowCheckedTop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fdeckedup%2Fdeckedup-mustard-yellow-checked-pure-cotton-top%2F17357976%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m18",
      name: "Mustard Yellow Round Neck Crop Top",
      description: "The Lifestyle Co. Mustard Yellow Round Neck Crop Top",
      price: "₹479",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29152954/2024/4/24/d66a601a-98d3-4b52-bd92-0edd554baf081713943891408Tops1.jpg",
      affiliateLink: "https://clnk.in/woRU",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m19",
      name: "Printed Casual Shirt",
      description: "Men Mustard Yellow & White Regular Fit Printed Casual Shirt",
      price: "₹692",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/10356877/2019/9/23/d221729e-a36e-468a-8b2c-a393077aec5b1569214732015-Anouk-Men-Shirts-1391569214729615-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fanouk%2Fanouk-men-mustard-yellow--white-regular-fit-printed-casual-shirt%2F10356877%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m20",
      name: "Olive Green Crepe Knitted Top",
      description: "Olive Green Crepe Knitted Top",
      price: "₹341",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/17799722/2022/4/7/28e77b01-2bd0-42a1-b84a-45faadd57c9e1649340417349TokyoTalkiesOliveGreenCrepeTop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Ftokyo%2Btalkies%2Ftokyo-talkies-olive-green-crepe-knitted-top%2F17799722%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m21",
      name: "Slim Fit Casual Shirt",
      description: "Men Olive Green Solid Slim Fit Casual Shirt",
      price: "₹479",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/DECEMBER/18/j1lzuTQx_6fa24fd59b5e43c08c474180873ea579.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fhighlander%2Fhighlander-men-olive-green-solid-slim-fit-casual-shirt%2F19771884%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m22",
      name: "Olive Green Casual Shirt",
      description: "Men Olive Green & Black Checked Pure Cotton Casual Shirt",
      price: "₹611",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/14878070/2021/11/4/776b715d-6b78-4413-a2e7-ab9f5adec6fe1636023897840-Roadster-Men-Shirts-5301636023897187-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Froadster-men-olive-green--black-checked-pure-cotton-casual-shirt%2F14878070%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m23",
      name: "Kurta with Palazzo & Dupatta",
      description: "Olive Green Ethnic Motifs Embroidered Sequinned Kurta with Palazzo & Dupatta",
      price: "₹929",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/28884408/2024/4/12/0414a70e-a618-485c-93a0-1bbd53f821581712913257541VishudhWomenOliveEmbroideredPanelStraightKurtaWithCroppedPal2.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fkurta-sets%2Fvishudh%2Fvishudh-olive-green-ethnic-motifs-embroidered-sequinned-kurta-with-palazzo--dupatta%2F28884408%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m24",
      name: "Oversized Crepe Casual Shirt",
      description: "Oversized Crepe Casual Shirt",
      price: "₹999",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26171658/2025/4/9/ec069d5d-37ab-45c2-9458-0ea9bd38fef61744210336705-DL-Woman-Oversized-Crepe-Casual-Shirt-2891744210336231-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fdl%2Bwoman%2Fdl-woman-oversized-crepe-casual-shirt%2F26171658%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m25",
      name: "Men Polo Collar T-shirt",
      description: "Men Polo Collar T-shirt",
      price: "₹299",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32756176/2025/2/24/557d1e50-1f7d-42fa-979d-4b5ff78475771740397272985-Kook-N-Keech-Men-Tshirts-1251740397272443-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fkook%2Bn%2Bkeech%2Fkook-n-keech-men-polo-collar-t-shirt%2F32756176%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m26",
      name: "Floral Top",
      description: "Floral Printed V-Neck Pure Cotton Block Print Legacy Wrap Top",
      price: "₹797",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30964932/2025/1/6/aaeef858-407b-4db6-8f5d-638f56d97fee1736161273718-Taavi-Women-Tops-301736161273161-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fkurtis%2Ftaavi%2Ftaavi-floral-printed-v-neck-pure-cotton-block-print-legacy-wrap-top%2F30964932%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m27",
      name: "Summer Sheers Kurta",
      description: "Women Rust Ethnic Motifs Printed Summer Sheers Kurta",
      price: "₹607",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/22835858/2023/5/4/7fa9a9b9-64a5-4949-a8e8-a6143f04ed091683191083629-navibhu-Women-Kurtas-161683191082716-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fkurtas%2Fanouk%2Fanouk-women-rust-ethnic-motifs-printed-summer-sheers-kurta%2F22835858%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m28",
      name: "Pure Cotton Casual Shirt",
      description: "The Life Co. Boxy Fit Drop-Shoulder Sleeves Pure Cotton Casual Shirt",
      price: "₹620",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29951308/2024/10/9/70135341-26e1-42b4-8bcf-271ee9c380f61728468275532-Roadster-Men-Shirts-5491728468275060-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Fthe-roadster-life-co-boxy-fit-drop-shoulder-sleeves-pure-cotton-casual-shirt%2F29951308%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m29",
      name: "Checkered Oversized Shirt",
      description: "Checkered Oversized Shirt & Tank Top With Necklace",
      price: "₹1109",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/33236229/2025/3/25/e93ba013-b6e6-4cab-9682-6b9f2bf6e3b01742902228367-StyleCast-X-SERA-Women-Modern-Oversized-Fit-Checked-Cotton-C-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fstylecast%2Bx%2Bsera%2Fstylecast-x-sera-checkered-oversized-shirt--tank-top-with-necklace%2F33236229%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m30",
      name: "Solid Mock Neck Fitted Top",
      description: "Solid Mock Neck Fitted Top",
      price: "₹599",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/33630422/2025/4/22/e6cd4521-125c-406e-b1f5-8ebf4c7a55f41745317106400-Hifzaa-Top-6411745317105988-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fhifzaa%2Fhifzaa-solid-mock-neck-fitted-top%2F33630422%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m31",
      name: "Men asual shirt",
      description: "Men Comfort Spread Collar Textured Casual Shirt",
      price: "₹683",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/SEPTEMBER/20/DGRfTbb6_430d59e17ea1453187adf457689a5134.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fcampus%2Bsutra%2Fcampus-sutra-men-comfort-spread-collar-textured--casual-shirt%2F31007039%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m32",
      name: "Men Casual Shirt",
      description: "Men Pure Cotton Slim Fit Striped Casual Shirt",
      price: "₹1028",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25826992/2024/1/9/50f38346-5be2-4290-a556-5ed89177862c1704780137368-WROGN-Men-Shirts-5031704780137066-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fwrogn%2Fwrogn-men-pure-cotton-slim-fit-striped-casual-shirt%2F25826992%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m33",
      name: "Print Flared Sleeves Regular Top",
      description: "Cream-Coloured & Green Floral Print Flared Sleeves Regular Top",
      price: "₹467",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/13205250/2021/2/25/7c6025e7-0416-4723-8d6b-0cb2cd15715b1614233324236-all-about-you-Cream-Coloured-Floral-Printed-Flared-Sleeves-T-3.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fall%2Babout%2Byou%2Fall-about-you-cream-coloured--green-floral-print-flared-sleeves-regular-top%2F13205250%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m34",
      name: "Women Floral Lace Mandarin Collar Crop Top",
      description: "Women Floral Lace Mandarin Collar Crop Top",
      price: "₹725",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/NOVEMBER/1/Pxfo1Y38_cfa975e7c620456a90e80c067dbbb582.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fhere%2526now%2Fherenow-women-floral-lace-mandarin-collar-crop-top%2F31464722%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m35",
      name: "Sweetheart Neck Crop Top",
      description: "Sweetheart Neck Crop Top",
      price: "₹641",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/FEBRUARY/1/ekKVnbkE_2a05a940202744abaf819c9896312ea6.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fstyle%2Bquotient%2Fstyle-quotient-sweetheart-neck-crop-top%2F32610667%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m36",
      name: "White Cropped Vest Top",
      description: "White Cropped Vest Top",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_40,w_210,c_limit,fl_progressive/assets/images/17883614/2022/4/14/28a441d3-56ec-4375-abdc-ce5629c2c7651649908889390Croppedvesttop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fh%2526m%2Fhm-white-cropped-vest-top%2F17883614%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m37",
      name: "Women White Ribbed Crop Top",
      description: "Women White Ribbed Crop Top",
      price: "₹349",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_40,w_210,c_limit,fl_progressive/assets/images/20602506/2022/11/3/cfdc2629-02b2-4a2e-97fe-c4fac45994e81667455583136RibbedFittedCroptop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fblinkin%2Fblinkin-women-white-ribbed-crop-top%2F20602506%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m38",
      name: "Men White Twill Casual Shirt",
      description: "Men White Twill Casual Shirt",
      price: "₹569",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2284692/2019/7/11/addcdfa6-3751-4a11-b860-d4f64de5f96f1562832505355-Roadster-Men-White-Regular-Fit-Solid-Twill-Casual-Shirt-9021-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Froadster-men-white-twill-casual-shirt%2F2284692%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m39",
      name: "Square Neck Fitted Crop Top",
      description: "Square Neck Fitted Crop Top",
      price: "₹230",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32548862/2025/4/28/0fe0e3f7-2d13-46f4-b10e-7c5eb5f5f9ac1745838980469-glitchez-Women-Tops-2501745838979956-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fglitchez%2Fglitchez-square-neck-fitted-crop-top%2F32548862%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m40",
      name: "Bralette Crop Top",
      description: "Floral Printed Sweetheart Neck Smocked Bralette Crop Top",
      price: "₹349",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26022216/2023/12/4/c762cd8e-9c63-4634-908e-7169f6516b151701679000723SlyckGreyFloralPrintSweetheartNeckCropTop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fstylecast%2Bx%2Bslyck%2Fstylecast-x-slyck-floral-printed-sweetheart-neck-smocked-bralette-crop-top%2F26022216%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m41",
      name: "Solid Cotton Casual Shirt",
      description: "Men Classic Fit Spread Collar Solid Cotton Casual Shirt",
      price: "₹579",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32024807/2025/1/10/7c17a877-e8d4-4e3d-8b82-6d48092a9e881736521345606-VASTRADO-Men-Classic-Fit-Spread-Collar-Solid-Cotton-Casual-S-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fvastrado%2Fvastrado-men-classic-fit-spread-collar-solid-cotton-casual-shirt%2F32024807%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m42",
      name: "Cotton Boxy Casual Shirt",
      description: "Women Cuban Collar Textured Cotton Boxy Casual Shirt",
      price: "₹671",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/DECEMBER/3/cIpO5TRQ_c4342892ddac47a592baf34d9fcf99cd.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Fthe-roadster-lifestyle-co-women-cuban-collar-textured-cotton-boxy-casual-shirt%2F31820752%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m43",
      name: "Pure Cotton Casual Shirt",
      description: "Men Striped Oversized Pure Cotton Casual Shirt",
      price: "₹675",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/27478566/2024/5/6/3cccb456-71da-4a91-9c2d-52d79468d6d11714994814824-Mens-Cotton-Full-Sleeve-Shirts-7311714994814359-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fmast%2B%2526%2Bharbour%2Fmast--harbour-men-striped-oversized-pure-cotton-casual-shirt%2F27478566%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m44",
      name: "Ethnic Print Top",
      description: "Ethnic Print Top",
      price: "₹319",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/17894360/2023/9/6/d4b8068a-8a07-412c-816b-bfb9881f960d1693984013369-all-about-you-Ethnic-Print-Top-8451693984012916-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fall%2Babout%2Byou%2Fall-about-you-ethnic-print-top%2F17894360%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m45",
      name: "Flared Sleeves Top",
      description: "Green Self Design Lace Inserts Flared Sleeves Top",
      price: "₹591",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/18900100/2022/10/10/5b7485f8-85de-419a-9ba8-cec99dbef0eb1665401540584-DressBerry-Women-Tops-9671665401539964-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fdressberry%2Fdressberry-green-self-design-lace-inserts-flared-sleeves-top%2F18900100%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m46",
      name: "Green Embroidery Detail Top",
      description: "Green Embroidery Detail Top",
      price: "₹499",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/15192116/2023/8/29/8651c6d6-2720-4d07-be33-c3ec2db53c841693310581682allaboutyouGreenEmbroideryDetailTop1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Froutes%2Bby%2Ball%2Babout%2Byou%2Froutes-by-all-about-you-green-embroidery-detail-top%2F15192116%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m47",
      name: "Men Green Solid Pure Cotton Casual Shirt",
      description: "Men Green Solid Pure Cotton Casual Shirt",
      price: "₹591",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/14878034/2021/12/14/71d87b17-20c7-4929-a533-fe461ba392f91639475146867-Roadster-Men-Shirts-4901639475146311-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Froadster-men-green-solid-pure-cotton-casual-shirt%2F14878034%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "m48",
      name: "Whispered Lilac Ribbed Crop Top",
      description: "Whispered Lilac Ribbed Crop Top",
      price: "₹381",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/MAY/2/8Z3Nv0Uh_37f73b847f8a4a198c168dd543da8986.jpg",
      affiliateLink: "hhttps://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Fglitchez%2Fglitchez-whispered-lilac-ribbed-crop-top%2F31784438%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m49",
      name: "Sleeveless Top",
      description: "The Lifestyle Co Front Tie Sleeveless Top",
      price: "₹384",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/JULY/29/YEAXXxlF_4c52053584e14cd7b3c8c5ca453c0a49.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftops%2Froadster%2Fthe-roadster-lifestyle-co-front-tie-sleeveless-top%2F30386230%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "myntra",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "m50",
      name: "Solid Cotton Casual Shirt",
      description: "Regular Fit Button-Down Collar Solid Cotton Casual Shirt",
      price: "₹899",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/33329935/2025/3/27/5ef2e240-aa69-43b9-adc9-e51e7b772c491743087407937-Thomas-Scott-Men-Premium-Slim-Fit-Opaque-Casual-Shirt-236174-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Fthomas%2Bscott%2Fthomas-scott-men-premium-regular-fit-button-down-collar-solid-cotton-casual-shirt%2F33329935%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "myntra",
      gender: "male",
      category: "clothing",
    },
    // Bewakoof Products
    {
      _id: "aj1",
      name: "Printed Oversized T-shirt",
      description: "OFFICIAL GARFIELD MERCHANDISE Lazy Garfield Graphic Printed Oversized T-shirt",
      price: "₹649",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/23370004/2024/3/7/5349b751-aec0-4606-86f6-1160d7ba52121709804544749BewakoofxOFFICIALGARFIELDMERCHANDISELazyGarfieldGraphicPrint1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-x-official-garfield-merchandise-lazy-garfield-graphic-printed-oversized-t-shirt%2F23370004%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj2",
      name: "Half Sleeve Shirt",
      description: "The Lifestyle Co Pure Cotton Half Sleeve Shirts",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29936230/2024/6/10/33788a2a-66d1-47a1-a152-5d350c687cc71718040228301TheRoadsterLifestyleCoPureCottonHalfSleeveShirts1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fshirts%2Froadster%2Fthe-roadster-lifestyle-co-pure-cotton-half-sleeve-shirts%2F29936230%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj3",
      name: "Oversized Sweatshirt",
      description: "Men Printed Oversized Sweatshirt",
      price: "₹1199",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2024/NOVEMBER/19/M4utcdak_94d86a8dfe264cd4b13f718d82522aa3.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fsweatshirts%2Fbewakoof%2Fbewakoof-men-printed-oversized-sweatshirt%2F31669501%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj4",
      name: "Women's Orange T-shirt",
      description: "Orange Kung Fu Panda Printed Drop-Shoulder Sleeves Oversized Cotton T-shirt",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/29059474/2025/1/16/d67e826a-dd5a-4763-9982-8dfa3b2655081737007833151-Bewakoof-Orange-Kung-Fu-Panda-Printed-Drop-Shoulder-Sleeves--1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-orange-kung-fu-panda-printed-drop-shoulder-sleeves-oversized-cotton-t-shirt%2F29059474%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj5",
      name: "Printed Oversized T-shirt",
      description: "Official Garfield Merchandise Printed Oversized T-shirt",
      price: "₹599",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25655158/2025/1/16/227a6595-3133-4be3-a35f-48c6e9bcec181737007450772-Bewakoof-Official-Garfield-Merchandise-Printed-Oversized-T-s-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-official-garfield-merchandise-printed-oversized-t-shirt%2F25655158%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj6",
      name: "Cotton Oversized T-shirt",
      description: "Green Friends Printed Drop Shoulder Sleeves Pure Cotton Oversized T-shirt",
      price: "₹649",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26504408/2025/3/13/ddcb1d11-96b9-4339-bc29-be9bb2f7b4a51741853857254-Bewakoof-Green-Friends-Printed-Drop-Shoulder-Sleeves-Pure-Co-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-green-friends-printed-drop-shoulder-sleeves-pure-cotton-oversized-t-shirt%2F26504408%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj7",
      name: "Printed Oversized T-Shirt",
      description: "Official Disney Merchandise Hakuna Matata Women's Printed Oversized T-Shirt",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JANUARY/10/Bv8tUOTw_9be1b834bd5b4d2aa96b8e72de608ac0.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-official-disney-merchandise-hakuna-matata-womens-printed-oversized-t-shirt%2F32284332%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj8",
      name: "Oversized Cotton T-shirt",
      description: "Brown Calm Down Graphic Printed Oversized Cotton T-shirt",
      price: "₹549",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25958018/2025/1/16/38e37439-400c-4cfb-9289-e4947a86df181737007652373-Bewakoof-Brown-Calm-Down-Graphic-Printed-Oversized-Cotton-T--1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-official-disney-merchandise-hakuna-matata-womens-printed-oversized-t-shirt%2F32284332%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj9",
      name: "T-shirt",
      description: "Green Graphic Printed Cotton T-shirt",
      price: "₹449",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/22948062/2025/4/10/1643271a-e95e-4502-9295-1b1aab7e1a271744286389304-Bewakoof-Green-Graphic-Printed-Cotton-T-shirt-40117442863888-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-green-graphic-printed-cotton-t-shirt%2F22948062%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj10",
      name: "Mini Shirt Dress",
      description: "Typography Printed Shirt Collar Denim Cotton Oversized Mini Shirt Dress",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/26832856/2024/1/8/7c1737ba-c465-46c3-a8c7-5f6c1aca94081704717795410BewakoofBlueFloralPrintDenimA-LineDress1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fdresses%2Fbewakoof%2Fbewakoof-typography-printed-shirt-collar-denim-cotton-oversized-mini-shirt-dress%2F26832856%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj11",
      name: "T-shirt",
      description: "Women Graphic Printed Round Neck Cotton Oversized T-shirt",
      price: "₹599",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/12/WPnSSsRH_48bf649efbef4fccaac94adeebe2ca29.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-women-graphic-printed-round-neck-cotton-oversized-t-shirt%2F33578713%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj12",
      name: "T-shirt",
      description: "Women Graphic Printed Round Neck Pure Cotton Oversized T-shirt",
      price: "₹399",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/30873836/2025/1/16/e55b4d2a-e843-4579-8b85-5130a13deb2a1737008042753-Bewakoof-Women-Graphic-Printed-Round-Neck-Cotton-Oversized-T-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-women-graphic-printed-round-neck-pure-cotton-oversized-t-shirt%2F30873836%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj13",
      name: "Printed T-shirt",
      description: "Men Red & White Printed T-shirt",
      price: "₹529",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/18086206/2024/4/5/4d4b716b-53eb-4153-af1d-eb9838e432721712301577144-Bewakoof-Men-Red--White-Printed-T-shirt-9151712301577031-11.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-men-red--white-printed-t-shirt%2F18086206%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj14",
      name: "Solid Drop-Shoulder Sleeves Boyfriend Fit T-shirt",
      description: "Solid Drop-Shoulder Sleeves Boyfriend Fit T-shirt",
      price: "₹454",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/23442348/2025/2/12/d287517f-8410-478d-9dc6-6a088ffa37fc1739351358096-Bewakoof-Solid-Drop-Shoulder-Sleeves-Boyfriend-Fit-T-shirt-2-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-solid-drop-shoulder-sleeves-boyfriend-fit-t-shirt%2F23442348%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj15",
      name: "Graphic Printed Oversized T-Shirt",
      description: "Donald Duck Women's Graphic Printed Oversized T-Shirt",
      price: "₹699",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/32659926/2025/2/12/99e2606f-4497-4c58-becd-a21d8fa78a0d1739352193648-Bewakoof-Women-Donald-Duck-Printed-T-shirt-1921739352193217-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-official-disney-merchandise-donald-duck-womens-graphic-printed-oversized-t-shirt%2F32659926%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj16",
      name: "Graphic Printed Cotton Relaxed Fit T-shirt",
      description: "Graphic Printed Cotton Relaxed Fit T-shirt",
      price: "₹399",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/27321832/2025/2/20/bac10ea6-742a-414a-a630-36605f52d13f1740055518501-Bewakoof-Graphic-Printed-Cotton-Relaxed-Fit-T-shirt-15417400-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-graphic-printed-cotton-relaxed-fit-t-shirt%2F27321832%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj17",
      name: "Cotton Panda Printed Oversized Fit T-shirt",
      description: "Cotton Panda Printed Oversized Fit T-shirt",
      price: "₹674",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/22581032/2024/3/22/b639ab0b-5315-46cd-a834-bf76614fc2f51711085638645-Bewakoof-Cotton-Panda-Printed-Oversized-Fit-T-shirt-34717110-7.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-cotton-panda-printed-oversized-fit-t-shirt%2F22581032%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj18",
      name: "Oversized Pure Cotton T-shirt",
      description: "Drop-Shoulder Sleeves Oversized Pure Cotton T-shirt",
      price: "₹779",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/25957986/2025/2/12/a6eec2af-5249-4bfc-aedd-c382fe249ff91739351521218-Bewakoof-Garfield-Printed-Drop-Shoulder-Sleeves-Oversized-Co-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-garfield-printed-drop-shoulder-sleeves-oversized-pure-cotton-t-shirt%2F25957986%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj19",
      name: "Women's Crystal Rose Oversized Crochet Sweater",
      description: "Women's Crystal Rose Oversized Crochet Sweater",
      price: "₹629",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/31336206/2024/12/5/8bcba2f1-c918-4def-ab90-81663e9146a11733404836467-Bewakoof-Womens-Crystal-Rose-Oversized-Crochet-Sweater-10817-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Fsweaters%2Fbewakoof%2Fbewakoof-womens-crystal-rose-oversized-crochet-sweater%2F31336206%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj20",
      name: "Cotton Round Neck Oversized T-shirt",
      description: "Cotton Round Neck Oversized T-shirt",
      price: "₹654",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/23220762/2025/1/30/8a31f111-697c-4dda-b5fa-753b6b41f94a1738217561399-Bewakoof-Cotton-Round-Neck-Oversized-T-shirt-365173821756097-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-cotton-round-neck-oversized-t-shirt%2F23220762%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj21",
      name: "Oversized Pure Cotton T-shirt",
      description: "rinted Drop-Shoulder Sleeves Pure Cotton T-shirt",
      price: "₹599",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/24744202/2025/1/16/8b3f1afc-bb6a-4caf-9cb3-dd95f47033091737007359129-Bewakoof-Oversized-Graphic-Printed-Drop-Shoulder-Sleeves-Pur-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-oversized-graphic-printed-drop-shoulder-sleeves-pure-cotton-t-shirt%2F24744202%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj22",
      name: "Round Neck Cotton Oversized T-shirt",
      description: "Women Typography Printed Round Neck Cotton Oversized T-shirt",
      price: "₹499",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/APRIL/12/5B35GgSN_b9a36dfa472e4d4a9d485b73fa2c1fba.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-women-typography-printed-round-neck-cotton-oversized-t-shirt%2F33580612%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj23",
      name: "Round Neck Short Sleeves Cotton Relaxed Fit T-shirt",
      description: "Round Neck Short Sleeves Cotton Relaxed Fit T-shirt",
      price: "599",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/28231460/2024/3/13/b8b99564-7840-4207-88ee-a8ec223b8d031710307167832BewakoofPlusWomenTypographyExtendedSleevesAppliqueT-shirt1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Bplus%2Fbewakoof-plus-friends-printed-round-neck-short-sleeves-cotton-relaxed-fit-t-shirt%2F28231460%2Fbuy",
      recommendedSkinTones: ["warm"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
    {
      _id: "aj24",
      name: "Round Neck Cotton Oversized T-shirt",
      description: "Men Typography Printed Round Neck Cotton Oversized T-shirt",
      price: "₹2249",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/2025/JANUARY/28/emTPQwMQ_ba4f62c5805c401595c67a3afc86ee7b.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-men-typography-printed-round-neck-cotton-oversized-t-shirt%2F32532603%2Fbuy",
      recommendedSkinTones: ["cool"],
      source: "ajio",
      gender: "male",
      category: "clothing",
    },
    {
      _id: "aj25",
      name: "Oversized Cotton T-shirt",
      description: "Printed Drop-Shoulder Sleeves Oversized Cotton T-shirt",
      price: "₹662",
      imageUrl: "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/20450280/2024/12/24/7e947a01-74bb-42ae-ae28-0aded22b5c761735036280324-Bewakoof-Women-White-Printed-Drop-Shoulder-Sleeves-Oversized-1.jpg",
      affiliateLink: "https://linksredirect.com/?cid=230419&source=linkkit&url=https%3A%2F%2Fwww.myntra.com%2Ftshirts%2Fbewakoof%2Fbewakoof-women-white-printed-drop-shoulder-sleeves-oversized-cotton-t-shirt%2F20450280%2Fbuy",
      recommendedSkinTones: ["neutral"],
      source: "ajio",
      gender: "female",
      category: "clothing",
    },
  ];

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        let sortedOutfits = [...staticOutfits];
        if (priceSort === 'lowToHigh') {
          sortedOutfits.sort((a, b) => parseFloat(a.price.replace('₹', '').replace(',', '')) - parseFloat(b.price.replace('₹', '').replace(',', '')));
        } else if (priceSort === 'highToLow') {
          sortedOutfits.sort((a, b) => parseFloat(b.price.replace('₹', '').replace(',', '')) - parseFloat(a.price.replace('₹', '').replace(',', '')));
        }

        setOutfits(sortedOutfits);
        setFilteredOutfits(sortedOutfits);

        const allAmazonOutfits = sortedOutfits.filter(outfit => outfit.source === 'amazon');
        const allFlipkartOutfits = sortedOutfits.filter(outfit => outfit.source === 'flipkart');
        const allMyntraOutfits = sortedOutfits.filter(outfit => outfit.source === 'myntra');
        const allAjioOutfits = sortedOutfits.filter(outfit => outfit.source === 'ajio');
        const allOutfits = sortedOutfits.filter(outfit => ['warm', 'cool', 'neutral'].some(tone => outfit.recommendedSkinTones.includes(tone)));

        setAmazonOutfits(allAmazonOutfits);
        setFlipkartOutfits(allFlipkartOutfits);
        setMyntraOutfits(allMyntraOutfits);
        setAjioOutfits(allAjioOutfits);
        setVisibleAllOutfits(allOutfits.slice(0, allItemsToShow));
        setLoading(false);
      } catch (err) {
        setError('Error loading outfits');
        console.error('Error fetching outfits:', err);
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [allItemsToShow, priceSort]);

  useEffect(() => {
    let filtered = [...outfits];
    if (detectedSkinTone) {
      filtered = filtered.filter(outfit =>
        outfit.recommendedSkinTones.includes(detectedSkinTone.type)
      );
    }
    if (selectedGender) {
      filtered = filtered.filter(outfit =>
        outfit.gender === selectedGender || outfit.gender === 'unisex'
      );
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
  }, [detectedSkinTone, selectedGender, outfits]);

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

    return (
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 flex-shrink-0"
        onMouseEnter={() => setHoveredCard(outfit._id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="relative overflow-hidden h-[400px]">
          <a href={outfit.affiliateLink} target="_blank" rel="noopener noreferrer">
            <img
              src={outfit.imageUrl}
              alt={outfit.name}
              className="w-full h-full object-cover"
            />
          </a>
          <button
            onClick={() => handleWishlistClick(outfit)}
            className={`absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out md:${
              hoveredCard === outfit._id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-red-500'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-6 w-[320px]">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{outfit.name}</h3>
          <p className="text-gray-600 mb-4">{outfit.description}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-purple-600">{outfit.price}</span>
            <a href={outfit.affiliateLink} target="_blank" rel="noopener noreferrer">
              <button className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-700 transition-all duration-300">
                Buy Now
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const MobileProductCard = ({ outfit }: { outfit: Outfit }) => {
    const isWishlisted = wishlist.some(item => item._id === outfit._id);

    return (
      <div className="flex-shrink-0 w-[240px] h-[320px] bg-gray-200 rounded-lg overflow-hidden">
        <div className="relative overflow-hidden h-[200px]">
          <a href={outfit.affiliateLink} target="_blank" rel="noopener noreferrer">
            <img
              src={outfit.imageUrl}
              alt={outfit.name}
              className="w-full h-full object-cover"
            />
          </a>
          <button
            onClick={() => handleWishlistClick(outfit)}
            className={`absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-red-500'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-3">
          <h4 className="text-sm font-bold text-gray-800">{outfit.name}</h4>
          <p className="text-xs text-gray-600 mb-2">{outfit.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-purple-600">{outfit.price}</span>
            <a href={outfit.affiliateLink} target="_blank" rel="noopener noreferrer">
              <button className="px-2 py-1 bg-purple-900 text-white text-sm rounded hover:bg-purple-700 transition-all duration-300">
                Buy Now
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            {detectedSkinTone ? `Outfits for Your ${detectedSkinTone.type} Skin Tone` : 'Shop by Category'}
          </h2>
          <div className="flex flex-row space-x-4 w-full max-w-4xl">
            <div
              className={`relative w-1/2 h-48 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 transform hover:scale-105 ${selectedGender === 'male' ? 'ring-4 ring-blue-500' : ''}`}
              onClick={() => setSelectedGender(selectedGender === 'male' ? null : 'male')}
            >
              <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce" alt="Male Fashion" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Men's Fashion</h3>
              </div>
            </div>
            <div
              className={`relative w-1/2 h-48 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 transform hover:scale-105 ${selectedGender === 'female' ? 'ring-4 ring-pink-500' : ''}`}
              onClick={() => setSelectedGender(selectedGender === 'female' ? null : 'female')}
            >
              <img src="https://images.unsplash.com/photo-1520048330564-702a8875182f" alt="Female Fashion" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white">Women's Fashion</h3>
              </div>
            </div>
          </div>
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

        {/* Amazon Section */}
        <div className="mb-12 hidden md:block">
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
        <div className="mb-12 hidden md:block">
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
        <div className="mb-12 hidden md:block">
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
        <div className="mb-12 hidden md:block">
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
        <div className="md:hidden">
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
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8 text-gray-800 pl-4">
            {selectedGender ? `${selectedGender === 'male' ? "Men's" : "Women's"} Collection` : 'All Products'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {visibleAllOutfits.map(outfit => (
              <ProductCard key={outfit._id} outfit={outfit} />
            ))}
          </div>
          {visibleAllOutfits.length < filteredOutfits.filter(o => ['warm', 'cool', 'neutral'].some(tone => o.recommendedSkinTones.includes(tone))).length && (
            <div className="flex justify-center mt-8">
              <motion.button
                onClick={() => handleShowMore('all')}
                className="px-6 py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                Show More
              </motion.button>
            </div>
          )}
        </div>
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
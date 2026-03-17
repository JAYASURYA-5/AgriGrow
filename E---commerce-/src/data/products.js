// Placeholder image generator - creates SVG images that load instantly
const getPlaceholderImage = (category, productId) => {
  const colors = {
    'Medicines': '%23FF6B6B',
    'Fertilizers': '%234ECDC4',
    'Seeds': '%2395E1D3',
    'Vegetables': '%23A8E6CF',
    'Fruits': '%23FFD3B6'
  };
  const color = colors[category] || '%2395E1D3';
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='${color}' width='400' height='400'/%3E%3Ctext x='200' y='160' font-size='48' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial'%3E${category}%3C/text%3E%3Ctext x='200' y='240' font-size='32' fill='white' text-anchor='middle' font-family='Arial'%3E%23${productId}%3C/text%3E%3C/svg%3E`;
};

export const products = [
  // Medicines (Crop Disease Treatments & Pesticides)
  {
    id: 1,
    name: 'Copper Fungicide',
    price: 399,
    description: 'Effective fungicide for treating various crop diseases. Controls powdery mildew and leaf spot.',
    category: 'Medicines',
    image: getPlaceholderImage('Medicines', 1),
    rating: 4.5,
    reviews: 125,
    stock: 50
  },
  {
    id: 2,
    name: 'Neem Oil Insecticide',
    price: 299,
    description: 'Organic insecticide derived from neem seeds. Safe for organic farming. Controls aphids, mites, and scale insects.',
    category: 'Medicines',
    image: getPlaceholderImage('Medicines', 2),
    rating: 4.7,
    reviews: 89,
    stock: 45
  },
  {
    id: 3,
    name: 'Systemic Pesticide',
    price: 449,
    description: 'Systemic pesticide for soil application. Protects plants from various insect pests for 2-3 weeks.',
    category: 'Medicines',
    image: getPlaceholderImage('Medicines', 3),
    rating: 4.3,
    reviews: 67,
    stock: 35
  },
  {
    id: 4,
    name: 'Sulfur Dust',
    price: 9.99,
    description: 'Powdery sulfur for fungal diseases. Dust directly on affected plants. Natural and effective.',
    category: 'Medicines',
    image: 'https://5.imimg.com/data5/SELLER/Default/2020/10/GT/PO/IO/4632151/sulphur-dust-500x500.jpg',
    rating: 4.6,
    reviews: 102,
    stock: 60
  },

  // Fertilizers
  {
    id: 5,
    name: 'NPK Fertilizer 10-10-10',
    price: 24.99,
    description: 'Balanced NPK fertilizer for general crop growth. Contains nitrogen, phosphorus, and potassium.',
    category: 'Fertilizers',
    image: 'https://down-br.img.susercontent.com/file/br-11134207-7qukw-lj5qm8d3cckw08',
    rating: 4.8,
    reviews: 156,
    stock: 100
  },
  {
    id: 6,
    name: 'DAP Fertilizer',
    price: 22.50,
    description: 'Di-ammonium phosphate for root and flower development. Rich in phosphorus and nitrogen.',
    category: 'Fertilizers',
    image: 'https://m.media-amazon.com/images/I/711KTAxw-ZL._SL1500_.jpg',
    rating: 4.5,
    reviews: 134,
    stock: 80
  },
  {
    id: 7,
    name: 'Urea Fertilizer',
    price: 16.75,
    description: 'High nitrogen content for leafy vegetables and crops requiring rapid growth.',
    category: 'Fertilizers',
    image: 'https://gogarden.co.in/cdn/shop/files/71yg6hRnpTL._SL1200_fac2b8e7-208b-482d-9493-07d03daaff6f.jpg?v=1684132066',
    rating: 4.4,
    reviews: 98,
    stock: 75
  },
  {
    id: 8,
    name: 'Potassium Sulfate',
    price: 19.99,
    description: 'Rich potassium source for fruit and flower development. Improves crop quality.',
    category: 'Fertilizers',
    image: 'https://www.westlab.com.au/media/catalog/product/050a7bb5635ac2c48f7ed1fc51b23f4e/contents/PL026-X/PL026-500G-min.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=1000&width=1000&canvas=1000:1000',
    rating: 4.6,
    reviews: 112,
    stock: 65
  },

  // Seeds
  {
    id: 9,
    name: 'Tomato Seeds (Hybrid)',
    price: 8.50,
    description: 'High-yield hybrid tomato seeds. Disease resistant and produces large fruits. 500 seeds per packet.',
    category: 'Seeds',
    image: 'https://farmshand.in/wp-content/uploads/2024/04/HYBRID-TOMATO-SEEDS.webp',
    rating: 4.7,
    reviews: 189,
    stock: 150
  },
  {
    id: 10,
    name: 'Spinach Seeds',
    price: 6.99,
    description: 'Fast-growing spinach seeds for quick harvests. Nutrient-rich leafy green. 1000 seeds per packet.',
    category: 'Seeds',
    image: 'https://i5.walmartimages.com/asr/4d36952a-1e2a-47e1-8a96-aa91be677a26_1.d32e5ffa17d1724373f90537fde6c3e4.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff',
    rating: 4.5,
    reviews: 76,
    stock: 120
  },
  {
    id: 11,
    name: 'Carrot Seeds',
    price: 7.49,
    description: 'Premium carrot seeds for sweet and tender carrots. Extended shelf life variety. 1000 seeds per packet.',
    category: 'Seeds',
    image: 'https://c8.alamy.com/comp/ABJNH2/carrot-seed-ABJNH2.jpg',
    rating: 4.6,
    reviews: 95,
    stock: 110
  },
  {
    id: 12,
    name: 'Wheat Seeds',
    price: 14.99,
    description: 'High-yield wheat seeds for grain production. Disease tolerant variety. 5 kg pack.',
    category: 'Seeds',
    image: 'https://thumbs.dreamstime.com/b/wheat-seeds-close-up-extreme-background-35551952.jpg',
    rating: 4.4,
    reviews: 82,
    stock: 90
  },

  // Vegetables
  {
    id: 13,
    name: 'Fresh Broccoli',
    price: 3.99,
    description: 'Fresh, organic broccoli florets. High in vitamins and minerals. Per pound.',
    category: 'Vegetables',
    image: 'https://5.imimg.com/data5/SELLER/Default/2020/12/FR/DR/GI/7926714/fresh-broccoli-1000x1000.jpg',
    rating: 4.6,
    reviews: 145,
    stock: 200
  },
  {
    id: 14,
    name: 'Organic Bell Peppers',
    price: 4.50,
    description: 'Colorful organic bell peppers. Sweet taste and crispy texture. Set of 3.',
    category: 'Vegetables',
    image: 'https://img.freepik.com/premium-photo/farmfresh-organic-bell-peppers-multiple-colors_762026-115005.jpg',
    rating: 4.7,
    reviews: 167,
    stock: 180
  },
  {
    id: 15,
    name: 'Green Beans (Fresh)',
    price: 5.99,
    description: 'Crispy fresh green beans. Pesticide-free and locally grown. Per kilogram.',
    category: 'Vegetables',
    image: 'https://www.tastingtable.com/img/gallery/the-absolute-best-ways-to-keep-green-beans-fresh/l-intro-1653397050.jpg',
    rating: 4.5,
    reviews: 123,
    stock: 160
  },
  {
    id: 16,
    name: 'Onions Bundle',
    price: 2.99,
    description: 'Fresh yellow onions. Perfect for cooking. 5 pounds bundle.',
    category: 'Vegetables',
    image: 'https://image.freepik.com/free-photo/bundles-red-onions_78492-1997.jpg',
    rating: 4.4,
    reviews: 98,
    stock: 250
  },

  // Fruits
  {
    id: 17,
    name: 'Organic Apples',
    price: 6.99,
    description: 'Sweet and crispy organic apples. Hand-picked at peak ripeness. 6 count.',
    category: 'Fruits',
    image: 'https://static.vecteezy.com/system/resources/previews/027/228/643/non_2x/delicious-organic-apples-in-autumn-tray-market-agriculture-farm-background-top-view-free-photo.jpg',
    rating: 4.8,
    reviews: 201,
    stock: 120
  },
  {
    id: 18,
    name: 'Fresh Mangoes',
    price: 5.50,
    description: 'Golden ripe mangoes. Sweet and juicy. Perfect for fresh eating. 4 count.',
    category: 'Fruits',
    image: 'https://as1.ftcdn.net/v2/jpg/01/96/99/90/1000_F_196999091_AqreT719XAjzPqkfr1f04jCcHCsfIJdI.jpg',
    rating: 4.6,
    reviews: 156,
    stock: 100
  },
  {
    id: 19,
    name: 'Strawberry Pack',
    price: 7.99,
    description: 'Fresh red strawberries. Rich flavor and high in vitamin C. 1 pound pack.',
    category: 'Fruits',
    image: 'https://images.heb.com/is/image/HEBGrocery/000321286',
    rating: 4.7,
    reviews: 178,
    stock: 90
  },
  {
    id: 20,
    name: 'Banana Bunch',
    price: 3.49,
    description: 'Fresh bananas at perfect ripeness. Great source of potassium. Full bunch.',
    category: 'Fruits',
    image: 'https://as1.ftcdn.net/v2/jpg/01/29/78/40/1000_F_129784069_ec19Olf2YLwe8XtR9xpVTTfe4CvIOKst.jpg',
    rating: 4.5,
    reviews: 134,
    stock: 200
  }
];

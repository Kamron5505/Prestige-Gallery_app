import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';

const categories = [
  {
    name: 'Premium Roses',
    slug: 'premium-roses',
    description: 'Luxury rose arrangements for every occasion',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/roses',
  },
  {
    name: 'Seasonal Blooms',
    slug: 'seasonal-blooms',
    description: 'Fresh seasonal flowers at their peak',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/seasonal',
  },
  {
    name: 'Wedding Collections',
    slug: 'wedding-collections',
    description: 'Elegant bridal bouquets and wedding decor',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/wedding',
  },
  {
    name: 'Bridal Bouquets',
    slug: 'bridal-bouquets',
    description: 'Hand-tied bridal arrangements for your special day',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/bridal',
  },
  {
    name: 'Luxury Gifts',
    slug: 'luxury-gifts',
    description: 'Premium gift sets and arrangements',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/gifts',
  },
  {
    name: 'Sympathy & Tributes',
    slug: 'sympathy-tributes',
    description: 'Respectful arrangements for remembrance',
    image: 'https://res.cloudinary.com/demo/image/upload/v1/prestige-gallery/categories/sympathy',
  },
];

const products = [
  {
    name: 'Velvet Midnight Rose',
    slug: 'velvet-midnight-rose',
    description: 'An exquisite arrangement of 24 hand-selected black velvet roses, wrapped in matte black tissue and finished with an ivory silk ribbon. Each rose is grown in controlled environments for perfect petal formation and deep, velvety texture.',
    price: 450000,
    discountPrice: 340000,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80', alt: 'Velvet Midnight Rose Bouquet' },
      { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80', alt: 'Velvet Midnight Rose Detail' },
    ],
    stock: 15,
    tags: ['roses', 'premium', 'black', 'luxury'],
    isPremium: true,
    isNew: false,
    isGift: true,
    composition: '24 black velvet roses, eucalyptus, ivory ribbon',
    size: 'Large (50cm x 40cm)',
    rating: 4.8,
    reviewCount: 24,
  },
  {
    name: 'Golden Hour Bouquet',
    slug: 'golden-hour-bouquet',
    description: 'A radiant arrangement featuring sun-kissed golden roses, cream peonies, and dried pampas grass. Inspired by the warm glow of golden hour, this bouquet brings sunshine to any room.',
    price: 320000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&q=80', alt: 'Golden Hour Bouquet' },
      { url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=400&q=80', alt: 'Golden Hour Detail' },
    ],
    stock: 20,
    tags: ['roses', 'peonies', 'golden', 'premium'],
    isPremium: true,
    isNew: true,
    isGift: true,
    composition: '12 golden roses, 5 cream peonies, pampas grass',
    size: 'Medium (40cm x 30cm)',
    rating: 4.9,
    reviewCount: 18,
  },
  {
    name: 'Crimson Affair',
    slug: 'crimson-affair',
    description: 'Deep burgundy roses paired with dried lavender and black foliage in a dramatic, romantic arrangement. The perfect statement piece for a special evening.',
    price: 280000,
    discountPrice: 220000,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1589123053640-2e3c4ee6f6e6?w=800&q=80', alt: 'Crimson Affair Bouquet' },
      { url: 'https://images.unsplash.com/photo-1589123053640-2e3c4ee6f6e6?w=400&q=80', alt: 'Crimson Affair Detail' },
    ],
    stock: 12,
    tags: ['roses', 'burgundy', 'romantic', 'premium'],
    isPremium: true,
    isNew: false,
    isGift: true,
    composition: '18 burgundy roses, dried lavender, black foliage',
    size: 'Medium (40cm x 35cm)',
    rating: 4.7,
    reviewCount: 31,
  },
  {
    name: 'Ivory Dream',
    slug: 'ivory-dream',
    description: 'An ethereal bridal bouquet of ivory garden roses, white ranunculus, and silver brunia. Each stem is carefully placed to create an organic, hand-tied look.',
    price: 520000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?w=800&q=80', alt: 'Ivory Dream Bouquet' },
      { url: 'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?w=400&q=80', alt: 'Ivory Dream Detail' },
    ],
    stock: 8,
    tags: ['bridal', 'ivory', 'white', 'wedding', 'premium'],
    isPremium: true,
    isNew: false,
    isGift: false,
    composition: '12 ivory garden roses, 8 white ranunculus, silver brunia',
    size: 'Large (45cm x 35cm)',
    rating: 5.0,
    reviewCount: 15,
  },
  {
    name: 'Wild Meadow Mix',
    slug: 'wild-meadow-mix',
    description: 'A carefree blend of seasonal wildflowers in soft pastels. Dried and fresh blooms intertwine for a textured, bohemian look that lasts.',
    price: 180000,
    discountPrice: 150000,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80', alt: 'Wild Meadow Mix' },
      { url: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&q=80', alt: 'Wild Meadow Detail' },
    ],
    stock: 30,
    tags: ['wildflowers', 'pastel', 'seasonal', 'bohemian'],
    isPremium: false,
    isNew: true,
    isGift: true,
    composition: 'Seasonal wildflowers, dried grasses, limonium',
    size: 'Small (30cm x 25cm)',
    rating: 4.5,
    reviewCount: 42,
  },
  {
    name: 'Royal Orchid Cascade',
    slug: 'royal-orchid-cascade',
    description: 'A cascading arrangement of rare phalaenopsis orchids in deep purple and white. Arranged in a modern ceramic vase, this piece is living art.',
    price: 680000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80', alt: 'Royal Orchid Cascade' },
      { url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80', alt: 'Royal Orchid Detail' },
    ],
    stock: 5,
    tags: ['orchids', 'purple', 'premium', 'luxury', 'vase'],
    isPremium: true,
    isNew: false,
    isGift: true,
    composition: '7 phalaenopsis orchids, ceramic vase included',
    size: 'Extra Large (60cm x 25cm)',
    rating: 4.9,
    reviewCount: 11,
  },
  {
    name: 'Summer Solstice Posy',
    slug: 'summer-solstice-posy',
    description: 'Bright sunflowers, golden chrysanthemums, and terracotta carnations tied with natural jute. A rustic yet refined posy celebrating the longest day.',
    price: 150000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80', alt: 'Summer Solstice Posy' },
      { url: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80', alt: 'Summer Solstice Detail' },
    ],
    stock: 25,
    tags: ['sunflowers', 'summer', 'seasonal', 'bright'],
    isPremium: false,
    isNew: false,
    isGift: true,
    composition: '5 sunflowers, chrysanthemums, carnations, jute wrap',
    size: 'Medium (35cm x 30cm)',
    rating: 4.3,
    reviewCount: 28,
  },
  {
    name: 'Moonlight Serenade',
    slug: 'moonlight-serenade',
    description: 'White and cream blooms arranged in a crescent silhouette. Featuring moonflowers, white lilies, and silver eucalyptus for an ethereal, moonlit effect.',
    price: 380000,
    discountPrice: 310000,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1532658663252-0c7241b0294b?w=800&q=80', alt: 'Moonlight Serenade' },
      { url: 'https://images.unsplash.com/photo-1532658663252-0c7241b0294b?w=400&q=80', alt: 'Moonlight Serenade Detail' },
    ],
    stock: 10,
    tags: ['white', 'moonflower', 'lily', 'evening', 'premium'],
    isPremium: true,
    isNew: true,
    isGift: true,
    composition: 'Moonflowers, white lilies, silver eucalyptus',
    size: 'Large (50cm x 35cm)',
    rating: 4.7,
    reviewCount: 9,
  },
  {
    name: 'Blush Peony Garden',
    slug: 'blush-peony-garden',
    description: 'A lush garden of blush pink peonies, ranunculus, and sweet peas. This voluminous arrangement is a celebration of femininity and spring.',
    price: 420000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1561181286-d5fee8d5cb8c?w=800&q=80', alt: 'Blush Peony Garden' },
      { url: 'https://images.unsplash.com/photo-1561181286-d5fee8d5cb8c?w=400&q=80', alt: 'Blush Peony Detail' },
    ],
    stock: 7,
    tags: ['peonies', 'blush', 'pink', 'spring', 'premium'],
    isPremium: true,
    isNew: false,
    isGift: true,
    composition: '10 blush peonies, ranunculus, sweet peas, eucalyptus',
    size: 'Large (45cm x 40cm)',
    rating: 4.9,
    reviewCount: 36,
  },
  {
    name: 'The Minimalist',
    slug: 'the-minimalist',
    description: 'A single stem of a perfect calla lily or anthurium in a minimalist ceramic cylinder. Clean lines, negative space, architectural beauty.',
    price: 95000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1594741151252-6e5e35c0b07d?w=800&q=80', alt: 'The Minimalist' },
      { url: 'https://images.unsplash.com/photo-1594741151252-6e5e35c0b07d?w=400&q=80', alt: 'The Minimalist Detail' },
    ],
    stock: 50,
    tags: ['minimalist', 'calla lily', 'modern', 'small'],
    isPremium: false,
    isNew: true,
    isGift: false,
    composition: 'Single calla lily with ceramic cylinder vase',
    size: 'Small (25cm x 10cm)',
    rating: 4.4,
    reviewCount: 53,
  },
  {
    name: 'Eternal Love Wreath',
    slug: 'eternal-love-wreath',
    description: 'A preserved rose wreath in deep burgundy and blush, mounted on a brass ring. Designed to last forever — a timeless symbol of enduring love.',
    price: 350000,
    discountPrice: 280000,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1544776193-352d25ca8283?w=800&q=80', alt: 'Eternal Love Wreath' },
      { url: 'https://images.unsplash.com/photo-1544776193-352d25ca8283?w=400&q=80', alt: 'Eternal Love Detail' },
    ],
    stock: 10,
    tags: ['wreath', 'preserved', 'love', 'eternal', 'luxury'],
    isPremium: true,
    isNew: false,
    isGift: true,
    composition: 'Preserved roses on brass ring, 30cm diameter',
    size: 'Medium (30cm diameter)',
    rating: 4.6,
    reviewCount: 19,
  },
  {
    name: 'Spring Awakening',
    slug: 'spring-awakening',
    description: 'A celebration of spring with tulips, hyacinths, and daffodils in soft yellows, creams, and pale greens. Arranged in a woven basket lined with moss.',
    price: 220000,
    discountPrice: null,
    category: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?w=800&q=80', alt: 'Spring Awakening' },
      { url: 'https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?w=400&q=80', alt: 'Spring Awakening Detail' },
    ],
    stock: 18,
    tags: ['spring', 'tulips', 'hyacinth', 'seasonal'],
    isPremium: false,
    isNew: false,
    isGift: true,
    composition: 'Tulips, hyacinths, daffodils in moss-lined basket',
    size: 'Medium (35cm x 30cm)',
    rating: 4.5,
    reviewCount: 22,
  },
];

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Favorite.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@prestigegallery.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);

    // Create test customer
    const customer = await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'customer123456',
      role: 'customer',
      addresses: [
        {
          label: 'Home',
          street: '12 Amir Temur Street',
          city: 'Tashkent',
          state: 'Tashkent City',
          zip: '100000',
          country: 'Uzbekistan',
          isDefault: true,
        },
      ],
    });
    console.log(`Customer created: ${customer.email}`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map category references to products
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    const productsWithCategories = products.map((product) => {
      let categorySlug;
      if (product.tags.includes('wedding') || product.tags.includes('bridal')) {
        categorySlug = product.tags.includes('bridal') ? 'bridal-bouquets' : 'wedding-collections';
      } else if (product.tags.includes('premium') || product.tags.includes('luxury')) {
        categorySlug = 'premium-roses';
      } else if (product.tags.includes('seasonal') || product.tags.includes('spring') || product.tags.includes('summer')) {
        categorySlug = 'seasonal-blooms';
      } else if (product.tags.includes('gift') || product.name.includes('Gift')) {
        categorySlug = 'luxury-gifts';
      } else {
        categorySlug = 'premium-roses';
      }
      return { ...product, category: categoryMap[categorySlug] };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n🌷 Seed completed successfully!');
    console.log('Admin credentials: admin@prestigegallery.com / admin123456');
    console.log('Customer credentials: customer@test.com / customer123456');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();

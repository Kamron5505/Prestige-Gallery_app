import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';
import slugify from 'slugify';

export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, premium, new: isNew, gift, search, sort, page, limit } = req.validatedQuery;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (premium) filter.isPremium = true;
    if (isNew) filter.isNew = true;
    if (gift) filter.isGift = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { reviewCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      throw new AppError('Product not found.', 404);
    }
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const data = req.validatedBody;
    const slug = slugify(data.name, { lower: true, strict: true });

    const existingSlug = await Product.findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const images = req.files?.length
      ? req.files.map((file) => ({
          url: file.path,
          alt: data.name,
        }))
      : [{ url: '/uploads/placeholder.jpg', alt: data.name }];

    const product = await Product.create({
      ...data,
      slug: finalSlug,
      images,
    });

    await product.populate('category', 'name slug');

    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const data = req.validatedBody;
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    if (data.name && data.name !== product.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
      const existingSlug = await Product.findOne({ slug: data.slug, _id: { $ne: req.params.id } });
      if (existingSlug) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    if (req.files?.length) {
      data.images = req.files.map((file) => ({
        url: file.path,
        alt: data.name || product.name,
      }));
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({ success: true, data: { product: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) {
      throw new AppError('Product not found.', 404);
    }
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .populate('category', 'name slug');

    res.json({ success: true, data: { products: related } });
  } catch (error) {
    next(error);
  }
};

import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'product',
        populate: { path: 'category', select: 'name slug' },
      })
      .sort('-createdAt');

    res.json({ success: true, data: { favorites } });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    if (existing) {
      return res.json({ success: true, message: 'Already in favorites.' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      product: req.params.productId,
    });

    res.status(201).json({ success: true, data: { favorite } });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId,
    });

    if (!favorite) {
      throw new AppError('Favorite not found.', 404);
    }

    res.json({ success: true, message: 'Removed from favorites.' });
  } catch (error) {
    next(error);
  }
};

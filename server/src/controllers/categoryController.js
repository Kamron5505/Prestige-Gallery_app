import Category from '../models/Category.js';
import { AppError } from '../middleware/errorHandler.js';
import slugify from 'slugify';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const category = await Category.create({ name, slug, description });
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new AppError('Category not found.', 404);
    }
    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) {
      throw new AppError('Category not found.', 404);
    }
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    next(error);
  }
};

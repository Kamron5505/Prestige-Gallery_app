import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    composition: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('discountPercentage').get(function () {
  if (!this.discountPrice) return null;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isPremium: 1, isNew: 1, isGift: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;

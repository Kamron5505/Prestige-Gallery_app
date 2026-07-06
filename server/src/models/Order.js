import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [orderItemSchema],
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      zip: { type: String },
      country: { type: String, default: 'Uzbekistan' },
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer'],
      default: 'cash',
    },
    promoCode: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const timestamp = date.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `PG-${timestamp}${random}`;
  }
  next();
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;

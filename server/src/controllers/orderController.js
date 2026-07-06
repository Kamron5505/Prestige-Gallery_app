import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

export const createOrder = async (req, res, next) => {
  try {
    const data = req.validatedBody;

    // Fetch products and calculate pricing
    const productIds = data.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found or unavailable.', 400);
    }

    const productMap = {};
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const product = productMap[item.product];
      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;
      return {
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
      };
    });

    let discount = 0;
    // Simple promo code logic
    if (data.promoCode === 'PRESTIGE10') {
      discount = subtotal * 0.1;
    }

    const total = subtotal - discount;

    const orderData = {
      items: orderItems,
      customerInfo: data.customerInfo,
      deliveryAddress: data.deliveryAddress,
      deliveryDate: new Date(data.deliveryDate),
      deliveryTime: data.deliveryTime,
      subtotal,
      discount,
      total,
      paymentMethod: data.paymentMethod || 'cash',
      promoCode: data.promoCode,
      notes: data.notes,
    };

    if (req.user) {
      orderData.user = req.user._id;
    }

    const order = await Order.create(orderData);

    // Update stock
    for (const item of data.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate('items.product', 'name slug images')
      .sort('-createdAt');

    res.json({ success: true, data: { orders } });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name slug images price'
    );

    if (!order) {
      throw new AppError('Order not found.', 404);
    }

    // Non-admin users can only see their own orders
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized.', 403);
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(paymentStatus && { paymentStatus }) },
      { new: true, runValidators: true }
    );

    if (!order) {
      throw new AppError('Order not found.', 404);
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

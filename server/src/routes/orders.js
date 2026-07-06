import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidator.js';

const router = Router();

router.post('/', optionalAuth, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, requireAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;

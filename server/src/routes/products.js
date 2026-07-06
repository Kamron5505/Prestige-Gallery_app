import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, getRelatedProducts } from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../validators/productValidator.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', validate(productQuerySchema), getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

router.post('/', authenticate, requireAdmin, upload.array('images', 5), validate(createProductSchema), createProduct);
router.put('/:id', authenticate, requireAdmin, upload.array('images', 5), validate(updateProductSchema), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;

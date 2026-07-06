import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getFavorites);
router.post('/:productId', authenticate, addFavorite);
router.delete('/:productId', authenticate, removeFavorite);

export default router;

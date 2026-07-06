import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refresh, logout, getMe, updateProfile, addAddress, deleteAddress } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);
router.post('/addresses', authenticate, addAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);

export default router;

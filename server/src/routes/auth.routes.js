import express from 'express';
import { registerUser, loginUser, getMe, changePassword,  logoutUser } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.patch('/change-password',protect,changePassword);

export default router;

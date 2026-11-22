
import { Router } from 'express';

import {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
} from '../controllers/authController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.post('/forgot-password', forgotPassword);

export default router;

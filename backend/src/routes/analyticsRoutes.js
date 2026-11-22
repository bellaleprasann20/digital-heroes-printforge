
import { Router } from 'express';
import {
  getDashboardStats,
  getRevenueReport
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueReport);

export default router;



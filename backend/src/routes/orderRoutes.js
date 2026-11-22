import { Router } from 'express';
import {
  getMyOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  reorder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/', getMyOrders);

// Admin-only route — must stay before /:id.
router.get('/admin', requireAdmin, getAllOrders);

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/reorder', reorder);

export default router;

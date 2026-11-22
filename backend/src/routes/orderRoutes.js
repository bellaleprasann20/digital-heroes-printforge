
import { Router } from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  reorder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/reorder', reorder);

export default router;


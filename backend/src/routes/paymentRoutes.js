
import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;


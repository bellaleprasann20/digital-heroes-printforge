
import { Router } from 'express';
import {
  calculateQuote,
  validateQuote
} from '../controllers/pricingController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/quote', calculateQuote);
router.post('/validate', authenticate, validateQuote);

export default router;


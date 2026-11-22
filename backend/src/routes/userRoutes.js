
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getCustomers,
  updateCustomerRole
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

router.get('/customers', requireAdmin, getCustomers);
router.patch('/customers/:userId/role', requireAdmin, updateCustomerRole);

export default router;



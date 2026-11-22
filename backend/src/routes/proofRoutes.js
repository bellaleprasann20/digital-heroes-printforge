
import { Router } from 'express';
import {
  getProofs,
  getProofVersions,
  approveProof,
  requestChanges
} from '../controllers/proofController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, getProofs);
router.get('/versions/:orderId', authenticate, getProofVersions);

router.post('/:id/approve', authenticate, approveProof);
router.post('/:id/request-changes', authenticate, requestChanges);

// Admin proof-management operations will be added separately.

export default router;




import { Router } from 'express';
import {
  getProductionQueue,
  updateProductionStage,
  getProductionFiles
} from '../controllers/productionController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/queue', getProductionQueue);
router.patch('/:orderId/stage', updateProductionStage);
router.get('/:orderId/files', getProductionFiles);

export default router;



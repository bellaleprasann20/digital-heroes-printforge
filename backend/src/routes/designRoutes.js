
import { Router } from 'express';
import {
  getDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
  duplicateDesign
} from '../controllers/designController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getDesigns);
router.post('/', createDesign);
router.get('/:id', getDesignById);
router.patch('/:id', updateDesign);
router.delete('/:id', deleteDesign);
router.post('/:id/duplicate', duplicateDesign);

export default router;


import { Router } from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getServices);                                              // Public
router.get('/:id', getServiceById);                                        // Public
router.post('/', protect, requireRole('admin'), createService);            // Admin
router.put('/:id', protect, requireRole('admin'), updateService);          // Admin
router.delete('/:id', protect, requireRole('admin'), deleteService);       // Admin

export default router;

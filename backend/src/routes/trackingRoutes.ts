import express from 'express';
import { trackingController } from '../controllers/trackingController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/update', protect, requireRole('technician'), trackingController.updateLocation);
router.get('/all', protect, requireRole('admin'), trackingController.getAllActiveTracking);
router.get('/:technicianId', protect, trackingController.getTechnicianLocation);

export default router;

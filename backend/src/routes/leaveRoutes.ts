import express from 'express';
import { leaveController } from '../controllers/leaveController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/apply', protect, leaveController.apply);
router.get('/', protect, leaveController.getAll);
router.put('/:id/status', protect, requireRole('admin'), leaveController.updateStatus);

export default router;

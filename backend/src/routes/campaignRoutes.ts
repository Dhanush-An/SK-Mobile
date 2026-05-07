import express from 'express';
import { campaignController } from '../controllers/campaignController';
import { protect, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all', campaignController.getAll);
router.post('/create', protect, requireRole('admin'), campaignController.create);
router.delete('/:id', protect, requireRole('admin'), campaignController.delete);

export default router;

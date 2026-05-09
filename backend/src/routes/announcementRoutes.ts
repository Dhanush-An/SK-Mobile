import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware';
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController';

const router = express.Router();

// Publicly accessible for logged in users (technicians, admins)
router.use(protect);

router.get('/', getAllAnnouncements);

// Restricted to Admin
router.post('/', requireRole('admin'), createAnnouncement);
router.delete('/:id', requireRole('admin'), deleteAnnouncement);


export default router;

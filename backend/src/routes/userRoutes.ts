import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  updateTechnicianStatus,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Admin routes
router.get('/', protect, requireRole('admin'), getAllUsers);
router.get('/:id', protect, requireRole('admin'), getUserById);
router.put('/:id/role', protect, requireRole('admin'), updateUserRole);
router.put('/:id/status', protect, requireRole('admin'), updateUserStatus);

// Technician route
router.put('/technician/status', protect, requireRole('technician'), updateTechnicianStatus);

export default router;

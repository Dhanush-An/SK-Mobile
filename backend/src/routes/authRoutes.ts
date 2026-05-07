import { Router } from 'express';
import { register, login, getProfile, updateProfile, onboardTechnician, getTechnicians, updateUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/onboard-tech', protect, requireRole('admin'), onboardTechnician);
router.get('/technicians', protect, requireRole('admin'), getTechnicians);
router.put('/users/:id', protect, requireRole('admin'), updateUser);

export default router;

import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getAssignedOrders,
  getOrderById,
  assignTechnician,
  updateOrderStatus,
  cancelOrder,
  getReports,
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

// Customer
router.post('/', protect, requireRole('customer'), createOrder);
router.get('/my', protect, requireRole('customer'), getMyOrders);
router.put('/:id/cancel', protect, requireRole('customer'), cancelOrder);

// Admin
router.get('/all', protect, requireRole('admin'), getAllOrders);
router.get('/reports', protect, requireRole('admin'), getReports);
router.put('/:id/assign', protect, requireRole('admin'), assignTechnician);

// Technician
router.get('/assigned', protect, requireRole('technician'), getAssignedOrders);

// Admin + Technician
router.put('/:id/status', protect, requireRole('admin', 'technician'), updateOrderStatus);

// Any authenticated user (access controlled in controller)
router.get('/:id', protect, getOrderById);

export default router;

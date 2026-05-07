import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentByOrder,
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/create-order', protect, requireRole('customer'), createPaymentOrder);
router.post('/verify', protect, requireRole('customer'), verifyPayment);
router.get('/order/:orderId', protect, getPaymentByOrder);

export default router;

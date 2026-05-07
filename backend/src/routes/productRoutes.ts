import { Router } from 'express';
import { createProduct, getProducts, deleteProduct } from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', protect, requireRole('admin'), createProduct);
router.delete('/:id', protect, requireRole('admin'), deleteProduct);

export default router;

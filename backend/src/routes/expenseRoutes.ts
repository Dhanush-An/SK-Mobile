import express from 'express';
import { getExpenses, createExpense, updateExpenseStatus } from '../controllers/expenseController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getExpenses);
router.post('/', requireRole('technician', 'admin'), createExpense);
router.put('/:id/status', requireRole('admin'), updateExpenseStatus);

export default router;

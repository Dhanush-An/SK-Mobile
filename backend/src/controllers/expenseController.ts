import { Request, Response } from 'express';
import Expense from '../models/Expense';
import { AuthRequest } from '../middleware/authMiddleware';


// GET /api/expenses (Admin) or /api/expenses/my (Technician)
export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'admin';
    
    const query = isAdmin ? {} : { technicianId: req.user?.userId };
    const expenses = await Expense.find(query).populate('technicianId', 'name email role');
    res.status(200).json({ success: true, data: expenses });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/expenses (Technician)
export const createExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { description, amount, date, category, type } = req.body;
    
    const expense = await Expense.create({
      technicianId: req.user?.userId,
      description,
      amount,
      category: category || 'General',
      type: type || (req.user?.role === 'admin' ? 'admin' : 'employee'),
      date
    });
    res.status(201).json({ success: true, data: expense });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/expenses/:id/status (Admin)
export const updateExpenseStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!expense) {
      res.status(404).json({ success: false, message: 'Expense not found' });
      return;
    }
    res.status(200).json({ success: true, data: expense });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

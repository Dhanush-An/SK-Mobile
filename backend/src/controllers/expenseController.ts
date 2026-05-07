import { Request, Response } from 'express';
import Expense from '../models/Expense';
import { AuthRequest } from '../middleware/authMiddleware';
import { isDbConnected, mockData, saveMockData } from '../utils/mockStore';

// GET /api/expenses (Admin) or /api/expenses/my (Technician)
export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'admin';
    
    if (!isDbConnected()) {
      let data = mockData.expenses;
      if (!isAdmin) {
        data = data.filter((e: any) => e.technicianId === req.user?.userId);
      }
      // Attach role for frontend filtering
      const enrichedData = data.map((e: any) => {
        const user = mockData.users.find((u: any) => u._id === e.technicianId);
        return { ...e, technicianId: { _id: e.technicianId, name: user?.name, role: user?.role } };
      });
      res.status(200).json({ success: true, data: enrichedData });
      return;
    }

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
    
    if (!isDbConnected()) {
      const newExpense = {
        _id: `mock_exp_${Date.now()}`,
        technicianId: req.user?.userId,
        description,
        amount: Number(amount),
        status: 'pending',
        category: category || 'General',
        type: type || (req.user?.role === 'admin' ? 'admin' : 'employee'),
        date: date || new Date(),
        createdAt: new Date()
      };
      mockData.expenses.push(newExpense);
      saveMockData();
      res.status(201).json({ success: true, data: newExpense });
      return;
    }

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

    if (!isDbConnected()) {
      const index = mockData.expenses.findIndex((e: any) => e._id === req.params.id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Expense not found' });
        return;
      }
      mockData.expenses[index].status = status;
      saveMockData();
      res.status(200).json({ success: true, data: mockData.expenses[index] });
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

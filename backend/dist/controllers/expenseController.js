"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseStatus = exports.createExpense = exports.getExpenses = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
// GET /api/expenses (Admin) or /api/expenses/my (Technician)
const getExpenses = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin';
        const query = isAdmin ? {} : { technicianId: req.user?.userId };
        const expenses = await Expense_1.default.find(query).populate('technicianId', 'name email role');
        res.status(200).json({ success: true, data: expenses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getExpenses = getExpenses;
// POST /api/expenses (Technician)
const createExpense = async (req, res) => {
    try {
        const { description, amount, date, category, type } = req.body;
        const expense = await Expense_1.default.create({
            technicianId: req.user?.userId,
            description,
            amount,
            category: category || 'General',
            type: type || (req.user?.role === 'admin' ? 'admin' : 'employee'),
            date
        });
        res.status(201).json({ success: true, data: expense });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createExpense = createExpense;
// PUT /api/expenses/:id/status (Admin)
const updateExpenseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }
        const expense = await Expense_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!expense) {
            res.status(404).json({ success: false, message: 'Expense not found' });
            return;
        }
        res.status(200).json({ success: true, data: expense });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateExpenseStatus = updateExpenseStatus;
//# sourceMappingURL=expenseController.js.map
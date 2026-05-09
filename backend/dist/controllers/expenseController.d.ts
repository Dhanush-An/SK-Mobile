import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getExpenses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createExpense: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateExpenseStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=expenseController.d.ts.map
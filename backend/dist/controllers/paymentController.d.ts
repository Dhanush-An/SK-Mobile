import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const createPaymentOrder: (req: AuthRequest, res: Response) => Promise<void>;
export declare const verifyPayment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getPaymentByOrder: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=paymentController.d.ts.map
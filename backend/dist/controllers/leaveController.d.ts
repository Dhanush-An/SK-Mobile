import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const leaveController: {
    apply: (req: AuthRequest, res: Response) => Promise<void>;
    getAll: (req: AuthRequest, res: Response) => Promise<void>;
    updateStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=leaveController.d.ts.map
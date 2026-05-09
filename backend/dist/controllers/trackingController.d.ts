import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const trackingController: {
    updateLocation: (req: AuthRequest, res: Response) => Promise<void>;
    getTechnicianLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllActiveTracking: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=trackingController.d.ts.map
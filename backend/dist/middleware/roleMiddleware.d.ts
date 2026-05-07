import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleMiddleware.d.ts.map
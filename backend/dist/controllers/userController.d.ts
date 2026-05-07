import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getAllUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUserById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserRole: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserStatus: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTechnicianStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map
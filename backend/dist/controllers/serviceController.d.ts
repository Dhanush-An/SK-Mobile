import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const createService: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getServices: (req: Request, res: Response) => Promise<void>;
export declare const getServiceById: (req: Request, res: Response) => Promise<void>;
export declare const updateService: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteService: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=serviceController.d.ts.map
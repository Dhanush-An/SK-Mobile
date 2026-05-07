import { Request, Response, NextFunction } from 'express';
interface AppError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, string>;
}
export declare const errorMiddleware: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=errorMiddleware.d.ts.map
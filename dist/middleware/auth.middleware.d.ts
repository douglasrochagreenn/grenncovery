import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types/auth.types';
export declare class AuthMiddleware {
    static authenticate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
    static requireAdmin(req: IAuthRequest, res: Response, next: NextFunction): void;
    static requireRole(roles: string[]): (req: IAuthRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=auth.middleware.d.ts.map
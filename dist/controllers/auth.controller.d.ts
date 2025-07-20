import { Request, Response } from 'express';
export declare class AuthController {
    private static loginSchema;
    private static registerSchema;
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static getProfile(req: Request, res: Response): Promise<void>;
    static verifyToken(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map
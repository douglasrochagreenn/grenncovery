import { IJwtPayload } from '../types/auth.types';
export declare class JwtService {
    static generateToken(payload: {
        userId: string;
        email: string;
        role: string;
    }): string;
    static verifyToken(token: string): IJwtPayload;
    static decodeToken(token: string): IJwtPayload | null;
    static extractTokenFromHeader(authHeader: string | undefined): string | null;
    static isTokenExpiringSoon(token: string): boolean;
    static getTokenInfo(token: string): {
        valid: boolean;
        expiresAt?: Date;
        user?: {
            userId: string;
            email: string;
            role: string;
        };
    };
}
//# sourceMappingURL=jwt.d.ts.map
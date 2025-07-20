"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'greenncovery-jwt-secret-key-2024-super-secure-token';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '30d');
class JwtService {
    static generateToken(payload) {
        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN || '30d'
        };
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }
    static decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded;
        }
        catch {
            return null;
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader?.startsWith('Bearer '))
            return null;
        return authHeader.slice(7);
    }
    static isTokenExpiringSoon(token) {
        const decoded = this.decodeToken(token);
        if (!decoded?.exp)
            return true;
        const now = Math.floor(Date.now() / 1000);
        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        return (decoded.exp - now) < sevenDaysInSeconds;
    }
    static getTokenInfo(token) {
        try {
            const decoded = this.verifyToken(token);
            return {
                valid: true,
                expiresAt: new Date(decoded.exp * 1000),
                user: {
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role
                }
            };
        }
        catch {
            return { valid: false };
        }
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.js.map
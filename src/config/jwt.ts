import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'greenncovery-jwt-secret-key-2024-super-secure-token';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export class JwtService {
  /**
   * Gera um token JWT
   */
  static generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
      expiresIn: JWT_EXPIRES_IN
    });
  }

  /**
   * Verifica e decodifica um token JWT
   */
  static verifyToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET as jwt.Secret) as IJwtPayload;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Decodifica um token sem verificar (para debug)
   */
  static decodeToken(token: string): IJwtPayload | null {
    try {
      return jwt.decode(token) as IJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrai token do header Authorization
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Verifica se o token está próximo do vencimento (últimos 7 dias)
   */
  static isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      
      return (decoded.exp - now) < sevenDaysInSeconds;
    } catch (error) {
      return true;
    }
  }

  /**
   * Obtém informações do token
   */
  static getTokenInfo(token: string): { valid: boolean; expiresAt?: Date; user?: any } {
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
    } catch (error) {
      return { valid: false };
    }
  }
} 
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types/auth.types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'nathan-webhook-secret-key-2024-super-secure';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export class JwtService {
  /**
   * Gera um token JWT
   */
  static generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
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
} 
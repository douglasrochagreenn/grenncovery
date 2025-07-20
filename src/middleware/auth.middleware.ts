import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { IAuthRequest } from '../types/auth.types';
import { logger } from '../config/logger';

export class AuthMiddleware {
  /**
   * Middleware para verificar se o usuário está autenticado
   */
  static async authenticate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'Token de autenticação não fornecido',
          message: 'É necessário fornecer um token Bearer válido'
        });
        return;
      }

      const token = authHeader.substring(7);
      
      // Verificar token (implementação temporária)
      const decoded = this.verifyToken(token);
      
      // Buscar usuário no banco
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Usuário não encontrado',
          message: 'Token válido, mas usuário não existe'
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Usuário inativo',
          message: 'Sua conta foi desativada'
        });
        return;
      }

      // Adicionar usuário à requisição
      req.user = user;
      next();
      
    } catch (error) {
      logger.error('Erro na autenticação:', error);
      res.status(401).json({
        success: false,
        error: 'Token inválido',
        message: 'Token de autenticação inválido ou expirado'
      });
    }
  }

  /**
   * Middleware para verificar se o usuário tem role de admin
   */
  static requireAdmin(req: IAuthRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Não autenticado',
        message: 'É necessário estar autenticado'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Acesso negado',
        message: 'É necessário ter permissão de administrador'
      });
      return;
    }

    next();
  }

  /**
   * Middleware para verificar se o usuário tem role específica
   */
  static requireRole(roles: string[]) {
    return (req: IAuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Não autenticado',
          message: 'É necessário estar autenticado'
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: 'Acesso negado',
          message: `É necessário ter uma das seguintes permissões: ${roles.join(', ')}`
        });
        return;
      }

      next();
    };
  }

  /**
   * Verificação temporária de token (será substituída pelo JwtService)
   */
  private static verifyToken(token: string): { userId: string; email: string; role: string } {
    // Implementação temporária - será substituída pelo JwtService
    try {
      // Decodificar base64 para simular verificação
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      
      if (parts.length !== 3) {
        throw new Error('Token inválido');
      }

      return {
        userId: parts[0],
        email: parts[1],
        role: parts[2]
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
} 
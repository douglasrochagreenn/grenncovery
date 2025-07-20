import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { JwtService } from '../config/jwt';
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

      const token = JwtService.extractTokenFromHeader(authHeader);
      
      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Token malformado',
          message: 'Formato do token inválido'
        });
        return;
      }

      // Verificar token JWT
      const decoded = JwtService.verifyToken(token);
      
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
} 
import { Request, Response } from 'express';
import Joi from 'joi';
import { User } from '../models/user.model';
import { logger } from '../config/logger';
import { ILoginRequest, IRegisterRequest, ILoginResponse, IRegisterResponse } from '../types/auth.types';

export class AuthController {
  // Schema de validação para login
  private static loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ser válido',
      'any.required': 'Email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    })
  });

  // Schema de validação para registro
  private static registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome não pode ter mais de 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ser válido',
      'any.required': 'Email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirmação de senha deve ser igual à senha',
      'any.required': 'Confirmação de senha é obrigatória'
    })
  });

  /**
   * Registra um novo usuário
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validar dados de entrada
      const { error, value } = AuthController.registerSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const { name, email, password }: IRegisterRequest = value;

      // Verificar se o email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Email já cadastrado',
          message: 'Este email já está sendo usado por outro usuário'
        });
        return;
      }

      // Criar novo usuário
      const user = new User({
        name,
        email,
        password,
        role: 'user', // Por padrão, novos usuários são 'user'
        isActive: true
      });

      await user.save();

      // Gerar token (implementação temporária)
      const token = AuthController.generateTemporaryToken(user._id.toString(), user.email, user.role);

      // Atualizar último login
      await user.updateLastLogin();

      const response: IRegisterResponse = {
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          token,
          expiresIn: '7d'
        }
      };

      logger.info(`Novo usuário registrado: ${email}`);
      res.status(201).json(response);

    } catch (error) {
      logger.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao registrar usuário'
      });
    }
  }

  /**
   * Faz login do usuário
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validar dados de entrada
      const { error, value } = AuthController.loginSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const { email, password }: ILoginRequest = value;

      // Buscar usuário com senha
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
        return;
      }

      // Verificar se o usuário está ativo
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          error: 'Conta desativada',
          message: 'Sua conta foi desativada. Entre em contato com o suporte.'
        });
        return;
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas',
          message: 'Email ou senha incorretos'
        });
        return;
      }

      // Gerar token (implementação temporária)
      const token = AuthController.generateTemporaryToken(user._id.toString(), user.email, user.role);

      // Atualizar último login
      await user.updateLastLogin();

      const response: ILoginResponse = {
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          },
          token,
          expiresIn: '7d'
        }
      };

      logger.info(`Login realizado: ${email}`);
      res.status(200).json(response);

    } catch (error) {
      logger.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao realizar login'
      });
    }
  }

  /**
   * Obtém informações do usuário logado
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // O usuário já está disponível através do middleware de autenticação
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Não autenticado',
          message: 'É necessário estar autenticado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Perfil obtido com sucesso',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      });

    } catch (error) {
      logger.error('Erro ao obter perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao obter perfil do usuário'
      });
    }
  }

  /**
   * Gera token temporário (será substituído pelo JwtService)
   */
  private static generateTemporaryToken(userId: string, email: string, role: string): string {
    const payload = `${userId}:${email}:${role}`;
    return Buffer.from(payload).toString('base64');
  }
} 
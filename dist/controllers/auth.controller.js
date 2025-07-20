"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const joi_1 = __importDefault(require("joi"));
const user_model_1 = require("../models/user.model");
const logger_1 = require("../config/logger");
const jwt_1 = require("../config/jwt");
class AuthController {
    static async register(req, res) {
        try {
            const { error, value } = AuthController.registerSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.details.map(detail => detail.message)
                });
                return;
            }
            const { name, email, password } = value;
            const existingUser = await user_model_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'Email já cadastrado',
                    message: 'Este email já está sendo usado por outro usuário'
                });
                return;
            }
            const user = new user_model_1.User({
                name,
                email,
                password,
                role: 'user',
                isActive: true
            });
            await user.save();
            const token = jwt_1.JwtService.generateToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            });
            await user.updateLastLogin();
            const response = {
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
                    expiresIn: '30d'
                }
            };
            logger_1.logger.info(`Novo usuário registrado: ${email}`);
            res.status(201).json(response);
        }
        catch (error) {
            logger_1.logger.error('Erro no registro:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao registrar usuário'
            });
        }
    }
    static async login(req, res) {
        try {
            const { error, value } = AuthController.loginSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.details.map(detail => detail.message)
                });
                return;
            }
            const { email, password } = value;
            const user = await user_model_1.User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Credenciais inválidas',
                    message: 'Email ou senha incorretos'
                });
                return;
            }
            if (!user.isActive) {
                res.status(401).json({
                    success: false,
                    error: 'Conta desativada',
                    message: 'Sua conta foi desativada. Entre em contato com o suporte.'
                });
                return;
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    error: 'Credenciais inválidas',
                    message: 'Email ou senha incorretos'
                });
                return;
            }
            const token = jwt_1.JwtService.generateToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            });
            await user.updateLastLogin();
            const response = {
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
                    expiresIn: '30d'
                }
            };
            logger_1.logger.info(`Login realizado: ${email}`);
            res.status(200).json(response);
        }
        catch (error) {
            logger_1.logger.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao realizar login'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const user = req.user;
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
        }
        catch (error) {
            logger_1.logger.error('Erro ao obter perfil:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao obter perfil do usuário'
            });
        }
    }
    static async verifyToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = jwt_1.JwtService.extractTokenFromHeader(authHeader);
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: 'Token não fornecido',
                    message: 'É necessário fornecer um token Bearer'
                });
                return;
            }
            const tokenInfo = jwt_1.JwtService.getTokenInfo(token);
            if (!tokenInfo.valid) {
                res.status(401).json({
                    success: false,
                    error: 'Token inválido',
                    message: 'Token inválido ou expirado'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Token válido',
                data: {
                    valid: true,
                    expiresAt: tokenInfo.expiresAt,
                    user: tokenInfo.user,
                    expiringSoon: jwt_1.JwtService.isTokenExpiringSoon(token)
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erro ao verificar token:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao verificar token'
            });
        }
    }
}
exports.AuthController = AuthController;
AuthController.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Email deve ser válido',
        'any.required': 'Email é obrigatório'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Senha deve ter pelo menos 6 caracteres',
        'any.required': 'Senha é obrigatória'
    })
});
AuthController.registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        'string.min': 'Nome deve ter pelo menos 2 caracteres',
        'string.max': 'Nome não pode ter mais de 100 caracteres',
        'any.required': 'Nome é obrigatório'
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Email deve ser válido',
        'any.required': 'Email é obrigatório'
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.min': 'Senha deve ter pelo menos 6 caracteres',
        'any.required': 'Senha é obrigatória'
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().messages({
        'any.only': 'Confirmação de senha deve ser igual à senha',
        'any.required': 'Confirmação de senha é obrigatória'
    })
});
//# sourceMappingURL=auth.controller.js.map
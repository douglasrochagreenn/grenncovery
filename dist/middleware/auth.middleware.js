"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
const logger_1 = require("../config/logger");
class AuthMiddleware {
    static async authenticate(req, res, next) {
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
            const token = jwt_1.JwtService.extractTokenFromHeader(authHeader);
            if (!token) {
                res.status(401).json({
                    success: false,
                    error: 'Token malformado',
                    message: 'Formato do token inválido'
                });
                return;
            }
            const decoded = jwt_1.JwtService.verifyToken(token);
            const user = await user_model_1.User.findById(decoded.userId).select('-password');
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
            req.user = user;
            next();
        }
        catch (error) {
            logger_1.logger.error('Erro na autenticação:', error);
            res.status(401).json({
                success: false,
                error: 'Token inválido',
                message: 'Token de autenticação inválido ou expirado'
            });
        }
    }
    static requireAdmin(req, res, next) {
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
    static requireRole(roles) {
        return (req, res, next) => {
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
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map
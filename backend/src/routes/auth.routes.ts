import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@exemplo.com"
 *           description: Email do usuário
 *         password:
 *           type: string
 *           example: "123456"
 *           description: Senha do usuário
 *           minLength: 6
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           example: "João Silva"
 *           description: Nome completo do usuário
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@exemplo.com"
 *           description: Email do usuário
 *         password:
 *           type: string
 *           example: "123456"
 *           description: Senha do usuário
 *           minLength: 6
 *         confirmPassword:
 *           type: string
 *           example: "123456"
 *           description: Confirmação da senha
 *           minLength: 6
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           example: "joao.silva@exemplo.com"
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           example: "user"
 *         isActive:
 *           type: boolean
 *           example: true
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T19:09:10.312Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T19:09:10.312Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T19:09:10.312Z"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login realizado com sucesso"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserResponse'
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             expiresIn:
 *               type: string
 *               example: "7d"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Dados inválidos"
 *         message:
 *           type: string
 *           example: "Email ou senha incorretos"
 *         details:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Email deve ser válido", "Senha é obrigatória"]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: |
 *       Cria uma nova conta de usuário no sistema.
 *       
 *       **Validações:**
 *       - Nome deve ter entre 2 e 100 caracteres
 *       - Email deve ser válido e único
 *       - Senha deve ter pelo menos 6 caracteres
 *       - Confirmação de senha deve ser igual à senha
 *       
 *       **Resposta:**
 *       - Retorna dados do usuário criado
 *       - Retorna token JWT para autenticação
 *       - Token expira em 7 dias
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             name: "João Silva"
 *             email: "joao.silva@exemplo.com"
 *             password: "123456"
 *             confirmPassword: "123456"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Usuário registrado com sucesso"
 *               data:
 *                 user:
 *                   _id: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                   name: "João Silva"
 *                   email: "joao.silva@exemplo.com"
 *                   role: "user"
 *                   isActive: true
 *                   lastLogin: "2025-01-19T19:09:10.312Z"
 *                   createdAt: "2025-01-19T19:09:10.312Z"
 *                   updatedAt: "2025-01-19T19:09:10.312Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn: "7d"
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Erro de validação
 *                 value:
 *                   success: false
 *                   error: "Dados inválidos"
 *                   details: ["Nome deve ter pelo menos 2 caracteres", "Email deve ser válido"]
 *               email_exists:
 *                 summary: Email já cadastrado
 *                 value:
 *                   success: false
 *                   error: "Email já cadastrado"
 *                   message: "Este email já está sendo usado por outro usuário"
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz login do usuário
 *     description: |
 *       Autentica um usuário existente e retorna um token JWT.
 *       
 *       **Validações:**
 *       - Email deve ser válido
 *       - Senha deve ter pelo menos 6 caracteres
 *       - Usuário deve existir e estar ativo
 *       - Senha deve estar correta
 *       
 *       **Resposta:**
 *       - Retorna dados do usuário
 *       - Retorna token JWT para autenticação
 *       - Atualiza último login
 *       - Token expira em 7 dias
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "joao.silva@exemplo.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Login realizado com sucesso"
 *               data:
 *                 user:
 *                   _id: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                   name: "João Silva"
 *                   email: "joao.silva@exemplo.com"
 *                   role: "user"
 *                   isActive: true
 *                   lastLogin: "2025-01-19T19:09:10.312Z"
 *                   createdAt: "2025-01-19T19:09:10.312Z"
 *                   updatedAt: "2025-01-19T19:09:10.312Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn: "7d"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas ou conta desativada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_credentials:
 *                 summary: Credenciais inválidas
 *                 value:
 *                   success: false
 *                   error: "Credenciais inválidas"
 *                   message: "Email ou senha incorretos"
 *               inactive_account:
 *                 summary: Conta desativada
 *                 value:
 *                   success: false
 *                   error: "Conta desativada"
 *                   message: "Sua conta foi desativada. Entre em contato com o suporte."
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtém perfil do usuário logado
 *     description: |
 *       Retorna as informações do usuário autenticado.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Resposta:**
 *       - Retorna dados completos do usuário
 *       - Não retorna a senha
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Perfil obtido com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Não autenticado"
 *               message: "É necessário estar autenticado"
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     summary: Verifica validade do token JWT
 *     description: |
 *       Verifica se um token JWT é válido e retorna informações sobre ele.
 *       
 *       **Funcionalidades:**
 *       - Valida token JWT
 *       - Retorna data de expiração
 *       - Informa se está próximo do vencimento
 *       - Retorna dados do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token verificado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token válido"
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-19T19:09:10.312Z"
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *                         email:
 *                           type: string
 *                           example: "usuario@exemplo.com"
 *                         role:
 *                           type: string
 *                           example: "user"
 *                     expiringSoon:
 *                       type: boolean
 *                       example: false
 *                       description: "True se o token expira em menos de 7 dias"
 *       400:
 *         description: Token não fornecido
 *       401:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */

// Rotas de autenticação
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-token', AuthController.verifyToken);
router.get('/profile', AuthMiddleware.authenticate, AuthController.getProfile);

export default router; 
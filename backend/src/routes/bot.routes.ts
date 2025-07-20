import { Router } from 'express';
import { BotController } from '../controllers/bot.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Bot
 *     description: Endpoints para integração com o bot
 */

/**
 * @swagger
 * /bot/status:
 *   get:
 *     summary: Verifica o status do bot
 *     description: Retorna o status atual do bot.
 *     tags: [Bot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status do bot retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "online"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-19T19:09:10.312Z"
 */

/**
 * @swagger
 * /bot/send-message:
 *   post:
 *     summary: Envia uma mensagem pelo bot
 *     description: Envia uma mensagem para um destinatário via bot.
 *     tags: [Bot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *                 example: "+5511999999999"
 *                 description: Número de telefone do destinatário
 *               message:
 *                 type: string
 *                 example: "Olá, esta é uma mensagem do bot!"
 *                 description: Conteúdo da mensagem
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messageId:
 *                   type: string
 *                   example: "msg_123456"
 *                 status:
 *                   type: string
 *                   example: "sent"
 */

/**
 * @swagger
 * /bot/read-message:
 *   get:
 *     summary: Lê mensagens recebidas pelo bot
 *     description: Retorna as mensagens recebidas pelo bot.
 *     tags: [Bot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de mensagens a retornar
 *     responses:
 *       200:
 *         description: Lista de mensagens recebidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: string
 *                         example: "+5511888888888"
 *                       message:
 *                         type: string
 *                         example: "Olá, bot!"
 *                       receivedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-19T19:09:10.312Z"
 */

// Aplicar middleware de autenticação em todas as rotas
router.use(AuthMiddleware.authenticate);

router.get('/status', BotController.status);
router.post('/register', BotController.register);
router.post('/send-message', BotController.sendMessage);
router.get('/read-message', BotController.readMessage);

export default router;

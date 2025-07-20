import { Router } from 'express';
import { AbandonedCartController } from '../controllers/abandonedCart.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT obtido através do login
 */

/**
 * @swagger
 * /api/abandoned-carts:
 *   get:
 *     summary: Lista carrinhos abandonados
 *     description: |
 *       Retorna uma lista paginada de carrinhos abandonados.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Filtros disponíveis:**
 *       - `page`: Número da página (padrão: 1)
 *       - `limit`: Itens por página (padrão: 10, máximo: 100)
 *       - `clientEmail`: Filtrar por email do cliente
 *       - `productName`: Filtrar por nome do produto
 *       - `sellerEmail`: Filtrar por email do vendedor
 *       - `startDate`: Data inicial (formato: YYYY-MM-DD)
 *       - `endDate`: Data final (formato: YYYY-MM-DD)
 *       - `minAmount`: Valor mínimo
 *       - `maxAmount`: Valor máximo
 *       
 *       **Ordenação:**
 *       - `sortBy`: Campo para ordenação (createdAt, amount, clientName, productName)
 *       - `sortOrder`: Ordem (asc, desc)
 *     tags: [API - Carrinhos Abandonados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: clientEmail
 *         schema:
 *           type: string
 *         description: Filtrar por email do cliente
 *       - in: query
 *         name: productName
 *         schema:
 *           type: string
 *         description: Filtrar por nome do produto
 *       - in: query
 *         name: sellerEmail
 *         schema:
 *           type: string
 *         description: Filtrar por email do vendedor
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (YYYY-MM-DD)
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Valor mínimo
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Valor máximo
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount, clientName, productName]
 *           default: createdAt
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordem da ordenação
 *     responses:
 *       200:
 *         description: Lista de carrinhos abandonados
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
 *                   example: "Carrinhos abandonados obtidos com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     carts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AbandonedCart'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 150
 *                         totalPages:
 *                           type: integer
 *                           example: 15
 *                         hasNext:
 *                           type: boolean
 *                           example: true
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/abandoned-carts/{id}:
 *   get:
 *     summary: Obtém detalhes de um carrinho abandonado
 *     description: |
 *       Retorna os detalhes completos de um carrinho abandonado específico.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *     tags: [API - Carrinhos Abandonados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do carrinho abandonado
 *     responses:
 *       200:
 *         description: Detalhes do carrinho abandonado
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
 *                   example: "Carrinho abandonado encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/AbandonedCart'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Carrinho não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/abandoned-carts/stats/overview:
 *   get:
 *     summary: Estatísticas gerais dos carrinhos abandonados
 *     description: |
 *       Retorna estatísticas gerais sobre carrinhos abandonados.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Estatísticas incluídas:**
 *       - Total de carrinhos abandonados
 *       - Valor total perdido
 *       - Valor médio por carrinho
 *       - Carrinhos por período (hoje, semana, mês)
 *       - Top produtos abandonados
 *       - Top vendedores afetados
 *     tags: [API - Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas obtidas com sucesso
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
 *                   example: "Estatísticas obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCarts:
 *                       type: integer
 *                       example: 1250
 *                     totalValue:
 *                       type: number
 *                       example: 125000.50
 *                     averageValue:
 *                       type: number
 *                       example: 100.00
 *                     todayCarts:
 *                       type: integer
 *                       example: 15
 *                     weekCarts:
 *                       type: integer
 *                       example: 89
 *                     monthCarts:
 *                       type: integer
 *                       example: 342
 *                     topProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           totalValue:
 *                             type: number
 *                     topSellers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           totalValue:
 *                             type: number
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/abandoned-carts/stats/daily:
 *   get:
 *     summary: Estatísticas diárias dos carrinhos abandonados
 *     description: |
 *       Retorna estatísticas diárias dos carrinhos abandonados dos últimos 30 dias.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *     tags: [API - Estatísticas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 90
 *           default: 30
 *         description: Número de dias para analisar
 *     responses:
 *       200:
 *         description: Estatísticas diárias obtidas com sucesso
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
 *                   example: "Estatísticas diárias obtidas com sucesso"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-19"
 *                       count:
 *                         type: integer
 *                         example: 15
 *                       totalValue:
 *                         type: number
 *                         example: 1500.00
 *                       averageValue:
 *                         type: number
 *                         example: 100.00
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */

// Aplicar middleware de autenticação em todas as rotas da API
router.use(AuthMiddleware.authenticate);

// Rotas da API (agora protegidas)
router.get('/abandoned-carts', AbandonedCartController.getAbandonedCarts);
router.get('/abandoned-carts/:id', AbandonedCartController.getAbandonedCartById);
router.get('/abandoned-carts/stats/overview', AbandonedCartController.getStatsOverview);
router.get('/abandoned-carts/stats/daily', AbandonedCartController.getDailyStats);

export default router; 
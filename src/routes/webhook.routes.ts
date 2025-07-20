import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 760
 *         start_date:
 *           type: string
 *           example: "2025-07-19"
 *         created_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312603Z"
 *         updated_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312606Z"
 *         status:
 *           type: string
 *           example: "paid"
 *         current_period_end:
 *           type: string
 *           example: "2025-07-19T19:09:10.312609Z"
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 526
 *         type:
 *           type: string
 *           example: "SUBSCRIPTION"
 *         status:
 *           type: string
 *           example: "abandoned"
 *         created_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312614Z"
 *         update_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312617Z"
 *         seller_id:
 *           type: integer
 *           example: 426
 *         installments:
 *           type: integer
 *           example: 12
 *         method:
 *           type: string
 *           example: "CREDIT_CARD"
 *         client_id:
 *           type: integer
 *           example: 100
 *         amount:
 *           type: number
 *           example: 10
 *         proposal_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         total:
 *           type: number
 *           example: 10
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 100
 *         name:
 *           type: string
 *           example: "Leila O'Connell"
 *         email:
 *           type: string
 *           format: email
 *           example: "adrian.barton@greenholt.net"
 *         cellphone:
 *           type: string
 *           example: "+16098846219"
 *         document:
 *           type: string
 *           example: "917.527.272-59"
 *         cpf_cnpj:
 *           type: string
 *           example: "917.527.272-59"
 *         zipcode:
 *           type: string
 *           example: "14229"
 *         street:
 *           type: string
 *           example: "Kyle Flat"
 *         number:
 *           type: string
 *           example: "35774"
 *         complement:
 *           type: string
 *           example: ""
 *         neighborhood:
 *           type: string
 *           example: ""
 *         city:
 *           type: string
 *           example: "New Arno"
 *         uf:
 *           type: string
 *           example: "WI"
 *         created_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312581Z"
 *         updated_at:
 *           type: string
 *           example: "2025-07-19T19:09:10.312588Z"
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 96502
 *         name:
 *           type: string
 *           example: "Dragão assinatura"
 *         description:
 *           type: string
 *           example: "Minha assinatura 10reais"
 *         category_id:
 *           type: integer
 *           example: 2
 *         stock:
 *           type: integer
 *           nullable: true
 *           example: null
 *         type:
 *           type: string
 *           example: "SUBSCRIPTION"
 *         amount:
 *           type: number
 *           example: 10
 *         period:
 *           type: integer
 *           example: 30
 *         thank_you_page:
 *           type: string
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           example: "2025-01-14T19:40:32.000000Z"
 *         updated_at:
 *           type: string
 *           example: "2025-01-14T19:40:32.000000Z"
 *         seller_id:
 *           type: integer
 *           example: 408443
 *         slug:
 *           type: string
 *           example: "dragao-assinatura"
 *         method:
 *           type: string
 *           example: "CREDIT_CARD,BOLETO,PIX"
 *         product_type_id:
 *           type: integer
 *           example: 5
 *         status_changed_at:
 *           type: string
 *           example: "2025-01-14 19:40:31"
 *         product_id:
 *           type: integer
 *           example: 96502
 *         hash:
 *           type: string
 *           example: "QPzYRe"
 *     Offer:
 *       type: object
 *       properties:
 *         hash:
 *           type: string
 *           example: "QPzYRe"
 *         amount:
 *           type: number
 *           example: 10
 *         method:
 *           type: string
 *           example: "CREDIT_CARD,BOLETO,PIX"
 *         name:
 *           type: string
 *           example: "Dragão assinatura"
 *         created_at:
 *           type: string
 *           example: "2025-01-14T19:40:32.000000Z"
 *     Seller:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 426
 *         name:
 *           type: string
 *           example: "Ezekiel Hagenes I"
 *         email:
 *           type: string
 *           format: email
 *           example: "larry.batz@hotmail.com"
 *         cellphone:
 *           type: string
 *           example: "+13803331961"
 *     AbandonedCartWebhook:
 *       type: object
 *       required:
 *         - type
 *         - event
 *         - oldStatus
 *         - currentStatus
 *         - contract
 *         - sale
 *         - client
 *         - product
 *         - oferta
 *         - offer
 *         - seller
 *       properties:
 *         type:
 *           type: string
 *           example: "checkout"
 *         event:
 *           type: string
 *           example: "checkoutAbandoned"
 *         oldStatus:
 *           type: string
 *           example: "abandoned"
 *         currentStatus:
 *           type: string
 *           example: "abandoned"
 *         contract:
 *           $ref: '#/components/schemas/Contract'
 *         sale:
 *           $ref: '#/components/schemas/Sale'
 *         client:
 *           $ref: '#/components/schemas/Client'
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         oferta:
 *           type: string
 *           example: "Dragão assinatura"
 *         offer:
 *           $ref: '#/components/schemas/Offer'
 *         seller:
 *           $ref: '#/components/schemas/Seller'
 *         affiliate:
 *           type: object
 *           nullable: true
 *           example: null
 *         productMetas:
 *           type: array
 *           items:
 *             type: object
 *           example: []
 *         proposalMetas:
 *           type: array
 *           items:
 *             type: object
 *           example: []
 *     NathanWebhookResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Webhook Nathan processado com sucesso"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: ID do registro no banco de dados
 *               example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *             saleId:
 *               type: number
 *               description: ID da venda
 *               example: 526
 *             clientEmail:
 *               type: string
 *               description: Email do cliente
 *               example: "adrian.barton@greenholt.net"
 *             productName:
 *               type: string
 *               description: Nome do produto
 *               example: "Dragão assinatura"
 *             amount:
 *               type: number
 *               description: Valor da venda
 *               example: 10
 *             clientName:
 *               type: string
 *               description: Nome do cliente
 *               example: "Leila O'Connell"
 *             clientPhone:
 *               type: string
 *               description: Telefone do cliente
 *               example: "+16098846219"
 *             productDescription:
 *               type: string
 *               description: Descrição do produto
 *               example: "Minha assinatura 10reais..."
 *             sellerName:
 *               type: string
 *               description: Nome do vendedor
 *               example: "Ezekiel Hagenes I"
 *             sellerEmail:
 *               type: string
 *               description: Email do vendedor
 *               example: "larry.batz@hotmail.com"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Dados obrigatórios não encontrados"
 *         required:
 *           type: array
 *           items:
 *             type: string
 *           example: ["event", "sale", "client", "product"]
 *     DuplicateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Venda já processada anteriormente"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *             saleId:
 *               type: number
 *               example: 526
 *             clientEmail:
 *               type: string
 *               example: "adrian.barton@greenholt.net"
 *             productName:
 *               type: string
 *               example: "Dragão assinatura"
 */

/**
 /**
 * @swagger
 * /webhook/greenncovery:
 *   post:
 *     summary: Recebe webhook específico do GreennCovery
 *     description: |
 *       Endpoint específico para receber webhooks do sistema GreennCovery.
 *       
 *       **Funcionalidades:**
 *       - Recebe dados de carrinho abandonado
 *       - Valida dados obrigatórios
 *       - Verifica duplicatas
 *       - Salva no MongoDB Atlas
 *       - Retorna informações processadas
 *       
 *       **Dados processados:**
 *       - Informações do cliente (nome, email, telefone, endereço)
 *       - Detalhes da venda (valor, método de pagamento)
 *       - Informações do produto
 *     tags: [Webhook GreennCovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbandonedCartWebhook'
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NathanWebhookResponse'
 *       400:
 *         description: Dados inválidos ou obrigatórios não encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Erro interno do servidor"
 *                 message:
 *                   type: string
 *                   example: "Erro ao processar webhook Nathan"
 */

/**
 * @swagger
 * /webhook/abandoned-cart:
 *   post:
 *     summary: Recebe webhook de carrinho abandonado (genérico)
 *     description: Endpoint genérico para receber notificações de carrinhos abandonados
 *     tags: [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbandonedCartWebhook'
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
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
 *                   example: Webhook processado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/AbandonedCartWebhook'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /webhook/health:
 *   get:
 *     summary: Verifica saúde do webhook
 *     description: Endpoint para verificar se o webhook está funcionando
 *     tags: [Webhook]
 *     responses:
 *       200:
 *         description: Webhook funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   example: 2025-01-19T19:09:10.312Z
 *                 service:
 *                   type: string
 *                   example: webhook-service
 */

// Webhook routes
router.post('/abandoned-cart', WebhookController.handleAbandonedCart);
router.post('/greenncovery', WebhookController.handleGreennCoveryWebhook);
router.get('/health', WebhookController.healthCheck);

export default router; 
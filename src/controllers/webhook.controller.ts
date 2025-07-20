import { Request, Response } from 'express';
import Joi from 'joi';
import { AbandonedCart } from '../models/abandonedCart.model';
import { logger } from '../config/logger';
import { AbandonedCartWebhook } from '../types/webhook.types';

// Validation schema for the webhook payload
const webhookValidationSchema = Joi.object({
  type: Joi.string().required(),
  event: Joi.string().required(),
  oldStatus: Joi.string().required(),
  currentStatus: Joi.string().required(),
  contract: Joi.object({
    id: Joi.number().required(),
    start_date: Joi.string().required(),
    created_at: Joi.string().required(),
    updated_at: Joi.string().required(),
    status: Joi.string().required(),
    current_period_end: Joi.string().required()
  }).required(),
  sale: Joi.object({
    id: Joi.number().required(),
    type: Joi.string().required(),
    status: Joi.string().required(),
    created_at: Joi.string().required(),
    update_at: Joi.string().required(),
    seller_id: Joi.number().required(),
    installments: Joi.number().required(),
    method: Joi.string().required(),
    client_id: Joi.number().required(),
    amount: Joi.number().required(),
    proposal_id: Joi.number().allow(null),
    total: Joi.number().required()
  }).required(),
  client: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    cellphone: Joi.string().required(),
    document: Joi.string().required(),
    cpf_cnpj: Joi.string().required(),
    zipcode: Joi.string().required(),
    street: Joi.string().required(),
    number: Joi.string().required(),
    complement: Joi.string().allow(''),
    neighborhood: Joi.string().allow(''),
    city: Joi.string().required(),
    uf: Joi.string().required(),
    created_at: Joi.string().required(),
    updated_at: Joi.string().required()
  }).required(),
  product: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    category_id: Joi.number().required(),
    stock: Joi.number().allow(null),
    type: Joi.string().required(),
    amount: Joi.number().required(),
    period: Joi.number().required(),
    thank_you_page: Joi.string().allow(null),
    created_at: Joi.string().required(),
    updated_at: Joi.string().required(),
    seller_id: Joi.number().required(),
    slug: Joi.string().required(),
    method: Joi.string().required(),
    product_type_id: Joi.number().required(),
    status_changed_at: Joi.string().required(),
    product_id: Joi.number().required(),
    hash: Joi.string().required()
  }).required(),
  oferta: Joi.string().required(),
  offer: Joi.object({
    hash: Joi.string().required(),
    amount: Joi.number().required(),
    method: Joi.string().required(),
    name: Joi.string().required(),
    created_at: Joi.string().required()
  }).required(),
  seller: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    cellphone: Joi.string().required()
  }).required(),
  affiliate: Joi.any().allow(null),
  productMetas: Joi.array().items(Joi.any()),
  proposalMetas: Joi.array().items(Joi.any())
});

export class WebhookController {
  /**
   * @swagger
   * /webhook/abandoned-cart:
   *   post:
   *     summary: Recebe webhook de carrinho abandonado
   *     description: Endpoint para receber notificações de carrinhos abandonados
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
  static async handleAbandonedCart(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📥 Recebendo webhook de carrinho abandonado');

      // Validate the request body
      const { error, value } = webhookValidationSchema.validate(req.body);
      
      if (error) {
        logger.error('❌ Erro de validação:', error.details);
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.details.map((detail: any) => detail.message)
        });
        return;
      }

      const webhookData: AbandonedCartWebhook = value;

      // Check if this is an abandoned cart event
      if (webhookData.event !== 'checkoutAbandoned') {
        logger.warn('⚠️ Evento não é de carrinho abandonado:', webhookData.event);
        res.status(200).json({
          success: true,
          message: 'Evento ignorado - não é carrinho abandonado'
        });
        return;
      }

      // Check if this sale was already processed
      const existingRecord = await AbandonedCart.findOne({ 'sale.id': webhookData.sale.id });
      
      if (existingRecord) {
        logger.info('🔄 Venda já processada anteriormente:', webhookData.sale.id);
        res.status(200).json({
          success: true,
          message: 'Venda já processada anteriormente',
          data: existingRecord
        });
        return;
      }

      // Save to database
      const abandonedCart = new AbandonedCart(webhookData);
      await abandonedCart.save();

      logger.info('✅ Carrinho abandonado salvo com sucesso', {
        saleId: webhookData.sale.id,
        clientEmail: webhookData.client.email,
        productName: webhookData.product.name
      });

      // Here you could add additional logic like:
      // - Send email to customer
      // - Create follow-up task
      // - Send notification to sales team
      // - Trigger marketing automation

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso',
        data: {
          id: abandonedCart._id,
          saleId: webhookData.sale.id,
          clientEmail: webhookData.client.email,
          productName: webhookData.product.name,
          amount: webhookData.sale.amount
        }
      });

    } catch (error) {
      logger.error('❌ Erro ao processar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao processar webhook'
      });
    }
  }

  /**
   * @swagger
   * /webhook/nathan:
   *   post:
   *     summary: Recebe webhook específico do Nathan
   *     description: Endpoint específico para receber webhooks do sistema Nathan
   *     tags: [Webhook]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               type:
   *                 type: string
   *                 example: "checkout"
   *               event:
   *                 type: string
   *                 example: "checkoutAbandoned"
   *               oldStatus:
   *                 type: string
   *                 example: "abandoned"
   *               currentStatus:
   *                 type: string
   *                 example: "abandoned"
   *               contract:
   *                 type: object
   *               sale:
   *                 type: object
   *               client:
   *                 type: object
   *               product:
   *                 type: object
   *               oferta:
   *                 type: string
   *               offer:
   *                 type: object
   *               seller:
   *                 type: object
   *               affiliate:
   *                 type: object
   *                 nullable: true
   *               productMetas:
   *                 type: array
   *               proposalMetas:
   *                 type: array
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
   *                   example: Webhook Nathan processado com sucesso
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: ID do registro no banco
   *                     saleId:
   *                       type: number
   *                       description: ID da venda
   *                     clientEmail:
   *                       type: string
   *                       description: Email do cliente
   *                     productName:
   *                       type: string
   *                       description: Nome do produto
   *                     amount:
   *                       type: number
   *                       description: Valor da venda
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  static async handleNathanWebhook(req: Request, res: Response): Promise<void> {
    try {
      logger.info('📥 Recebendo webhook específico do Nathan');

      // Log the incoming data for debugging
      logger.info('📋 Dados recebidos:', JSON.stringify(req.body, null, 2));

      // Basic validation - check if required fields exist
      if (!req.body || !req.body.event || !req.body.sale || !req.body.client || !req.body.product) {
        logger.error('❌ Dados obrigatórios não encontrados');
        res.status(400).json({
          success: false,
          error: 'Dados obrigatórios não encontrados',
          required: ['event', 'sale', 'client', 'product']
        });
        return;
      }

      const webhookData = req.body;

      // Check if this is an abandoned cart event
      if (webhookData.event !== 'checkoutAbandoned') {
        logger.warn('⚠️ Evento não é de carrinho abandonado:', webhookData.event);
        res.status(200).json({
          success: true,
          message: 'Evento ignorado - não é carrinho abandonado',
          event: webhookData.event
        });
        return;
      }

      // Check if this sale was already processed
      const existingRecord = await AbandonedCart.findOne({ 'sale.id': webhookData.sale.id });
      
      if (existingRecord) {
        logger.info('🔄 Venda já processada anteriormente:', webhookData.sale.id);
        res.status(200).json({
          success: true,
          message: 'Venda já processada anteriormente',
          data: {
            id: existingRecord._id,
            saleId: webhookData.sale.id,
            clientEmail: webhookData.client.email,
            productName: webhookData.product.name
          }
        });
        return;
      }

      // Save to database
      const abandonedCart = new AbandonedCart(webhookData);
      await abandonedCart.save();

      logger.info('✅ Webhook Nathan processado com sucesso', {
        saleId: webhookData.sale.id,
        clientEmail: webhookData.client.email,
        productName: webhookData.product.name,
        amount: webhookData.sale.amount || webhookData.sale.total
      });

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Webhook Nathan processado com sucesso',
        data: {
          id: abandonedCart._id,
          saleId: webhookData.sale.id,
          clientEmail: webhookData.client.email,
          productName: webhookData.product.name,
          amount: webhookData.sale.amount || webhookData.sale.total,
          clientName: webhookData.client.name,
          clientPhone: webhookData.client.cellphone,
          productDescription: webhookData.product.description,
          sellerName: webhookData.seller?.name,
          sellerEmail: webhookData.seller?.email
        }
      });

    } catch (error) {
      logger.error('❌ Erro ao processar webhook Nathan:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao processar webhook Nathan'
      });
    }
  }

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
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'webhook-service'
    });
  }
} 
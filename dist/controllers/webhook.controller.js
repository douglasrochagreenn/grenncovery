"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const joi_1 = __importDefault(require("joi"));
const abandonedCart_model_1 = require("../models/abandonedCart.model");
const logger_1 = require("../config/logger");
const webhookValidationSchema = joi_1.default.object({
    type: joi_1.default.string().required(),
    event: joi_1.default.string().required(),
    oldStatus: joi_1.default.string().required(),
    currentStatus: joi_1.default.string().required(),
    contract: joi_1.default.object({
        id: joi_1.default.number().required(),
        start_date: joi_1.default.string().required(),
        created_at: joi_1.default.string().required(),
        updated_at: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
        current_period_end: joi_1.default.string().required()
    }).required(),
    sale: joi_1.default.object({
        id: joi_1.default.number().required(),
        type: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
        created_at: joi_1.default.string().required(),
        update_at: joi_1.default.string().required(),
        seller_id: joi_1.default.number().required(),
        installments: joi_1.default.number().required(),
        method: joi_1.default.string().required(),
        client_id: joi_1.default.number().required(),
        amount: joi_1.default.number().required(),
        proposal_id: joi_1.default.number().allow(null),
        total: joi_1.default.number().required()
    }).required(),
    client: joi_1.default.object({
        id: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        cellphone: joi_1.default.string().required(),
        document: joi_1.default.string().required(),
        cpf_cnpj: joi_1.default.string().required(),
        zipcode: joi_1.default.string().required(),
        street: joi_1.default.string().required(),
        number: joi_1.default.string().required(),
        complement: joi_1.default.string().allow(''),
        neighborhood: joi_1.default.string().allow(''),
        city: joi_1.default.string().required(),
        uf: joi_1.default.string().required(),
        created_at: joi_1.default.string().required(),
        updated_at: joi_1.default.string().required()
    }).required(),
    product: joi_1.default.object({
        id: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        category_id: joi_1.default.number().required(),
        stock: joi_1.default.number().allow(null),
        type: joi_1.default.string().required(),
        amount: joi_1.default.number().required(),
        period: joi_1.default.number().required(),
        thank_you_page: joi_1.default.string().allow(null),
        created_at: joi_1.default.string().required(),
        updated_at: joi_1.default.string().required(),
        seller_id: joi_1.default.number().required(),
        slug: joi_1.default.string().required(),
        method: joi_1.default.string().required(),
        product_type_id: joi_1.default.number().required(),
        status_changed_at: joi_1.default.string().required(),
        product_id: joi_1.default.number().required(),
        hash: joi_1.default.string().required()
    }).required(),
    oferta: joi_1.default.string().required(),
    offer: joi_1.default.object({
        hash: joi_1.default.string().required(),
        amount: joi_1.default.number().required(),
        method: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        created_at: joi_1.default.string().required()
    }).required(),
    seller: joi_1.default.object({
        id: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        cellphone: joi_1.default.string().required()
    }).required(),
    affiliate: joi_1.default.any().allow(null),
    productMetas: joi_1.default.array().items(joi_1.default.any()),
    proposalMetas: joi_1.default.array().items(joi_1.default.any())
});
class WebhookController {
    static async handleAbandonedCart(req, res) {
        try {
            logger_1.logger.info('📥 Recebendo webhook de carrinho abandonado');
            const { error, value } = webhookValidationSchema.validate(req.body);
            if (error) {
                logger_1.logger.error('❌ Erro de validação:', error.details);
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.details.map((detail) => detail.message)
                });
                return;
            }
            const webhookData = value;
            if (webhookData.event !== 'checkoutAbandoned') {
                logger_1.logger.warn('⚠️ Evento não é de carrinho abandonado:', webhookData.event);
                res.status(200).json({
                    success: true,
                    message: 'Evento ignorado - não é carrinho abandonado'
                });
                return;
            }
            const existingRecord = await abandonedCart_model_1.AbandonedCart.findOne({ 'sale.id': webhookData.sale.id });
            if (existingRecord) {
                logger_1.logger.info('🔄 Venda já processada anteriormente:', webhookData.sale.id);
                res.status(200).json({
                    success: true,
                    message: 'Venda já processada anteriormente',
                    data: existingRecord
                });
                return;
            }
            const abandonedCart = new abandonedCart_model_1.AbandonedCart(webhookData);
            await abandonedCart.save();
            logger_1.logger.info('✅ Carrinho abandonado salvo com sucesso', {
                saleId: webhookData.sale.id,
                clientEmail: webhookData.client.email,
                productName: webhookData.product.name
            });
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
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao processar webhook:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar webhook'
            });
        }
    }
    static async handleGreennCoveryWebhook(req, res) {
        try {
            logger_1.logger.info('📥 Recebendo webhook específico do GreennCovery');
            logger_1.logger.info('📋 Dados recebidos:', JSON.stringify(req.body, null, 2));
            if (!req.body || !req.body.event || !req.body.sale || !req.body.client || !req.body.product) {
                logger_1.logger.error('❌ Dados obrigatórios não encontrados');
                res.status(400).json({
                    success: false,
                    error: 'Dados obrigatórios não encontrados',
                    required: ['event', 'sale', 'client', 'product']
                });
                return;
            }
            const webhookData = req.body;
            if (webhookData.event !== 'checkoutAbandoned') {
                logger_1.logger.warn('⚠️ Evento não é de carrinho abandonado:', webhookData.event);
                res.status(200).json({
                    success: true,
                    message: 'Evento ignorado - não é carrinho abandonado',
                    event: webhookData.event
                });
                return;
            }
            const existingRecord = await abandonedCart_model_1.AbandonedCart.findOne({ 'sale.id': webhookData.sale.id });
            if (existingRecord) {
                logger_1.logger.info('🔄 Venda já processada anteriormente:', webhookData.sale.id);
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
            const abandonedCart = new abandonedCart_model_1.AbandonedCart(webhookData);
            await abandonedCart.save();
            logger_1.logger.info('✅ Webhook GreennCovery processado com sucesso', {
                saleId: webhookData.sale.id,
                clientEmail: webhookData.client.email,
                productName: webhookData.product.name,
                amount: webhookData.sale.amount || webhookData.sale.total
            });
            res.status(200).json({
                success: true,
                message: 'Webhook GreennCovery processado com sucesso',
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
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao processar webhook GreennCovery:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao processar webhook GreennCovery'
            });
        }
    }
    static async healthCheck(req, res) {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'webhook-service'
        });
    }
}
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map
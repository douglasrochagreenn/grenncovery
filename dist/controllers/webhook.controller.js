"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const abandonedCart_model_1 = require("../models/abandonedCart.model");
const logger_1 = require("../config/logger");
class WebhookController {
    static extractWebhookData(data) {
        const getValue = (obj, paths) => {
            for (const path of paths) {
                const keys = path.split('.');
                let value = obj;
                for (const key of keys) {
                    if (value && typeof value === 'object' && key in value) {
                        value = value[key];
                    }
                    else {
                        value = undefined;
                        break;
                    }
                }
                if (value !== undefined && value !== null) {
                    return value;
                }
            }
            return null;
        };
        const type = getValue(data, ['type', 'eventType', 'webhook_type']) || 'checkout';
        const event = getValue(data, ['event', 'eventName', 'webhook_event']) || 'checkoutAbandoned';
        const oldStatus = getValue(data, ['oldStatus', 'old_status', 'previousStatus']) || 'abandoned';
        const currentStatus = getValue(data, ['currentStatus', 'current_status', 'status']) || 'abandoned';
        const contract = {
            id: getValue(data, ['contract.id', 'contract_id', 'subscription.id']) ?? 0,
            start_date: getValue(data, ['contract.start_date', 'contract.startDate', 'subscription.start_date']) ?? new Date().toISOString().split('T')[0],
            created_at: getValue(data, ['contract.created_at', 'contract.createdAt', 'subscription.created_at']) ?? new Date().toISOString(),
            updated_at: getValue(data, ['contract.updated_at', 'contract.updatedAt', 'subscription.updated_at']) ?? new Date().toISOString(),
            status: getValue(data, ['contract.status', 'subscription.status']) ?? 'unknown',
            current_period_end: getValue(data, ['contract.current_period_end', 'contract.currentPeriodEnd', 'subscription.current_period_end']) ?? new Date().toISOString()
        };
        const sale = {
            id: getValue(data, ['sale.id', 'order.id', 'transaction.id', 'purchase.id']) ?? Math.floor(Math.random() * 1000000),
            type: getValue(data, ['sale.type', 'order.type', 'transaction.type']) ?? 'PURCHASE',
            status: getValue(data, ['sale.status', 'order.status', 'transaction.status']) ?? 'abandoned',
            created_at: getValue(data, ['sale.created_at', 'sale.createdAt', 'order.created_at', 'transaction.created_at']) ?? new Date().toISOString(),
            update_at: getValue(data, ['sale.update_at', 'sale.updated_at', 'sale.updatedAt', 'order.updated_at']) ?? new Date().toISOString(),
            seller_id: getValue(data, ['sale.seller_id', 'sale.sellerId', 'seller.id', 'vendor.id']) ?? 0,
            installments: getValue(data, ['sale.installments', 'payment.installments']) ?? 1,
            method: getValue(data, ['sale.method', 'payment.method', 'payment_method']) ?? 'UNKNOWN',
            client_id: getValue(data, ['sale.client_id', 'sale.clientId', 'customer.id', 'client.id']) ?? 0,
            amount: getValue(data, ['sale.amount', 'sale.value', 'order.amount', 'transaction.amount']) ?? 0,
            proposal_id: getValue(data, ['sale.proposal_id', 'sale.proposalId', 'proposal.id']),
            total: getValue(data, ['sale.total', 'sale.amount', 'order.total', 'transaction.total']) ?? 0
        };
        const client = {
            id: getValue(data, ['client.id', 'customer.id', 'user.id']) ?? 0,
            name: getValue(data, ['client.name', 'customer.name', 'user.name', 'customer.full_name']) ?? 'Cliente Desconhecido',
            email: getValue(data, ['client.email', 'customer.email', 'user.email']) ?? 'cliente@exemplo.com',
            cellphone: getValue(data, ['client.cellphone', 'client.phone', 'customer.phone', 'user.phone']) ?? '',
            document: getValue(data, ['client.document', 'customer.document', 'user.document', 'client.cpf']) ?? '',
            cpf_cnpj: getValue(data, ['client.cpf_cnpj', 'client.cpf', 'customer.cpf', 'user.cpf']) ?? '',
            zipcode: getValue(data, ['client.zipcode', 'client.zip', 'customer.zipcode', 'address.zipcode']) ?? '',
            street: getValue(data, ['client.street', 'customer.street', 'address.street']) ?? '',
            number: getValue(data, ['client.number', 'customer.number', 'address.number']) ?? '',
            complement: getValue(data, ['client.complement', 'customer.complement', 'address.complement']) ?? '',
            neighborhood: getValue(data, ['client.neighborhood', 'customer.neighborhood', 'address.neighborhood']) ?? '',
            city: getValue(data, ['client.city', 'customer.city', 'address.city']) ?? '',
            uf: getValue(data, ['client.uf', 'client.state', 'customer.state', 'address.state']) ?? '',
            created_at: getValue(data, ['client.created_at', 'client.createdAt', 'customer.created_at']) ?? new Date().toISOString(),
            updated_at: getValue(data, ['client.updated_at', 'client.updatedAt', 'customer.updated_at']) ?? new Date().toISOString()
        };
        const product = {
            id: getValue(data, ['product.id', 'item.id', 'offer.product_id']) ?? 0,
            name: getValue(data, ['product.name', 'item.name', 'offer.name', 'product.title']) ?? 'Produto Desconhecido',
            description: getValue(data, ['product.description', 'item.description', 'offer.description']) ?? '',
            category_id: getValue(data, ['product.category_id', 'product.categoryId', 'item.category_id']) ?? 0,
            stock: getValue(data, ['product.stock', 'item.stock', 'inventory.quantity']),
            type: getValue(data, ['product.type', 'item.type', 'offer.type']) ?? 'PRODUCT',
            amount: getValue(data, ['product.amount', 'product.price', 'item.price', 'offer.price']) ?? 0,
            period: getValue(data, ['product.period', 'subscription.period', 'billing.period']) ?? 30,
            thank_you_page: getValue(data, ['product.thank_you_page', 'product.thankYouPage']),
            created_at: getValue(data, ['product.created_at', 'product.createdAt', 'item.created_at']) ?? new Date().toISOString(),
            updated_at: getValue(data, ['product.updated_at', 'product.updatedAt', 'item.updated_at']) ?? new Date().toISOString(),
            seller_id: getValue(data, ['product.seller_id', 'product.sellerId', 'vendor.id']) ?? 0,
            slug: getValue(data, ['product.slug', 'item.slug']) ?? '',
            method: getValue(data, ['product.method', 'payment.methods', 'accepted_methods']) ?? 'UNKNOWN',
            product_type_id: getValue(data, ['product.product_type_id', 'product.typeId']) ?? 0,
            status_changed_at: getValue(data, ['product.status_changed_at', 'product.statusChangedAt']) ?? new Date().toISOString(),
            product_id: getValue(data, ['product.product_id', 'product.id']) ?? 0,
            hash: getValue(data, ['product.hash', 'offer.hash', 'item.hash']) ?? ''
        };
        const offer = {
            hash: getValue(data, ['offer.hash', 'product.hash', 'item.hash']) ?? '',
            amount: getValue(data, ['offer.amount', 'offer.price', 'product.amount']) ?? 0,
            method: getValue(data, ['offer.method', 'offer.payment_methods', 'product.method']) ?? 'UNKNOWN',
            name: getValue(data, ['offer.name', 'product.name', 'item.name']) ?? 'Oferta Desconhecida',
            created_at: getValue(data, ['offer.created_at', 'offer.createdAt', 'product.created_at']) ?? new Date().toISOString()
        };
        const seller = {
            id: getValue(data, ['seller.id', 'vendor.id', 'merchant.id']) ?? 0,
            name: getValue(data, ['seller.name', 'vendor.name', 'merchant.name']) ?? 'Vendedor Desconhecido',
            email: getValue(data, ['seller.email', 'vendor.email', 'merchant.email']) ?? 'vendedor@exemplo.com',
            cellphone: getValue(data, ['seller.cellphone', 'seller.phone', 'vendor.phone']) ?? ''
        };
        return {
            type: type ?? 'checkout',
            event: event ?? 'checkoutAbandoned',
            oldStatus: oldStatus ?? 'abandoned',
            currentStatus: currentStatus ?? 'abandoned',
            contract,
            sale,
            client,
            product,
            oferta: product.name ?? 'Produto Desconhecido',
            offer,
            seller,
            affiliate: getValue(data, ['affiliate', 'referrer']) ?? null,
            productMetas: getValue(data, ['productMetas', 'product_metas', 'product.metadata']) ?? [],
            proposalMetas: getValue(data, ['proposalMetas', 'proposal_metas', 'proposal.metadata']) ?? []
        };
    }
    static async handleAbandonedCart(req, res) {
        try {
            logger_1.logger.info('📥 Recebendo webhook de carrinho abandonado');
            logger_1.logger.info('📋 Dados brutos recebidos:', JSON.stringify(req.body, null, 2));
            if (!req.body || typeof req.body !== 'object') {
                logger_1.logger.error('❌ Dados inválidos: body vazio ou não é objeto');
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    message: 'O corpo da requisição deve ser um objeto JSON válido'
                });
                return;
            }
            const webhookData = WebhookController.extractWebhookData(req.body);
            logger_1.logger.info('📊 Dados extraídos:', {
                event: webhookData.event,
                saleId: webhookData.sale.id,
                clientEmail: webhookData.client.email,
                productName: webhookData.product.name
            });
            const abandonedEvents = ['checkoutAbandoned', 'cart_abandoned', 'abandoned_cart', 'checkout_abandoned'];
            if (!abandonedEvents.includes(webhookData.event)) {
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
            logger_1.logger.info('📋 Dados brutos recebidos:', JSON.stringify(req.body, null, 2));
            if (!req.body || typeof req.body !== 'object') {
                logger_1.logger.error('❌ Dados inválidos: body vazio ou não é objeto');
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    message: 'O corpo da requisição deve ser um objeto JSON válido'
                });
                return;
            }
            const webhookData = WebhookController.extractWebhookData(req.body);
            logger_1.logger.info('📊 Dados extraídos:', {
                event: webhookData.event,
                saleId: webhookData.sale.id,
                clientEmail: webhookData.client.email,
                productName: webhookData.product.name
            });
            const abandonedEvents = ['checkoutAbandoned', 'cart_abandoned', 'abandoned_cart', 'checkout_abandoned'];
            if (!abandonedEvents.includes(webhookData.event)) {
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
    static async updateCartStatus(req, res) {
        try {
            const { id } = req.params;
            const { cart_status, status_updated_by } = req.body;
            logger_1.logger.info(`📥 Recebendo atualização de status via webhook: ${id} -> ${cart_status}`);
            const validStatuses = ['abandoned', 'recovered', 'cancelled'];
            if (!cart_status || !validStatuses.includes(cart_status)) {
                res.status(400).json({
                    success: false,
                    error: 'Status inválido',
                    message: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}`
                });
                return;
            }
            const abandonedCart = await abandonedCart_model_1.AbandonedCart.findById(id);
            if (!abandonedCart) {
                res.status(404).json({
                    success: false,
                    error: 'Carrinho abandonado não encontrado',
                    message: 'O carrinho abandonado com o ID especificado não foi encontrado'
                });
                return;
            }
            const previousStatus = abandonedCart.cart_status;
            abandonedCart.cart_status = cart_status;
            abandonedCart.status_updated_at = new Date();
            abandonedCart.status_updated_by = status_updated_by || 'webhook';
            await abandonedCart.save();
            logger_1.logger.info(`✅ Status do carrinho atualizado via webhook: ${id} (${previousStatus} -> ${cart_status})`);
            res.status(200).json({
                success: true,
                message: 'Status do carrinho atualizado com sucesso via webhook',
                data: {
                    id: abandonedCart._id,
                    saleId: abandonedCart.sale.id,
                    clientEmail: abandonedCart.client.email,
                    productName: abandonedCart.product.name,
                    cart_status: abandonedCart.cart_status,
                    status_updated_at: abandonedCart.status_updated_at,
                    status_updated_by: abandonedCart.status_updated_by,
                    previousStatus
                }
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao atualizar status do carrinho via webhook:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao atualizar status do carrinho via webhook'
            });
        }
    }
}
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map
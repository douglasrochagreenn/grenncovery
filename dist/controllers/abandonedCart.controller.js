"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbandonedCartController = void 0;
const abandonedCart_model_1 = require("../models/abandonedCart.model");
const logger_1 = require("../config/logger");
class AbandonedCartController {
    static async getAbandonedCarts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 10, 100);
            const skip = (page - 1) * limit;
            const filter = {};
            if (req.query.clientEmail) {
                filter['client.email'] = { $regex: req.query.clientEmail, $options: 'i' };
            }
            if (req.query.productName) {
                filter['product.name'] = { $regex: req.query.productName, $options: 'i' };
            }
            if (req.query.sellerEmail) {
                filter['seller.email'] = { $regex: req.query.sellerEmail, $options: 'i' };
            }
            if (req.query.startDate || req.query.endDate) {
                filter.createdAt = {};
                if (req.query.startDate) {
                    filter.createdAt.$gte = new Date(req.query.startDate);
                }
                if (req.query.endDate) {
                    filter.createdAt.$lte = new Date(req.query.endDate + 'T23:59:59.999Z');
                }
            }
            if (req.query.minAmount) {
                filter['sale.total'] = { ...filter['sale.total'], $gte: parseFloat(req.query.minAmount) };
            }
            if (req.query.maxAmount) {
                filter['sale.total'] = { ...filter['sale.total'], $lte: parseFloat(req.query.maxAmount) };
            }
            if (req.query.cart_status) {
                filter.cart_status = req.query.cart_status;
            }
            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
            const sort = {};
            sort[sortBy] = sortOrder;
            const [abandonedCarts, total] = await Promise.all([
                abandonedCart_model_1.AbandonedCart.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                abandonedCart_model_1.AbandonedCart.countDocuments(filter)
            ]);
            const totalPages = Math.ceil(total / limit);
            logger_1.logger.info(`📊 Consulta de carrinhos abandonados: ${abandonedCarts.length} resultados`);
            res.status(200).json({
                success: true,
                message: 'Carrinhos abandonados obtidos com sucesso',
                data: {
                    carts: abandonedCarts,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                }
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao buscar carrinhos abandonados:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao buscar carrinhos abandonados'
            });
        }
    }
    static async getAbandonedCartById(req, res) {
        try {
            const { id } = req.params;
            const abandonedCart = await abandonedCart_model_1.AbandonedCart.findById(id).lean();
            if (!abandonedCart) {
                res.status(404).json({
                    success: false,
                    error: 'Carrinho abandonado não encontrado',
                    message: 'O carrinho abandonado com o ID especificado não foi encontrado'
                });
                return;
            }
            logger_1.logger.info(`📋 Carrinho abandonado encontrado: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Carrinho abandonado encontrado',
                data: abandonedCart
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao buscar carrinho abandonado por ID:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao buscar carrinho abandonado'
            });
        }
    }
    static async getStatsOverview(req, res) {
        try {
            const [totalCarts, totalValue, averageValue, recoveredCarts, recoveredValue] = await Promise.all([
                abandonedCart_model_1.AbandonedCart.countDocuments(),
                abandonedCart_model_1.AbandonedCart.aggregate([
                    { $group: { _id: null, total: { $sum: '$sale.total' } } }
                ]),
                abandonedCart_model_1.AbandonedCart.aggregate([
                    { $group: { _id: null, avg: { $avg: '$sale.total' } } }
                ]),
                abandonedCart_model_1.AbandonedCart.countDocuments({ cart_status: 'recovered' }),
                abandonedCart_model_1.AbandonedCart.aggregate([
                    { $match: { cart_status: 'recovered' } },
                    { $group: { _id: null, total: { $sum: '$sale.total' } } }
                ])
            ]);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const [todayCarts, weekCarts, monthCarts] = await Promise.all([
                abandonedCart_model_1.AbandonedCart.countDocuments({ createdAt: { $gte: today } }),
                abandonedCart_model_1.AbandonedCart.countDocuments({ createdAt: { $gte: weekAgo } }),
                abandonedCart_model_1.AbandonedCart.countDocuments({ createdAt: { $gte: monthAgo } })
            ]);
            const recoveryRate = totalCarts > 0 ? ((recoveredCarts / totalCarts) * 100).toFixed(2) : '0.00';
            const topProducts = await abandonedCart_model_1.AbandonedCart.aggregate([
                { $group: {
                        _id: '$product.name',
                        count: { $sum: 1 },
                        totalValue: { $sum: '$sale.total' }
                    } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            const topSellers = await abandonedCart_model_1.AbandonedCart.aggregate([
                { $group: {
                        _id: { name: '$seller.name', email: '$seller.email' },
                        count: { $sum: 1 },
                        totalValue: { $sum: '$sale.total' }
                    } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            const stats = {
                totalCarts,
                totalValue: totalValue[0]?.total || 0,
                averageValue: averageValue[0]?.avg || 0,
                recoveredCarts,
                recoveredValue: recoveredValue[0]?.total || 0,
                recoveryRate: parseFloat(recoveryRate),
                todayCarts,
                weekCarts,
                monthCarts,
                topProducts: topProducts.map(p => ({
                    name: p._id,
                    count: p.count,
                    totalValue: p.totalValue
                })),
                topSellers: topSellers.map(s => ({
                    name: s._id.name,
                    email: s._id.email,
                    count: s.count,
                    totalValue: s.totalValue
                }))
            };
            logger_1.logger.info(`📈 Estatísticas geradas: ${totalCarts} carrinhos abandonados`);
            res.status(200).json({
                success: true,
                message: 'Estatísticas obtidas com sucesso',
                data: stats
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao gerar estatísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao gerar estatísticas'
            });
        }
    }
    static async getDailyStats(req, res) {
        try {
            const days = Math.min(parseInt(req.query.days) || 30, 90);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const dailyStats = await abandonedCart_model_1.AbandonedCart.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                { $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 },
                        totalValue: { $sum: '$sale.total' }
                    } },
                { $sort: { _id: 1 } }
            ]);
            const stats = dailyStats.map(stat => ({
                date: stat._id,
                count: stat.count,
                totalValue: stat.totalValue,
                averageValue: stat.count > 0 ? stat.totalValue / stat.count : 0
            }));
            logger_1.logger.info(`📊 Estatísticas diárias geradas: ${days} dias`);
            res.status(200).json({
                success: true,
                message: 'Estatísticas diárias obtidas com sucesso',
                data: stats
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao gerar estatísticas diárias:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao gerar estatísticas diárias'
            });
        }
    }
    static async updateCartStatus(req, res) {
        try {
            const { id } = req.params;
            const { cart_status, status_updated_by } = req.body;
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
            abandonedCart.cart_status = cart_status;
            abandonedCart.status_updated_at = new Date();
            abandonedCart.status_updated_by = status_updated_by || 'system';
            await abandonedCart.save();
            logger_1.logger.info(`✅ Status do carrinho atualizado: ${id} -> ${cart_status}`);
            res.status(200).json({
                success: true,
                message: 'Status do carrinho atualizado com sucesso',
                data: {
                    id: abandonedCart._id,
                    saleId: abandonedCart.sale.id,
                    clientEmail: abandonedCart.client.email,
                    productName: abandonedCart.product.name,
                    cart_status: abandonedCart.cart_status,
                    status_updated_at: abandonedCart.status_updated_at,
                    status_updated_by: abandonedCart.status_updated_by,
                    previousStatus: cart_status !== abandonedCart.cart_status ? abandonedCart.cart_status : undefined
                }
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao atualizar status do carrinho:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Erro ao atualizar status do carrinho'
            });
        }
    }
}
exports.AbandonedCartController = AbandonedCartController;
//# sourceMappingURL=abandonedCart.controller.js.map
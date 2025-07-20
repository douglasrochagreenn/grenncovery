import { Request, Response } from 'express';
import { AbandonedCart } from '../models/abandonedCart.model';
import { logger } from '../config/logger';

export class AbandonedCartController {
  /**
   * Get all abandoned carts with pagination and filters
   */
  static async getAbandonedCarts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};
      
      if (req.query.clientEmail) {
        filter['client.email'] = { $regex: req.query.clientEmail as string, $options: 'i' };
      }
      
      if (req.query.productName) {
        filter['product.name'] = { $regex: req.query.productName as string, $options: 'i' };
      }

      if (req.query.sellerEmail) {
        filter['seller.email'] = { $regex: req.query.sellerEmail as string, $options: 'i' };
      }
      
      if (req.query.startDate || req.query.endDate) {
        filter.createdAt = {};
        if (req.query.startDate) {
          filter.createdAt.$gte = new Date(req.query.startDate as string);
        }
        if (req.query.endDate) {
          filter.createdAt.$lte = new Date(req.query.endDate as string + 'T23:59:59.999Z');
        }
      }

      if (req.query.minAmount) {
        filter['sale.total'] = { ...filter['sale.total'], $gte: parseFloat(req.query.minAmount as string) };
      }

      if (req.query.maxAmount) {
        filter['sale.total'] = { ...filter['sale.total'], $lte: parseFloat(req.query.maxAmount as string) };
      }

      if (req.query.cart_status) {
        filter.cart_status = req.query.cart_status;
      }

      // Build sort object
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string === 'asc' ? 1 : -1;
      const sort: any = {};
      sort[sortBy] = sortOrder;

      // Execute query
      const [abandonedCarts, total] = await Promise.all([
        AbandonedCart.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        AbandonedCart.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      logger.info(`📊 Consulta de carrinhos abandonados: ${abandonedCarts.length} resultados`);

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

    } catch (error) {
      logger.error('❌ Erro ao buscar carrinhos abandonados:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao buscar carrinhos abandonados'
      });
    }
  }

  /**
   * Get abandoned cart by ID
   */
  static async getAbandonedCartById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const abandonedCart = await AbandonedCart.findById(id).lean();

      if (!abandonedCart) {
        res.status(404).json({
          success: false,
          error: 'Carrinho abandonado não encontrado',
          message: 'O carrinho abandonado com o ID especificado não foi encontrado'
        });
        return;
      }

      logger.info(`📋 Carrinho abandonado encontrado: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Carrinho abandonado encontrado',
        data: abandonedCart
      });

    } catch (error) {
      logger.error('❌ Erro ao buscar carrinho abandonado por ID:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao buscar carrinho abandonado'
      });
    }
  }

  /**
   * Get overview statistics about abandoned carts
   */
  static async getStatsOverview(req: Request, res: Response): Promise<void> {
    try {
      // Get basic stats
      const [totalCarts, totalValue, averageValue, recoveredCarts, recoveredValue] = await Promise.all([
        AbandonedCart.countDocuments(),
        AbandonedCart.aggregate([
          { $group: { _id: null, total: { $sum: '$sale.total' } } }
        ]),
        AbandonedCart.aggregate([
          { $group: { _id: null, avg: { $avg: '$sale.total' } } }
        ]),
        AbandonedCart.countDocuments({ cart_status: 'recovered' }),
        AbandonedCart.aggregate([
          { $match: { cart_status: 'recovered' } },
          { $group: { _id: null, total: { $sum: '$sale.total' } } }
        ])
      ]);

      // Get period stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const [todayCarts, weekCarts, monthCarts] = await Promise.all([
        AbandonedCart.countDocuments({ createdAt: { $gte: today } }),
        AbandonedCart.countDocuments({ createdAt: { $gte: weekAgo } }),
        AbandonedCart.countDocuments({ createdAt: { $gte: monthAgo } })
      ]);

      // Calculate recovery rate
      const recoveryRate = totalCarts > 0 ? ((recoveredCarts / totalCarts) * 100).toFixed(2) : '0.00';

      // Get top products
      const topProducts = await AbandonedCart.aggregate([
        { $group: { 
          _id: '$product.name', 
          count: { $sum: 1 },
          totalValue: { $sum: '$sale.total' }
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Get top sellers
      const topSellers = await AbandonedCart.aggregate([
        { $group: { 
          _id: { name: '$seller.name', email: '$seller.email' }, 
          count: { $sum: 1 },
          totalValue: { $sum: '$sale.total' }
        }},
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

      logger.info(`📈 Estatísticas geradas: ${totalCarts} carrinhos abandonados`);

      res.status(200).json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: stats
      });

    } catch (error) {
      logger.error('❌ Erro ao gerar estatísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao gerar estatísticas'
      });
    }
  }

  /**
   * Get daily statistics about abandoned carts
   */
  static async getDailyStats(req: Request, res: Response): Promise<void> {
    try {
      const days = Math.min(parseInt(req.query.days as string) || 30, 90);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const dailyStats = await AbandonedCart.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 
          count: { $sum: 1 },
          totalValue: { $sum: '$sale.total' }
        }},
        { $sort: { _id: 1 } }
      ]);

      const stats = dailyStats.map(stat => ({
        date: stat._id,
        count: stat.count,
        totalValue: stat.totalValue,
        averageValue: stat.count > 0 ? stat.totalValue / stat.count : 0
      }));

      logger.info(`📊 Estatísticas diárias geradas: ${days} dias`);

      res.status(200).json({
        success: true,
        message: 'Estatísticas diárias obtidas com sucesso',
        data: stats
      });

    } catch (error) {
      logger.error('❌ Erro ao gerar estatísticas diárias:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao gerar estatísticas diárias'
      });
    }
  }

  /**
   * Update cart status
   */
  static async updateCartStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cart_status, status_updated_by } = req.body;

      // Validar status
      const validStatuses = ['abandoned', 'recovered', 'cancelled'];
      if (!cart_status || !validStatuses.includes(cart_status)) {
        res.status(400).json({
          success: false,
          error: 'Status inválido',
          message: `Status deve ser um dos seguintes: ${validStatuses.join(', ')}`
        });
        return;
      }

      // Buscar carrinho abandonado
      const abandonedCart = await AbandonedCart.findById(id);

      if (!abandonedCart) {
        res.status(404).json({
          success: false,
          error: 'Carrinho abandonado não encontrado',
          message: 'O carrinho abandonado com o ID especificado não foi encontrado'
        });
        return;
      }

      // Atualizar status
      abandonedCart.cart_status = cart_status;
      abandonedCart.status_updated_at = new Date();
      abandonedCart.status_updated_by = status_updated_by || 'system';

      await abandonedCart.save();

      logger.info(`✅ Status do carrinho atualizado: ${id} -> ${cart_status}`);

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

    } catch (error) {
      logger.error('❌ Erro ao atualizar status do carrinho:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Erro ao atualizar status do carrinho'
      });
    }
  }
}
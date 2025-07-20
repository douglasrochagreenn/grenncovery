import { Request, Response } from 'express';
import Joi from 'joi';
import { QuestionAnswer } from '../models/questionAnswer.model';
import { logger } from '../config/logger';
import { ICreateQuestionAnswerRequest, IUpdateQuestionAnswerRequest, IQuestionAnswerFilters } from '../types/questionAnswer.types';

export class QuestionAnswerController {
  // Schema de validação para criação
  private static createSchema = Joi.object({
    question: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Pergunta deve ter pelo menos 10 caracteres',
      'string.max': 'Pergunta não pode ter mais de 1000 caracteres',
      'any.required': 'Pergunta é obrigatória'
    }),
    answer: Joi.string().max(2000).allow('').optional().messages({
      'string.max': 'Resposta não pode ter mais de 2000 caracteres'
    }),
    status: Joi.string().valid('pending', 'answered', 'archived').optional(),
    producerId: Joi.number().integer().positive().optional(),
    clientId: Joi.number().integer().positive().optional(),
    clientName: Joi.string().max(100).optional().messages({
      'string.max': 'Nome do cliente não pode ter mais de 100 caracteres'
    }),
    clientEmail: Joi.string().email().optional().messages({
      'string.email': 'Email deve ser válido'
    }),
    productId: Joi.number().integer().positive().optional(),
    productName: Joi.string().max(200).optional().messages({
      'string.max': 'Nome do produto não pode ter mais de 200 caracteres'
    }),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    category: Joi.string().max(50).optional().messages({
      'string.max': 'Categoria não pode ter mais de 50 caracteres'
    }),
    tags: Joi.array().items(Joi.string().max(30)).optional(),
    isPublic: Joi.boolean().optional()
  });

  // Schema de validação para atualização
  private static updateSchema = Joi.object({
    question: Joi.string().min(10).max(1000).optional().messages({
      'string.min': 'Pergunta deve ter pelo menos 10 caracteres',
      'string.max': 'Pergunta não pode ter mais de 1000 caracteres'
    }),
    answer: Joi.string().max(2000).allow('').optional().messages({
      'string.max': 'Resposta não pode ter mais de 2000 caracteres'
    }),
    status: Joi.string().valid('pending', 'answered', 'archived').optional(),
    producerId: Joi.number().integer().positive().optional(),
    clientId: Joi.number().integer().positive().optional(),
    clientName: Joi.string().max(100).optional().messages({
      'string.max': 'Nome do cliente não pode ter mais de 100 caracteres'
    }),
    clientEmail: Joi.string().email().optional().messages({
      'string.email': 'Email deve ser válido'
    }),
    productId: Joi.number().integer().positive().optional(),
    productName: Joi.string().max(200).optional().messages({
      'string.max': 'Nome do produto não pode ter mais de 200 caracteres'
    }),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    category: Joi.string().max(50).optional().messages({
      'string.max': 'Categoria não pode ter mais de 50 caracteres'
    }),
    tags: Joi.array().items(Joi.string().max(30)).optional(),
    isPublic: Joi.boolean().optional()
  });

  /**
   * Criar nova pergunta
   */
  static async createQuestionAnswer(req: Request, res: Response): Promise<void> {
    try {
      // Validar dados de entrada
      const { error, value } = QuestionAnswerController.createSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const questionAnswerData: ICreateQuestionAnswerRequest = value;

      // Criar nova pergunta
      const questionAnswer = new QuestionAnswer(questionAnswerData);
      await questionAnswer.save();

      logger.info(`✅ Nova pergunta criada: ${questionAnswer._id}`);

      res.status(201).json({
        success: true,
        message: 'Pergunta criada com sucesso',
        data: questionAnswer
      });

    } catch (error) {
      logger.error('❌ Erro ao criar pergunta:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao criar pergunta'
      });
    }
  }

  /**
   * Listar perguntas com filtros e paginação
   */
  static async getQuestionAnswers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const skip = (page - 1) * limit;

      // Construir filtros
      const filter: any = {};
      
      if (req.query.status) {
        filter.status = req.query.status;
      }
      
      if (req.query.priority) {
        filter.priority = req.query.priority;
      }
      
      if (req.query.category) {
        filter.category = { $regex: req.query.category as string, $options: 'i' };
      }
      
      if (req.query.producerId) {
        filter.producerId = parseInt(req.query.producerId as string);
      }
      
      if (req.query.clientId) {
        filter.clientId = parseInt(req.query.clientId as string);
      }
      
      if (req.query.productId) {
        filter.productId = parseInt(req.query.productId as string);
      }
      
      if (req.query.clientEmail) {
        filter.clientEmail = { $regex: req.query.clientEmail as string, $options: 'i' };
      }
      
      if (req.query.isPublic !== undefined) {
        filter.isPublic = req.query.isPublic === 'true';
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
      
      if (req.query.search) {
        const searchRegex = { $regex: req.query.search as string, $options: 'i' };
        filter.$or = [
          { question: searchRegex },
          { answer: searchRegex },
          { clientName: searchRegex },
          { productName: searchRegex }
        ];
      }

      // Construir ordenação
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string === 'asc' ? 1 : -1;
      const sort: any = {};
      sort[sortBy] = sortOrder;

      // Executar consulta
      const [questionAnswers, total] = await Promise.all([
        QuestionAnswer.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        QuestionAnswer.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      logger.info(`📊 Consulta de perguntas: ${questionAnswers.length} resultados`);

      res.status(200).json({
        success: true,
        message: 'Perguntas obtidas com sucesso',
        data: {
          questionAnswers,
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
      logger.error('❌ Erro ao buscar perguntas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar perguntas'
      });
    }
  }

  /**
   * Obter pergunta por ID
   */
  static async getQuestionAnswerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const questionAnswer = await QuestionAnswer.findById(id).lean();

      if (!questionAnswer) {
        res.status(404).json({
          success: false,
          error: 'Pergunta não encontrada',
          message: 'A pergunta com o ID especificado não foi encontrada'
        });
        return;
      }

      logger.info(`📋 Pergunta encontrada: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Pergunta encontrada',
        data: questionAnswer
      });

    } catch (error) {
      logger.error('❌ Erro ao buscar pergunta por ID:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pergunta'
      });
    }
  }

  /**
   * Atualizar pergunta
   */
  static async updateQuestionAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar dados de entrada
      const { error, value } = QuestionAnswerController.updateSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      const updateData: IUpdateQuestionAnswerRequest = value;

      // Atualizar pergunta
      const questionAnswer = await QuestionAnswer.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!questionAnswer) {
        res.status(404).json({
          success: false,
          error: 'Pergunta não encontrada',
          message: 'A pergunta com o ID especificado não foi encontrada'
        });
        return;
      }

      logger.info(`✅ Pergunta atualizada: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Pergunta atualizada com sucesso',
        data: questionAnswer
      });

    } catch (error) {
      logger.error('❌ Erro ao atualizar pergunta:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao atualizar pergunta'
      });
    }
  }

  /**
   * Deletar pergunta
   */
  static async deleteQuestionAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const questionAnswer = await QuestionAnswer.findByIdAndDelete(id);

      if (!questionAnswer) {
        res.status(404).json({
          success: false,
          error: 'Pergunta não encontrada',
          message: 'A pergunta com o ID especificado não foi encontrada'
        });
        return;
      }

      logger.info(`🗑️ Pergunta deletada: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Pergunta deletada com sucesso',
        data: { id }
      });

    } catch (error) {
      logger.error('❌ Erro ao deletar pergunta:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao deletar pergunta'
      });
    }
  }

  /**
   * Obter estatísticas das perguntas
   */
  static async getQuestionAnswerStats(req: Request, res: Response): Promise<void> {
    try {
      // Estatísticas básicas
      const [totalQuestions, pendingQuestions, answeredQuestions, archivedQuestions] = await Promise.all([
        QuestionAnswer.countDocuments(),
        QuestionAnswer.countDocuments({ status: 'pending' }),
        QuestionAnswer.countDocuments({ status: 'answered' }),
        QuestionAnswer.countDocuments({ status: 'archived' })
      ]);

      // Estatísticas por prioridade
      const priorityStats = await QuestionAnswer.aggregate([
        { $group: { 
          _id: '$priority', 
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]);

      // Estatísticas por categoria
      const categoryStats = await QuestionAnswer.aggregate([
        { $match: { category: { $exists: true, $ne: null } } },
        { $group: { 
          _id: '$category', 
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Perguntas por período
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const [todayQuestions, weekQuestions, monthQuestions] = await Promise.all([
        QuestionAnswer.countDocuments({ createdAt: { $gte: today } }),
        QuestionAnswer.countDocuments({ createdAt: { $gte: weekAgo } }),
        QuestionAnswer.countDocuments({ createdAt: { $gte: monthAgo } })
      ]);

      const stats = {
        total: {
          totalQuestions,
          pendingQuestions,
          answeredQuestions,
          archivedQuestions
        },
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byCategory: categoryStats.map(item => ({
          category: item._id,
          count: item.count
        })),
        byPeriod: {
          today: todayQuestions,
          week: weekQuestions,
          month: monthQuestions
        },
        responseRate: totalQuestions > 0 ? (answeredQuestions / totalQuestions * 100).toFixed(2) : 0
      };

      logger.info(`📈 Estatísticas de perguntas geradas: ${totalQuestions} perguntas`);

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
        message: 'Erro ao gerar estatísticas'
      });
    }
  }

  /**
   * Responder pergunta (atualizar apenas resposta e status)
   */
  static async answerQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { answer } = req.body;

      if (!answer || answer.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Resposta é obrigatória',
          message: 'É necessário fornecer uma resposta'
        });
        return;
      }

      if (answer.length > 2000) {
        res.status(400).json({
          success: false,
          error: 'Resposta muito longa',
          message: 'Resposta não pode ter mais de 2000 caracteres'
        });
        return;
      }

      const questionAnswer = await QuestionAnswer.findByIdAndUpdate(
        id,
        { 
          answer: answer.trim(),
          status: 'answered',
          answeredAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!questionAnswer) {
        res.status(404).json({
          success: false,
          error: 'Pergunta não encontrada',
          message: 'A pergunta com o ID especificado não foi encontrada'
        });
        return;
      }

      logger.info(`✅ Pergunta respondida: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Pergunta respondida com sucesso',
        data: questionAnswer
      });

    } catch (error) {
      logger.error('❌ Erro ao responder pergunta:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao responder pergunta'
      });
    }
  }
}
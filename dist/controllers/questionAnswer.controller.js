"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswerController = void 0;
const joi_1 = __importDefault(require("joi"));
const questionAnswer_model_1 = require("../models/questionAnswer.model");
const logger_1 = require("../config/logger");
class QuestionAnswerController {
    static async createQuestionAnswer(req, res) {
        try {
            const { error, value } = QuestionAnswerController.createSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.details.map(detail => detail.message)
                });
                return;
            }
            const questionAnswerData = value;
            const questionAnswer = new questionAnswer_model_1.QuestionAnswer(questionAnswerData);
            await questionAnswer.save();
            logger_1.logger.info(`✅ Nova pergunta criada: ${questionAnswer._id}`);
            res.status(201).json({
                success: true,
                message: 'Pergunta criada com sucesso',
                data: questionAnswer
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao criar pergunta:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao criar pergunta'
            });
        }
    }
    static async getQuestionAnswers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = Math.min(parseInt(req.query.limit) || 10, 100);
            const skip = (page - 1) * limit;
            const filter = {};
            if (req.query.status) {
                filter.status = req.query.status;
            }
            if (req.query.priority) {
                filter.priority = req.query.priority;
            }
            if (req.query.category) {
                filter.category = { $regex: req.query.category, $options: 'i' };
            }
            if (req.query.producerId) {
                filter.producerId = parseInt(req.query.producerId);
            }
            if (req.query.clientId) {
                filter.clientId = parseInt(req.query.clientId);
            }
            if (req.query.productId) {
                filter.productId = parseInt(req.query.productId);
            }
            if (req.query.clientEmail) {
                filter.clientEmail = { $regex: req.query.clientEmail, $options: 'i' };
            }
            if (req.query.isPublic !== undefined) {
                filter.isPublic = req.query.isPublic === 'true';
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
            if (req.query.search) {
                const searchRegex = { $regex: req.query.search, $options: 'i' };
                filter.$or = [
                    { question: searchRegex },
                    { answer: searchRegex },
                    { clientName: searchRegex },
                    { productName: searchRegex }
                ];
            }
            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
            const sort = {};
            sort[sortBy] = sortOrder;
            const [questionAnswers, total] = await Promise.all([
                questionAnswer_model_1.QuestionAnswer.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                questionAnswer_model_1.QuestionAnswer.countDocuments(filter)
            ]);
            const totalPages = Math.ceil(total / limit);
            logger_1.logger.info(`📊 Consulta de perguntas: ${questionAnswers.length} resultados`);
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
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao buscar perguntas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao buscar perguntas'
            });
        }
    }
    static async getQuestionAnswerById(req, res) {
        try {
            const { id } = req.params;
            const questionAnswer = await questionAnswer_model_1.QuestionAnswer.findById(id).lean();
            if (!questionAnswer) {
                res.status(404).json({
                    success: false,
                    error: 'Pergunta não encontrada',
                    message: 'A pergunta com o ID especificado não foi encontrada'
                });
                return;
            }
            logger_1.logger.info(`📋 Pergunta encontrada: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Pergunta encontrada',
                data: questionAnswer
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao buscar pergunta por ID:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao buscar pergunta'
            });
        }
    }
    static async updateQuestionAnswer(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = QuestionAnswerController.updateSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.details.map(detail => detail.message)
                });
                return;
            }
            const updateData = value;
            const questionAnswer = await questionAnswer_model_1.QuestionAnswer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!questionAnswer) {
                res.status(404).json({
                    success: false,
                    error: 'Pergunta não encontrada',
                    message: 'A pergunta com o ID especificado não foi encontrada'
                });
                return;
            }
            logger_1.logger.info(`✅ Pergunta atualizada: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Pergunta atualizada com sucesso',
                data: questionAnswer
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao atualizar pergunta:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao atualizar pergunta'
            });
        }
    }
    static async deleteQuestionAnswer(req, res) {
        try {
            const { id } = req.params;
            const questionAnswer = await questionAnswer_model_1.QuestionAnswer.findByIdAndDelete(id);
            if (!questionAnswer) {
                res.status(404).json({
                    success: false,
                    error: 'Pergunta não encontrada',
                    message: 'A pergunta com o ID especificado não foi encontrada'
                });
                return;
            }
            logger_1.logger.info(`🗑️ Pergunta deletada: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Pergunta deletada com sucesso',
                data: { id }
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao deletar pergunta:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao deletar pergunta'
            });
        }
    }
    static async getQuestionAnswerStats(req, res) {
        try {
            const [totalQuestions, pendingQuestions, answeredQuestions, archivedQuestions] = await Promise.all([
                questionAnswer_model_1.QuestionAnswer.countDocuments(),
                questionAnswer_model_1.QuestionAnswer.countDocuments({ status: 'pending' }),
                questionAnswer_model_1.QuestionAnswer.countDocuments({ status: 'answered' }),
                questionAnswer_model_1.QuestionAnswer.countDocuments({ status: 'archived' })
            ]);
            const priorityStats = await questionAnswer_model_1.QuestionAnswer.aggregate([
                { $group: {
                        _id: '$priority',
                        count: { $sum: 1 }
                    } },
                { $sort: { _id: 1 } }
            ]);
            const categoryStats = await questionAnswer_model_1.QuestionAnswer.aggregate([
                { $match: { category: { $exists: true, $ne: null } } },
                { $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const [todayQuestions, weekQuestions, monthQuestions] = await Promise.all([
                questionAnswer_model_1.QuestionAnswer.countDocuments({ createdAt: { $gte: today } }),
                questionAnswer_model_1.QuestionAnswer.countDocuments({ createdAt: { $gte: weekAgo } }),
                questionAnswer_model_1.QuestionAnswer.countDocuments({ createdAt: { $gte: monthAgo } })
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
                }, {}),
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
            logger_1.logger.info(`📈 Estatísticas de perguntas geradas: ${totalQuestions} perguntas`);
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
                message: 'Erro ao gerar estatísticas'
            });
        }
    }
    static async answerQuestion(req, res) {
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
            const questionAnswer = await questionAnswer_model_1.QuestionAnswer.findByIdAndUpdate(id, {
                answer: answer.trim(),
                status: 'answered',
                answeredAt: new Date()
            }, { new: true, runValidators: true });
            if (!questionAnswer) {
                res.status(404).json({
                    success: false,
                    error: 'Pergunta não encontrada',
                    message: 'A pergunta com o ID especificado não foi encontrada'
                });
                return;
            }
            logger_1.logger.info(`✅ Pergunta respondida: ${id}`);
            res.status(200).json({
                success: true,
                message: 'Pergunta respondida com sucesso',
                data: questionAnswer
            });
        }
        catch (error) {
            logger_1.logger.error('❌ Erro ao responder pergunta:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
                message: 'Erro ao responder pergunta'
            });
        }
    }
}
exports.QuestionAnswerController = QuestionAnswerController;
QuestionAnswerController.createSchema = joi_1.default.object({
    question: joi_1.default.string().min(10).max(1000).required().messages({
        'string.min': 'Pergunta deve ter pelo menos 10 caracteres',
        'string.max': 'Pergunta não pode ter mais de 1000 caracteres',
        'any.required': 'Pergunta é obrigatória'
    }),
    answer: joi_1.default.string().max(2000).allow('').optional().messages({
        'string.max': 'Resposta não pode ter mais de 2000 caracteres'
    }),
    status: joi_1.default.string().valid('pending', 'answered', 'archived').optional(),
    producerId: joi_1.default.number().integer().positive().optional(),
    clientId: joi_1.default.number().integer().positive().optional(),
    clientName: joi_1.default.string().max(100).optional().messages({
        'string.max': 'Nome do cliente não pode ter mais de 100 caracteres'
    }),
    clientEmail: joi_1.default.string().email().optional().messages({
        'string.email': 'Email deve ser válido'
    }),
    productId: joi_1.default.number().integer().positive().optional(),
    productName: joi_1.default.string().max(200).optional().messages({
        'string.max': 'Nome do produto não pode ter mais de 200 caracteres'
    }),
    priority: joi_1.default.string().valid('low', 'medium', 'high').optional(),
    category: joi_1.default.string().max(50).optional().messages({
        'string.max': 'Categoria não pode ter mais de 50 caracteres'
    }),
    tags: joi_1.default.array().items(joi_1.default.string().max(30)).optional(),
    isPublic: joi_1.default.boolean().optional()
});
QuestionAnswerController.updateSchema = joi_1.default.object({
    question: joi_1.default.string().min(10).max(1000).optional().messages({
        'string.min': 'Pergunta deve ter pelo menos 10 caracteres',
        'string.max': 'Pergunta não pode ter mais de 1000 caracteres'
    }),
    answer: joi_1.default.string().max(2000).allow('').optional().messages({
        'string.max': 'Resposta não pode ter mais de 2000 caracteres'
    }),
    status: joi_1.default.string().valid('pending', 'answered', 'archived').optional(),
    producerId: joi_1.default.number().integer().positive().optional(),
    clientId: joi_1.default.number().integer().positive().optional(),
    clientName: joi_1.default.string().max(100).optional().messages({
        'string.max': 'Nome do cliente não pode ter mais de 100 caracteres'
    }),
    clientEmail: joi_1.default.string().email().optional().messages({
        'string.email': 'Email deve ser válido'
    }),
    productId: joi_1.default.number().integer().positive().optional(),
    productName: joi_1.default.string().max(200).optional().messages({
        'string.max': 'Nome do produto não pode ter mais de 200 caracteres'
    }),
    priority: joi_1.default.string().valid('low', 'medium', 'high').optional(),
    category: joi_1.default.string().max(50).optional().messages({
        'string.max': 'Categoria não pode ter mais de 50 caracteres'
    }),
    tags: joi_1.default.array().items(joi_1.default.string().max(30)).optional(),
    isPublic: joi_1.default.boolean().optional()
});
//# sourceMappingURL=questionAnswer.controller.js.map
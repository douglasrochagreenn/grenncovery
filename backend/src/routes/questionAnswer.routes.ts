import { Router } from 'express';
import { QuestionAnswerController } from '../controllers/questionAnswer.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     QuestionAnswer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         question:
 *           type: string
 *           example: "Como posso cancelar minha assinatura?"
 *         answer:
 *           type: string
 *           example: "Para cancelar sua assinatura, acesse sua conta e clique em 'Cancelar Assinatura'."
 *         status:
 *           type: string
 *           enum: [pending, answered, archived]
 *           example: "answered"
 *         producerId:
 *           type: number
 *           example: 123
 *         clientId:
 *           type: number
 *           example: 456
 *         clientName:
 *           type: string
 *           example: "João Silva"
 *         clientEmail:
 *           type: string
 *           format: email
 *           example: "joao@exemplo.com"
 *         productId:
 *           type: number
 *           example: 789
 *         productName:
 *           type: string
 *           example: "Curso de JavaScript"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "medium"
 *         category:
 *           type: string
 *           example: "Suporte"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["cancelamento", "assinatura"]
 *         isPublic:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T19:09:10.312Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T19:09:10.312Z"
 *         answeredAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-19T20:15:30.123Z"
 *     CreateQuestionAnswerRequest:
 *       type: object
 *       required:
 *         - question
 *       properties:
 *         question:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "Como posso cancelar minha assinatura?"
 *         answer:
 *           type: string
 *           maxLength: 2000
 *           example: "Para cancelar sua assinatura, acesse sua conta..."
 *         status:
 *           type: string
 *           enum: [pending, answered, archived]
 *           example: "pending"
 *         producerId:
 *           type: number
 *           example: 123
 *         clientId:
 *           type: number
 *           example: 456
 *         clientName:
 *           type: string
 *           maxLength: 100
 *           example: "João Silva"
 *         clientEmail:
 *           type: string
 *           format: email
 *           example: "joao@exemplo.com"
 *         productId:
 *           type: number
 *           example: 789
 *         productName:
 *           type: string
 *           maxLength: 200
 *           example: "Curso de JavaScript"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "medium"
 *         category:
 *           type: string
 *           maxLength: 50
 *           example: "Suporte"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             maxLength: 30
 *           example: ["cancelamento", "assinatura"]
 *         isPublic:
 *           type: boolean
 *           example: false
 *     UpdateQuestionAnswerRequest:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           example: "Como posso cancelar minha assinatura?"
 *         answer:
 *           type: string
 *           maxLength: 2000
 *           example: "Para cancelar sua assinatura, acesse sua conta..."
 *         status:
 *           type: string
 *           enum: [pending, answered, archived]
 *           example: "answered"
 *         producerId:
 *           type: number
 *           example: 123
 *         clientId:
 *           type: number
 *           example: 456
 *         clientName:
 *           type: string
 *           maxLength: 100
 *           example: "João Silva"
 *         clientEmail:
 *           type: string
 *           format: email
 *           example: "joao@exemplo.com"
 *         productId:
 *           type: number
 *           example: 789
 *         productName:
 *           type: string
 *           maxLength: 200
 *           example: "Curso de JavaScript"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "high"
 *         category:
 *           type: string
 *           maxLength: 50
 *           example: "Suporte"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             maxLength: 30
 *           example: ["cancelamento", "assinatura"]
 *         isPublic:
 *           type: boolean
 *           example: true
 *     AnswerQuestionRequest:
 *       type: object
 *       required:
 *         - answer
 *       properties:
 *         answer:
 *           type: string
 *           maxLength: 2000
 *           example: "Para cancelar sua assinatura, acesse sua conta e clique em 'Cancelar Assinatura'."
 */

/**
 * @swagger
 * /api/questions-answers:
 *   post:
 *     summary: Criar nova pergunta
 *     description: |
 *       Cria uma nova pergunta no sistema.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Validações:**
 *       - Pergunta deve ter entre 10 e 1000 caracteres
 *       - Resposta pode estar vazia ou ter até 2000 caracteres
 *       - Email deve ser válido se fornecido
 *       - Tags devem ter no máximo 30 caracteres cada
 *     tags: [API - Perguntas e Respostas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionAnswerRequest'
 *     responses:
 *       201:
 *         description: Pergunta criada com sucesso
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
 *                   example: "Pergunta criada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/QuestionAnswer'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 *   get:
 *     summary: Listar perguntas com filtros
 *     description: |
 *       Retorna uma lista paginada de perguntas com filtros opcionais.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Filtros disponíveis:**
 *       - `status`: Status da pergunta (pending, answered, archived)
 *       - `priority`: Prioridade (low, medium, high)
 *       - `category`: Categoria da pergunta
 *       - `producerId`: ID do produtor
 *       - `clientId`: ID do cliente
 *       - `productId`: ID do produto
 *       - `clientEmail`: Email do cliente
 *       - `isPublic`: Se a pergunta é pública (true/false)
 *       - `startDate`: Data inicial (YYYY-MM-DD)
 *       - `endDate`: Data final (YYYY-MM-DD)
 *       - `search`: Busca em pergunta, resposta, nome do cliente e produto
 *     tags: [API - Perguntas e Respostas]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, answered, archived]
 *         description: Filtrar por status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filtrar por prioridade
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: producerId
 *         schema:
 *           type: number
 *         description: Filtrar por ID do produtor
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: number
 *         description: Filtrar por ID do cliente
 *       - in: query
 *         name: productId
 *         schema:
 *           type: number
 *         description: Filtrar por ID do produto
 *       - in: query
 *         name: clientEmail
 *         schema:
 *           type: string
 *         description: Filtrar por email do cliente
 *       - in: query
 *         name: isPublic
 *         schema:
 *           type: boolean
 *         description: Filtrar por visibilidade pública
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar em pergunta, resposta, nome do cliente e produto
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, priority, status]
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
 *         description: Lista de perguntas
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
 *                   example: "Perguntas obtidas com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     questionAnswers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/QuestionAnswer'
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
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/questions-answers/{id}:
 *   get:
 *     summary: Obter pergunta por ID
 *     description: |
 *       Retorna os detalhes de uma pergunta específica.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *     tags: [API - Perguntas e Respostas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     responses:
 *       200:
 *         description: Pergunta encontrada
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
 *                   example: "Pergunta encontrada"
 *                 data:
 *                   $ref: '#/components/schemas/QuestionAnswer'
 *       404:
 *         description: Pergunta não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 *   put:
 *     summary: Atualizar pergunta
 *     description: |
 *       Atualiza uma pergunta existente. Produtores podem editar respostas e status.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Funcionalidades:**
 *       - Atualizar pergunta, resposta e status
 *       - Quando uma resposta é adicionada, o status muda automaticamente para 'answered'
 *       - Data de resposta é atualizada automaticamente
 *     tags: [API - Perguntas e Respostas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuestionAnswerRequest'
 *     responses:
 *       200:
 *         description: Pergunta atualizada com sucesso
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
 *                   example: "Pergunta atualizada com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/QuestionAnswer'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pergunta não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 *   delete:
 *     summary: Deletar pergunta
 *     description: |
 *       Remove uma pergunta do sistema.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *     tags: [API - Perguntas e Respostas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     responses:
 *       200:
 *         description: Pergunta deletada com sucesso
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
 *                   example: "Pergunta deletada com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *       404:
 *         description: Pergunta não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/questions-answers/{id}/answer:
 *   patch:
 *     summary: Responder pergunta
 *     description: |
 *       Adiciona ou atualiza a resposta de uma pergunta específica.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Funcionalidades:**
 *       - Atualiza apenas a resposta
 *       - Muda status automaticamente para 'answered'
 *       - Define data de resposta automaticamente
 *     tags: [API - Perguntas e Respostas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da pergunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnswerQuestionRequest'
 *     responses:
 *       200:
 *         description: Pergunta respondida com sucesso
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
 *                   example: "Pergunta respondida com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/QuestionAnswer'
 *       400:
 *         description: Resposta inválida ou não fornecida
 *       404:
 *         description: Pergunta não encontrada
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/questions-answers/stats:
 *   get:
 *     summary: Estatísticas das perguntas
 *     description: |
 *       Retorna estatísticas detalhadas sobre as perguntas e respostas.
 *       
 *       **Autenticação:**
 *       - Requer token JWT válido no header Authorization
 *       - Formato: `Bearer <token>`
 *       
 *       **Estatísticas incluídas:**
 *       - Total de perguntas por status
 *       - Distribuição por prioridade
 *       - Top categorias
 *       - Perguntas por período
 *       - Taxa de resposta
 *     tags: [API - Perguntas e Respostas]
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
 *                     total:
 *                       type: object
 *                       properties:
 *                         totalQuestions:
 *                           type: integer
 *                           example: 1250
 *                         pendingQuestions:
 *                           type: integer
 *                           example: 150
 *                         answeredQuestions:
 *                           type: integer
 *                           example: 1000
 *                         archivedQuestions:
 *                           type: integer
 *                           example: 100
 *                     byPriority:
 *                       type: object
 *                       properties:
 *                         low:
 *                           type: integer
 *                           example: 300
 *                         medium:
 *                           type: integer
 *                           example: 700
 *                         high:
 *                           type: integer
 *                           example: 250
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: "Suporte"
 *                           count:
 *                             type: integer
 *                             example: 450
 *                     byPeriod:
 *                       type: object
 *                       properties:
 *                         today:
 *                           type: integer
 *                           example: 15
 *                         week:
 *                           type: integer
 *                           example: 89
 *                         month:
 *                           type: integer
 *                           example: 342
 *                     responseRate:
 *                       type: string
 *                       example: "80.00"
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro interno do servidor
 */

// Aplicar middleware de autenticação em todas as rotas
router.use(AuthMiddleware.authenticate);

// Rotas CRUD
router.post('/', QuestionAnswerController.createQuestionAnswer);
router.get('/', QuestionAnswerController.getQuestionAnswers);
router.get('/stats', QuestionAnswerController.getQuestionAnswerStats);
router.get('/:id', QuestionAnswerController.getQuestionAnswerById);
router.put('/:id', QuestionAnswerController.updateQuestionAnswer);
router.delete('/:id', QuestionAnswerController.deleteQuestionAnswer);
router.patch('/:id/answer', QuestionAnswerController.answerQuestion);

export default router;
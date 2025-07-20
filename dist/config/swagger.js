"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDefinition = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GreennCovery Webhook API',
            version: '1.0.0',
            description: `
        API para receber webhooks de carrinho abandonado e gerenciar dados de clientes, vendas e produtos.
        
        ## 🚀 Funcionalidades
        
        - **Webhook de Carrinho Abandonado**: Recebe e processa notificações de carrinhos abandonados
        - **Armazenamento no MongoDB Atlas**: Salva todos os dados de forma estruturada
        - **API REST**: Endpoints para consultar e analisar os dados
        - **Sistema de Autenticação**: JWT para proteger endpoints sensíveis
        - **Validação de Dados**: Validação robusta com Joi
        - **Logging**: Sistema de logs com Winston
        - **Estatísticas**: Relatórios e análises dos carrinhos abandonados
        - **Perguntas e Respostas**: Sistema completo de Q&A
        
        ## 🔐 Autenticação
        
        A maioria dos endpoints da API requer autenticação JWT. Para obter um token:
        
        1. **Registre-se**: \`POST /auth/register\`
        2. **Faça login**: \`POST /auth/login\`
        3. **Use o token**: Adicione \`Bearer <token>\` no header Authorization
        
        ## 📊 Estrutura dos Dados
        
        ### Webhook de Carrinho Abandonado
        O webhook recebe dados estruturados contendo:
        - Informações do evento (tipo, status)
        - Dados da venda (ID, valor, método de pagamento)
        - Informações do cliente (nome, email, endereço)
        - Detalhes do produto (nome, descrição, preço)
        - Dados do vendedor
        - Informações do contrato/assinatura
        
        ### Status do Carrinho
        - \`abandoned\`: Carrinho abandonado (padrão)
        - \`recovered\`: Carrinho recuperado (cliente finalizou compra)
        - \`cancelled\`: Carrinho cancelado (cliente desistiu)
        
        ## 🔧 Filtros e Paginação
        
        A maioria dos endpoints de listagem suporta:
        - **Paginação**: \`page\` e \`limit\`
        - **Ordenação**: \`sortBy\` e \`sortOrder\`
        - **Filtros**: Por data, email, produto, status, etc.
        - **Busca**: Busca textual em campos relevantes
        
        ## 📈 Estatísticas
        
        Endpoints de estatísticas fornecem:
        - Visão geral dos carrinhos abandonados
        - Estatísticas por período
        - Top produtos e vendedores
        - Taxa de recuperação
        - Análises de perguntas e respostas
        
        ## 🌐 Ambientes
        
        - **Desenvolvimento**: http://localhost:3000
        - **Produção**: Configure conforme necessário
        
        ## 📞 Suporte
        
        Para suporte técnico:
        - Email: support@greenncovery.com
        - Documentação: Esta página
        - Repositório: GitHub (se aplicável)
      `,
            contact: {
                name: 'GreennCovery Support',
                email: 'support@greenncovery.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            },
            {
                url: 'https://api.greenncovery.com',
                description: 'Servidor de Produção'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido através do login. Formato: Bearer <token>'
                }
            },
            schemas: {
                AbandonedCart: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '64f8a1b2c3d4e5f6a7b8c9d0',
                            description: 'ID único do registro'
                        },
                        type: {
                            type: 'string',
                            example: 'checkout',
                            description: 'Tipo do evento'
                        },
                        event: {
                            type: 'string',
                            example: 'checkoutAbandoned',
                            description: 'Nome do evento'
                        },
                        oldStatus: {
                            type: 'string',
                            example: 'abandoned',
                            description: 'Status anterior'
                        },
                        currentStatus: {
                            type: 'string',
                            example: 'abandoned',
                            description: 'Status atual'
                        },
                        contract: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 760 },
                                start_date: { type: 'string', example: '2025-07-19' },
                                created_at: { type: 'string', example: '2025-07-19T19:09:10.312603Z' },
                                updated_at: { type: 'string', example: '2025-07-19T19:09:10.312606Z' },
                                status: { type: 'string', example: 'paid' },
                                current_period_end: { type: 'string', example: '2025-07-19T19:09:10.312609Z' }
                            }
                        },
                        sale: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 526 },
                                type: { type: 'string', example: 'SUBSCRIPTION' },
                                status: { type: 'string', example: 'abandoned' },
                                created_at: { type: 'string', example: '2025-07-19T19:09:10.312614Z' },
                                update_at: { type: 'string', example: '2025-07-19T19:09:10.312617Z' },
                                seller_id: { type: 'integer', example: 426 },
                                installments: { type: 'integer', example: 12 },
                                method: { type: 'string', example: 'CREDIT_CARD' },
                                client_id: { type: 'integer', example: 100 },
                                amount: { type: 'number', example: 10 },
                                proposal_id: { type: 'integer', nullable: true, example: null },
                                total: { type: 'number', example: 10 }
                            }
                        },
                        client: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 100 },
                                name: { type: 'string', example: 'Leila O\'Connell' },
                                email: { type: 'string', format: 'email', example: 'adrian.barton@greenholt.net' },
                                cellphone: { type: 'string', example: '+16098846219' },
                                document: { type: 'string', example: '917.527.272-59' },
                                cpf_cnpj: { type: 'string', example: '917.527.272-59' },
                                zipcode: { type: 'string', example: '14229' },
                                street: { type: 'string', example: 'Kyle Flat' },
                                number: { type: 'string', example: '35774' },
                                complement: { type: 'string', example: '' },
                                neighborhood: { type: 'string', example: '' },
                                city: { type: 'string', example: 'New Arno' },
                                uf: { type: 'string', example: 'WI' },
                                created_at: { type: 'string', example: '2025-07-19T19:09:10.312581Z' },
                                updated_at: { type: 'string', example: '2025-07-19T19:09:10.312588Z' }
                            }
                        },
                        product: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 96502 },
                                name: { type: 'string', example: 'Dragão assinatura' },
                                description: { type: 'string', example: 'Minha assinatura 10reais' },
                                category_id: { type: 'integer', example: 2 },
                                stock: { type: 'integer', nullable: true, example: null },
                                type: { type: 'string', example: 'SUBSCRIPTION' },
                                amount: { type: 'number', example: 10 },
                                period: { type: 'integer', example: 30 },
                                thank_you_page: { type: 'string', nullable: true, example: null },
                                created_at: { type: 'string', example: '2025-01-14T19:40:32.000000Z' },
                                updated_at: { type: 'string', example: '2025-01-14T19:40:32.000000Z' },
                                seller_id: { type: 'integer', example: 408443 },
                                slug: { type: 'string', example: 'dragao-assinatura' },
                                method: { type: 'string', example: 'CREDIT_CARD,BOLETO,PIX' },
                                product_type_id: { type: 'integer', example: 5 },
                                status_changed_at: { type: 'string', example: '2025-01-14 19:40:31' },
                                product_id: { type: 'integer', example: 96502 },
                                hash: { type: 'string', example: 'QPzYRe' }
                            }
                        },
                        oferta: {
                            type: 'string',
                            example: 'Dragão assinatura',
                            description: 'Nome da oferta'
                        },
                        offer: {
                            type: 'object',
                            properties: {
                                hash: { type: 'string', example: 'QPzYRe' },
                                amount: { type: 'number', example: 10 },
                                method: { type: 'string', example: 'CREDIT_CARD,BOLETO,PIX' },
                                name: { type: 'string', example: 'Dragão assinatura' },
                                created_at: { type: 'string', example: '2025-01-14T19:40:32.000000Z' }
                            }
                        },
                        seller: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 426 },
                                name: { type: 'string', example: 'Ezekiel Hagenes I' },
                                email: { type: 'string', format: 'email', example: 'larry.batz@hotmail.com' },
                                cellphone: { type: 'string', example: '+13803331961' }
                            }
                        },
                        affiliate: {
                            type: 'object',
                            nullable: true,
                            example: null,
                            description: 'Dados do afiliado (se houver)'
                        },
                        productMetas: {
                            type: 'array',
                            items: { type: 'object' },
                            example: [],
                            description: 'Metadados do produto'
                        },
                        proposalMetas: {
                            type: 'array',
                            items: { type: 'object' },
                            example: [],
                            description: 'Metadados da proposta'
                        },
                        cart_status: {
                            type: 'string',
                            enum: ['abandoned', 'recovered', 'cancelled'],
                            example: 'abandoned',
                            description: 'Status atual do carrinho'
                        },
                        status_updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-20T10:30:00.000Z',
                            description: 'Data da última atualização de status'
                        },
                        status_updated_by: {
                            type: 'string',
                            example: 'system',
                            description: 'Usuário que atualizou o status'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-19T19:09:10.312Z',
                            description: 'Data de criação do registro'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2025-01-19T19:09:10.312Z',
                            description: 'Data da última atualização do registro'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            example: 'Erro interno do servidor'
                        },
                        message: {
                            type: 'string',
                            example: 'Descrição detalhada do erro'
                        },
                        details: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Campo obrigatório não fornecido'],
                            description: 'Detalhes adicionais do erro (opcional)'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operação realizada com sucesso'
                        },
                        data: {
                            type: 'object',
                            description: 'Dados retornados pela operação'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Webhook',
                description: 'Endpoints para receber webhooks de carrinho abandonado'
            },
            {
                name: 'Webhook GreennCovery',
                description: 'Endpoints específicos para webhooks do sistema GreennCovery'
            },
            {
                name: 'API - Carrinhos Abandonados',
                description: 'Endpoints para gerenciar carrinhos abandonados (requer autenticação)'
            },
            {
                name: 'API - Estatísticas',
                description: 'Endpoints para obter estatísticas e relatórios (requer autenticação)'
            },
            {
                name: 'API - Perguntas e Respostas',
                description: 'Endpoints para gerenciar perguntas e respostas (requer autenticação)'
            },
            {
                name: 'Autenticação',
                description: 'Endpoints para autenticação e gerenciamento de usuários'
            }
        ]
    },
    apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/models/*.ts'
    ]
};
exports.swaggerDefinition = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map
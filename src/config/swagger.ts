/**
 * Configuração manual do Swagger para garantir funcionamento em produção
 */

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GreennCovery Webhook API',
    version: '1.0.0',
    description: 'API para receber webhooks de carrinho abandonado do sistema GreennCovery',
    contact: {
      name: 'GreennCovery',
      email: 'contato@greenncovery.com'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://api.greenncovery.com' 
        : `http://localhost:${process.env.PORT || 3000}`,
      description: process.env.NODE_ENV === 'production' 
        ? 'Servidor de Produção' 
        : 'Servidor de Desenvolvimento'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido através do login (válido por 30 dias)'
      }
    },
    schemas: {
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
          }
        }
      },
      AbandonedCartWebhook: {
        type: 'object',
        required: ['type', 'event', 'sale', 'client', 'product'],
        properties: {
          type: {
            type: 'string',
            example: 'checkout'
          },
          event: {
            type: 'string',
            example: 'checkoutAbandoned'
          },
          oldStatus: {
            type: 'string',
            example: 'abandoned'
          },
          currentStatus: {
            type: 'string',
            example: 'abandoned'
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
            example: 'Dragão assinatura'
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
            example: null
          },
          productMetas: {
            type: 'array',
            items: { type: 'object' },
            example: []
          },
          proposalMetas: {
            type: 'array',
            items: { type: 'object' },
            example: []
          }
        }
      },
      AbandonedCart: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '64f8a1b2c3d4e5f6a7b8c9d0'
          },
          type: {
            type: 'string',
            example: 'checkout'
          },
          event: {
            type: 'string',
            example: 'checkoutAbandoned'
          },
          sale: {
            $ref: '#/components/schemas/AbandonedCartWebhook/properties/sale'
          },
          client: {
            $ref: '#/components/schemas/AbandonedCartWebhook/properties/client'
          },
          product: {
            $ref: '#/components/schemas/AbandonedCartWebhook/properties/product'
          },
          seller: {
            $ref: '#/components/schemas/AbandonedCartWebhook/properties/seller'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-19T19:09:10.312Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-19T19:09:10.312Z'
          }
        }
      }
    }
  },
  paths: {
    '/webhook/greenncovery': {
      post: {
        summary: 'Recebe webhook específico do GreennCovery',
        description: 'Endpoint específico para receber webhooks do sistema GreennCovery de carrinho abandonado',
        tags: ['Webhook GreennCovery'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AbandonedCartWebhook'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Webhook processado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Webhook GreennCovery processado com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: '64f8a1b2c3d4e5f6a7b8c9d0' },
                        saleId: { type: 'number', example: 526 },
                        clientEmail: { type: 'string', example: 'adrian.barton@greenholt.net' },
                        productName: { type: 'string', example: 'Dragão assinatura' },
                        amount: { type: 'number', example: 10 }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          500: {
            description: 'Erro interno do servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/webhook/abandoned-cart': {
      post: {
        summary: 'Recebe webhook de carrinho abandonado (genérico)',
        description: 'Endpoint genérico para receber notificações de carrinhos abandonados',
        tags: ['Webhook'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AbandonedCartWebhook'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Webhook processado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Webhook processado com sucesso' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          500: {
            description: 'Erro interno do servidor'
          }
        }
      }
    },
    '/webhook/health': {
      get: {
        summary: 'Verifica saúde do webhook',
        description: 'Endpoint para verificar se o webhook está funcionando',
        tags: ['Webhook'],
        responses: {
          200: {
            description: 'Webhook funcionando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', example: '2025-01-19T19:09:10.312Z' },
                    service: { type: 'string', example: 'webhook-service' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/abandoned-carts': {
      get: {
        summary: 'Lista carrinhos abandonados',
        description: 'Retorna uma lista paginada de carrinhos abandonados com filtros opcionais',
        tags: ['API - Carrinhos Abandonados'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Número da página'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Itens por página'
          },
          {
            in: 'query',
            name: 'clientEmail',
            schema: { type: 'string' },
            description: 'Filtrar por email do cliente'
          },
          {
            in: 'query',
            name: 'productName',
            schema: { type: 'string' },
            description: 'Filtrar por nome do produto'
          }
        ],
        responses: {
          200: {
            description: 'Lista de carrinhos abandonados',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Carrinhos abandonados obtidos com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        carts: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/AbandonedCart' }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer', example: 1 },
                            limit: { type: 'integer', example: 10 },
                            total: { type: 'integer', example: 150 },
                            totalPages: { type: 'integer', example: 15 },
                            hasNext: { type: 'boolean', example: true },
                            hasPrev: { type: 'boolean', example: false }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Não autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/abandoned-carts/stats/overview': {
      get: {
        summary: 'Estatísticas gerais dos carrinhos abandonados',
        description: 'Retorna estatísticas gerais sobre carrinhos abandonados',
        tags: ['API - Estatísticas'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Estatísticas obtidas com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Estatísticas obtidas com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        totalCarts: { type: 'integer', example: 1250 },
                        totalValue: { type: 'number', example: 125000.50 },
                        averageValue: { type: 'number', example: 100.00 },
                        todayCarts: { type: 'integer', example: 15 },
                        weekCarts: { type: 'integer', example: 89 },
                        monthCarts: { type: 'integer', example: 342 }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Não autenticado'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Faz login do usuário',
        description: 'Autentica um usuário e retorna um token JWT',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
                  password: { type: 'string', example: '123456', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login realizado com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        expiresIn: { type: 'string', example: '30d' }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Registra um novo usuário',
        description: 'Cria uma nova conta de usuário no sistema',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'confirmPassword'],
                properties: {
                  name: { type: 'string', example: 'João Silva', minLength: 2, maxLength: 100 },
                  email: { type: 'string', format: 'email', example: 'joao.silva@exemplo.com' },
                  password: { type: 'string', example: '123456', minLength: 6 },
                  confirmPassword: { type: 'string', example: '123456', minLength: 6 }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário registrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Usuário registrado com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string', example: '64f8a1b2c3d4e5f6a7b8c9d0' },
                            name: { type: 'string', example: 'João Silva' },
                            email: { type: 'string', example: 'joao.silva@exemplo.com' },
                            role: { type: 'string', example: 'user' },
                            isActive: { type: 'boolean', example: true }
                          }
                        },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        expiresIn: { type: 'string', example: '30d' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Dados inválidos ou email já cadastrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/profile': {
      get: {
        summary: 'Obtém perfil do usuário logado',
        description: 'Retorna as informações do usuário autenticado',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Perfil obtido com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Perfil obtido com sucesso' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            _id: { type: 'string', example: '64f8a1b2c3d4e5f6a7b8c9d0' },
                            name: { type: 'string', example: 'João Silva' },
                            email: { type: 'string', example: 'joao.silva@exemplo.com' },
                            role: { type: 'string', example: 'user' },
                            isActive: { type: 'boolean', example: true },
                            lastLogin: { type: 'string', format: 'date-time' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Não autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/auth/verify-token': {
      post: {
        summary: 'Verifica validade do token JWT',
        description: 'Verifica se um token JWT é válido e retorna informações sobre ele',
        tags: ['Autenticação'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Token verificado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Token válido' },
                    data: {
                      type: 'object',
                      properties: {
                        valid: { type: 'boolean', example: true },
                        expiresAt: { type: 'string', format: 'date-time' },
                        user: {
                          type: 'object',
                          properties: {
                            userId: { type: 'string', example: '64f8a1b2c3d4e5f6a7b8c9d0' },
                            email: { type: 'string', example: 'usuario@exemplo.com' },
                            role: { type: 'string', example: 'user' }
                          }
                        },
                        expiringSoon: { type: 'boolean', example: false }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Token inválido ou expirado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/abandoned-carts/{id}': {
      get: {
        summary: 'Obtém detalhes de um carrinho abandonado',
        description: 'Retorna os detalhes completos de um carrinho abandonado específico',
        tags: ['API - Carrinhos Abandonados'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID do carrinho abandonado'
          }
        ],
        responses: {
          200: {
            description: 'Detalhes do carrinho abandonado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Carrinho abandonado encontrado' },
                    data: { $ref: '#/components/schemas/AbandonedCart' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Carrinho não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          401: {
            description: 'Não autenticado'
          }
        }
      }
    },
    '/api/abandoned-carts/stats/daily': {
      get: {
        summary: 'Estatísticas diárias dos carrinhos abandonados',
        description: 'Retorna estatísticas diárias dos carrinhos abandonados dos últimos dias',
        tags: ['API - Estatísticas'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'days',
            schema: { type: 'integer', minimum: 1, maximum: 90, default: 30 },
            description: 'Número de dias para analisar'
          }
        ],
        responses: {
          200: {
            description: 'Estatísticas diárias obtidas com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Estatísticas diárias obtidas com sucesso' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date: { type: 'string', format: 'date', example: '2025-01-19' },
                          count: { type: 'integer', example: 15 },
                          totalValue: { type: 'number', example: 1500.00 },
                          averageValue: { type: 'number', example: 100.00 }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Não autenticado'
          }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check geral',
        description: 'Verifica se a API está funcionando',
        tags: ['Sistema'],
        responses: {
          200: {
            description: 'API funcionando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', example: '2025-01-19T19:09:10.312Z' },
                    service: { type: 'string', example: 'greenncovery-api' },
                    version: { type: 'string', example: '1.0.0' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Webhook GreennCovery',
      description: 'Endpoints específicos para webhooks do GreennCovery'
    },
    {
      name: 'Webhook',
      description: 'Endpoints genéricos para webhooks'
    },
    {
      name: 'API - Carrinhos Abandonados',
      description: 'APIs para gerenciar carrinhos abandonados'
    },
    {
      name: 'API - Estatísticas',
      description: 'APIs para estatísticas e relatórios'
    },
    {
      name: 'Autenticação',
      description: 'Endpoints de autenticação e autorização'
    },
    {
      name: 'Sistema',
      description: 'Endpoints de sistema e monitoramento'
    }
  ]
};
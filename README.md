# Nathan Webhook API

Backend em Node.js com TypeScript para receber webhooks de carrinho abandonado e gerenciar dados de clientes, vendas e produtos.

## 🚀 Funcionalidades

- **Webhook de Carrinho Abandonado**: Recebe e processa notificações de carrinhos abandonados
- **Armazenamento no MongoDB Atlas**: Salva todos os dados de forma estruturada
- **API REST**: Endpoints para consultar e analisar os dados
- **Documentação Swagger**: API documentada automaticamente
- **Validação de Dados**: Validação robusta com Joi
- **Logging**: Sistema de logs com Winston
- **Estatísticas**: Relatórios e análises dos carrinhos abandonados

## 📋 Pré-requisitos

- Node.js 18+ 
- MongoDB Atlas (conta gratuita)
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd nathan
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nathan-db?retryWrites=true&w=majority

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key

# Logging
LOG_LEVEL=info
```

4. **Configure o MongoDB Atlas**
   - Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Crie um cluster gratuito
   - Obtenha a string de conexão
   - Substitua no arquivo `.env`

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

## 🔌 Endpoints

### Webhook
- `POST /webhook/abandoned-cart` - Recebe webhook de carrinho abandonado
- `GET /webhook/health` - Verifica saúde do webhook

### API
- `GET /api/abandoned-carts` - Lista carrinhos abandonados (com paginação e filtros)
- `GET /api/abandoned-carts/:id` - Busca carrinho por ID
- `GET /api/abandoned-carts/stats/overview` - Estatísticas gerais

### Sistema
- `GET /health` - Health check geral

## 📊 Estrutura do Webhook

O webhook recebe dados no seguinte formato:

```json
{
  "type": "checkout",
  "event": "checkoutAbandoned",
  "oldStatus": "abandoned",
  "currentStatus": "abandoned",
  "contract": {
    "id": 760,
    "start_date": "2025-07-19",
    "created_at": "2025-07-19T19:09:10.312603Z",
    "updated_at": "2025-07-19T19:09:10.312606Z",
    "status": "paid",
    "current_period_end": "2025-07-19T19:09:10.312609Z"
  },
  "sale": {
    "id": 526,
    "type": "SUBSCRIPTION",
    "status": "abandoned",
    "created_at": "2025-07-19T19:09:10.312614Z",
    "update_at": "2025-07-19T19:09:10.312617Z",
    "seller_id": 426,
    "installments": 12,
    "method": "CREDIT_CARD",
    "client_id": 100,
    "amount": 10,
    "proposal_id": null,
    "total": 10
  },
  "client": {
    "id": 100,
    "name": "Leila O'Connell",
    "email": "adrian.barton@greenholt.net",
    "cellphone": "+16098846219",
    "document": "917.527.272-59",
    "cpf_cnpj": "917.527.272-59",
    "zipcode": "14229",
    "street": "Kyle Flat",
    "number": "35774",
    "complement": "",
    "neighborhood": "",
    "city": "New Arno",
    "uf": "WI",
    "created_at": "2025-07-19T19:09:10.312581Z",
    "updated_at": "2025-07-19T19:09:10.312588Z"
  },
  "product": {
    "id": 96502,
    "name": "Dragão assinatura",
    "description": "Minha assinatura 10reais",
    "category_id": 2,
    "stock": null,
    "type": "SUBSCRIPTION",
    "amount": 10,
    "period": 30,
    "thank_you_page": null,
    "created_at": "2025-01-14T19:40:32.000000Z",
    "updated_at": "2025-01-14T19:40:32.000000Z",
    "seller_id": 408443,
    "slug": "dragao-assinatura",
    "method": "CREDIT_CARD,BOLETO,PIX",
    "product_type_id": 5,
    "status_changed_at": "2025-01-14 19:40:31",
    "product_id": 96502,
    "hash": "QPzYRe"
  },
  "oferta": "Dragão assinatura",
  "offer": {
    "hash": "QPzYRe",
    "amount": 10,
    "method": "CREDIT_CARD,BOLETO,PIX",
    "name": "Dragão assinatura",
    "created_at": "2025-01-14T19:40:32.000000Z"
  },
  "seller": {
    "id": 426,
    "name": "Ezekiel Hagenes I",
    "email": "larry.batz@hotmail.com",
    "cellphone": "+13803331961"
  },
  "affiliate": null,
  "productMetas": [],
  "proposalMetas": []
}
```

## 🔍 Exemplos de Uso

### Enviar Webhook
```bash
curl -X POST http://localhost:3000/webhook/abandoned-cart \
  -H "Content-Type: application/json" \
  -d @webhook-example.json
```

### Consultar Carrinhos Abandonados
```bash
# Listar todos
curl http://localhost:3000/api/abandoned-carts

# Com filtros
curl "http://localhost:3000/api/abandoned-carts?email=test@example.com&page=1&limit=10"

# Por ID
curl http://localhost:3000/api/abandoned-carts/64f8a1b2c3d4e5f6a7b8c9d0
```

### Ver Estatísticas
```bash
curl http://localhost:3000/api/abandoned-carts/stats/overview
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/
│   ├── database.ts      # Configuração do MongoDB
│   └── logger.ts        # Configuração do Winston
├── controllers/
│   ├── webhook.controller.ts      # Controller do webhook
│   └── abandonedCart.controller.ts # Controller da API
├── models/
│   └── abandonedCart.model.ts     # Modelo do MongoDB
├── routes/
│   ├── webhook.routes.ts          # Rotas do webhook
│   └── api.routes.ts              # Rotas da API
├── types/
│   └── webhook.types.ts           # Interfaces TypeScript
└── index.ts                       # Arquivo principal
```

## 🧪 Testes

```bash
npm test
```

## 📝 Logs

Os logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

## 🔧 Configuração de Produção

1. Configure as variáveis de ambiente para produção
2. Use um processo manager como PM2
3. Configure um proxy reverso (nginx)
4. Configure SSL/TLS
5. Configure monitoramento e alertas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para support@nathan.com ou abra uma issue no repositório. 
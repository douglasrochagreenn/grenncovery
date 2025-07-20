# Guia de Deploy - Nathan Webhook API

Este documento contém instruções detalhadas para fazer o deploy da API em diferentes ambientes.

## 🚀 Deploy Local

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Passos
1. **Clone e instale**
```bash
git clone <repository-url>
cd nathan
npm install
```

2. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Execute em desenvolvimento**
```bash
npm run dev
```

## 🐳 Deploy com Docker

### Usando Docker Compose (Recomendado para desenvolvimento)

1. **Clone o repositório**
```bash
git clone <repository-url>
cd nathan
```

2. **Execute com Docker Compose**
```bash
docker-compose up -d
```

3. **Acesse os serviços**
- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- MongoDB Express: http://localhost:8081 (admin/admin123)

### Usando Docker apenas para a API

1. **Build da imagem**
```bash
npm run docker:build
```

2. **Execute o container**
```bash
npm run docker:run
```

## ☁️ Deploy em Produção

### Opção 1: PM2 (Recomendado)

1. **Instale o PM2 globalmente**
```bash
npm install -g pm2
```

2. **Build da aplicação**
```bash
npm run build
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Configure MONGODB_URI e outras variáveis para produção
```

4. **Inicie com PM2**
```bash
npm run pm2:start
```

5. **Comandos úteis do PM2**
```bash
npm run pm2:stop      # Para a aplicação
npm run pm2:restart   # Reinicia a aplicação
npm run pm2:logs      # Visualiza logs
pm2 monit            # Monitoramento em tempo real
pm2 startup          # Configura para iniciar com o sistema
```

### Opção 2: Docker em Produção

1. **Build da imagem de produção**
```bash
docker build -t nathan-webhook-api:latest .
```

2. **Execute com variáveis de ambiente**
```bash
docker run -d \
  --name nathan-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-atlas-uri \
  -e JWT_SECRET=your-secret \
  nathan-webhook-api:latest
```

### Opção 3: Kubernetes

1. **Crie um namespace**
```bash
kubectl create namespace nathan
```

2. **Aplique os manifests**
```bash
kubectl apply -f k8s/
```

3. **Verifique o deploy**
```bash
kubectl get pods -n nathan
kubectl get services -n nathan
```

## 🔧 Configuração do MongoDB Atlas

### 1. Criar Cluster
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster (M0 - Free tier)

### 2. Configurar Network Access
1. Vá em "Network Access"
2. Adicione seu IP ou `0.0.0.0/0` para acesso global

### 3. Criar Database User
1. Vá em "Database Access"
2. Crie um novo usuário com permissões de leitura/escrita

### 4. Obter Connection String
1. Vá em "Clusters" > "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela senha do usuário criado

### 5. Configurar no .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nathan-db?retryWrites=true&w=majority
```

## 🔒 Configurações de Segurança

### Variáveis de Ambiente Obrigatórias
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-super-secret-jwt-key
```

### Recomendações de Segurança
1. **Use HTTPS em produção**
2. **Configure CORS adequadamente**
3. **Use variáveis de ambiente seguras**
4. **Configure rate limiting**
5. **Monitore logs e métricas**
6. **Faça backup regular do MongoDB**

## 📊 Monitoramento

### Logs
- **Desenvolvimento**: Console + arquivos em `logs/`
- **Produção**: Use PM2 logs ou Docker logs

### Métricas
- **Health Check**: `GET /health`
- **Webhook Health**: `GET /webhook/health`
- **Métricas da API**: `GET /api/abandoned-carts/stats/overview`

### Alertas
Configure alertas para:
- Status da aplicação
- Taxa de erro dos webhooks
- Performance do MongoDB
- Uso de recursos

## 🔄 CI/CD

### GitHub Actions (Exemplo)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to server
        run: |
          # Seus comandos de deploy
```

## 🆘 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MongoDB**
   - Verifique a string de conexão
   - Confirme se o IP está liberado no Atlas
   - Verifique as credenciais

2. **Erro de porta em uso**
   - Mude a porta no .env
   - Verifique se não há outro processo usando a porta

3. **Erro de permissão**
   - Verifique as permissões dos arquivos
   - Execute com usuário adequado

4. **Erro de memória**
   - Aumente a memória do container
   - Configure PM2 com limite de memória

### Logs Úteis
```bash
# PM2
pm2 logs nathan-webhook-api

# Docker
docker logs nathan-api

# Aplicação
tail -f logs/combined.log
tail -f logs/error.log
```

## 📞 Suporte

Para suporte técnico:
- Abra uma issue no repositório
- Envie email para support@nathan.com
- Consulte a documentação da API em `/api-docs` 
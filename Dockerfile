# Imagem base leve com Node.js 18
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Copia o restante da aplicação
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Healthcheck simples (ajuste se não usar healthcheck.js)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node healthcheck.js || exit 1

# Inicia a aplicação
CMD ["npm", "start"]

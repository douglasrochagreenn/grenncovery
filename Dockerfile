# Use imagem leve com Node.js 18
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Copia somente o código já compilado
COPY dist ./dist
COPY healthcheck.js ./

# Expõe a porta
EXPOSE 3000

# Healthcheck opcional
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node healthcheck.js || exit 1

# Inicia app
CMD ["npm", "start"]

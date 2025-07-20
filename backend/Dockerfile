# Etapa 1: build com dependências completas
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: apenas arquivos necessários para produção
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copia somente os arquivos compilados da etapa anterior
COPY --from=build /app/dist ./dist
COPY --from=build /app/healthcheck.js ./healthcheck.js
RUN mkdir -p logs

RUN addgroup -g 1001 -S nodejs
RUN adduser -S greenncovery -u 1001
RUN chown -R greenncovery:nodejs /app
USER greenncovery

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["npm", "start"]

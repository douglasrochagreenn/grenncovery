#!/bin/bash

# Script para testar o webhook específico do GreennCovery

echo "🧪 Testando webhook específico do GreennCovery..."
echo ""

# URL do webhook (porta 3000)
WEBHOOK_URL="http://localhost:3000/webhook/greenncovery"

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if curl -s "$WEBHOOK_URL" > /dev/null 2>&1; then
    echo "✅ Servidor está rodando!"
else
    echo "❌ Servidor não está rodando. Inicie com: npm run dev"
    exit 1
fi

echo ""
echo "📤 Enviando webhook do GreennCovery..."

# Enviar webhook
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @greenncovery-webhook-example.json)

echo "📥 Resposta do servidor:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "🔍 Testando health check..."
HEALTH_RESPONSE=$(curl -s "http://localhost:3000/webhook/health")
echo "Health check: $HEALTH_RESPONSE"

echo ""
echo "📊 Testando API de estatísticas..."
STATS_RESPONSE=$(curl -s "http://localhost:3000/api/abandoned-carts/stats/overview")
echo "Estatísticas: $STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"

echo ""
echo "📋 Testando listagem de carrinhos abandonados..."
CARTS_RESPONSE=$(curl -s "http://localhost:3000/api/abandoned-carts?limit=5")
echo "Carrinhos abandonados: $CARTS_RESPONSE" | jq '.' 2>/dev/null || echo "$CARTS_RESPONSE"

echo ""
echo "🌐 Acesse a documentação Swagger em: http://localhost:3000/api-docs"
echo ""
echo "✅ Teste concluído!"
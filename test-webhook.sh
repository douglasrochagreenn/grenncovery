#!/bin/bash

# Script para testar o webhook de carrinho abandonado

echo "🧪 Testando webhook de carrinho abandonado..."
echo ""

# URL do webhook
WEBHOOK_URL="http://localhost:3000/webhook/abandoned-cart"

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if curl -s "$WEBHOOK_URL" > /dev/null 2>&1; then
    echo "✅ Servidor está rodando!"
else
    echo "❌ Servidor não está rodando. Inicie com: npm run dev"
    exit 1
fi

echo ""
echo "📤 Enviando webhook de teste..."

# Enviar webhook
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @webhook-example.json)

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
echo "✅ Teste concluído!" 
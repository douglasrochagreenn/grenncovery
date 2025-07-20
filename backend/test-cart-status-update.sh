#!/bin/bash

# Script para testar a atualização de status do carrinho abandonado

echo "🧪 Testando atualização de status do carrinho abandonado..."
echo ""

# URL base
BASE_URL="http://localhost:3000"

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo "✅ Servidor está rodando!"
else
    echo "❌ Servidor não está rodando. Inicie com: npm run dev"
    exit 1
fi

echo ""
echo "🔐 Fazendo login para obter token..."

# Dados para login
LOGIN_DATA='{
  "email": "joao@greenncovery.com",
  "password": "123456"
}'

# Fazer login
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

echo "📤 Resposta do login:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extrair token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null)

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo ""
    echo "❌ Não foi possível obter token. Registrando usuário..."
    
    # Dados para registro
    REGISTER_DATA='{
      "name": "João GreennCovery",
      "email": "joao@greenncovery.com",
      "password": "123456",
      "confirmPassword": "123456"
    }'
    
    # Registrar usuário
    REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d "$REGISTER_DATA")
    
    echo "📤 Resposta do registro:"
    echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
    
    # Extrair token do registro
    TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token' 2>/dev/null)
fi

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Não foi possível obter token de autenticação"
    exit 1
fi

echo ""
echo "🔑 Token obtido com sucesso!"
echo ""

# Headers com autenticação
AUTH_HEADER="Authorization: Bearer $TOKEN"

echo "📋 1. Listando carrinhos abandonados para obter um ID..."
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts?limit=1" \
  -H "$AUTH_HEADER")

echo "📤 Resposta da listagem:"
echo "$LIST_RESPONSE" | jq '.' 2>/dev/null || echo "$LIST_RESPONSE"

# Extrair ID do primeiro carrinho
CART_ID=$(echo "$LIST_RESPONSE" | jq -r '.data.carts[0]._id' 2>/dev/null)

if [ "$CART_ID" = "null" ] || [ -z "$CART_ID" ]; then
    echo ""
    echo "⚠️ Nenhum carrinho abandonado encontrado. Criando um via webhook..."
    
    # Enviar webhook para criar um carrinho
    WEBHOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/webhook/abandoned-cart" \
      -H "Content-Type: application/json" \
      -d @webhook-example.json)
    
    echo "📤 Resposta do webhook:"
    echo "$WEBHOOK_RESPONSE" | jq '.' 2>/dev/null || echo "$WEBHOOK_RESPONSE"
    
    # Extrair ID do carrinho criado
    CART_ID=$(echo "$WEBHOOK_RESPONSE" | jq -r '.data.id' 2>/dev/null)
fi

if [ "$CART_ID" = "null" ] || [ -z "$CART_ID" ]; then
    echo "❌ Não foi possível obter ID do carrinho abandonado"
    exit 1
fi

echo ""
echo "🛒 Carrinho encontrado: $CART_ID"
echo ""

echo "📝 2. Testando atualização para 'recovered' via API..."
UPDATE_DATA_RECOVERED='{
  "cart_status": "recovered",
  "status_updated_by": "test_user"
}'

UPDATE_RESPONSE_RECOVERED=$(curl -s -X PATCH "$BASE_URL/api/abandoned-carts/$CART_ID/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "$UPDATE_DATA_RECOVERED")

echo "📤 Resposta da atualização para 'recovered':"
echo "$UPDATE_RESPONSE_RECOVERED" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE_RECOVERED"

echo ""
echo "📝 3. Testando atualização para 'cancelled' via Webhook..."
UPDATE_DATA_CANCELLED='{
  "cart_status": "cancelled",
  "status_updated_by": "webhook_system"
}'

UPDATE_RESPONSE_CANCELLED=$(curl -s -X PATCH "$BASE_URL/webhook/abandoned-cart/$CART_ID/status" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA_CANCELLED")

echo "📤 Resposta da atualização para 'cancelled' via webhook:"
echo "$UPDATE_RESPONSE_CANCELLED" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE_CANCELLED"

echo ""
echo "📝 4. Testando atualização para 'abandoned' via API..."
UPDATE_DATA_ABANDONED='{
  "cart_status": "abandoned",
  "status_updated_by": "admin_reset"
}'

UPDATE_RESPONSE_ABANDONED=$(curl -s -X PATCH "$BASE_URL/api/abandoned-carts/$CART_ID/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "$UPDATE_DATA_ABANDONED")

echo "📤 Resposta da atualização para 'abandoned':"
echo "$UPDATE_RESPONSE_ABANDONED" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE_ABANDONED"

echo ""
echo "❌ 5. Testando status inválido..."
UPDATE_DATA_INVALID='{
  "cart_status": "invalid_status",
  "status_updated_by": "test_user"
}'

UPDATE_RESPONSE_INVALID=$(curl -s -X PATCH "$BASE_URL/api/abandoned-carts/$CART_ID/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "$UPDATE_DATA_INVALID")

echo "📤 Resposta com status inválido:"
echo "$UPDATE_RESPONSE_INVALID" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE_INVALID"

echo ""
echo "🔍 6. Verificando carrinho após atualizações..."
GET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts/$CART_ID" \
  -H "$AUTH_HEADER")

echo "📤 Estado final do carrinho:"
echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"

echo ""
echo "📊 7. Verificando estatísticas com filtro por status..."
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts?cart_status=abandoned&limit=3" \
  -H "$AUTH_HEADER")

echo "📤 Carrinhos com status 'abandoned':"
echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"

echo ""
echo "📋 RESUMO DOS ENDPOINTS TESTADOS:"
echo "✅ PATCH /api/abandoned-carts/:id/status        - Atualizar status via API (autenticado)"
echo "✅ PATCH /webhook/abandoned-cart/:id/status     - Atualizar status via Webhook"
echo "✅ GET   /api/abandoned-carts/:id               - Verificar carrinho atualizado"
echo "✅ GET   /api/abandoned-carts?cart_status=...   - Filtrar por status"
echo ""
echo "🌐 Acesse a documentação Swagger em: $BASE_URL/api-docs"
echo "📖 Procure pelas seções:"
echo "   - 'API - Carrinhos Abandonados' para a API autenticada"
echo "   - 'Webhook' para o endpoint de webhook"
echo ""
echo "✅ Teste de atualização de status concluído!"
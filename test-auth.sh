#!/bin/bash

# Script para testar o sistema de autenticação

echo "🔐 Testando sistema de autenticação - GreennCovery..."
echo ""

# URL base
BASE_URL="http://localhost:3001"

# Verificar se o servidor está rodando
echo "🔍 Verificando se o servidor está rodando..."
if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo "✅ Servidor está rodando!"
else
    echo "❌ Servidor não está rodando. Inicie com: npm run dev"
    exit 1
fi

echo ""
echo "📝 Testando registro de usuário..."

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

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo ""
    echo "⚠️  Não foi possível obter token do registro. Tentando login..."
    
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
    
    # Extrair token do login
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null)
fi

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo ""
    echo "🔑 Token JWT obtido (válido por 30 dias)"
    echo "Token: ${TOKEN:0:50}..."
    echo ""
    
    echo "🔍 Verificando validade do token..."
    TOKEN_VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/verify-token" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📤 Resposta da verificação:"
    echo "$TOKEN_VERIFY_RESPONSE" | jq '.' 2>/dev/null || echo "$TOKEN_VERIFY_RESPONSE"
    echo ""
    
    echo "👤 Testando obtenção do perfil..."
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📤 Resposta do perfil:"
    echo "$PROFILE_RESPONSE" | jq '.' 2>/dev/null || echo "$PROFILE_RESPONSE"
    
    echo ""
    echo "📊 Testando API protegida (estatísticas)..."
    STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts/stats/overview" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📤 Resposta das estatísticas:"
    echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"
    
    echo ""
    echo "📋 Testando API protegida (carrinhos abandonados)..."
    CARTS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts?limit=5" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "📤 Resposta dos carrinhos:"
    echo "$CARTS_RESPONSE" | jq '.' 2>/dev/null || echo "$CARTS_RESPONSE"
    
    echo ""
    echo "🚫 Testando acesso sem token..."
    NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/abandoned-carts")
    
    echo "📤 Resposta sem token:"
    echo "$NO_TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$NO_TOKEN_RESPONSE"
    
    echo ""
    echo "📋 INSTRUÇÕES PARA USO NO SWAGGER:"
    echo "1. Acesse: $BASE_URL/api-docs"
    echo "2. Clique no botão 'Authorize' (cadeado)"
    echo "3. Digite: Bearer $TOKEN"
    echo "4. Clique em 'Authorize' e depois 'Close'"
    echo "5. Agora você pode testar todas as APIs protegidas!"
    
else
    echo ""
    echo "❌ Não foi possível obter token de autenticação"
fi

echo ""
echo "🌐 Acesse a documentação Swagger em: $BASE_URL/api-docs"
echo ""
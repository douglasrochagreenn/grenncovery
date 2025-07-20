#!/bin/bash

# Script para testar o sistema de autenticação

echo "🔐 Testando sistema de autenticação..."
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
  "name": "João Silva",
  "email": "joao.silva@exemplo.com",
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
      "email": "joao.silva@exemplo.com",
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
    echo "🔑 Token obtido: $TOKEN"
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
    
else
    echo ""
    echo "❌ Não foi possível obter token de autenticação"
fi

echo ""
echo "🌐 Acesse a documentação Swagger em: $BASE_URL/api-docs"
echo ""
echo "✅ Teste de autenticação concluído!" 
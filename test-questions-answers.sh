#!/bin/bash

# Script para testar o CRUD de Questions & Answers

echo "🧪 Testando CRUD de Questions & Answers..."
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

echo "📝 1. Criando nova pergunta..."
CREATE_DATA='{
  "question": "Como posso cancelar minha assinatura do produto?",
  "clientName": "João Silva",
  "clientEmail": "joao.silva@exemplo.com",
  "productName": "Curso de JavaScript Avançado",
  "priority": "high",
  "category": "Cancelamento",
  "tags": ["cancelamento", "assinatura", "suporte"],
  "isPublic": false
}'

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/questions-answers" \
  -H "Content-Type: application/json" \
  -H "$AUTH_HEADER" \
  -d "$CREATE_DATA")

echo "📤 Resposta da criação:"
echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"

# Extrair ID da pergunta criada
QUESTION_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data._id' 2>/dev/null)

echo ""
echo "📋 2. Listando perguntas..."
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/api/questions-answers?limit=5" \
  -H "$AUTH_HEADER")

echo "📤 Resposta da listagem:"
echo "$LIST_RESPONSE" | jq '.' 2>/dev/null || echo "$LIST_RESPONSE"

if [ "$QUESTION_ID" != "null" ] && [ -n "$QUESTION_ID" ]; then
    echo ""
    echo "🔍 3. Buscando pergunta por ID: $QUESTION_ID"
    GET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/questions-answers/$QUESTION_ID" \
      -H "$AUTH_HEADER")
    
    echo "📤 Resposta da busca:"
    echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"
    
    echo ""
    echo "✏️ 4. Respondendo pergunta..."
    ANSWER_DATA='{
      "answer": "Para cancelar sua assinatura, acesse sua conta no painel do usuário, vá em \"Minhas Assinaturas\" e clique em \"Cancelar\". O cancelamento será efetivado no final do período atual."
    }'
    
    ANSWER_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/questions-answers/$QUESTION_ID/answer" \
      -H "Content-Type: application/json" \
      -H "$AUTH_HEADER" \
      -d "$ANSWER_DATA")
    
    echo "📤 Resposta da pergunta respondida:"
    echo "$ANSWER_RESPONSE" | jq '.' 2>/dev/null || echo "$ANSWER_RESPONSE"
    
    echo ""
    echo "📝 5. Atualizando pergunta..."
    UPDATE_DATA='{
      "priority": "medium",
      "status": "answered",
      "isPublic": true,
      "tags": ["cancelamento", "assinatura", "suporte", "resolvido"]
    }'
    
    UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/questions-answers/$QUESTION_ID" \
      -H "Content-Type: application/json" \
      -H "$AUTH_HEADER" \
      -d "$UPDATE_DATA")
    
    echo "📤 Resposta da atualização:"
    echo "$UPDATE_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE"
fi

echo ""
echo "📊 6. Obtendo estatísticas..."
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/questions-answers/stats" \
  -H "$AUTH_HEADER")

echo "📤 Resposta das estatísticas:"
echo "$STATS_RESPONSE" | jq '.' 2>/dev/null || echo "$STATS_RESPONSE"

echo ""
echo "🔍 7. Testando filtros..."
FILTER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/questions-answers?status=answered&priority=medium&limit=3" \
  -H "$AUTH_HEADER")

echo "📤 Resposta com filtros:"
echo "$FILTER_RESPONSE" | jq '.' 2>/dev/null || echo "$FILTER_RESPONSE"

echo ""
echo "🔍 8. Testando busca..."
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/api/questions-answers?search=cancelar&limit=3" \
  -H "$AUTH_HEADER")

echo "📤 Resposta da busca:"
echo "$SEARCH_RESPONSE" | jq '.' 2>/dev/null || echo "$SEARCH_RESPONSE"

if [ "$QUESTION_ID" != "null" ] && [ -n "$QUESTION_ID" ]; then
    echo ""
    echo "🗑️ 9. Deletando pergunta..."
    DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/questions-answers/$QUESTION_ID" \
      -H "$AUTH_HEADER")
    
    echo "📤 Resposta da deleção:"
    echo "$DELETE_RESPONSE" | jq '.' 2>/dev/null || echo "$DELETE_RESPONSE"
fi

echo ""
echo "📋 RESUMO DOS ENDPOINTS TESTADOS:"
echo "✅ POST   /api/questions-answers           - Criar pergunta"
echo "✅ GET    /api/questions-answers           - Listar perguntas"
echo "✅ GET    /api/questions-answers/:id       - Buscar por ID"
echo "✅ PUT    /api/questions-answers/:id       - Atualizar pergunta"
echo "✅ PATCH  /api/questions-answers/:id/answer - Responder pergunta"
echo "✅ DELETE /api/questions-answers/:id       - Deletar pergunta"
echo "✅ GET    /api/questions-answers/stats     - Estatísticas"
echo ""
echo "🌐 Acesse a documentação Swagger em: $BASE_URL/api-docs"
echo "📖 Procure pela seção 'API - Perguntas e Respostas'"
echo ""
echo "✅ Teste do CRUD concluído!"
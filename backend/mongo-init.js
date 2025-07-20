// Script de inicialização do MongoDB
// Cria a database e configurações iniciais

db = db.getSiblingDB('nathan-db');

// Criar coleção de carrinhos abandonados
db.createCollection('abandoned_carts');

// Criar índices para melhor performance
db.abandoned_carts.createIndex({ "sale.id": 1 });
db.abandoned_carts.createIndex({ "client.id": 1 });
db.abandoned_carts.createIndex({ "product.id": 1 });
db.abandoned_carts.createIndex({ "client.email": 1 });
db.abandoned_carts.createIndex({ "createdAt": -1 });
db.abandoned_carts.createIndex({ "sale.status": 1 });

// Criar usuário admin (opcional)
db.createUser({
  user: "nathan_admin",
  pwd: "nathan_password_123",
  roles: [
    { role: "readWrite", db: "nathan-db" },
    { role: "dbAdmin", db: "nathan-db" }
  ]
});

print("✅ Database 'nathan-db' inicializada com sucesso!");
print("📊 Coleção 'abandoned_carts' criada");
print("🔍 Índices criados para otimização");
print("👤 Usuário admin criado: nathan_admin"); 
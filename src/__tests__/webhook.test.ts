import request from 'supertest';
import app from '../index';
import { AbandonedCart } from '../models/abandonedCart.model';

describe('Webhook API', () => {
  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await AbandonedCart.deleteMany({});
  });

  afterAll(async () => {
    // Limpa o banco de dados após todos os testes
    await AbandonedCart.deleteMany({});
  });

  describe('POST /webhook/abandoned-cart', () => {
    it('should process valid abandoned cart webhook', async () => {
      const webhookData = {
        type: 'checkout',
        event: 'checkoutAbandoned',
        oldStatus: 'abandoned',
        currentStatus: 'abandoned',
        contract: {
          id: 760,
          start_date: '2025-07-19',
          created_at: '2025-07-19T19:09:10.312603Z',
          updated_at: '2025-07-19T19:09:10.312606Z',
          status: 'paid',
          current_period_end: '2025-07-19T19:09:10.312609Z'
        },
        sale: {
          id: 526,
          type: 'SUBSCRIPTION',
          status: 'abandoned',
          created_at: '2025-07-19T19:09:10.312614Z',
          update_at: '2025-07-19T19:09:10.312617Z',
          seller_id: 426,
          installments: 12,
          method: 'CREDIT_CARD',
          client_id: 100,
          amount: 10,
          proposal_id: null,
          total: 10
        },
        client: {
          id: 100,
          name: 'Test User',
          email: 'test@example.com',
          cellphone: '+1234567890',
          document: '123.456.789-00',
          cpf_cnpj: '123.456.789-00',
          zipcode: '12345',
          street: 'Test Street',
          number: '123',
          complement: '',
          neighborhood: '',
          city: 'Test City',
          uf: 'TS',
          created_at: '2025-07-19T19:09:10.312581Z',
          updated_at: '2025-07-19T19:09:10.312588Z'
        },
        product: {
          id: 96502,
          name: 'Test Product',
          description: 'Test Description',
          category_id: 2,
          stock: null,
          type: 'SUBSCRIPTION',
          amount: 10,
          period: 30,
          thank_you_page: null,
          created_at: '2025-01-14T19:40:32.000000Z',
          updated_at: '2025-01-14T19:40:32.000000Z',
          seller_id: 408443,
          slug: 'test-product',
          method: 'CREDIT_CARD,BOLETO,PIX',
          product_type_id: 5,
          status_changed_at: '2025-01-14 19:40:31',
          product_id: 96502,
          hash: 'TEST123'
        },
        oferta: 'Test Product',
        offer: {
          hash: 'TEST123',
          amount: 10,
          method: 'CREDIT_CARD,BOLETO,PIX',
          name: 'Test Product',
          created_at: '2025-01-14T19:40:32.000000Z'
        },
        seller: {
          id: 426,
          name: 'Test Seller',
          email: 'seller@example.com',
          cellphone: '+1234567890'
        },
        affiliate: null,
        productMetas: [],
        proposalMetas: []
      };

      const response = await request(app)
        .post('/webhook/abandoned-cart')
        .send(webhookData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Webhook processado com sucesso');
      expect(response.body.data).toHaveProperty('saleId', 526);
      expect(response.body.data).toHaveProperty('clientEmail', 'test@example.com');

      // Verifica se foi salvo no banco
      const savedRecord = await AbandonedCart.findOne({ 'sale.id': 526 });
      expect(savedRecord).toBeTruthy();
      expect(savedRecord?.client.email).toBe('test@example.com');
    });

    it('should reject invalid webhook data', async () => {
      const invalidData = {
        type: 'checkout',
        event: 'checkoutAbandoned'
        // Dados incompletos
      };

      const response = await request(app)
        .post('/webhook/abandoned-cart')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Dados inválidos');
    });

    it('should ignore non-abandoned cart events', async () => {
      const webhookData = {
        type: 'checkout',
        event: 'checkoutCompleted', // Evento diferente
        oldStatus: 'pending',
        currentStatus: 'completed',
        // ... outros dados necessários
      };

      const response = await request(app)
        .post('/webhook/abandoned-cart')
        .send(webhookData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Evento ignorado - não é carrinho abandonado');
    });

    it('should not duplicate existing sales', async () => {
      const webhookData = {
        type: 'checkout',
        event: 'checkoutAbandoned',
        oldStatus: 'abandoned',
        currentStatus: 'abandoned',
        contract: {
          id: 760,
          start_date: '2025-07-19',
          created_at: '2025-07-19T19:09:10.312603Z',
          updated_at: '2025-07-19T19:09:10.312606Z',
          status: 'paid',
          current_period_end: '2025-07-19T19:09:10.312609Z'
        },
        sale: {
          id: 999, // ID único
          type: 'SUBSCRIPTION',
          status: 'abandoned',
          created_at: '2025-07-19T19:09:10.312614Z',
          update_at: '2025-07-19T19:09:10.312617Z',
          seller_id: 426,
          installments: 12,
          method: 'CREDIT_CARD',
          client_id: 100,
          amount: 10,
          proposal_id: null,
          total: 10
        },
        client: {
          id: 100,
          name: 'Test User',
          email: 'test@example.com',
          cellphone: '+1234567890',
          document: '123.456.789-00',
          cpf_cnpj: '123.456.789-00',
          zipcode: '12345',
          street: 'Test Street',
          number: '123',
          complement: '',
          neighborhood: '',
          city: 'Test City',
          uf: 'TS',
          created_at: '2025-07-19T19:09:10.312581Z',
          updated_at: '2025-07-19T19:09:10.312588Z'
        },
        product: {
          id: 96502,
          name: 'Test Product',
          description: 'Test Description',
          category_id: 2,
          stock: null,
          type: 'SUBSCRIPTION',
          amount: 10,
          period: 30,
          thank_you_page: null,
          created_at: '2025-01-14T19:40:32.000000Z',
          updated_at: '2025-01-14T19:40:32.000000Z',
          seller_id: 408443,
          slug: 'test-product',
          method: 'CREDIT_CARD,BOLETO,PIX',
          product_type_id: 5,
          status_changed_at: '2025-01-14 19:40:31',
          product_id: 96502,
          hash: 'TEST123'
        },
        oferta: 'Test Product',
        offer: {
          hash: 'TEST123',
          amount: 10,
          method: 'CREDIT_CARD,BOLETO,PIX',
          name: 'Test Product',
          created_at: '2025-01-14T19:40:32.000000Z'
        },
        seller: {
          id: 426,
          name: 'Test Seller',
          email: 'seller@example.com',
          cellphone: '+1234567890'
        },
        affiliate: null,
        productMetas: [],
        proposalMetas: []
      };

      // Primeira requisição
      await request(app)
        .post('/webhook/abandoned-cart')
        .send(webhookData)
        .expect(200);

      // Segunda requisição com os mesmos dados
      const response = await request(app)
        .post('/webhook/abandoned-cart')
        .send(webhookData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Venda já processada anteriormente');

      // Verifica se só existe um registro
      const records = await AbandonedCart.find({ 'sale.id': 999 });
      expect(records).toHaveLength(1);
    });
  });

  describe('GET /webhook/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/webhook/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.service).toBe('webhook-service');
    });
  });
}); 
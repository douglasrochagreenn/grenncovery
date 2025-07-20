import mongoose, { Document, Schema } from 'mongoose';
import { AbandonedCartWebhook } from '../types/webhook.types';

export interface AbandonedCartDocument extends Document, AbandonedCartWebhook {
  createdAt: Date;
  updatedAt: Date;
  cart_status?: string;
  status_updated_at?: Date;
  status_updated_by?: string;
}

const ContractSchema = new Schema({
  id: { type: Number, default: 0 },
  start_date: { type: String, default: '' },
  created_at: { type: String, default: () => new Date().toISOString() },
  updated_at: { type: String, default: () => new Date().toISOString() },
  status: { type: String, default: 'unknown' },
  current_period_end: { type: String, default: () => new Date().toISOString() }
}, { _id: false });

const SaleSchema = new Schema({
  id: { type: Number, default: 0 },
  type: { type: String, default: 'PURCHASE' },
  status: { type: String, default: 'abandoned' },
  created_at: { type: String, default: () => new Date().toISOString() },
  update_at: { type: String, default: () => new Date().toISOString() },
  seller_id: { type: Number, default: 0 },
  installments: { type: Number, default: 1 },
  method: { type: String, default: 'UNKNOWN' },
  client_id: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  proposal_id: { type: Number, default: null },
  total: { type: Number, default: 0 }
}, { _id: false });

const ClientSchema = new Schema({
  id: { type: Number, default: 0 },
  name: { type: String, default: 'Cliente Desconhecido' },
  email: { type: String, default: 'cliente@exemplo.com' },
  cellphone: { type: String, default: '' },
  document: { type: String, default: '' },
  cpf_cnpj: { type: String, default: '' },
  zipcode: { type: String, default: '' },
  street: { type: String, default: '' },
  number: { type: String, default: '' },
  complement: { type: String, default: '' },
  neighborhood: { type: String, default: '' },
  city: { type: String, default: '' },
  uf: { type: String, default: '' },
  created_at: { type: String, default: () => new Date().toISOString() },
  updated_at: { type: String, default: () => new Date().toISOString() }
}, { _id: false });

const ProductSchema = new Schema({
  id: { type: Number, default: 0 },
  name: { type: String, default: 'Produto Desconhecido' },
  description: { type: String, default: '' },
  category_id: { type: Number, default: 0 },
  stock: { type: Number, default: null },
  type: { type: String, default: 'PRODUCT' },
  amount: { type: Number, default: 0 },
  period: { type: Number, default: 30 },
  thank_you_page: { type: String, default: null },
  created_at: { type: String, default: () => new Date().toISOString() },
  updated_at: { type: String, default: () => new Date().toISOString() },
  seller_id: { type: Number, default: 0 },
  slug: { type: String, default: '' },
  method: { type: String, default: 'UNKNOWN' },
  product_type_id: { type: Number, default: 0 },
  status_changed_at: { type: String, default: () => new Date().toISOString() },
  product_id: { type: Number, default: 0 },
  hash: { type: String, default: '' }
}, { _id: false });

const OfferSchema = new Schema({
  hash: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  method: { type: String, default: 'UNKNOWN' },
  name: { type: String, default: 'Oferta Desconhecida' },
  created_at: { type: String, default: () => new Date().toISOString() }
}, { _id: false });

const SellerSchema = new Schema({
  id: { type: Number, default: 0 },
  name: { type: String, default: 'Vendedor Desconhecido' },
  email: { type: String, default: 'vendedor@exemplo.com' },
  cellphone: { type: String, default: '' }
}, { _id: false });

const AbandonedCartSchema = new Schema({
  type: { type: String, default: 'checkout' },
  event: { type: String, default: 'checkoutAbandoned' },
  oldStatus: { type: String, default: 'abandoned' },
  currentStatus: { type: String, default: 'abandoned' },
  contract: { type: ContractSchema, default: () => ({}) },
  sale: { type: SaleSchema, default: () => ({}) },
  client: { type: ClientSchema, default: () => ({}) },
  product: { type: ProductSchema, default: () => ({}) },
  oferta: { type: String, default: 'Produto Desconhecido' },
  offer: { type: OfferSchema, default: () => ({}) },
  seller: { type: SellerSchema, default: () => ({}) },
  affiliate: { type: Schema.Types.Mixed, default: null },
  productMetas: { type: [Schema.Types.Mixed], default: [] },
  proposalMetas: { type: [Schema.Types.Mixed], default: [] },
  cart_status: { 
    type: String, 
    enum: ['abandoned', 'recovered', 'cancelled'], 
    default: 'abandoned',
    index: true
  },
  status_updated_at: { 
    type: Date, 
    default: Date.now 
  },
  status_updated_by: { 
    type: String, 
    default: 'system' 
  }
}, {
  timestamps: true,
  collection: 'abandoned_carts'
});

// Indexes for better query performance
AbandonedCartSchema.index({ 'sale.id': 1 });
AbandonedCartSchema.index({ 'client.id': 1 });
AbandonedCartSchema.index({ 'product.id': 1 });
AbandonedCartSchema.index({ 'client.email': 1 });
AbandonedCartSchema.index({ createdAt: -1 });
AbandonedCartSchema.index({ 'sale.status': 1 });
AbandonedCartSchema.index({ cart_status: 1 });
AbandonedCartSchema.index({ status_updated_at: -1 });

// Middleware para atualizar status_updated_at quando cart_status muda
AbandonedCartSchema.pre('save', function(next) {
  if (this.isModified('cart_status')) {
    this.status_updated_at = new Date();
  }
  next();
});

export const AbandonedCart = mongoose.model<AbandonedCartDocument>('AbandonedCart', AbandonedCartSchema); 
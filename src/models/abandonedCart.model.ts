import mongoose, { Document, Schema } from 'mongoose';
import { AbandonedCartWebhook } from '../types/webhook.types';

export interface AbandonedCartDocument extends Document, AbandonedCartWebhook {
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema({
  id: { type: Number, required: true },
  start_date: { type: String, required: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  status: { type: String, required: true },
  current_period_end: { type: String, required: true }
}, { _id: false });

const SaleSchema = new Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: String, required: true },
  update_at: { type: String, required: true },
  seller_id: { type: Number, required: true },
  installments: { type: Number, required: true },
  method: { type: String, required: true },
  client_id: { type: Number, required: true },
  amount: { type: Number, required: true },
  proposal_id: { type: Number, default: null },
  total: { type: Number, required: true }
}, { _id: false });

const ClientSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  cellphone: { type: String, required: true },
  document: { type: String, required: true },
  cpf_cnpj: { type: String, required: true },
  zipcode: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String, default: '' },
  neighborhood: { type: String, default: '' },
  city: { type: String, required: true },
  uf: { type: String, required: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true }
}, { _id: false });

const ProductSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category_id: { type: Number, required: true },
  stock: { type: Number, default: null },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: Number, required: true },
  thank_you_page: { type: String, default: null },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  seller_id: { type: Number, required: true },
  slug: { type: String, required: true },
  method: { type: String, required: true },
  product_type_id: { type: Number, required: true },
  status_changed_at: { type: String, required: true },
  product_id: { type: Number, required: true },
  hash: { type: String, required: true }
}, { _id: false });

const OfferSchema = new Schema({
  hash: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: String, required: true }
}, { _id: false });

const SellerSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  cellphone: { type: String, required: true }
}, { _id: false });

const AbandonedCartSchema = new Schema({
  type: { type: String, required: true },
  event: { type: String, required: true },
  oldStatus: { type: String, required: true },
  currentStatus: { type: String, required: true },
  contract: { type: ContractSchema, required: true },
  sale: { type: SaleSchema, required: true },
  client: { type: ClientSchema, required: true },
  product: { type: ProductSchema, required: true },
  oferta: { type: String, required: true },
  offer: { type: OfferSchema, required: true },
  seller: { type: SellerSchema, required: true },
  affiliate: { type: Schema.Types.Mixed, default: null },
  productMetas: { type: [Schema.Types.Mixed], default: [] },
  proposalMetas: { type: [Schema.Types.Mixed], default: [] }
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

export const AbandonedCart = mongoose.model<AbandonedCartDocument>('AbandonedCart', AbandonedCartSchema); 
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbandonedCart = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ContractSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    start_date: { type: String, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: true },
    status: { type: String, required: true },
    current_period_end: { type: String, required: true }
}, { _id: false });
const SaleSchema = new mongoose_1.Schema({
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
const ClientSchema = new mongoose_1.Schema({
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
const ProductSchema = new mongoose_1.Schema({
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
const OfferSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: String, required: true }
}, { _id: false });
const SellerSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    cellphone: { type: String, required: true }
}, { _id: false });
const AbandonedCartSchema = new mongoose_1.Schema({
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
    affiliate: { type: mongoose_1.Schema.Types.Mixed, default: null },
    productMetas: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    proposalMetas: { type: [mongoose_1.Schema.Types.Mixed], default: [] }
}, {
    timestamps: true,
    collection: 'abandoned_carts'
});
AbandonedCartSchema.index({ 'sale.id': 1 });
AbandonedCartSchema.index({ 'client.id': 1 });
AbandonedCartSchema.index({ 'product.id': 1 });
AbandonedCartSchema.index({ 'client.email': 1 });
AbandonedCartSchema.index({ createdAt: -1 });
AbandonedCartSchema.index({ 'sale.status': 1 });
exports.AbandonedCart = mongoose_1.default.model('AbandonedCart', AbandonedCartSchema);
//# sourceMappingURL=abandonedCart.model.js.map
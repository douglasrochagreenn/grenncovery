export interface Contract {
  id: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  status: string;
  current_period_end: string;
}

export interface Sale {
  id: number;
  type: string;
  status: string;
  created_at: string;
  update_at: string;
  seller_id: number;
  installments: number;
  method: string;
  client_id: number;
  amount: number;
  proposal_id: number | null;
  total: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  document: string;
  cpf_cnpj: string;
  zipcode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  stock: number | null;
  type: string;
  amount: number;
  period: number;
  thank_you_page: string | null;
  created_at: string;
  updated_at: string;
  seller_id: number;
  slug: string;
  method: string;
  product_type_id: number;
  status_changed_at: string;
  product_id: number;
  hash: string;
}

export interface Offer {
  hash: string;
  amount: number;
  method: string;
  name: string;
  created_at: string;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  cellphone: string;
}

export interface ProductMeta {
  // Define based on your needs
}

export interface ProposalMeta {
  // Define based on your needs
}

export interface AbandonedCartWebhook {
  type: string;
  event: string;
  oldStatus: string;
  currentStatus: string;
  contract: Contract;
  sale: Sale;
  client: Client;
  product: Product;
  oferta: string;
  offer: Offer;
  seller: Seller;
  affiliate: any | null;
  productMetas: ProductMeta[];
  proposalMetas: ProposalMeta[];
} 
import { defineStore } from "pinia";
import ApiService from "@/services/ApiService";
import { abandonedCart } from "@/services";

export interface IAbandonedCart {
  _id: string;
  type: string;
  event: string;
  sale: {
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
  };
  client: {
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
  };
  product: {
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
  };
  seller: {
    id: number;
    name: string;
    email: string;
    cellphone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IAbandonedCartResponse {
  success: boolean;
  message: string;
  carts: IAbandonedCart[];
  pagination: IPagination;
}

export interface IAbandonedCartFilters {
  page?: number;
  limit?: number;
  clientEmail?: string;
  productName?: string;
}

export const useAbandonedCartStore = defineStore("abandonedCart", {
  state: () => ({
    carts: [] as IAbandonedCart[],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    } as IPagination,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAbandonedCarts(filters: IAbandonedCartFilters = {}) {
      this.loading = true;
      this.error = null;

      try {
        const params = new URLSearchParams();

        // Adiciona parâmetros de paginação
        params.append(
          "page",
          (filters.page || this.pagination.page).toString()
        );
        params.append(
          "limit",
          (filters.limit || this.pagination.limit).toString()
        );

        // Adiciona filtros opcionais
        if (filters.clientEmail) {
          params.append("clientEmail", filters.clientEmail);
        }
        if (filters.productName) {
          params.append("productName", filters.productName);
        }

        const response = await ApiService?.get<IAbandonedCartResponse>(
          abandonedCart.routes.get(params.toString())
        );

        this.carts = response.data.carts;
        this.pagination = response.data.pagination;

        return response.data;
      } catch (error: any) {
        this.error = error.message || "Erro ao carregar carrinhos abandonados";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async nextPage() {
      if (this.pagination.hasNext) {
        await this.fetchAbandonedCarts({ page: this.pagination.page + 1 });
      }
    },

    async prevPage() {
      if (this.pagination.hasPrev) {
        await this.fetchAbandonedCarts({ page: this.pagination.page - 1 });
      }
    },

    async goToPage(page: number) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        await this.fetchAbandonedCarts({ page });
      }
    },

    async searchByEmail(email: string) {
      await this.fetchAbandonedCarts({
        page: 1,
        clientEmail: email,
      });
    },

    async searchByProductName(productName: string) {
      await this.fetchAbandonedCarts({
        page: 1,
        productName,
      });
    },

    clearFilters() {
      this.fetchAbandonedCarts({ page: 1 });
    },
  },

  getters: {
    hasCarts: (state) => state.carts.length > 0,
    totalCarts: (state) => state.pagination.total,
    currentPage: (state) => state.pagination.page,
    totalPages: (state) => state.pagination.totalPages,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  },
});

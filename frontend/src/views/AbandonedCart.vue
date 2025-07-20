<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/index";
import { useAbandonedCartStore } from "@/store";
import { PhMagnifyingGlass, PhX, PhChatCircle } from "@phosphor-icons/vue";

const router = useRouter();
const abandonedCartStore = useAbandonedCartStore();

// Filtros
const emailFilter = ref("");
const productNameFilter = ref("");

// Computed properties
const hasFilters = computed(() => emailFilter.value || productNameFilter.value);

// Funções
const handleSearch = async () => {
  try {
    if (emailFilter.value) {
      await abandonedCartStore.searchByEmail(emailFilter.value);
    } else if (productNameFilter.value) {
      await abandonedCartStore.searchByProductName(productNameFilter.value);
    } else {
      await abandonedCartStore.fetchAbandonedCarts();
    }
  } catch (error) {
    console.error("Erro na busca:", error);
  }
};

const clearFilters = async () => {
  emailFilter.value = "";
  productNameFilter.value = "";
  await abandonedCartStore.clearFilters();
};

const handlePageChange = async (page: number | string) => {
  try {
    if (typeof page === "number") {
      await abandonedCartStore.goToPage(page);
    }
  } catch (error) {
    console.error("Erro ao mudar página:", error);
  }
};

const navigateToMessageHistory = (cartId: string, clientCellphone: string) => {
  router.push({
    name: "MessageHistory",
    params: {
      id: cartId,
      client_cellphone: clientCellphone,
    },
  });
};

// Gerar array de páginas para exibição
const getPageNumbers = () => {
  const { currentPage, totalPages } = abandonedCartStore;
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return pages;
};

onMounted(async () => {
  try {
    await abandonedCartStore.fetchAbandonedCarts();
  } catch (error) {
    console.error("Erro ao carregar carrinhos abandonados:", error);
  }
});
</script>

<template>
  <div class="space-y-6 w-full">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Carrinho Abandonado</h1>
      <Badge variant="secondary" class="text-sm">
        {{ abandonedCartStore.totalCarts }} carrinhos abandonados
      </Badge>
    </div>

    <!-- Filtros -->
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent class="overflow-hidden">
        <div class="grid md:grid-cols-1 grid-cols-3 gap-4 w-full">
          <div class="space-y-2">
            <Label for="email-filter">Email do Cliente</Label>
            <div class="relative">
              <Input
                id="email-filter"
                v-model="emailFilter"
                placeholder="Digite o email do cliente"
                @keyup.enter="handleSearch"
              />
              <PhMagnifyingGlass
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                :size="16"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="product-filter">Nome do Produto</Label>
            <div class="relative">
              <Input
                id="product-filter"
                v-model="productNameFilter"
                placeholder="Digite o nome do produto"
                @keyup.enter="handleSearch"
              />
              <PhMagnifyingGlass
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                :size="16"
              />
            </div>
          </div>

          <div class="flex items-end space-x-2">
            <Button @click="handleSearch" class="flex-1"> Buscar </Button>
            <Button
              v-if="hasFilters"
              variant="outline"
              @click="clearFilters"
              class="px-3"
            >
              <PhX :size="16" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tabela -->
    <Card>
      <CardHeader>
        <CardTitle>Lista de Carrinhos Abandonados</CardTitle>
      </CardHeader>
      <CardContent class="overflow-hidden">
        <Table class="min-w-full">
          <TableCaption>Lista de carrinhos abandonados no sistema</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[12%]">Cliente</TableHead>
              <TableHead class="w-[18%]">Email</TableHead>
              <TableHead class="w-[25%]">Produto</TableHead>
              <TableHead class="w-[10%]">Valor</TableHead>
              <TableHead class="w-[12%]">Data do Abandono</TableHead>
              <TableHead class="w-[8%]">Status</TableHead>
              <TableHead class="w-[15%]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="abandonedCartStore.isLoading">
              <TableCell colspan="7" class="text-center py-8">
                <div class="flex items-center justify-center">
                  <div
                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"
                  ></div>
                  <span class="ml-2">Carregando...</span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow v-else-if="!abandonedCartStore.hasCarts">
              <TableCell colspan="7" class="text-center py-8 text-gray-500">
                Nenhum carrinho abandonado encontrado.
              </TableCell>
            </TableRow>

            <TableRow
              v-else
              v-for="cart in abandonedCartStore.carts"
              :key="cart._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <TableCell class="font-medium">{{ cart.client.name }}</TableCell>
              <TableCell>{{ cart.client.email }}</TableCell>
              <TableCell class="max-w-0 truncate" :title="cart.product.name">
                <div class="truncate">{{ cart.product.name }}</div>
              </TableCell>
              <TableCell class="font-semibold">
                R$ {{ cart.sale.total.toFixed(2) }}
              </TableCell>
              <TableCell>
                {{ new Date(cart.createdAt).toLocaleDateString("pt-BR") }}
              </TableCell>
              <TableCell>
                <Badge variant="destructive"> Abandonado </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  @click="
                    navigateToMessageHistory(cart._id, cart.client.cellphone)
                  "
                  class="flex items-center gap-2"
                >
                  <PhChatCircle :size="16" />
                  Histórico
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Paginação -->
        <div
          v-if="abandonedCartStore.totalPages > 1"
          class="mt-6 overflow-hidden"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  :class="{
                    'pointer-events-none opacity-50':
                      !abandonedCartStore.pagination.hasPrev,
                  }"
                  @click="abandonedCartStore.prevPage"
                />
              </PaginationItem>

              <template v-for="page in getPageNumbers()" :key="page">
                <PaginationItem v-if="page === 'ellipsis'">
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem v-else>
                  <PaginationLink
                    :is-active="page === abandonedCartStore.currentPage"
                    @click="handlePageChange(page)"
                  >
                    {{ page }}
                  </PaginationLink>
                </PaginationItem>
              </template>

              <PaginationItem>
                <PaginationNext
                  :class="{
                    'pointer-events-none opacity-50':
                      !abandonedCartStore.pagination.hasNext,
                  }"
                  @click="abandonedCartStore.nextPage"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>

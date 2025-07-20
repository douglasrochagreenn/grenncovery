<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import {
  PhHouse,
  PhShoppingCart,
  PhQuestion,
  PhWhatsappLogo,
  PhSignOut,
  PhMoon,
  PhSun,
} from "@phosphor-icons/vue";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navigationItems = [
  {
    name: "Home",
    route: "Home",
    icon: PhHouse,
  },
  {
    name: "Carrinho Abandonado",
    route: "AbandonedCart",
    icon: PhShoppingCart,
  },
  {
    name: "Perguntas e Respostas",
    route: "Q&A",
    icon: PhQuestion,
  },
  {
    name: "Configuração WhatsApp",
    route: "WhatsAppConfig",
    icon: PhWhatsappLogo,
  },
];

const isActiveRoute = (routeName: string) => {
  return route.name === routeName;
};

// Toggle de tema
const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};

// Inicializar tema no carregamento
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove("dark");
  }
});
</script>

<template>
  <div class="h-dvh flex">
    <!-- Sidebar -->
    <aside
      class="w-[280px] h-dvh bg-background shadow-lg border-r border-border flex flex-col"
    >
      <div class="p-6 flex-1 flex flex-col">
        <h1 class="text-2xl font-bold text-foreground">Grenncovery</h1>

        <nav class="space-y-2 mb-8 flex-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.route"
            :to="{ name: item.route }"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              isActiveRoute(item.route)
                ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            ]"
          >
            <component :is="item.icon" :size="20" />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Toggle de Tema -->
        <div
          class="flex items-center justify-between p-4 mb-4 border border-border rounded-lg bg-card"
        >
          <div class="flex items-center gap-3">
            <PhSun v-if="!isDarkMode" class="w-5 h-5 text-yellow-500" />
            <PhMoon v-else class="w-5 h-5 text-blue-500" />
            <Label class="text-sm font-medium">
              {{ isDarkMode ? "Modo Escuro" : "Modo Claro" }}
            </Label>
          </div>
          <Switch :checked="isDarkMode" @update:checked="toggleTheme" />
        </div>

        <!-- Logout Button -->
        <Button
          variant="outline"
          class="w-full justify-start gap-3 text-destructive border-destructive/20 hover:bg-destructive/10"
          @click="handleLogout"
        >
          <PhSignOut :size="20" />
          Sair
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-dvh overflow-y-auto bg-background">
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss"></style>

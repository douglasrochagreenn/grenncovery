<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store";

const authStore = useAuthStore();

const route = useRoute();

import { Toaster } from "vue-sonner";

watch(
  () => route.name,
  (_newPath, oldPath) => {
    if (typeof oldPath === "string") {
      authStore.setOldRoute(oldPath);
    }
  }
);

const defineLayout = computed<string>(() => {
  // VIEW HOME
  if (route.name === "Login") {
    return "layoutForm";
  }

  // Rotas autenticadas usam LayoutDashboard
  if (
    route.name === "Home" ||
    route.name === "AbandonedCart" ||
    route.name === "Q&A" ||
    route.name === "WhatsAppConfig" ||
    route.name === "MessageHistory"
  ) {
    return "layoutDashboard";
  }

  return "main";
});
</script>

<template>
  <Toaster
    position="top-right"
    theme="light"
    richColors
    :duration="3000"
    :expand="true"
  />
  <component :is="defineLayout">
    <router-view />
  </component>
</template>

<style lang="scss">
html {
  @apply scroll-smooth;
}

* {
  padding: 0px;
  margin: 0px;
  box-sizing: border-box;
  font-family: "Rubik", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--yellow);
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar {
  width: 1px;
  background: transparent;
}
::-webkit-scrollbar-track {
  background: transparent !important;
}

::selection {
  color: var(--black);
  background: var(--input);
}

[data-anima="top"] {
  animation: showTop 0.5s forwards;
}

@keyframes showTop {
  from {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

[data-sonner-toast][data-styled="true"] {
  padding: 16px;
}
[data-sonner-toast][data-mounted="true"][data-expanded="true"] {
  height: fit-content;
}
</style>

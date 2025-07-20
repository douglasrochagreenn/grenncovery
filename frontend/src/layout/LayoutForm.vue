<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";

const router = useRoute();

const dynamicRouterName = computed(() => {
  if (["SignupPF", "SignupPJ"].includes(String(router.name))) {
    return "AccountType";
  }
  return "Home";
});

onMounted(() => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
  }
});
</script>

<template>
  <!-- <NavBar class="hidden md:flex" /> -->
  <main
    data-anima="top"
    class="h-dvh grid grid-cols-[635px_1fr] md:grid-cols-[1fr] overflow-hidden lg:grid-cols-[282px_1fr] xl:grid-cols-[475px_1fr] md:overflow-scroll"
  >
    <div class="image relative md:hidden"/>
    <div class="container flex flex-col p-28 pb-0 gap-10 md:p-8">
      <!-- <router-link
        v-if="router.name !== 'RegistrationSuccessfully'"
        :to="{ name: dynamicRouterName }"
        class="return text-base text-foreground font-semibold flex gap-2 items-center cursor-pointer pr-3 pl-3"
      >
        <PhArrowLeft :size="18" color="#181818" weight="bold" />
        Voltar
      </router-link> -->
      <div>
        <slot />
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.image {
  background-image: url("../assets/img.login.svg");
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
.return {
  &:hover {
    svg {
      transition: all 0.3s;
      animation: effectArrow 1s infinite ease;
    }
  }

  @keyframes effectArrow {
    0% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(5px);
    }
    100% {
      transform: translateX(0px);
    }
  }
}
</style>

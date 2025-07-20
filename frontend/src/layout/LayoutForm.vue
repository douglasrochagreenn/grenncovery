<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
  }
});
</script>

<template>
  <main
    data-anima="top"
    class="h-dvh grid grid-cols-[635px_1fr] md:grid-cols-[1fr] overflow-hidden lg:grid-cols-[282px_1fr] xl:grid-cols-[475px_1fr] md:overflow-scroll"
  >
    <div class="image relative md:hidden" />
    <div class="container flex flex-col p-28 pb-0 gap-10 md:p-8">
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

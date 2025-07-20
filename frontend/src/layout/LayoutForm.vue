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
    class="h-dvh grid grid-cols-[1fr_2fr] md:grid-cols-[1fr] overflow-hidden md:overflow-scroll"
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
  background-image: url("../assets/GREENNCOVERY.LOGIN.svg");
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

<script setup lang="ts">
import {  onMounted, onUnmounted, ref } from "vue";

const isScrolled = ref(false);

const scrollThreshold = ref(0);

function adjustScrollThreshold() {
  if (window.matchMedia("(max-width: 425px)").matches) {
    // Pequenas telas
    scrollThreshold.value = 85;
  } else if (window.matchMedia("(max-width: 767px)").matches) {
    // Telas médias
    scrollThreshold.value = 120;
  } else if (window.matchMedia("(max-width: 1080px)").matches) {
    // Telas grandes
    scrollThreshold.value = 45;
  } else if (window.matchMedia("(max-width: 1440px)").matches) {
    // XL
    scrollThreshold.value = 85;
  } else if (window.matchMedia("(max-width: 1920px)").matches) {
    // 2XL
    scrollThreshold.value = 200;
  } else {
    // Padrão para telas maiores
    scrollThreshold.value = 250;
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > scrollThreshold.value;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", adjustScrollThreshold);
  adjustScrollThreshold();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", adjustScrollThreshold);
});
</script>

<template>
  <main data-anima="top">
    <router-view />
  </main>
</template>

<style lang="scss"></style>

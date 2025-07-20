<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
});

const classes = computed(() => {
  return [
    "flex w-full items-center justify-center space-x-2 py-2",
    props.class,
  ];
});
</script>

<template>
  <nav :class="classes" aria-label="pagination">
    <slot />
  </nav>
</template>

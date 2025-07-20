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
    "flex h-10 w-10 items-center justify-center text-sm font-medium",
    props.class,
  ];
});
</script>

<template>
  <span :class="classes">
    <svg
      class="h-4 w-4"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
    <span class="sr-only">More pages</span>
  </span>
</template>

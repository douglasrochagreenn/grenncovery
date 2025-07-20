<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
});

const classes = computed(() => {
  return ["", props.class];
});
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

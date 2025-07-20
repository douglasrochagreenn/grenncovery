<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
  isActive: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  ];

  if (props.isActive) {
    baseClasses.push("bg-primary text-primary-foreground hover:bg-primary/90");
  } else {
    baseClasses.push("hover:bg-accent hover:text-accent-foreground");
  }

  baseClasses.push("h-10 px-4 py-2");
  baseClasses.push(props.class);

  return baseClasses;
});

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<template>
  <button :class="classes" type="button" @click="handleClick">
    <slot />
  </button>
</template>

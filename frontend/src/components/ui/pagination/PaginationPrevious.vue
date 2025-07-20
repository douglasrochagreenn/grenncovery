<script setup lang="ts">
import { computed } from "vue";

interface Props {
  class?: string | Record<string, boolean>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
  ];

  if (typeof props.class === "string") {
    baseClasses.push(props.class);
  } else if (typeof props.class === "object") {
    // Handle conditional classes
    Object.entries(props.class).forEach(([className, condition]) => {
      if (condition) {
        baseClasses.push(className);
      }
    });
  }

  return baseClasses;
});

const handleClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<template>
  <button :class="classes" type="button" @click="handleClick">
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
    <span class="sr-only">Go to previous page</span>
  </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";
import { cn } from "@/lib/utils";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <PhCircleNotch v-if="loading" :size="24" color="var(--icon-foreground)" weight="bold" class="absolute spinner" />
    <slot />
  </Primitive>
</template>

<style scoped lang="scss">
.spinner {
  animation: rotator 1s linear infinite;
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

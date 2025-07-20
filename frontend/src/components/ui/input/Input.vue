<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  placeholder?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    :placeholder="placeholder"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-border/[.10] bg-background px-3 py-2 text-base font-normal text-primary ring-offset-background pr-10 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-label focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  />
</template>

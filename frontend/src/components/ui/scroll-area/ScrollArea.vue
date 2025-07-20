<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import type { ScrollAreaRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from "radix-vue";
import { computed, ref } from "vue";
import ScrollBar from "./ScrollBar.vue";

const props = defineProps<ScrollAreaRootProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const viewportRef = ref<HTMLElement | null>(null);

// Expõe para o pai poder acessar scrollTop etc.
defineExpose({ viewportRef });
</script>

<template>
  <ScrollAreaRoot v-bind="delegatedProps" :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>

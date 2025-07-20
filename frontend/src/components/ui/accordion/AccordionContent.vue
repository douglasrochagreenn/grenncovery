<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { AccordionContent, type AccordionContentProps } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<
  AccordionContentProps & { class?: HTMLAttributes["class"]; classContent?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AccordionContent
    v-bind="delegatedProps"
    class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-[#F5F5F5] p-4"
    :class="cn('', props.classContent)"
  >
    <div :class="cn('', props.class)">
      <slot />
    </div>
  </AccordionContent>
</template>

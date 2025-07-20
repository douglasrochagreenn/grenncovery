<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TabsList, type TabsListProps } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    class="w-full grid grid-cols-2"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-lg bg-[#202020] p-[0.6rem] text-muted-foreground border-[2px] border-solid border-border/[.10]',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>

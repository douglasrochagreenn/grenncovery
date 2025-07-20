<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes["class"]; label?: boolean; error?: string; loading?: boolean }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const isError = computed(() => !!props.error);

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-14 w-full items-center justify-between rounded-lg border-[2px] border-border/[.10] bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:max-w-full [&>span]w-full [&>span]whitespace-nowrap [&>span]overflow-hidden [&>span]text-ellipsis md:w-full',
        props.class,
        { '!text-label': props.label },
        { '!border-destructive !text-destructive': isError }
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <PhCircleNotch
        v-if="props.loading"
        :size="24"
        :color="isError ? 'var(--destructive)' : 'var(--icon)'"
        weight="bold"
        class="absolute right-4 spinner"
      />
      <PhCaretDown v-else :size="24" :color="isError ? 'var(--destructive)' : 'var(--icon)'" />
    </SelectIcon>
  </SelectTrigger>
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

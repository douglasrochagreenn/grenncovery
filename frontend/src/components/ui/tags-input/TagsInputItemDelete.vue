<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete v-bind="forwardedProps" :class="cn('flex rounded bg-transparent mr-1', props.class)">
    <slot>
      <PhX :size="16" color="var(--icon-foreground)" />
    </slot>
  </TagsInputItemDelete>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useCarousel } from "./useCarousel";
import type { WithClassAsProps } from "./interface";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const props = defineProps<WithClassAsProps>();

const { scrollPrev } = useCarousel();
</script>

<template>
  <Button
    :class="cn('touch-manipulation absolute h-8 w-8 rounded-full p-0 top-2/4 left-12 -translate-x-1/2', props.class)"
    variant="outline"
    @click="scrollPrev"
  >
    <slot>
      <ArrowLeft class="h-4 w-4 text-current" />
      <span class="sr-only">Previous Slide</span>
    </slot>
  </Button>
</template>

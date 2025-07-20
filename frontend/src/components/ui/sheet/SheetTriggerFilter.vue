<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from "radix-vue";

const props = defineProps<DialogTriggerProps>();
</script>

<template>
  <DialogTrigger v-bind="props" class="md:h-14">
    <slot />
  </DialogTrigger>
</template>

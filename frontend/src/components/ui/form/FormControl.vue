<script lang="ts" setup>
import { Slot } from "radix-vue";
import { useFormField } from "./useFormField";

const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
</script>

<template>
  <Slot
    :id="formItemId"
    :aria-describedby="!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`"
    :aria-invalid="!!error"
    :class="{ 'border-destructive border-2 focus-visible:ring-destructive-light': !!error }"
  >
    <slot />
  </Slot>
</template>

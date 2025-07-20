<script lang="ts" setup>
import { ErrorMessage } from "vee-validate";
import { toValue } from "vue";
import { useFormField } from "./useFormField";

const { name, formMessageId, error } = useFormField();
</script>

<template>
  <div class="flex items-center gap-1">
    <PhWarningCircle v-if="error" :size="20" weight="regular" color="#F02424" />
    <ErrorMessage :id="formMessageId" as="p" :name="toValue(name)" class="text-sm font-medium text-destructive" />
  </div>
</template>

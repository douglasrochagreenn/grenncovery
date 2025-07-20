<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useAuthStore } from "@/store";
import { schemaLogin } from "@/utils";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const authStore = useAuthStore();

const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const showPassword = ref(false);
const loading = ref(false);

const typePassword = computed(() => {
  if (showPassword.value) {
    return "text";
  }
  return "password";
});

const placeholderPassword = computed(() => {
  if (showPassword.value) {
    return "Crie uma senha";
  }
  return "••••••";
});

const { handleSubmit } = useForm({
  validationSchema: schemaLogin,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await authStore.login(values);
    router.push({ name: "Home" });
  } catch (error) {
    console.error("Erro no login:", error);
  } finally {
    loading.value = false;
  }
});

onMounted(async () => {
  if (isAuthenticated.value) {
    await authStore.getMe().then(() => {
      router.push({ name: "Home" });
    });
  }
});
</script>
<template>
  <div class="flex flex-col gap-10">
    <h1
      class="font-extrabold text-[32px] text-foreground leading-none pr-3 pl-3 md:text-[56px] md:leading-8"
    >
      Acessar minha conta
    </h1>
    <form
      class="w-full grid gap-4 overflow-y-scroll pr-3 pl-3"
      @submit="onSubmit"
    >
      <!-- Email -->
      <FormField v-slot="{ componentField }" name="email">
        <FormItem v-auto-animate>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Digite seu email"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <!-- Senha -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem v-auto-animate>
          <div
            class="flex w-full items-center text-bold font-medium justify-between"
          >
            <FormLabel>Senha</FormLabel>
          </div>
          <FormControl>
            <Input
              :type="typePassword"
              :placeholder="placeholderPassword"
              v-bind="componentField"
            />
            <PhEye
              v-if="!showPassword"
              :size="20"
              color="var(--icon)"
              class="cursor-pointer absolute top-[32px] right-3 select-none"
              @click="showPassword = !showPassword"
            />
            <PhEyeSlash
              v-else
              :size="20"
              color="var(--icon)"
              class="cursor-pointer absolute top-[32px] right-3 select-none"
              @click="showPassword = !showPassword"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button variant="dark" type="submit" :disabled="loading"
        >Entrar na minha conta</Button
      >
    </form>
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PhWhatsappLogo,
  PhQrCode,
  PhArrowClockwise,
  PhSignOut,
} from "@phosphor-icons/vue";
import { useRevolutionStore } from "@/store";
import { useAuthStore } from "@/store";

const revolutionStore = useRevolutionStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const qrCode = computed(() => revolutionStore.getQrCode);
const qrCodeLoading = computed(() => revolutionStore.getQrCodeLoading);
const sessionReady = computed(() => revolutionStore.getSessionReady);
const sessionState = computed(() => revolutionStore.getSessionState);

const refreshQrCode = async () => {
  try {
    await revolutionStore.getSessionQrCode();
  } catch (error) {
    console.error("Erro ao atualizar QR Code:", error);
  }
};

const checkSessionStatus = async () => {
  try {
    await revolutionStore.checkStatus();
  } catch (error) {
    console.error("Erro ao verificar status da sessão:", error);
  }
};

const disconnectSession = async () => {
  try {
    await revolutionStore.disconnectSession();
    // Verificar status da sessão após desconectar
    await checkSessionStatus();
  } catch (error) {
    console.error("Erro ao desconectar sessão:", error);
  }
};

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await revolutionStore.createSession();
      // Verificar status da sessão após criar
      await checkSessionStatus();
    } catch (error) {
      console.error("Erro ao criar sessão:", error);
      // Aqui você pode adicionar um toast de erro se necessário
    }
  }
});
</script>

<template>
  <div class="space-y-6" v-if="isAuthenticated">
    <div class="flex items-center space-x-3">
      <div class="p-2 bg-green-100 rounded-lg">
        <PhWhatsappLogo class="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h1 class="text-3xl font-bold">Configuração do WhatsApp</h1>
        <p class="text-gray-600 mt-1">Configure as integrações do WhatsApp</p>
      </div>
    </div>

    <!-- QR Code Section -->
    <Card v-if="sessionReady">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="flex items-center gap-2">
            <PhQrCode class="w-5 h-5" />
            QR Code do WhatsApp
          </CardTitle>
          <div class="flex items-center gap-2">
            <!-- Status da Conexão -->
            <div
              class="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              :class="
                sessionState
                  ? 'bg-green-100 text-green-700 text-primary'
                  : 'bg-red-100 text-red-700'
              "
            >
              <div
                class="w-2 h-2 rounded-full"
                :class="sessionState ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              {{ sessionState ? "Conectado" : "Desconectado" }}
            </div>

            <!-- Botão Verificar Status -->
            <Button
              variant="outline"
              size="sm"
              @click="checkSessionStatus"
              class="flex items-center gap-2"
            >
              <PhArrowClockwise class="w-4 h-4" />
              Verificar Status
            </Button>

            <!-- Botão Atualizar QR -->
            <Button
              v-if="!sessionState"
              variant="outline"
              size="sm"
              @click="refreshQrCode"
              :disabled="qrCodeLoading"
              class="flex items-center gap-2"
            >
              <PhArrowClockwise
                class="w-4 h-4"
                :class="{ 'animate-spin': qrCodeLoading }"
              />
              Atualizar QR
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex flex-col items-center space-y-4">
        <!-- Status Conectado -->
        <div v-if="sessionState" class="text-center p-8">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <PhWhatsappLogo class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-green-700 mb-2">
            WhatsApp Conectado!
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            Sua sessão está ativa e pronta para uso
          </p>

          <!-- Botão Desconectar -->
          <Button
            v-if="sessionState"
            variant="outline"
            @click="disconnectSession"
            class="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <PhSignOut :size="16" />
            Desconectar WhatsApp
          </Button>
        </div>

        <!-- QR Code para Conectar -->
        <div v-else>
          <div
            v-if="qrCodeLoading"
            class="flex items-center justify-center p-8"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"
            ></div>
            <span class="ml-2 text-gray-600">Carregando QR Code...</span>
          </div>

          <div v-else-if="qrCode" class="text-center">
            <img
              :src="qrCode"
              alt="QR Code do WhatsApp"
              class="mx-auto border border-gray-200 rounded-lg shadow-sm"
              style="max-width: 250px"
            />
            <p class="text-sm text-gray-600 mt-3">
              Escaneie este QR Code com o WhatsApp do seu celular para conectar
            </p>
          </div>

          <div v-else class="text-center p-8 text-gray-500">
            <PhQrCode class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>QR Code não disponível</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>

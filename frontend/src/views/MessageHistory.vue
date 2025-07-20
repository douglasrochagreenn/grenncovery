<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  PhArrowLeft,
  PhChatCircle,
  PhClock,
  PhPaperPlaneRight,
} from "@phosphor-icons/vue";
import { useRevolutionStore } from "@/store";

const route = useRoute();
const router = useRouter();
const cartId = route.params.id as string;
const clientCellphone = route.params.client_cellphone as string;
const revolutionStore = useRevolutionStore();

const loading = ref(true);
const sendingMessage = ref(false);
const newMessage = ref("");

// Computed para acessar as mensagens da store
const messages = computed(() => revolutionStore.messages);

const goBack = () => {
  router.push({ name: "AbandonedCart" });
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  // Criar mensagem local para exibição imediata
  const localMessage = {
    _data: {
      id: {
        fromMe: true,
        remote: `${clientCellphone}@c.us`,
        id: `local_${Date.now()}`,
        _serialized: `true_${clientCellphone}@c.us_local_${Date.now()}`,
      },
      viewed: false,
      body: newMessage.value.trim(),
      type: "chat",
      t: Math.floor(Date.now() / 1000),
      notifyName: "",
      from: {
        server: "c.us",
        user: "554491543424", // ID do usuário logado
        _serialized: "554491543424@c.us",
      },
      to: {
        server: "c.us",
        user: clientCellphone,
        _serialized: `${clientCellphone}@c.us`,
      },
      ack: 1, // Enviada
      invis: false,
      star: false,
      kicNotified: false,
      isFromTemplate: false,
      pollInvalidated: false,
      isSentCagPollCreation: false,
      latestEditMsgKey: null,
      latestEditSenderTimestampMs: null,
      broadcast: false,
      mentionedJidList: [],
      groupMentions: [],
      isEventCanceled: false,
      eventInvalidated: false,
      isVcardOverMmsDocument: false,
      isForwarded: false,
      isQuestion: false,
      labels: [],
      hasReaction: false,
      viewMode: "VISIBLE",
      messageSecret: {},
      productHeaderImageRejected: false,
      lastPlaybackProgress: 0,
      isDynamicReplyButtonsMsg: false,
      isCarouselCard: false,
      parentMsgId: null,
      callSilenceReason: null,
      isVideoCall: false,
      callDuration: null,
      callCreator: null,
      callParticipants: null,
      isCallLink: null,
      callLinkToken: null,
      isMdHistoryMsg: false,
      stickerSentTs: 0,
      isAvatar: false,
      lastUpdateFromServerTs: 0,
      invokedBotWid: null,
      botTargetSenderJid: null,
      bizBotType: null,
      botResponseTargetId: null,
      botPluginType: null,
      botPluginReferenceIndex: null,
      botPluginSearchProvider: null,
      botPluginSearchUrl: null,
      botPluginSearchQuery: null,
      botPluginMaybeParent: false,
      botReelPluginThumbnailCdnUrl: null,
      botMessageDisclaimerText: null,
      botMsgBodyType: null,
      reportingTokenInfo: null,
      requiresDirectConnection: false,
      bizContentPlaceholderType: null,
      hostedBizEncStateMismatch: false,
      senderOrRecipientAccountTypeHosted: false,
      placeholderCreatedWhenAccountIsHosted: false,
      links: [],
    },
    id: {
      fromMe: true,
      remote: `${clientCellphone}@c.us`,
      id: `local_${Date.now()}`,
      _serialized: `true_${clientCellphone}@c.us_local_${Date.now()}`,
    },
    ack: 1,
    hasMedia: false,
    body: newMessage.value.trim(),
    type: "chat",
    timestamp: Math.floor(Date.now() / 1000),
    from: "554491543424@c.us",
    to: `${clientCellphone}@c.us`,
    deviceType: "android",
    isForwarded: false,
    forwardingScore: 0,
    isStatus: false,
    isStarred: false,
    broadcast: false,
    fromMe: true,
    hasQuotedMsg: false,
    hasReaction: false,
    vCards: [],
    mentionedIds: [],
    groupMentions: [],
    isGif: false,
    links: [],
  };

  try {
    sendingMessage.value = true;

    // Enviar mensagem via API
    await revolutionStore.sendMessageApi(
      clientCellphone,
      newMessage.value.trim()
    );

    // Adicionar mensagem local ao array de mensagens
    revolutionStore.messages.push(localMessage);

    // Limpar textarea
    newMessage.value = "";
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    // @ts-ignore
    if (error?.response?.status === 500) {
      revolutionStore.messages.push(localMessage);
      // Limpar textarea
      newMessage.value = "";
    }
  } finally {
    sendingMessage.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    // Buscar mensagens usando a store
    await revolutionStore.getMessagesApi(clientCellphone);
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button
          variant="outline"
          @click="goBack"
          class="flex items-center gap-2"
        >
          <PhArrowLeft :size="16" />
          Voltar
        </Button>
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            Histórico de Mensagens
          </h1>
          <p class="text-muted-foreground">
            Carrinho ID: {{ cartId }} | Cliente: {{ clientCellphone }}
          </p>
        </div>
      </div>
    </div>

    <!-- Histórico de Mensagens -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <PhChatCircle :size="20" />
          Mensagens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          ></div>
          <span class="ml-2">Carregando mensagens...</span>
        </div>

        <div
          v-else-if="messages.length === 0"
          class="text-center py-8 text-muted-foreground"
        >
          <PhChatCircle :size="48" class="mx-auto mb-4 opacity-50" />
          <p>Nenhuma mensagem encontrada.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id._serialized"
            :class="[
              'flex gap-3',
              message.fromMe ? 'justify-end' : 'justify-start',
            ]"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md p-3 rounded-lg',
                message.fromMe
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted',
              ]"
            >
              <p class="text-sm">{{ message.body }}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-1 text-xs opacity-70">
                  <PhClock :size="12" />
                  {{
                    new Date(message.timestamp * 1000).toLocaleString("pt-BR")
                  }}
                </div>
                <Badge
                  v-if="message.fromMe"
                  :variant="message.ack === 3 ? 'default' : 'secondary'"
                  class="text-xs"
                >
                  {{ message.ack === 3 ? "Lida" : "Enviada" }}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Área de Envio de Mensagem -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex gap-3">
          <Textarea
            v-model="newMessage"
            placeholder="Digite sua mensagem..."
            class="flex-1 min-h-[80px] resize-none"
            @keydown.enter.prevent="sendMessage"
          />
          <Button
            @click="sendMessage"
            :disabled="!newMessage.trim() || sendingMessage"
            class="self-end"
          >
            <PhPaperPlaneRight
              :size="20"
              :class="{ 'animate-spin': sendingMessage }"
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss"></style>

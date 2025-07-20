import { defineStore } from "pinia";

import ApiServiceRevolution from "@/services/ApiServiceRevolution";
import { revolution } from "@/services/index";
import { useAuthStore } from "../auth";

// Interfaces para tipagem das respostas da API
interface SessionStatusResponse {
  success: boolean;
  state: SessionState;
  message: SessionMessage;
}

// Tipos para os possíveis estados da sessão
type SessionState = "CONNECTED" | "DISCONNECTED" | null;

// Tipos para as mensagens de resposta
type SessionMessage = "session_connected" | "session_not_connected" | string;

// Interface para mensagens do WhatsApp
interface WhatsAppMessage {
  _data: {
    id: {
      fromMe: boolean;
      remote: string;
      id: string;
      _serialized: string;
    };
    viewed: boolean;
    body: string;
    type: string;
    t: number;
    notifyName: string;
    from: {
      server: string;
      user: string;
      _serialized: string;
    };
    to: {
      server: string;
      user: string;
      _serialized: string;
    };
    ack: number;
    invis: boolean;
    star: boolean;
    kicNotified: boolean;
    isFromTemplate: boolean;
    pollInvalidated: boolean;
    isSentCagPollCreation: boolean;
    latestEditMsgKey: any;
    latestEditSenderTimestampMs: any;
    broadcast: boolean;
    mentionedJidList: any[];
    groupMentions: any[];
    isEventCanceled: boolean;
    eventInvalidated: boolean;
    isVcardOverMmsDocument: boolean;
    isForwarded: boolean;
    isQuestion: boolean;
    labels: any[];
    hasReaction: boolean;
    viewMode: string;
    messageSecret: any;
    productHeaderImageRejected: boolean;
    lastPlaybackProgress: number;
    isDynamicReplyButtonsMsg: boolean;
    isCarouselCard: boolean;
    parentMsgId: any;
    callSilenceReason: any;
    isVideoCall: boolean;
    callDuration: any;
    callCreator: any;
    callParticipants: any;
    isCallLink: any;
    callLinkToken: any;
    isMdHistoryMsg: boolean;
    stickerSentTs: number;
    isAvatar: boolean;
    lastUpdateFromServerTs: number;
    invokedBotWid: any;
    botTargetSenderJid: any;
    bizBotType: any;
    botResponseTargetId: any;
    botPluginType: any;
    botPluginReferenceIndex: any;
    botPluginSearchProvider: any;
    botPluginSearchUrl: any;
    botPluginSearchQuery: any;
    botPluginMaybeParent: boolean;
    botReelPluginThumbnailCdnUrl: any;
    botMessageDisclaimerText: any;
    botMsgBodyType: any;
    reportingTokenInfo: any;
    requiresDirectConnection: boolean;
    bizContentPlaceholderType: any;
    hostedBizEncStateMismatch: boolean;
    senderOrRecipientAccountTypeHosted: boolean;
    placeholderCreatedWhenAccountIsHosted: boolean;
    links: any[];
  };
  id: {
    fromMe: boolean;
    remote: string;
    id: string;
    _serialized: string;
  };
  ack: number;
  hasMedia: boolean;
  body: string;
  type: string;
  timestamp: number;
  from: string;
  to: string;
  deviceType: string;
  isForwarded: boolean;
  forwardingScore: number;
  isStatus: boolean;
  isStarred: boolean;
  broadcast: boolean;
  fromMe: boolean;
  hasQuotedMsg: boolean;
  hasReaction: boolean;
  vCards: any[];
  mentionedIds: any[];
  groupMentions: any[];
  isGif: boolean;
  links: any[];
}

interface MessagesResponse {
  status: string;
  messages: WhatsAppMessage[];
}

export const useRevolutionStore = defineStore("revolution", {
  state: () => ({
    session: null as string | null,
    sessionReady: false as boolean,
    qrCode: null as string | null,
    qrCodeLoading: false as boolean,
    sessionState: false as boolean,
    messages: [] as WhatsAppMessage[],
  }),
  actions: {
    async getSessionId() {
      const authStore = useAuthStore();

      const user = authStore.getUser;

      if (!user._id) {
        throw new Error("Dados do usuário incompletos");
      }

      const sessionId = `${user._id}`;
      this.session = sessionId;
      return sessionId;
    },
    async createSession() {
      try {
        const sessionId = await this.getSessionId();
        await ApiServiceRevolution?.get<string>(
          revolution.routes.createSession(sessionId)
        );
        this.sessionReady = true;
      } catch (error: any) {
        if (error?.response?.status === 422) {
          this.sessionReady = true;
        }
      }

      if (this.sessionReady) {
        this.qrCode = await this.getSessionQrCode();
      }
    },
    async getSessionQrCode() {
      try {
        this.qrCodeLoading = true;
        const sessionId = await this.getSessionId();

        const url = revolution.routes.getSessionQrCode(sessionId);

        const response = await ApiServiceRevolution?.get<Blob>(url, "blob");

        if (response && response.data) {
          // A resposta já deve ser um Blob
          const blob = response.data as Blob;

          const reader = new FileReader();

          return new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const base64 = reader.result as string;
              this.qrCode = base64;
              resolve(base64);
            };
            reader.onerror = (error) => {
              console.error("Erro no FileReader:", error);
              reject(error);
            };
            reader.readAsDataURL(blob);
          });
        }

        return null;
      } catch (error) {
        console.error("Erro ao obter QR Code:", error);
        return null;
      } finally {
        this.qrCodeLoading = false;
      }
    },
    async checkStatus(): Promise<SessionStatusResponse | null> {
      try {
        const sessionId = await this.getSessionId();
        const response = await ApiServiceRevolution?.get<SessionStatusResponse>(
          revolution.routes.checkStatus(sessionId)
        );

        // A API retorna diretamente o objeto, não dentro de response.data
        if (response) {
          const statusData = response as unknown as SessionStatusResponse;

          // Atualizar o estado baseado na resposta
          this.sessionState = this.isSessionConnected(statusData);

          return statusData;
        }

        // Se não há resposta válida, considerar como desconectado
        this.sessionState = false;
        return null;
      } catch (error) {
        console.error("Erro ao verificar status:", error);
        this.sessionState = false;
        return null;
      }
    },
    // Função helper para verificar se a sessão está conectada
    isSessionConnected(statusData: SessionStatusResponse): boolean {
      return statusData.success && statusData.state === "CONNECTED";
    },
    async disconnectSession() {
      try {
        const sessionId = await this.getSessionId();
        await ApiServiceRevolution?.get(
          revolution.routes.disconnectSession(sessionId)
        );
        this.sessionState = false;
      } catch (error) {
        console.error("Erro ao desconectar sessão:", error);
      }
    },
    async getMessagesApi(clientCellphone: string): Promise<MessagesResponse[]> {
      const sessionId = await this.getSessionId();
      try {
        const response = await ApiServiceRevolution?.post<MessagesResponse[]>(
          revolution.routes.getMessages(sessionId),
          {
            chatId: `${clientCellphone}@c.us`,
            searchOptions: {},
          }
        );
        // @ts-ignore
        if (response && response.messages) {
          // @ts-ignore
          this.messages = response.messages;
          // @ts-ignore
          return response.messages;
        }

        return [];
      } catch (error) {
        this.messages = [];
        console.error("Erro ao obter mensagens:", error);
        return [];
      }
    },
    async sendMessageApi(clientCellphone: string, message: string) {
      try {
        const sessionId = await this.getSessionId();
        const response = await ApiServiceRevolution?.post<{
          status: string;
          message: string;
        }>(revolution.routes.sendMessage(sessionId), {
          chatId: `${clientCellphone}@c.us`,
          contentType: "string",
          content: message,
        });
        return response;
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        throw error;
      }
    },
  },
  getters: {
    getSession: (state) => state.session,
    getSessionReady: (state) => state.sessionReady,
    getQrCode: (state) => state.qrCode,
    getQrCodeLoading: (state) => state.qrCodeLoading,
    getSessionState: (state) => state.sessionState,
    isConnected: (state) => state.sessionState,
    getMessages: (state) => state.messages,
  },
});

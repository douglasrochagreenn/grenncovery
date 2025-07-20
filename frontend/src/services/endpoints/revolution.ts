export const routes = {
  createSession: (sessionId: string) => `session/start/${sessionId}`,
  getSessionQrCode: (sessionId: string) => `session/qr/${sessionId}/image`,
  checkStatus: (sessionId: string) => `session/status/${sessionId}`,
  disconnectSession: (sessionId: string) => `session/terminate/${sessionId}`,
  getMessages: (sessionId: string) => `chat/fetchMessages/${sessionId}`,
  sendMessage: (sessionId: string) => `client/sendMessage/${sessionId}`,
};

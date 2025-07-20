export const routes = {
  get: () => "/chat",
  getMessages: (chatId: string) => `/chat/${chatId}/messages`,
  readMessages: () => "/chat/read",
};

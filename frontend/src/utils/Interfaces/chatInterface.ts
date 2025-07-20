export interface UserChat {
  id: string;
  socket_id: string;
  username: string;
  email: string;
  avatar: string | undefined;
}

export interface FirstAccess {
  message: string;
  userReceives: UserChat;
  sendingUser: UserChat;
}

export interface Message {
  id: string;
  content: string;
  sender: UserChat;
  receiver: UserChat;
  timestamp: Date;
}

export interface Chat {
  id: string;
  participants: UserChat[];
  messages: Message[];
  lastMessage?: Message;
}

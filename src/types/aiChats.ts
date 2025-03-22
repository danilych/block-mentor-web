export enum EChatMessageRole {
  USER = 'user',
  AI = 'assistant'
}

export type TChatMessage = {
  senderType: EChatMessageRole;
  content: string;
  id: string;
  createdAt: number;
  chunks?: string[];
  role: EChatMessageRole;
};

export type TAiChat = {
  id: string;
  title: string;
  messages: TChatMessage[];
  agentId: string;
};

export type AiChatsState = {
  selectedChat: TAiChat | null;
  isBotTyping: boolean;
  showEmptyChat: boolean;
  avalableAgent: {
    id: string;
    name: string;
  } | null;
};

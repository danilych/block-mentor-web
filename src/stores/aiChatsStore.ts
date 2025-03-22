import { create } from 'zustand';
import { TAiChat } from '@/types/aiChats';

interface AiChatsState {
  selectedChat: TAiChat | null;
  isBotTyping: boolean;
  showEmptyChat: boolean;
  avalableAgent: { id: string; name: string } | null;
  setSelectedChat: (chat: TAiChat | null) => void;
  setIsBotTyping: (typing: boolean) => void;
  setShowEmptyChat: (show: boolean) => void;
}

export const aiChatsStore = create<AiChatsState>((set) => ({
  selectedChat: null,
  isBotTyping: false,
  showEmptyChat: true,
  avalableAgent: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setIsBotTyping: (typing) => set({ isBotTyping: typing }),
  setShowEmptyChat: (show) => set({ showEmptyChat: show }),
}));

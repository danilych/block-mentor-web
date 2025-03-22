import { EChatMessageRole, TChatMessage, TAiChat } from "@/types/aiChats";
import { aiChatsStore } from "@/stores/aiChatsStore";
import { v4 as uuidv4 } from 'uuid';

class AiChatsService {
  async openChat(agentId: string): Promise<TAiChat> {
    const newChat: TAiChat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      agentId
    };
    aiChatsStore.getState().setSelectedChat(newChat);
    return newChat;
  }

  async sendMessage(message: string): Promise<TChatMessage> {
    const store = aiChatsStore.getState();
    const newMessage: TChatMessage = {
      id: uuidv4(),
      content: message,
      senderType: EChatMessageRole.USER,
      role: EChatMessageRole.USER,
      createdAt: Date.now()
    };
    
    if (store.selectedChat) {
      const updatedChat = {
        ...store.selectedChat,
        messages: [...store.selectedChat.messages, newMessage]
      };
      store.setSelectedChat(updatedChat);
    }
    
    return newMessage;
  }

  async simulateResponse(message: string): Promise<TChatMessage> {
    const store = aiChatsStore.getState();
    store.setIsBotTyping(true);
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response: TChatMessage = {
      id: uuidv4(),
      content: message,
      senderType: EChatMessageRole.AI,
      role: EChatMessageRole.AI,
      createdAt: Date.now()
    };
    
    if (store.selectedChat) {
      const updatedChat = {
        ...store.selectedChat,
        messages: [...store.selectedChat.messages, response]
      };
      store.setSelectedChat(updatedChat);
    }
    
    store.setIsBotTyping(false);
    return response;
  }
}

export const aiChatsService = new AiChatsService();

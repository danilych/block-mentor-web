import apiClient from './apiClient'
import { ChatMessage } from '@/types'

export const chatService = {
  getOrCreateChat: async (): Promise<{messages: ChatMessage[]}> => {
    const { data } = await apiClient.get<{messages: ChatMessage[]}>('/chats')
    return data
  },

  sendMessage: async (content: string, role: string): Promise<Response> => {
    const token = await (window as any).privyGetAccessToken?.() || ''
    const response = await fetch(`${apiClient.defaults.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        role,
      }),
    })

    if (!response.ok || !response.body) {
      throw new Error('Failed to send message')
    }

    return response
  }
}

export default chatService

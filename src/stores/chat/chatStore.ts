import { create } from 'zustand'
import { ChatMessage, ChatMessageRole } from '@/types'
import { chatService } from '@/services/api'

interface ChatState {
  messages: ChatMessage[]
  isBotTyping: boolean
  error: string | null
  isLoading: boolean
  
  getOrCreateChat: () => Promise<void>
  sendMessage: (content: string, role: string) => Promise<void>
  reset: () => void
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isBotTyping: false,
  error: null,
  isLoading: false,
  
  getOrCreateChat: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await chatService.getOrCreateChat()
      set({ messages: response.messages, isLoading: false })
    } catch (error: any) {
      console.error('Error getting chat:', error)
      set({
        error: error.message || 'Failed to load chat',
        isLoading: false
      })
    }
  },
  
  sendMessage: async (content: string, role: string) => {
    try {
      if (!content.trim().length) return
      
      const messageId = crypto.randomUUID()
      
      const userMessage: ChatMessage = {
        role: ChatMessageRole.USER,
        content,
        id: messageId,
      }
      
      set(state => ({
        messages: [...state.messages, userMessage],
        isBotTyping: true
      }))
      
      const response = await chatService.sendMessage(content, role)
      
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let resultString = ''
      
      const aiMessage: ChatMessage = {
        role: ChatMessageRole.AI,
        content: '',
        id: crypto.randomUUID(),
      }
      
      set(state => ({
        messages: [...state.messages, aiMessage]
      }))
      
      let previousChunk = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const messageChunk = decoder.decode(value, { stream: true })
        const cleanedMessages = messageChunk.split('')
        
        cleanedMessages.forEach(chunk => {
          if (
            previousChunk &&
            (previousChunk.match(/[a-zA-Z0-9]$/) || chunk.match(/^[a-zA-Z0-9]/))
          ) {
            resultString += '' + chunk
          } else {
            resultString += chunk
          }
          previousChunk = chunk
        })
        
        set(state => ({
          messages: state.messages.map(msg =>
            msg.id === aiMessage.id
              ? {
                  ...msg,
                  content: resultString,
                  chunks: [...(msg.chunks || []), ...cleanedMessages],
                }
              : msg
          )
        }))
      }
      
      set({ isBotTyping: false })
    } catch (error: any) {
      console.error('Error sending message:', error)
      set({
        error: error.message || 'Failed to send message',
        isBotTyping: false
      })
    }
  },
  
  reset: () => {
    set({
      messages: [],
      isBotTyping: false,
      error: null,
      isLoading: false
    })
  }
}))

export default useChatStore

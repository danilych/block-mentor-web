export enum ChatMessageRole {
  USER = 'user',
  AI = 'assistant',
  SYSTEM = 'system',
}

export type ChatMessage = {
  content: string
  role: ChatMessageRole
  id: string
  createdAt?: number
  chunks?: string[]
}

export type AiChat = {
  id: string
  title: string
  messages: ChatMessage[]
  agentId: string
}

export type AiChatsState = {
  selectedChat: AiChat | null
  isBotTyping: boolean
  showEmptyChat: boolean
}

export interface MessageProps {
  message: {
    role: string
    content: string | null
  }
}

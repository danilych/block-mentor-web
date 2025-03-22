export enum EChatMessageRole {
  USER = 'USER',
  AI = 'AGENT',
}

export type TChatMessage = {
  prompt: string
  role: EChatMessageRole
  id: string
  createdAt?: number
  chunks?: string[]
}

export type TAiChat = {
  id: string
  title: string
  messages: TChatMessage[]
  agentId: string
}

export type AiChatsState = {
  selectedChat: TAiChat | null
  isBotTyping: boolean
  showEmptyChat: boolean
}

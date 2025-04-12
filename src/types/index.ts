export interface ParticleOptions {
  particleColor: string
  lineColor: string
  particleAmount: number
  defaultRadius: number
  variantRadius: number
  defaultSpeed: number
  variantSpeed: number
  linkRadius: number
}

export interface Particle {
  x: number
  y: number
  color: string
  radius: number
  speed: number
  directionAngle: number
  vector: { x: number; y: number }
  update: () => void
  border: () => void
  draw: () => void
}

export interface MessageProps {
  message: {
    role: string
    content: string | null
  }
}

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

export interface Vesting {
  id: string
  tokenName: string
  tokenSymbol: string
  amount: string
  totalPeriods: string
  periodDuration: string
  startTimestamp: string
  createdAt: string
  tokenAddress: string
  owner: string
  webpage?: string
}

export interface Token {
  name: string
  symbol: string
  createdAt: string
  initialSupply: string
  contractAddress: string
}

export interface User {
  id: string;
  wallet: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  user: User;
}

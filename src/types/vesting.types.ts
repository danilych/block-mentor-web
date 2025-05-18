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

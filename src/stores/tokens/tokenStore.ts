import { create } from 'zustand'
import { Token } from '@/types'
import { tokenService } from '@/services/api'
import { formatEther } from 'ethers'

interface TokenState {
  tokens: Token[]
  isLoading: boolean
  error: string | null
  fetchTokens: (walletAddress: string) => Promise<void>
  reset: () => void
}

const useTokenStore = create<TokenState>((set) => ({
  tokens: [],
  isLoading: false,
  error: null,

  fetchTokens: async (walletAddress: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const apiTokens = await tokenService.getTokens(walletAddress)
      
      const formattedTokens: Token[] = apiTokens.map(token => ({
        name: token.name,
        symbol: token.ticker,
        createdAt: new Date(
          parseInt(token.blockTimestamp) * 1000
        ).toLocaleDateString(),
        initialSupply: formatEther(token.initialAmount).replace(/\.0+$/, ''),
        contractAddress: token.token_address,
      }))
      
      set({ tokens: formattedTokens, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching tokens:', error)
      set({ 
        error: error.message || 'Failed to fetch tokens', 
        isLoading: false 
      })
    }
  },

  reset: () => {
    set({ tokens: [], error: null, isLoading: false })
  }
}))

export default useTokenStore

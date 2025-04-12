import { create } from 'zustand'
import { Vesting } from '@/types'
import { vestingService } from '@/services/api'

interface VestingState {
  vestings: Vesting[]
  isLoading: boolean
  error: string | null
  fetchVestings: (walletAddress: string) => Promise<void>
  reset: () => void
}

const useVestingStore = create<VestingState>((set) => ({
  vestings: [],
  isLoading: false,
  error: null,

  fetchVestings: async (walletAddress: string) => {
    try {
      set({ isLoading: true, error: null })
      
      const apiVestings = await vestingService.getVestings(walletAddress)
      
      const formattedVestings: Vesting[] = apiVestings.map(vesting => ({
        id: vesting.id,
        tokenName: vesting.token_name,
        tokenSymbol: vesting.token_ticker,
        amount: vesting.amount,
        totalPeriods: vesting.total_periods,
        periodDuration: vesting.period_duration,
        startTimestamp: vesting.start_timestamp,
        createdAt: new Date(
          parseInt(vesting.blockTimestamp) * 1000
        ).toLocaleDateString(),
        tokenAddress: vesting.token_address,
        owner: vesting.owner,
        webpage: vesting.webpage
      }))
      
      set({ vestings: formattedVestings, isLoading: false })
    } catch (error: any) {
      console.error('Error fetching vestings:', error)
      set({ 
        error: error.message || 'Failed to fetch vestings', 
        isLoading: false 
      })
    }
  },

  reset: () => {
    set({ vestings: [], error: null, isLoading: false })
  }
}))

export default useVestingStore

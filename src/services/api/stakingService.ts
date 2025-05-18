import apiClient from './apiClient'

export interface ApiStaking {
  id: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  amount: string
  rewardRate: string
  lockupPeriod: string
  startTimestamp: string
  owner: string
}

export const stakingService = {
  getStakings: async (walletAddress: string): Promise<ApiStaking[]> => {
    try {
      const response = await apiClient.get<ApiStaking[]>(
        `/user/stakings/${walletAddress}`
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return []
      }
      throw error
    }
  },
}

export default stakingService

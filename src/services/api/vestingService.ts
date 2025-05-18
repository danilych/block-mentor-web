import apiClient from './apiClient'
import { ApiVesting } from '@/types/api'

export const vestingService = {
  getVestings: async (walletAddress: string): Promise<ApiVesting[]> => {
    try {
      const response = await apiClient.get<ApiVesting[]>(
        `/user/vestings/${walletAddress}`
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

export default vestingService

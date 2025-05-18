import apiClient from './apiClient'
import { ApiToken } from '@/types/api'

export const tokenService = {
  getTokens: async (walletAddress: string): Promise<ApiToken[]> => {
    try {
      const response = await apiClient.get<ApiToken[]>(
        `/user/tokens/${walletAddress}`
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

export default tokenService

import apiClient from './apiClient'
import { UserData } from '@/types'

export const authService = {
  authenticate: async (): Promise<UserData> => {
    const { data } = await apiClient.post<UserData>('/auth')
    return data
  },
}

export default authService

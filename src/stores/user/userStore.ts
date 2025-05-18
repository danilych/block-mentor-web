import { create } from 'zustand'
import { UserData } from '@/types'
import { authService } from '@/services/api'

interface UserState {
  user: UserData | null
  isLoading: boolean
  error: string | null
  authenticate: () => Promise<void>
  reset: () => void
}

const useUserStore = create<UserState>(set => ({
  user: null,
  isLoading: false,
  error: null,

  authenticate: async () => {
    try {
      set({ isLoading: true, error: null })
      const userData = await authService.authenticate()
      set({ user: userData, isLoading: false })
    } catch (error: any) {
      console.error('Authentication error:', error)
      set({
        error: error.message || 'Failed to authenticate',
        isLoading: false,
      })
    }
  },

  reset: () => {
    set({ user: null, error: null, isLoading: false })
  },
}))

export default useUserStore

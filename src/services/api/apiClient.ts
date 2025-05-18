import axios from 'axios'
import { getAccessToken } from '@privy-io/react-auth'
import { API_BASE_URL } from '@/config'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async config => {
  try {
    const token = await getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  } catch (error) {
    console.error('Error setting auth token:', error)
    return config
  }
})

export default apiClient

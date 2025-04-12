import { usePrivy } from '@privy-io/react-auth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ParticleEffect from '@/components/layout/Canvas'
import ChatInterface from '@/components/chat/ChatInterface'
import Login from '@/components/auth/Login'
import TokensPage from '@/pages/tokens'
import VestingsPage from '@/pages/vestings'
import StakingsPage from '@/pages/stakings'
import { useEffect } from 'react'
import { useHeadlessDelegatedActions } from '@privy-io/react-auth'
import { useUserStore } from '@/stores'

const App = () => {
  const { user, authenticate } = useUserStore()
  const { authenticated, user: privyUser } = usePrivy()
  const { delegateWallet } = useHeadlessDelegatedActions()

  const handleGetOrCreateUser = async () => {
    await authenticate()

    if (user) {
      delegateWallet({
        address: user.user.wallet,
        chainType: 'ethereum',
      })
    }
  }

  useEffect(() => {
    if (
      authenticated &&
      privyUser?.linkedAccounts.some(lAcc => lAcc?.type === 'wallet')
    ) {
      handleGetOrCreateUser()
    }
  }, [authenticated, privyUser])

  if (!authenticated) {
    return (
      <div className="overflow-hidden w-full h-screen relative flex">
        <div className="flex justify-center items-center w-full h-full">
          <Login />
        </div>
        <ParticleEffect />
      </div>
    )
  }

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/vestings" element={<VestingsPage />} />
          <Route path="/stakings" element={<StakingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ParticleEffect />
    </div>
  )
}

export default App

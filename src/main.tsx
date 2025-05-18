import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import { PrivyProvider } from '@privy-io/react-auth'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar.tsx'

import { logo } from '@/assets'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: logo,
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="text-white absolute lg:top-0 right-0 z-10 md:static" />
        <App />
      </SidebarProvider>
    </PrivyProvider>
  </StrictMode>
)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrivyProvider } from "@privy-io/react-auth";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar.tsx";

import { logo } from "./assets/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: logo,
        },
        embeddedWallets: {
          createOnLogin: "all-users",
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <App />
      </SidebarProvider>
    </PrivyProvider>
  </StrictMode>
);

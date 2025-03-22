import { usePrivy } from "@privy-io/react-auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ParticleEffect from "./components/Canvas";
import Chat from "./components/chat";
import Login from "./components/login";
import TokensPage from "./pages/tokens";
import VestingsPage from "./pages/vestings";
import StakingsPage from "./pages/stakings";
import { useEffect, useState } from "react";
import $client from "./service/client";

const App = () => {
  const [user, setUser] = useState(null);
  const { authenticated } = usePrivy();

  const handleGetOrCreateUser = async () => {
    const {data} = await $client.post("/auth");
      
    setUser(data)
  }

  useEffect(() => {
    if (authenticated) {
      handleGetOrCreateUser()
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="overflow-hidden w-full h-screen relative flex">
        <div className="flex justify-center items-center w-full h-full">
          <Login />
        </div>
        <ParticleEffect />
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Chat user={user} />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/vestings" element={<VestingsPage />} />
          <Route path="/stakings" element={<StakingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ParticleEffect />
    </div>
  );
};

export default App;

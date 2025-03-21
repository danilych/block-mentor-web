import { usePrivy } from "@privy-io/react-auth";
import ParticleEffect from "./components/Canvas";
import Chat from "./components/chat";
import Login from "./components/login";

const App = () => {
  const { authenticated } = usePrivy();

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      {authenticated ? (
        <Chat />
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <Login />
        </div>
      )}
      <ParticleEffect />
    </div>
  );
};

export default App;

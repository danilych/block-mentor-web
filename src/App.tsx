import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./components/ui/button";
import ParticleEffect from "./components/Canvas";

function App() {
  const { ready, login } = usePrivy();
  if (!ready) {
    return <div>Loading...</div>;
  }
  const handleClick = () => {
    login();
  };
  return (
    <div className="min-h-svh flex items-center justify-center">
      <div>
        <h2 className="scroll-m-20 text-white pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Welcome
        </h2>
        <Button onClick={handleClick}>Login</Button>
      </div>
      <ParticleEffect />
    </div>
  );
}

export default App;

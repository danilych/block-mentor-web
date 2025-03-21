import { usePrivy } from "@privy-io/react-auth";

function App() {
  const { ready, login } = usePrivy();
  if (!ready) {
    return <div>Loading...</div>;
  }
  const handleClick = () => {
    login();
  };
  return (
    <div>
      <button
        className="p-5 border-2 focus:bg-amber-400"
        onClick={() => handleClick()}
      >
        Login
      </button>
    </div>
  );
}

export default App;

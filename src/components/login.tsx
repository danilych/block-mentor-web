import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

function Login() {
  const handleClick = async () => {
    await login();
  };
  const { ready, login } = usePrivy();
  if (!ready) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2 className="scroll-m-20 text-white pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Welcome
      </h2>
      <Button onClick={handleClick}>Login</Button>
    </div>
  );
}

export default Login;

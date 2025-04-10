import { usePrivy, useLogin } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import $client from '@/service/client'

function Login() {
  const register = async () => {
    await $client.post('/auth')
  }

  const { ready } = usePrivy()
  const { login } = useLogin({
    onComplete: register,
  })

  const handleClick = async () => {
    await login()
  }

  if (!ready) {
    return <div>Loading...</div>
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="scroll-m-20 text-white pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Welcome
      </h2>
      <Button onClick={handleClick}>Login</Button>
    </div>
  )
}

export default Login

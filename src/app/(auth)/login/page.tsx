import { SignInButton } from "@clerk/nextjs"

export default async function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <SignInButton />
    </div>
  )
}
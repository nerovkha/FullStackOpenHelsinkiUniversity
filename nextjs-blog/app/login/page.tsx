"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const Login = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setPending(false)

    if (result?.error) {
      setError("wrong username or password")
    } else {
      const sessionUser = await fetch("/api/auth/session").then((res) =>
        res.json()
      )
      const name = sessionUser?.user?.name ?? ""
      document.cookie = `flash=${encodeURIComponent(`welcome ${name}`)}; path=/`
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">login</h1>

      {error && (
        <div
          data-testid="error-message"
          className="mb-4 rounded border border-red-300 bg-red-100 px-4 py-2 text-red-800"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
        </div>
        <button
          data-testid="login-button"
          type="submit"
          disabled={pending}
          className="w-full rounded bg-slate-800 px-4 py-1.5 text-slate-100"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

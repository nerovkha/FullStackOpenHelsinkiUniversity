"use client"

import { useActionState } from "react"
import { registerUser, type RegisterFormState } from "@/app/actions"

const initialState: RegisterFormState = { errors: {} }

const Register = () => {
  const [state, formAction] = useActionState(registerUser, initialState)

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">register</h1>

      <form action={formAction} className="space-y-3">
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            defaultValue={state.values?.username ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.username && (
            <p data-testid="username-error" className="text-sm text-red-600">
              {state.errors.username}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            defaultValue={state.values?.name ?? ""}
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.name && (
            <p data-testid="name-error" className="text-sm text-red-600">
              {state.errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.password && (
            <p data-testid="password-error" className="text-sm text-red-600">
              {state.errors.password}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className="w-full rounded border border-slate-300 px-3 py-1.5"
          />
          {state.errors?.passwordConfirm && (
            <p
              data-testid="passwordConfirm-error"
              className="text-sm text-red-600"
            >
              {state.errors.passwordConfirm}
            </p>
          )}
        </div>
        <button
          data-testid="register-button"
          type="submit"
          className="w-full rounded bg-slate-800 px-4 py-1.5 text-slate-100"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default Register

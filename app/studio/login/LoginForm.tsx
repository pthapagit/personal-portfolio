"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Email
        </span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-ink outline-none focus:border-office-green"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-ink/20 bg-paper px-3 py-2 text-ink outline-none focus:border-office-green"
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-office-green px-4 py-2.5 font-mono text-sm uppercase tracking-[0.2em] text-paper transition disabled:opacity-60"
      >
        {pending ? "Signing in\u2026" : "Sign in"}
      </button>
    </form>
  );
}

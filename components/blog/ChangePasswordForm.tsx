"use client";

import { useActionState } from "react";
import { MIN_PASSWORD_LENGTH } from "@/lib/blog/password";
import type { PasswordState } from "@/app/studio/types";

const inputClass =
  "rounded-md border border-ink/20 bg-paper px-3 py-2 text-ink outline-none focus:border-office-green";
const labelClass = "font-mono text-xs uppercase tracking-[0.2em] text-ink-soft";

export function ChangePasswordForm({
  action,
}: {
  action: (prev: PasswordState, formData: FormData) => Promise<PasswordState>;
}) {
  const [state, formAction, pending] = useActionState(action, {} as PasswordState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className={labelClass}>Current password</span>
        <input
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className={labelClass}>New password</span>
        <input
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
        <span className="text-xs text-ink-soft">
          At least {MIN_PASSWORD_LENGTH} characters. A few random words make a strong, memorable
          passphrase.
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className={labelClass}>Confirm new password</span>
        <input
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          className={inputClass}
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm text-office-green">
          Password updated. Other signed-in devices have been signed out.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-md bg-office-green px-4 py-2.5 font-mono text-sm uppercase tracking-[0.2em] text-paper transition disabled:opacity-60"
      >
        {pending ? "Updating\u2026" : "Change password"}
      </button>
    </form>
  );
}

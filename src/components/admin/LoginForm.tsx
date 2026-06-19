"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="card w-full max-w-sm p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-accent-400" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 3.2l7.4 4.1v9.4L12 20.8l-7.4-4.1V7.3L12 3.2z" strokeWidth="1.6" />
            <path d="M4.6 7.3L12 11.4l7.4-4.1" strokeWidth="1.6" />
            <path d="M12 11.4v9.4" strokeWidth="1.6" />
          </svg>
        </span>
        <div>
          <p className="font-display text-base font-extrabold tracking-tight text-brand-900">Admin</p>
          <p className="text-xs text-ink-500">Liquidation Pallet Deals</p>
        </div>
      </div>

      <label className="mt-6 block text-sm">
        <span className="font-medium text-ink-800">Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600"
        />
      </label>

      {state.error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-5 w-full justify-center">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div
        className={
          compact
            ? "mt-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800"
            : "rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800"
        }
      >
        <Icon name="check" className="h-4 w-4" />
        <span>You're on the list. Check your inbox for confirmation.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "mt-3" : ""}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className="w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600"
          />
        </label>
        <button type="submit" className="btn-primary justify-center">
          Subscribe
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-500">No spam. Unsubscribe any time.</p>
    </form>
  );
}

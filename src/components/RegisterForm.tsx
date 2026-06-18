"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function RegisterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink-900">Welcome aboard.</h3>
        <p className="mt-2 text-sm text-ink-600">
          Check your email to verify your account and start browsing early-release lots.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card grid gap-4 p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="First name" required />
        <Field name="lastName" label="Last name" required />
      </div>
      <Field name="company" label="Business name" />
      <Field name="email" label="Email" type="email" required />
      <Field name="password" label="Password" type="password" required />
      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-600"
        />
        <span>
          I agree to the Terms & Conditions and acknowledge the Privacy Policy.
        </span>
      </label>
      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          defaultChecked
          className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-600"
        />
        <span>Email me when new lots match my categories.</span>
      </label>
      <button type="submit" className="btn-primary justify-center">
        Create free account
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      <span className="font-medium text-ink-800">
        {label}
        {required && <span className="ml-0.5 text-accent-600">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600"
      />
    </label>
  );
}

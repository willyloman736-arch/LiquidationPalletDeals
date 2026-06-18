"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink-900">Thanks — we got your message.</h3>
        <p className="mt-2 text-sm text-ink-600">
          We&rsquo;ll do our best to follow up within the business day. Please check your spam folder for our
          reply.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 sm:p-8">
      <Field name="name" label="Name" required autoComplete="name" />
      <Field name="email" label="Email" type="email" required autoComplete="email" />
      <Field name="subject" label="Subject" required />
      <label className="text-sm">
        <span className="font-medium text-ink-800">
          Message<span className="ml-0.5 text-accent-600">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600"
          placeholder="How can we help? Include any SKUs you're interested in."
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-500">By submitting you agree to our Privacy Policy.</p>
        <button type="submit" className="btn-primary">
          Send message
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600"
      />
    </label>
  );
}

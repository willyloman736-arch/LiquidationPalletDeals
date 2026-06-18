import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Liquidation Pallet Deals — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-800 shadow-card ring-1 ring-brand-950/30 transition group-hover:bg-brand-900">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-5 w-5 text-accent-400"
          strokeLinejoin="round"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 3.2l7.4 4.1v9.4L12 20.8l-7.4-4.1V7.3L12 3.2z" strokeWidth="1.6" />
          <path d="M4.6 7.3L12 11.4l7.4-4.1" strokeWidth="1.6" />
          <path d="M12 11.4v9.4" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="font-display text-sm font-extrabold leading-none tracking-tight text-brand-900 sm:text-lg">
        Liquidation Pallet <span className="text-accent-600">Deals</span>
      </span>
    </Link>
  );
}

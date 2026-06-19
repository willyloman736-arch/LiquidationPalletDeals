import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-brand-900 text-white">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2 font-display font-extrabold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-accent-400" strokeLinejoin="round" strokeLinecap="round">
                <path d="M12 3.2l7.4 4.1v9.4L12 20.8l-7.4-4.1V7.3L12 3.2z" strokeWidth="1.7" />
                <path d="M4.6 7.3L12 11.4l7.4-4.1" strokeWidth="1.7" />
                <path d="M12 11.4v9.4" strokeWidth="1.7" />
              </svg>
            </span>
            Admin
            <span className="hidden text-xs font-medium text-brand-300 sm:inline">· Liquidation Pallet Deals</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin" className="font-semibold text-white/85 hover:text-white">
              Products
            </Link>
            <Link href="/admin/deals" className="text-white/70 hover:text-white">
              Deal tiers
            </Link>
            <Link href="/" className="text-white/70 hover:text-white">
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold ring-1 ring-inset ring-white/20 hover:bg-white/20"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container py-8">{children}</div>
    </div>
  );
}

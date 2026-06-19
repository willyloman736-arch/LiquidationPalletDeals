"use client";

import { usePathname } from "next/navigation";

/** Renders the public Header/Footer around page content — except on /admin,
 *  which has its own shell. */
export function SiteFrame({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  return (
    <>
      {!isAdmin && header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isAdmin && footer}
    </>
  );
}

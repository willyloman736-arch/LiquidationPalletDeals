import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center bg-ink-50 p-4">
      <LoginForm />
    </div>
  );
}

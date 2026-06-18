import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { RegisterForm } from "@/components/RegisterForm";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Create a free account",
  description: "Sign up for a free buyer account to access manifests, save lots, and get new-lot alerts.",
};

const perks = [
  {
    icon: "bolt",
    title: "Early access to new lots",
    body: "See pallets the moment they're listed — before the public homepage updates.",
  },
  {
    icon: "star",
    title: "Save lots to a watchlist",
    body: "Track lots you're considering and get notified if pricing or availability changes.",
  },
  {
    icon: "mail",
    title: "Category-specific alerts",
    body: "Pick the categories you sell and only hear from us when relevant lots go live.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Buyer account"
        title="Create a free account."
        description="Faster checkout, order history, and early access to new pallets."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/register", label: "Register" },
        ]}
      />
      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-ink-900">Why register</h2>
            <ul className="mt-6 space-y-5">
              {perks.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon name={p.icon} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{p.title}</p>
                    <p className="mt-1 text-sm text-ink-600">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-600">
              Already have an account?{" "}
              <Link href="/contact" className="link font-semibold">
                Sign in or recover access
              </Link>
            </p>
          </div>
          <div className="lg:col-span-7">
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}

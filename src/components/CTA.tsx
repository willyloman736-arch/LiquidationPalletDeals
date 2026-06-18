import Link from "next/link";
import { Icon } from "./Icon";

export function CTA() {
  return (
    <section className="py-14">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-950 p-10 text-white shadow-pop sm:p-14">
          <div className="absolute inset-0 gradient-mesh opacity-30" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
                Register now
              </p>
              <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                Create a free buyer account and unlock early-release lots.
              </h2>
              <p className="mt-4 max-w-xl text-balance text-white/80">
                Account holders see new pallets before the public list, save lots to a watchlist, and get
                category-specific alerts on the lots they care about.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Link
                href="/register"
                className="btn bg-white text-brand-900 hover:bg-ink-50"
              >
                Create free account
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link href="/deals" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20">
                Browse deals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

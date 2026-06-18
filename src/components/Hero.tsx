import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icon";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      <Image
        src="/images/marketing/hero-aerial.webp"
        alt="Aerial view of the LiquidationsPalletDeals.com liquidation warehouse and loading docks in Beacon Falls, Connecticut"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-900/92 via-ink-900/75 to-ink-900/40"
        aria-hidden="true"
      />
      <div className="container relative py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="anim-rise badge bg-accent-500 text-brand-950">
            <Icon name="bolt" className="h-3.5 w-3.5" /> Everything 82% off MSRP or more
          </span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Famous brand names, sold by the pallet.
          </h1>
          <p
            className="anim-rise mt-5 max-w-xl text-balance text-lg text-white/85"
            style={{ animationDelay: "120ms" }}
          >
            Bulk offerings of the best labels — 100%-inspected liquidation pallets and truckloads from
            famous and specialty stores. New lots listed daily.
          </p>
          <div
            className="anim-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "210ms" }}
          >
            <Link href="/deals" className="btn-accent">
              Shop all deals
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
            >
              Create a free account
            </Link>
          </div>
          <dl
            className="anim-rise mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-8"
            style={{ animationDelay: "300ms" }}
          >
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Inspection</dt>
              <dd className="mt-1 text-2xl font-bold">100%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Off MSRP</dt>
              <dd className="mt-1 text-2xl font-bold">82%+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">New lots</dt>
              <dd className="mt-1 text-2xl font-bold">Daily</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

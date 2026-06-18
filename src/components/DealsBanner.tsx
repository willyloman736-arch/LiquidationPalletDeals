import Link from "next/link";
import { dealTiers } from "@/data/categories";
import { Icon } from "./Icon";

export function DealsBanner() {
  return (
    <section className="border-b border-ink-100 bg-white py-14">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Deal tiers</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Shop by discount level.
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {dealTiers.map((d) => (
            <Link
              key={d.slug}
              href={`/deals/${d.slug}`}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${d.accent} p-6 text-white shadow-pop transition hover:-translate-y-0.5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {d.name}
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">{d.minDiscount}%+ off</p>
              <p className="mt-3 max-w-xs text-sm text-white/85">{d.blurb}</p>
              <span className="mt-6 inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">
                Shop tier <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

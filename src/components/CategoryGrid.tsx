import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { Icon } from "./Icon";

export function CategoryGrid() {
  return (
    <section className="border-b border-ink-100 bg-ink-50 py-14">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Every department, at liquidation prices.
            </h2>
          </div>
          <Link href="/deals" className="link text-sm font-semibold">
            View all deals <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-pop"
            >
              <div className="relative aspect-[4/3] bg-ink-100">
                <Image
                  src={c.image}
                  alt={`${c.name} liquidation pallets`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 text-white">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 backdrop-blur">
                      <Icon name={c.icon} className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    <Icon
                      name="arrowRight"
                      className="ml-auto h-5 w-5 text-white/70 transition group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-white/85">{c.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

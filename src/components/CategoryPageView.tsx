import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { getPalletsByCategory } from "@/data/pallets";
import { PageHeader } from "./PageHeader";
import { PalletGrid } from "./PalletGrid";
import { Icon } from "./Icon";

export function CategoryPageView({ slug }: { slug: string }) {
  const category = categories.find((c) => c.slug === slug);
  if (!category) return notFound();
  const pallets = getPalletsByCategory(slug);

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={category.name}
        description={category.longDescription}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: `/${category.slug}`, label: category.name },
        ]}
      />

      <section className="border-b border-ink-100 bg-white py-10">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">
                Subcategories
              </h2>
              <ul className="mt-3 space-y-1">
                {category.subcategories.length === 0 && (
                  <li className="text-sm text-ink-500">No subcategories</li>
                )}
                {category.subcategories.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={`#${s.slug}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 hover:text-brand-700"
                    >
                      {s.name}
                      <Icon name="chevronRight" className="h-3.5 w-3.5 text-ink-400" />
                    </a>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-ink-500">
                Highlights
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-700">
                {category.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-700" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="lg:col-span-9">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-600">
                  Showing <span className="font-semibold text-ink-900">{pallets.length}</span> available
                  lots
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Link href="/deals" className="rounded-full bg-ink-50 px-3 py-1.5 text-ink-700 ring-1 ring-ink-100 hover:text-brand-700">
                    All deals
                  </Link>
                  <Link href="/deals/80-off" className="rounded-full bg-ink-50 px-3 py-1.5 text-ink-700 ring-1 ring-ink-100 hover:text-brand-700">
                    80%+ off
                  </Link>
                  <Link href="/deals/90-off" className="rounded-full bg-ink-50 px-3 py-1.5 text-ink-700 ring-1 ring-ink-100 hover:text-brand-700">
                    90%+ off
                  </Link>
                </div>
              </div>
              <PalletGrid pallets={pallets} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function generateCategoryStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

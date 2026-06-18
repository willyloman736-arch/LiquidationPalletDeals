import Link from "next/link";

type Crumb = { href: string; label: string };

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div className="absolute inset-0 gradient-mesh opacity-60" aria-hidden="true" />
      <div className="container relative py-12 sm:py-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-ink-500">
            <ol className="flex items-center gap-1">
              {breadcrumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={c.href} className="hover:text-brand-700">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink-700">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-balance text-base text-ink-600 sm:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}

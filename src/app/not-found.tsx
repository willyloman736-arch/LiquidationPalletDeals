import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-4xl font-extrabold text-ink-900">Lot not found.</h1>
        <p className="mt-3 text-ink-600">
          The page you're looking for may have sold, moved, or never existed. Browse the latest inventory
          below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
          <Link href="/deals" className="btn-primary">
            Browse deals <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

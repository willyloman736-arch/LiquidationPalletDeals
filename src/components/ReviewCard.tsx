import { Icon } from "./Icon";
import type { Review } from "@/data/reviews";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <Stars rating={review.rating} />
      <h3 className="mt-3 text-base font-bold text-ink-900">{review.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{review.body}</p>
      <footer className="mt-5 border-t border-ink-100 pt-4">
        <p className="text-sm font-semibold text-ink-900">{review.name}</p>
        <p className="mt-0.5 text-xs text-ink-500">
          {review.buyerType} · {review.location}
        </p>
        <span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
          {review.category}
        </span>
      </footer>
    </article>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`h-4 w-4 ${i < rating ? "text-accent-500" : "text-ink-200"}`}
        />
      ))}
    </div>
  );
}

import type { Property } from "@/data/properties";
import { Icon } from "@/components/ui/Icon";
import { ShowMore } from "./ShowMore";

export function Reviews({ property }: { property: Property }) {
  const { rating, reviewCount, ratings, reviews } = property;

  return (
    <section id="reviews" className="scroll-mt-24 border-b border-line py-10">
      <h2 className="flex items-center gap-2 text-[22px] font-semibold">
        <Icon name="star" className="size-5 text-brand" />
        {rating.toFixed(1)} · {reviewCount} reviews
      </h2>

      <dl className="mt-8 grid gap-x-24 gap-y-3 sm:grid-cols-2">
        {ratings.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 text-sm">
            <dt>{r.label}</dt>
            <dd className="flex items-center gap-3">
              <span className="h-1 w-28 overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-black" style={{ width: `${(r.score / 5) * 100}%` }} />
              </span>
              <span className="w-6 text-xs font-semibold">{r.score.toFixed(1)}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-x-24 gap-y-10 sm:grid-cols-2">
        {reviews.map((review, i) => (
          <article key={i}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-ink-soft font-semibold text-white">
                {review.author[0]}
              </span>
              <div>
                <p className="font-semibold">{review.author}</p>
                <p className="text-sm text-muted">{review.date}</p>
              </div>
            </div>
            <div className="mt-3 text-[15px] leading-relaxed">
              {review.text.length > 180 ? <ShowMore lines={3}>{review.text}</ShowMore> : <p>{review.text}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import type { NewsItem } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-branco-sal">
      <div className="aspect-video w-full bg-marmoreio">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-cinza-ferro">
          {formatDate(item.published_at)}
        </span>
        <h3 className="font-semibold text-preto-wagyu">{item.title}</h3>
        {item.body && <p className="text-sm text-cinza-ferro">{item.body}</p>}
      </div>
    </div>
  );
}

import type { EventItem } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-cinza-osso bg-branco-sal">
      <div className="aspect-video w-full bg-marmoreio">
        {event.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs font-semibold text-vinho-defumado">
          {formatDate(event.event_date)}
          {event.location ? ` · ${event.location}` : ""}
        </span>
        <h3 className="font-semibold text-preto-wagyu">{event.title}</h3>
        {event.description && (
          <p className="text-sm text-cinza-ferro">{event.description}</p>
        )}
      </div>
    </div>
  );
}

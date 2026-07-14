import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/EventCard";
import type { EventItem } from "@/lib/types";

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true })
    .returns<EventItem[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Eventos</h1>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <p className="text-cinza-ferro">Nenhum evento programado no momento.</p>
      )}
    </div>
  );
}

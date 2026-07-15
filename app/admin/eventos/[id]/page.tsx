import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";
import { updateEvent } from "../actions";
import type { EventItem } from "@/lib/types";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle<EventItem>();

  if (!event) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Editar evento</h1>
      <EventForm event={event} action={updateEvent.bind(null, id)} />
    </div>
  );
}

import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "../actions";

export default function NovoEventoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Novo evento</h1>
      <EventForm action={createEvent} />
    </div>
  );
}

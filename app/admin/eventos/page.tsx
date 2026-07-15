import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { deleteEvent } from "./actions";
import type { EventItem } from "@/lib/types";

export default async function AdminEventosPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .returns<EventItem[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Eventos</h1>
        <Link
          href="/admin/eventos/novo"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Novo evento
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {events?.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded border border-cinza-osso p-3"
          >
            <div>
              <p className="font-semibold text-preto-wagyu">{e.title}</p>
              <p className="text-sm text-cinza-ferro">
                {formatDate(e.event_date)}
                {e.location ? ` · ${e.location}` : ""} · {e.is_active ? "Ativo" : "Oculto"}
              </p>
            </div>
            <div>
              <Link
                href={`/admin/eventos/${e.id}`}
                className="mr-3 text-vinho-defumado hover:underline"
              >
                Editar
              </Link>
              <form action={deleteEvent.bind(null, e.id)} className="inline">
                <button className="text-vermelho-brasa hover:underline">Excluir</button>
              </form>
            </div>
          </li>
        ))}
        {(!events || events.length === 0) && (
          <p className="text-cinza-ferro">Nenhum evento cadastrado ainda.</p>
        )}
      </ul>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { awardPoints } from "../orcamentos/actions";
import type { Profile } from "@/lib/types";

export default async function AdminClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "cliente")
    .order("created_at", { ascending: false })
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Clientes</h1>

      <ul className="flex flex-col gap-3">
        {clientes?.map((c) => (
          <li key={c.id} className="rounded border border-cinza-osso p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-preto-wagyu">{c.name ?? "Sem nome"}</p>
                <p className="text-sm text-cinza-ferro">{c.phone ?? "Sem telefone"}</p>
              </div>
              <p className="text-lg font-bold text-vinho-defumado">{c.points_balance} pts</p>
            </div>
            <form action={awardPoints.bind(null, c.id, null)} className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Ajustar pontos
                <input
                  type="number"
                  name="points"
                  required
                  className="w-28 rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-preto-wagyu">
                Motivo
                <input
                  name="description"
                  defaultValue="Ajuste manual"
                  className="rounded border border-cinza-osso px-3 py-2"
                />
              </label>
              <button className="rounded-full bg-preto-wagyu px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-cinza-ferro">
                Aplicar
              </button>
            </form>
          </li>
        ))}
        {(!clientes || clientes.length === 0) && (
          <p className="text-cinza-ferro">Nenhum cliente cadastrado ainda.</p>
        )}
      </ul>
    </div>
  );
}

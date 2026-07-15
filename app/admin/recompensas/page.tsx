import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteReward } from "./actions";
import type { Reward } from "@/lib/types";

export default async function AdminRecompensasPage() {
  const supabase = await createClient();
  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .order("points_cost")
    .returns<Reward[]>();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-preto-wagyu">Recompensas</h1>
        <Link
          href="/admin/recompensas/novo"
          className="rounded-full bg-vermelho-brasa px-4 py-2 text-sm font-semibold text-branco-sal hover:bg-sangue-nobre"
        >
          Nova recompensa
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {rewards?.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between rounded border border-cinza-osso p-3"
          >
            <div>
              <p className="font-semibold text-preto-wagyu">{r.title}</p>
              <p className="text-sm text-cinza-ferro">
                {r.points_cost} pontos · {r.is_active ? "Ativa" : "Inativa"}
              </p>
            </div>
            <div>
              <Link
                href={`/admin/recompensas/${r.id}`}
                className="mr-3 text-vinho-defumado hover:underline"
              >
                Editar
              </Link>
              <form action={deleteReward.bind(null, r.id)} className="inline">
                <button className="text-vermelho-brasa hover:underline">Excluir</button>
              </form>
            </div>
          </li>
        ))}
        {(!rewards || rewards.length === 0) && (
          <p className="text-cinza-ferro">Nenhuma recompensa cadastrada ainda.</p>
        )}
      </ul>
    </div>
  );
}

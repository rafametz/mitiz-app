import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RewardForm } from "@/components/admin/RewardForm";
import { updateReward } from "../actions";
import type { Reward } from "@/lib/types";

export default async function EditarRecompensaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: reward } = await supabase
    .from("rewards")
    .select("*")
    .eq("id", id)
    .maybeSingle<Reward>();

  if (!reward) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-preto-wagyu">Editar recompensa</h1>
      <RewardForm reward={reward} action={updateReward.bind(null, id)} />
    </div>
  );
}

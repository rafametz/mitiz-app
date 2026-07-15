"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";

function parseReward(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const points_cost = Number(formData.get("points_cost") ?? 0);
  const reward_type = String(formData.get("reward_type") ?? "desconto_percent");
  const valueRaw = formData.get("value");
  const value = valueRaw ? Number(valueRaw) : null;
  const stockRaw = formData.get("stock");
  const stock = stockRaw ? Number(stockRaw) : null;
  const is_active = formData.get("is_active") === "on";

  if (!title) throw new Error("Título é obrigatório");

  return { title, description, points_cost, reward_type, value, stock, is_active };
}

export async function createReward(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("rewards").insert(parseReward(formData));
  revalidatePath("/admin/recompensas");
  redirect("/admin/recompensas");
}

export async function updateReward(rewardId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("rewards").update(parseReward(formData)).eq("id", rewardId);
  revalidatePath("/admin/recompensas");
  redirect("/admin/recompensas");
}

export async function deleteReward(rewardId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("rewards").delete().eq("id", rewardId);
  revalidatePath("/admin/recompensas");
}

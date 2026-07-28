"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const status = String(formData.get("status") ?? "novo");

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath(`/admin/orcamentos/${orderId}`);
  revalidatePath("/admin/orcamentos");
}

export async function awardPoints(
  customerId: string,
  orderId: string | null,
  formData: FormData,
) {
  const { supabase, user } = await requireAdmin();
  const points = Number(formData.get("points") ?? 0);
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!points) throw new Error("Informe uma quantidade de pontos");

  const { data: profile } = await supabase
    .from("profiles")
    .select("points_balance")
    .eq("id", customerId)
    .maybeSingle();

  await supabase.from("points_transactions").insert({
    customer_id: customerId,
    order_id: orderId,
    type: points >= 0 ? "ganho" : "ajuste",
    points,
    description,
    created_by: user.id,
  });

  await supabase
    .from("profiles")
    .update({ points_balance: (profile?.points_balance ?? 0) + points })
    .eq("id", customerId);

  if (orderId) revalidatePath(`/admin/orcamentos/${orderId}`);
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${customerId}`);
}

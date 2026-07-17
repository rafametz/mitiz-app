"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { deleteStorageImage } from "@/lib/supabase/storage-helpers";

function parsePromotion(formData: FormData) {
  const product_id = String(formData.get("product_id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const discount_type = String(formData.get("discount_type") ?? "percent");
  const discount_value = Number(formData.get("discount_value") ?? 0);
  const starts_at = String(formData.get("starts_at") ?? "") || null;
  const ends_at = String(formData.get("ends_at") ?? "") || null;
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";

  if (!title) throw new Error("Título é obrigatório");

  return {
    product_id,
    title,
    description,
    discount_type,
    discount_value,
    starts_at,
    ends_at,
    image_url,
    is_active,
  };
}

export async function createPromotion(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("promotions").insert(parsePromotion(formData));
  revalidatePath("/admin/promocoes");
  redirect("/admin/promocoes");
}

export async function updatePromotion(promotionId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("promotions").update(parsePromotion(formData)).eq("id", promotionId);
  revalidatePath("/admin/promocoes");
  redirect("/admin/promocoes");
}

export async function deletePromotion(promotionId: string) {
  const { supabase } = await requireAdmin();
  const { data: promotion } = await supabase
    .from("promotions")
    .select("image_url")
    .eq("id", promotionId)
    .maybeSingle();

  await supabase.from("promotions").delete().eq("id", promotionId);
  await deleteStorageImage(supabase, promotion?.image_url);
  revalidatePath("/admin/promocoes");
}

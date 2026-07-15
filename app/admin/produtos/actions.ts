"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { slugify } from "@/lib/slugify";

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "") || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const unit_type = String(formData.get("unit_type") ?? "kg");
  const price_per_unit = Number(formData.get("price_per_unit") ?? 0);
  const meat_type = String(formData.get("meat_type") ?? "outros");
  const is_active = formData.get("is_active") === "on";
  const is_featured = formData.get("is_featured") === "on";

  if (!name) throw new Error("Nome é obrigatório");

  await supabase.from("products").insert({
    name,
    slug: slugify(name),
    category_id,
    description,
    unit_type,
    price_per_unit,
    meat_type,
    is_active,
    is_featured,
  });

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "") || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const unit_type = String(formData.get("unit_type") ?? "kg");
  const price_per_unit = Number(formData.get("price_per_unit") ?? 0);
  const meat_type = String(formData.get("meat_type") ?? "outros");
  const is_active = formData.get("is_active") === "on";
  const is_featured = formData.get("is_featured") === "on";

  if (!name) throw new Error("Nome é obrigatório");

  await supabase
    .from("products")
    .update({
      name,
      category_id,
      description,
      unit_type,
      price_per_unit,
      meat_type,
      is_active,
      is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(productId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/produtos");
}

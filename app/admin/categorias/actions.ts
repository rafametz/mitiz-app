"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { slugify } from "@/lib/slugify";

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  if (!name) throw new Error("Nome é obrigatório");

  await supabase.from("categories").insert({ name, slug: slugify(name), sort_order });
  revalidatePath("/admin/categorias");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const sort_order = Number(formData.get("sort_order") ?? 0);
  if (!name) throw new Error("Nome é obrigatório");

  await supabase.from("categories").update({ name, sort_order }).eq("id", categoryId);
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(categoryId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/admin/categorias");
}

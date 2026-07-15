"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";

function parseNews(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";
  if (!title) throw new Error("Título é obrigatório");
  return { title, body, is_active };
}

export async function createNews(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("news").insert(parseNews(formData));
  revalidatePath("/admin/novidades");
  redirect("/admin/novidades");
}

export async function updateNews(newsId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("news").update(parseNews(formData)).eq("id", newsId);
  revalidatePath("/admin/novidades");
  redirect("/admin/novidades");
}

export async function deleteNews(newsId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("news").delete().eq("id", newsId);
  revalidatePath("/admin/novidades");
}

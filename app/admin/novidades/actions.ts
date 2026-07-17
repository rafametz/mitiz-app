"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { deleteStorageImage } from "@/lib/supabase/storage-helpers";

function parseNews(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const is_active = formData.get("is_active") === "on";
  if (!title) throw new Error("Título é obrigatório");
  return { title, body, image_url, is_active };
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
  const { data: item } = await supabase
    .from("news")
    .select("image_url")
    .eq("id", newsId)
    .maybeSingle();

  await supabase.from("news").delete().eq("id", newsId);
  await deleteStorageImage(supabase, item?.image_url);
  revalidatePath("/admin/novidades");
}

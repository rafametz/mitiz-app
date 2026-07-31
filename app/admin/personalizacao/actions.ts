"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function updateSiteSettings(settingsId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const hero_image_url = String(formData.get("hero_image_url") ?? "").trim() || null;
  const primary_color = String(formData.get("primary_color") ?? "#AF2B1E");
  const primary_hover_color = String(formData.get("primary_hover_color") ?? "#8B1E1E");

  await supabase
    .from("site_settings")
    .update({ hero_image_url, primary_color, primary_hover_color })
    .eq("id", settingsId);

  revalidatePath("/admin/personalizacao");
  revalidatePath("/", "layout");
}

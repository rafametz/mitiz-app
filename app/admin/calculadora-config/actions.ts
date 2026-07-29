"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function updateCalculatorSettings(settingsId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const grams_per_adult = Number(formData.get("grams_per_adult") ?? 400);
  const grams_per_child = Number(formData.get("grams_per_child") ?? 200);
  const bread_product_id = String(formData.get("bread_product_id") ?? "") || null;
  const bread_units_per_package = Number(formData.get("bread_units_per_package") ?? 5);
  const cheese_product_id = String(formData.get("cheese_product_id") ?? "") || null;
  const cheese_people_per_package = Number(formData.get("cheese_people_per_package") ?? 5);

  await supabase
    .from("calculator_settings")
    .update({
      grams_per_adult,
      grams_per_child,
      bread_product_id,
      bread_units_per_package,
      cheese_product_id,
      cheese_people_per_package,
    })
    .eq("id", settingsId);

  revalidatePath("/admin/calculadora-config");
}

export async function updateCalculatorGroup(groupId: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const percent = Number(formData.get("percent") ?? 0);
  const category_id = String(formData.get("category_id") ?? "") || null;
  const max_selections = Number(formData.get("max_selections") ?? 3);

  await supabase
    .from("calculator_groups")
    .update({ percent, category_id, max_selections })
    .eq("id", groupId);

  revalidatePath("/admin/calculadora-config");
}

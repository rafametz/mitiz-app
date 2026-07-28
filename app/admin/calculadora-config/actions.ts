"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export async function updateCalculatorRule(ruleId: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const grams_per_adult = Number(formData.get("grams_per_adult") ?? 0);
  const grams_per_child = Number(formData.get("grams_per_child") ?? 0);
  const category_id = String(formData.get("category_id") ?? "") || null;

  await supabase
    .from("barbecue_calculator_rules")
    .update({ grams_per_adult, grams_per_child, category_id })
    .eq("id", ruleId);

  revalidatePath("/admin/calculadora-config");
}
